<template>
    <div>
        <el-card class="box-card" body-style="display: flex; justify-content: space-between; align-items: center">
            <dateDisplay style="font-size: 24px">{{$store.state.constants.date}}</dateDisplay>
        </el-card>
        <div style="margin-top: 10px; display: flex; align-items: space-between">
            <el-card style="flex: 1; margin-right: 10px" body-style="padding: 5px">
                <div slot="header" style="font-size: 24px; display: flex; justify-content: start; align-items: baseline">
                    <i class="far fa-calendar-check"></i>
                    <span style="margin-left: 5px">予定</span>
                </div>
                <div>
                    <draggable 
                        v-model="data.reservation"
                        draggable=".ok"
                        :sort="false"
                        :disabled="!canEdit"
                        :group="{name: 'drop', put: false}"
                        animation="200"
                        style="min-height:300px">
                        <el-card 
                            shadow="hover" 
                            v-for="element in data.reservation" 
                            :key="element.id" 
                            :body-style="display.cardStyle" 
                            class="rec-card" 
                            v-bind:class="{'ok': element.insurance.selected && element.examType}">
                            <span style="text-align: start">
                                <div style="font-size: 18px; font-weight: bold">{{ element.title }}</div>
                                <div style="font-size: 12px">ID: {{ element.patient.patientID }}</div>
                                <div style="font-size: 12px">
                                    <el-popover
                                        v-if="canEdit"
                                        placement="right"
                                        title="受付"
                                        width="500"
                                        trigger="click"
                                        v-model="display.reservationPop">
                                        <walkin 
                                            v-if="display.reservationPop" 
                                            @submit="updateReservation(element, ...arguments)" 
                                            @close="display.reservationPop = false" 
                                            :mode="'res'" 
                                            :meta="{res: element.patient.patientID, ins: element.insurance.selected, exm: element.examType, comm: element.comment}">
                                        </walkin>
                                        <span slot="reference" style="cursor: pointer">
                                            <i v-if="!element.examType || !element.insurance.selected" class="fas fa-exclamation"></i>
                                            <i v-else class="fas fa-check"></i>
                                            内容：
                                            <span v-if="!element.examType">未</span>
                                            <span v-else-if="display.shinsatsuTypes.length > 0">{{ getType(element.examType) }}</span>
                                            ・保険組合せ：
                                            <span v-if="!element.insurance.selected">未</span>
                                            <span v-else>{{ element.insurance.selected }}</span>
                                        </span>
                                    </el-popover>
                                </div>
                            </span>
                            <span style="text-align: end">
                                <el-tag type="info">{{ $moment(element.resTime, 'HH:mm:ss').format('H:mm') }}</el-tag>
                            </span>
                        </el-card>
                    </draggable>
                </div>
            </el-card>
            <el-card style="flex: 1; margin-right: 10px" body-style="padding: 5px">
                <div slot="header" style="font-size: 24px; display: flex; justify-content: space-between; align-items: baseline">
                    <span>
                        <i class="fas fa-couch"></i>
                        <span style="margin-left: 5px">待合</span>
                    </span>
                    <el-popover
                        placement="bottom"
                        title="受付"
                        width="500"
                        trigger="click"
                        v-model="display.exWalkinOpen">
                        <walkin v-if="display.exWalkinOpen" @submit="submitNewWalkin" @close="display.exWalkinOpen = false" :mode="'ex'" :meta="display.exMeta"></walkin>
                    </el-popover>
                    <el-popover
                        placement="bottom"
                        title="受付"
                        width="500"
                        trigger="click"
                        v-model="display.newWalkinOpen"
                        v-if="canEdit">
                        <walkin v-if="display.newWalkinOpen" @submit="submitNewWalkin" @close="display.newWalkinOpen = false" :mode="'new'" :meta="false"></walkin>
                        <el-button slot="reference" size="small">受付</el-button>               
                    </el-popover>

                </div>
                <div>
                    <draggable
                        draggable=".ok"
                        @change="submitNewWalkinRes"
                        v-model="data.waiting"
                        :sort="false"
                        group="drop"
                        animation="200"
                        :disabled="!canEdit"
                        style="min-height:300px">
                        <el-card 
                            shadow="hover" 
                            v-for="element in data.waiting" 
                            :key="element.ID" 
                            :body-style="display.cardStyle" 
                            class="rec-card" 
                            v-bind:class="{ok: element.status !== '5' && element.status !== '7' && element.status !== '8'}">
                            <span style="text-align: start">
                                <div style="font-size: 18px; font-weight: bold">{{element.name_last}}{{element.name_first}}</div>
                                <div style="font-size: 12px">ID: {{element.patient}}</div>
                                <div v-if="display.shinsatsuTypes.length > 0" style="font-size: 12px">{{ getType(element.type) }}</div>
                            </span>
                            <span style="text-align: end">
                                <el-tag v-if="element.status === '6'" type="info">一時停止・再開可能</el-tag>
                                <el-tag v-else-if="element.status === '8'" type="info"><i class="far fa-hourglass"></i>健康診断中</el-tag>
                                <el-tag v-else-if="element.status === '5'" type="info">検査待ち</el-tag>
                                <el-tag v-else :type="element.bcolor">待ち時間：{{element.waitTime}}分</el-tag>
                            </span>
                        </el-card>
                    </draggable>
                </div>
            </el-card>
            <div style="flex: 1; margin-right: 10px">
                <el-card>
                    <div slot="header" style="font-size: 24px; display: flex; justify-content: start; align-items: baseline">
                        <i class="fas fa-stethoscope"></i>
                        <span style="margin-left: 5px">診察</span>
                    </div>
                    <div style="text-align: left">
                        空きあり医者：{{ freeDoctors }}
                    </div>
                </el-card>
                <el-card v-for="(doctor, rowIndex) in doctors" :key="rowIndex" style="margin-top: 10px">
                    <div style="text-align: left">{{ doctor.lastname }} {{ doctor.firstname }}</div>
                    <draggable
                        draggable=".ok"
                        :disabled="!canEdit"
                        :group="{name: 'drop', pull: false, put: doctor.patients.length < 1}"
                        @change="startShin(doctor.id, ...arguments)"
                        class="frame"
                        v-model="doctor.patients">
                        <el-card shadow="hover" v-for="element in doctor.patients" :key="element.ID" :body-style="display.cardStyle" class="rec-card">
                            <span style="text-align: start">
                                <div style="font-size: 18px; font-weight: bold">{{element.name_last}}{{element.name_first}}</div>
                                <div style="font-size: 12px">ID: {{element.patient}}</div>
                                <div v-if="display.shinsatsuTypes.length > 0" style="font-size: 12px">{{ getType(element.type) }}</div>
                            </span>
                        </el-card>
                    </draggable>
                </el-card>
            </div>
            <el-card style="flex: 1; margin-right: 10px" body-style="padding: 5px">
                <div slot="header" style="font-size: 24px; display: flex; justify-content: start; align-items: baseline">
                    <i class="fas fa-hand-holding-usd"></i>
                    <span style="margin-left: 5px">会計</span>
                </div>
                <div>
                    <el-card shadow="hover" v-for="element in data.pay" :key="element.ID" :body-style="display.cardStyle" class="rec-card">
                            <span style="text-align: start">
                                <div style="font-size: 18px; font-weight: bold">{{element.name_last}}{{element.name_first}}</div>
                                <div style="font-size: 12px">ID: {{element.patient}}</div>
                                <div v-if="display.shinsatsuTypes.length > 0" style="font-size: 12px">{{ getType(element.type) }}</div>
                            </span>
                            <span style="text-align: end">
                                <span v-if="element.status === '41'" style="font-size: 12px">オーダー待ち</span>
                                <el-popover
                                    v-else
                                    placement="bottom"
                                    title="会計"
                                    width="300"
                                    trigger="click"
                                    v-model="element.open">
                                    <payment v-if="element.open" :item="element" @cancel="element.open = false" @submitted="element.open = false; update()"></payment>
                                    <el-button slot="reference"  size="small" type="info" plain>会計</el-button>               
                                </el-popover>
                            </span>
                        </el-card>
                </div>
            </el-card>
            <el-card style="width: 700px" body-style="padding: 5px">
                <div slot="header" style="font-size: 24px; display: flex; justify-content: start; align-items: baseline">
                    <i class="far fa-calendar-alt"></i>
                    <span style="margin-left: 5px">カレンダー</span>
                </div>
                <div>
                    <calendar :config="calConfig" :base-view="view"></calendar>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>

