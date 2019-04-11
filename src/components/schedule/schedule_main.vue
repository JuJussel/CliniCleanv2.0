<template>
        <el-card style="max-height: 100%; width: 80%; overflow: auto">
            <el-popover
                placement="bottom"
                title="予約登録"
                width="350"
                trigger="click"
                v-model="display.newEventOpen"
                >
                <div>
                    <el-form :rules="eventRules" :model="newEventData" label-width="100px" v-if="display.newEventOpen" ref="newEventForm">
                        <el-form-item label="患者選択" prop="patient">
                            <el-select
                                v-model="newEventData.patient"
                                value-key="patientID"
                                filterable
                                remote
                                placeholder="氏名又はIDで検索"
                                :remote-method="searchPatient"
                                :loading="display.searchLoading">
                                <el-option
                                    v-for="item in searchResults"
                                    :key="item.patientID"
                                    :label="item.name_last_kanji + item.name_first_kanji"
                                    :value="item">
                                    <span style="display: flex; justify-content: space-between; width: 280px">
                                        <span style="color: #8492a6; font-size: 13px">ID: {{ item.patientID}}</span>
                                        <span>{{ item.name_last_kanji + item.name_first_kanji }}</span>
                                        <span style="color: #8492a6; font-size: 13px">
                                            {{ item.birthdate_year + "年" + item.birthdate_month + "月" + item.birthdate_day + "日"}}
                                        </span>
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日付" prop="date">
                            <el-date-picker
                                v-model="newEventData.date"
                                type="date"
                                format="yyyy年MM月dd日"
                                value-format="yyyy/MM/dd"
                                placeholder="選択又は入力">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="時間" prop="start">
                            <el-time-select
                                placeholder="から"
                                v-model="newEventData.start"
                                value-format="HH:mm:ss"
                                :picker-options="{
                                    start: '09:00',
                                    step: '00:15',
                                    end: '20:00'
                                }">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="内容" prop="type">
                            <el-select v-model="newEventData.type" placeholder="選択">
                                <el-option
                                v-for="item in display.shinsatsuTypes"
                                :key="item.ID"
                                :label="item.name"
                                :value="item.ID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="コメント">
                            <el-input v-model="newEventData.notes" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div>
                        <span style="float: right">
                            <el-button type="text" @click="display.newEventOpen = false">キャンセル</el-button>
                            <el-button type="primary" @click="newEvent">保存</el-button>
                        </span>
                    </div>
                </div>
                <el-button slot="reference"><i class="el-icon-plus" style="margin-right: 5px"></i>登録</el-button>
            </el-popover>
            <calendar @eventClick="eventClick" :config="calConfig" ref="calendar" style="margin-top: -35px"></calendar>
            <el-popover
                placement="bottom"
                :title="eventData.title"
                width="350"
                trigger="manual"
                v-model="display.editEventOpen"
                >
                <div>
                    <el-form :disabled="eventData.arrived === '1'" :rules="eventRules" :model="eventData" label-width="100px" v-if="display.editEventOpen" ref="eventForm">
                        <el-form-item label="日付" prop="date">
                            <el-date-picker
                                v-model="eventData.date"
                                type="date"
                                format="yyyy年MM月dd日"
                                value-format="yyyy/MM/dd"
                                placeholder="選択又は入力">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="時間" prop="start">
                            <el-time-select
                                placeholder="から"
                                v-model="eventData.start"
                                value-format="HH:mm:ss"
                                :picker-options="{
                                    start: '09:00',
                                    step: '00:15',
                                    end: '20:00'
                                }">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="内容" prop="type">
                            <el-select v-model="eventData.type" placeholder="選択">
                                <el-option
                                v-for="item in display.shinsatsuTypes"
                                :key="item.ID"
                                :label="item.name"
                                :value="item.ID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="コメント">
                            <el-input v-model="eventData.notes" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div v-if="eventData.arrived === '0'">
                        <el-button style="float:left" type="danger" plain @click="deleteEvent">削除</el-button>
                        <span style="float: right">
                            <el-button type="text" @click="display.editEventOpen = false">キャンセル</el-button>
                            <el-button type="primary" @click="saveEvent">保存</el-button>
                        </span>
                    </div>
                    <div v-else style="float: right">
                        <el-button type="text" @click="display.editEventOpen = false">閉じる</el-button>
                    </div>
                </div>
                <div slot="reference" class="popoverDummy" v-bind:style="{top: display.popoverDummy.top, left: display.popoverDummy.left}"></div>
            </el-popover>
        </el-card>
</template>

<script>

import calendar from '../shared/calendar'
import { setTimeout } from 'timers';

export default {
    components: {
        'calendar': calendar
    },
    created() {
        this.doRequest('getShinsatsuType', '').then(result => {
           this.display.shinsatsuTypes = result.data 
        })
    },
    data() {
        return {
            display: {
                searchLoading: false,
                newEventOpen: false,
                editEventOpen: false,
                shinsatsuTypes: [],
                popoverDummy: {
                    top: '0px',
                    left: '0px'
                }
            },
            searchResults: [],
            newEventData: {
                patient: {},
                date: "",
                start: "",
                notes: "",
                type: "1",
                doctor: ""
            },
            eventData: {},
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
                events: this.$globals.apiURL + "/ccapi/get/schedule/getEvents.php?session_id=" + (sessionStorage.getItem("session_id")==null?"":sessionStorage.getItem("session_id"))
            },
            eventRules: {
                patientID: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                date: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                start: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                type: [
                    { required: true, message: '選択してください', trigger: 'manual' }
                ]
            }
        }
    },
    methods: {
        eventClick(item) {
            this.eventData = {
                'date': JSON.parse(JSON.stringify(item[0].time.date)),
                'start': JSON.parse(JSON.stringify(item[0].time.start)),
                'type': JSON.parse(JSON.stringify(item[0].type)),
                'notes': JSON.parse(JSON.stringify(item[0].notes)),
                'patientID': item[0].patientID,
                'arrived': item[0].arrived,
                'title': item[0].title,
                'doctor': item[0].doctor,
                'id': item[0].id
            }
            this.display.editEventOpen = false
            this.display.popoverDummy.top = item[1].pageY + 'px'
            this.display.popoverDummy.left = item[1].pageX + 'px'
            setTimeout(function() {this.display.editEventOpen = true}.bind(this), 300)
        },
        saveEvent() {
            this.$refs.eventForm.validate(valid => {
                if (valid) {
                    this.doRequest('updateEvent', this.eventData).then(result => {
                        if (!result.err) {
                            this.$refs.calendar.refresh()
                            this.display.editEventOpen = false
                        }
                    })
                }
            })
        },
        newEvent() {
            this.$refs.newEventForm.validate(valid => {
                if (valid) {
                    this.doRequest('insertNewEvent', this.newEventData).then(result => {
                        if (!result.err) {
                            this.$refs.calendar.refresh()
                            this.display.newEventOpen = false
                        }
                    })
                }
            })
        },
        deleteEvent() {
            this.doRequest('deleteEvent', this.eventData.id).then(result => {
                if (!result.err) {
                    this.$refs.calendar.refresh()
                    this.display.editEventOpen = false
                }
            })
        },
        searchPatient(query) {
            if (query !== '') {
                this.display.searchLoading = true
                this.doRequest('getQuickPatientSearch', query).then(result => {
                    this.searchResults = result.data
                    this.display.searchLoading = false
                })
            } else {
                this.searchResults = []
            }
        }
    }
}
</script>

<style scoped>
.popoverDummy {
    position: fixed;
    z-index: 1000
}
</style>