import walkin from './walkin'
import payment from './payment'
import calendar from '../../shared/calendar'
import { log } from 'util';
import { loadavg } from 'os';
import loginVue from '../../../views/login.vue';
import { setTimeout } from 'timers';

export default {
    props: [
      'meta'
    ],
    components: {
        'walkin': walkin,
        'payment': payment,
        'calendar': calendar
    },
    created: function() {
        this.update();
        var self = this;
        setInterval(function (){
            self.updateTime()
        }, 50000);
        //get shinsatsu type
        this.doRequest('getShinsatsuType', '').then(result => {
           this.display.shinsatsuTypes = result.data 
        })
    },
    data() {
        return {
            data: {
                reservation: [],
                waiting: [],
                exam: [],
                pay: []
            },
            display: {
                exWalkinOpen: false,
                exMeta: false,
                newWalkinOpen: false,
                reservationPop: false,
                paymentOpen: false,
                shinsatsuTypes: [],
                cardStyle: "background-color: #eaf1f7; display: flex; justify-content: space-between; padding: 10px",
                loadingInsurance: false
            },
            calConfig: {
                header: "false",
                firstDay: 1,
                displayEventTime: false,
                fixedWeekCount: false,
                navLinks: true,
                height: "auto",
                minTime: "09:00:00",
                maxTime: "20:00:00",
                defaultView: "month",
                allDaySlot: false,
                editable: false,
                locale: 'ja',
                businessHours: [
                    {dow: [ 1, 2, 3, 4, 5 ], start: '09:00', end: '12:00'},
                    {dow: [ 1, 2, 3, 5 ], start: '16:00', end: '20:00'},
                    {dow: [6], start: '09:00', end: '12:00'}
                ],
                events: this.$globals.apiURL + "/ccapi/get/patient/getReceptionHistory.php?session_id=" + (sessionStorage.getItem("session_id")==null?"":sessionStorage.getItem("session_id"))
            },
            view: 'month'
        }
    },
    computed: {
        canEdit() {
            let role = this.$store.state.constants.userRole
            if (role === '1' || role === '2' || role === '3') {
                return true
            }
            return false
        },
        doctors() {
            let docs = this.$store.state.constants.userList.filter(item => item.role == 2)
            docs.forEach(item2 => {
                let patient = this.data.exam.find(patient => patient.doctor === item2.id)
                if (patient) {
                    item2.patients = [patient]                 
                } else {
                    item2.patients = []
                }
            })
            return docs
        },
        freeDoctors() {
            return this.doctors.filter(item => item.patients.length < 1).length
        }
    },
    methods: {
        getType(item) {
                let type = this.display.shinsatsuTypes.findIndex(st => st.ID === item)
                return this.display.shinsatsuTypes[type].name                
        },
        //Update all data
        update: function () {
            this.doRequest('getReceptionFlow', '').then(result => {
                this.data.waiting = result.data.waiting
                this.data.exam = result.data.exam
                this.data.pay = result.data.pay
            })
            this.doRequest('getReceptionFlowReservations', '').then(result => {
                this.data.reservation = result.data
            })
        },
        updateTime: function () {
            var now = this.$moment();
            for (var i = 0; i < this.data.waiting.length; i++) {
                var start = this.$moment(this.data.waiting[i].start_time, "HH:mm:ss")
                var delta = now.diff(start, 'minutes')
                this.data.waiting[i].waitTime = delta
                this.data.waiting[i].bcolor = "info"
                if (delta > 15) {
                    this.data.waiting[i].bcolor = "warning"
                }
                if (delta > 30) {
                    this.data.waiting[i].bcolor = "danger"
                }
                if (this.data.waiting[i].status === "5") {
                    this.data.waiting[i].bcolor = "info"
                }
            }
            for (var i = 0; i < this.data.exam.length; i++) {
                var start = this.$moment(this.data.exam[i].start_time, "HH:mm:ss")
                var delta = now.diff(start, 'minutes')
                this.data.exam[i].waitTime = delta
            }
            for (var i = 0; i < this.data.pay.length; i++) {
                var start = this.$moment(this.data.pay[i].start_time, "HH:mm:ss")
                var delta = now.diff(start, 'minutes')
                this.data.pay[i].waitTime = delta
            }
        },
        updateReservation(elm, emit) {
            this.doRequest('updateReservation', {event: elm.id, new: emit}).then(result => {
                elm.insurance.selected = emit.insurance.selected
                elm.insurance.jihi = emit.insurance.jihi
                elm.examType = emit.examType
                elm.comment = emit.comment
                this.display.reservationPop = false
            })
        },
        submitNewWalkinRes(data) {
            if (data.added) {
              this.submitNewWalkin(data.added.element)          
            }
        },
        submitNewWalkin(data) {
            this.doRequest('newWalkin', data).then(result => {
                if (result.isKS) {
                    this.insertKenkouShindanOrder(data.patient.patientID, result.karteID);              
                }
                this.display.newWalkinOpen = false
                this.update()
            })
        },  
        startShin(doctor,patient) {
            if (patient.added) {
                patient.added.element.doctor = doctor
                let data = patient.added.element
                this.doRequest('moveReceptionToShinsatsu', data)
            }
        },

        insertKenkouShindanOrder(patientID, karteID) {
            let orderData = [
                {
                    karteID: karteID, 
                    patientID: patientID,
                    userExec: '999904',
                    karteID: karteID,
                    subTask: false,
                    kouiType: '095',
                    trackingID: 0,
                    kouiID: '1'
                }
            ]
            this.doRequest('insertOrder', orderData)
        },
        receivePat(data) {
            this.display.exMeta = data
            this.display.exWalkinOpen = true
        }
    },
    sockets: {
        //Notification for updated Tasks////////////////////////////////////////
        broadcast(data) {
            console.log(data);
            
            if (data.action === "paymentDone" || 
                data.action === 'updateTask' || 
                data.action === 'newShinsatsu' || 
                data.action === 'closeShinsatsu' || 
                data.action === 'assignTask' || 
                data.action === 'finishKenkoushindanFirst') {
            this.update()
            }
        }
    }
}
</script>

<style scoped>
.rec-card {
    margin: 5px;
}
.frame {
    border: solid 1px #dddddd;
    min-height: 30px;
    border-radius: 5px;
}
</style>
