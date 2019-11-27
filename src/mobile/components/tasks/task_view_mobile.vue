<template>
    <div class="mainBorder">
        <!-- SRL --->
        <div>カルテ：{{ task.karte }}　患者ID：{{ task.patientID }}</div>
        <div v-if="task.type === '1'">
            <div  class="wrapper">
                <div style="width: calc(100% - 164px)">
                    <b> {{ task.title }} </b>
                </div>
                
                <div>
                    <el-button @click="submitTask" type="primary">済</el-button>
                </div>
            </div>
            <div style="margin-top: 10px">
                    <span>検体量(ml)：</span>
                    <span> {{ task.specName }} </span>
                    <span> {{ task.srlData.specimen_amount }} </span>
            </div>
            <div style="margin-bottom: 10px">
                <span>容器:</span>
                <span> {{ task.srlData.container_1 }} </span>
                <span v-if="task.srlData.container_1_b !== '0'">→ {{ task.srlData.container_1_b }} </span>
                <span v-if="task.srlData.container_2 !== '0'">→ {{ task.srlData.container_2 }} </span>
            </div>
        </div>
        <!-- SRL End -->
        <!-- Inhouse --->
        <div v-else-if="task.type === '2'">
            <div class="wrapper">
                <div style="width: calc(100% - 164px)">
                    <div>
                        <b> {{ task.title }} </b>
                    </div>
                </div>
                <div style="margin-right: 10px">
                    <el-button :disabled="resultsFull && resultsFiltered.length < 1" @click="fetchResults" v-loading="resultsLoading">結果追加</el-button>
                </div>
                <div>
                    <el-button
                        @click="submitTask"
                        :disabled="task.sub_task === '0' && resultsOb.results.length < 1"
                        type="primary">
                        済
                    </el-button>
                </div>
            </div>
            <div style="margin-top: 10px">
                <el-form ref="resultsForm" :model="resultsOb">
                    <el-form-item
                        v-for="(result, index) in resultsOb.results"
                        :key="result.JLAC"
                        :label="result.name"
                        :prop="'results[' + index + '].value'"
                        :rules="{
                            required: true, message: '入力してください', trigger: 'blur'
                        }">
                        <span style="float: right">
                            <el-input v-model="result.value" style="width: 120px">
                                <template v-if="result.unit !== ''" slot="append"> {{ result.unit }} </template>
                            </el-input>
                            <el-button @click="removeResult(result)" type="danger" style="margin-left: 10px">削除</el-button>
                        </span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- Inhouse End --->
        <!-- Prev/Shot --->
        <div v-if="task.type === '3' || task.type === '4'">
            <div class="wrapper">
                <div style="width: calc(100% - 164px)">
                    <div>
                        <b> {{ task.title }} </b>
                    </div>
                </div>
                <div>
                    <el-button
                        @click="submitTask"
                        :disabled="task.sub_1 ==='' || task.sub_2 === ''"
                        type="primary">
                        済
                    </el-button>
                </div>
            </div>
            <div>
                <el-form label-width="50px" style="width: 100%">
                    <el-form-item label="位置">
                        <el-button @click="openSelectLocation">{{ task.sub_3 }}</el-button>
                    </el-form-item>
                    <el-form-item label="量">
                        <el-input v-model="task.sub_1" style="width: 120px">
                            <template slot="append">ml</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="LotNo">
                        <el-input v-model="task.sub_2" style="width: 120px"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- Prev/Shot End --->
        <!-- OP/Treat --->
        <div v-if="task.type === '7' || task.type === '8'">
            <div class="wrapper">
                <div style="width: calc(100% - 164px)">
                    <div>
                        <b> {{ task.title }} </b>
                    </div>
                </div>
                <div>
                    <el-button
                        @click="submitTask"
                        :disabled="task.sub_1 ==='' || task.sub_2 === ''"
                        type="primary">
                        済
                    </el-button>
                </div>
            </div>
        </div>
        <!-- OP/Treat End --->
        <!-- Kenkoushindan --->
        <div v-if="task.type === '95'">
            <div  class="wrapper">
                <div style="width: calc(100% - 164px)">
                    <b> {{ task.title }} </b>
                </div>
                <div>
                    <el-button @click="saveKKSD" type="primary">済</el-button>
                </div>
            </div>
            <el-form ref="form" :rules="rules" :model="task.kksdData" label-width="100px" style="margin-top: 10px">
                <el-form-item label="薬剤歴" prop="medication_history">
                    <el-radio-group v-model="task.kksdData.medication_history">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="task.kksdData.medication_history === '1'" prop="medication_history_text" :rules="[{ required: true, message: '入力してください', trigger: 'false' }]">              
                    <el-input  
                        placeholder="入力  " 
                        v-model="task.kksdData.medication_history_text">
                    </el-input>
                </el-form-item>
                <el-form-item label="既往歴" prop="medical_history">
                    <el-radio-group v-model="task.kksdData.medical_history">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="task.kksdData.medical_history === '1'" prop="medical_history_text" :rules="[{ required: true, message: '入力してください', trigger: 'false' }]">
                    <el-input placeholder="入力  " v-model="task.kksdData.medical_history_text"></el-input>
                </el-form-item>
                <el-form-item label="自覚症状" prop="subjective_symtoms">
                    <el-radio-group v-model="task.kksdData.subjective_symtoms">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="task.kksdData.subjective_symtoms === '1'" prop="subjective_symtoms_text" :rules="[{ required: true, message: '入力してください', trigger: 'false' }]">
                    <el-input placeholder="入力  " v-model="task.kksdData.subjective_symtoms_text"></el-input>
                </el-form-item>
                <el-form-item label="他覚症状" prop="objective_symtoms">
                    <el-radio-group v-model="task.kksdData.objective_symtoms">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="task.kksdData.objective_symtoms === '1'" prop="objective_symtoms_text" :rules="[{ required: true, message: '入力してください', trigger: 'false' }]">
                    <el-input placeholder="入力  " v-model="task.kksdData.objective_symtoms_text"></el-input>
                </el-form-item>
                <el-form-item label="身長" prop="height" >
                    <el-input style="width: 140px" type="number" placeholder="入力" v-model.number="task.kksdData.height">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="体重" prop="weight">
                    <el-input style="width: 140px" type="number" placeholder="入力" v-model.number="task.kksdData.weight">
                        <template slot="append">kg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="BMI" prop="bmi">
                    <el-input style="width: 140px" type="number" placeholder="入力" v-model.number="task.kksdData.bmi"></el-input>
                </el-form-item>
                <el-form-item label="腹囲" prop="stomache_width">
                    <el-input style="width: 140px" type="number" placeholder="入力" v-model.number="task.kksdData.stomache_width">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="心電図ID" prop="ecg">
                    <el-input style="width: 140px" placeholder="入力  " v-model="task.kksdData.ecg"></el-input>
                </el-form-item>
                <el-form-item label="X線番号" prop="x_ray_ID">
                    <el-input style="width: 140px" placeholder="入力" v-model="task.kksdData.x_ray_ID"></el-input>
                </el-form-item>
                <h4>血圧</h4>
                <el-form-item label="血圧最高(S)" prop="blood_pressure_max">
                    <el-input style="width: 140px"  type="number" placeholder="入力  " v-model.number="task.kksdData.blood_pressure_max"></el-input>
                </el-form-item>
                <el-form-item label="血圧最低(D)" prop="blood_pressure_min">
                    <el-input style="width: 140px" type="number" placeholder="入力  " v-model.number="task.kksdData.blood_pressure_min"></el-input>
                </el-form-item>
                <h4>視力</h4>
                <el-form-item label="視力左" prop="sight_left">
                    <el-input style="width: 140px" type="number" placeholder="入力  " v-model.number="task.kksdData.sight_left"></el-input>
                </el-form-item>
                    <el-form-item label="視力右" prop="sight_right">
                    <el-input style="width: 140px" type="number" placeholder="入力  " v-model.number="task.kksdData.sight_right"></el-input>
                </el-form-item>
                <h4>聴力左(所見)</h4>
                <el-form-item label="1000Hz" prop="hearing_left_low">
                    <el-radio-group v-model="task.kksdData.hearing_left_low">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
                    <el-form-item label="4000Hz" prop="hearing_left_high">
                        <el-radio-group v-model="task.kksdData.hearing_left_high">
                            <el-radio-button border label="1">あり</el-radio-button >
                            <el-radio-button border label="0">なし</el-radio-button >
                        </el-radio-group>
                </el-form-item>
                <h4>聴力右(所見)</h4>
                <el-form-item label="1000Hz" prop="hearing_right_low">
                    <el-radio-group v-model="task.kksdData.hearing_right_low">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="4000Hz" prop="hearing_right_high">
                    <el-radio-group v-model="task.kksdData.hearing_right_high">
                        <el-radio-button border label="1">あり</el-radio-button >
                        <el-radio-button border label="0">なし</el-radio-button >
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <!-- Kenkoushindan End -->
        <div>
            <el-button @click="addComment = !addComment">コメント</el-button>
            {{ task.order_comment }}
        </div>
        <div v-if="addComment">
            <el-form label-width="80" size="mini">
                <el-form-item label="コメント">
                    <el-input v-if="task.type==='95'" v-model="task.kksdData.comment" style="max-width: 300px" type="textarea"></el-input>
                    <el-input v-else v-model="comment" style="max-width: 300px" type="textarea"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="結果追加" :visible.sync="resultSelectOpen" custom-class="resultSelector" fullscreen>
            <div v-bind:style="{'max-height': height + 'px'}" style="overflow: auto">
                <div v-for="result in resultsFiltered" :key="result.JLAC" class="list_item" @click="addResult(result)">
                    <span>{{ result.name }}</span>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="位置選択" :visible.sync="locationSelectOpen" custom-class="resultSelector" fullscreen>
            <div v-bind:style="{'max-height': height + 'px'}" style="overflow: auto">
                <div v-for="(location, key) in locations" :key="key" class="list_item" @click="selectLocation(location)">
                    <span>{{ location }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: [
        'task'
    ],
    data() {
        return {
            addComment: false,
            comment: "",
            height: window.innerHeight - 150,
            resultsFull: false,
            locationSelectOpen: false,
            resultSelectOpen: false,
            resultsLoading: false,
            resultsOb: {
                results: []
            },
            locations: [
                '右上腕',
                '左上腕',
                '右大腿',
                '左大腿',
                '右臀部',
                '左臀部',
                '静脈'
            ],
            resultsFilter: "",
            rules: {
                blood_pressure_max: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                blood_pressure_min: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                bmi: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                comment: [
                    { required: false, message: '入力してください', trigger: 'false' }
                ],
                ecg: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                hearing_left_high: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                hearing_left_low: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                hearing_right_high: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                hearing_right_low: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                height: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                medical_history: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                medication_history: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                objective_symtoms: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                sight_left: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                sight_right: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                stomache_width: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                subjective_symtoms: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ],
                weight: [
                    { required: true, message: '入力してください', trigger: 'false' },
                    { type: 'number', message: '数字を入力してください', trigger: 'false'}
                ],
                x_ray_ID: [
                    { required: true, message: '入力してください', trigger: 'false' }
                ]
            }
        }
    },
    computed: {
        resultsFiltered() {
            let returnArr = _.differenceWith(this.resultsFull, this.resultsOb.results, _.isEqual)
            returnArr = returnArr.filter(item => item.name && item.name.includes(this.resultsFilter))
            return returnArr
        }
    },
    watch: {
        task: {
            handler: function(newValue) {
                if (this.task.type === '95') {
                    this.doRequest('updateKenkoushindan', {kssdData: this.task.kksdData, mode: "update", orderID: this.task.ID})
                }
            },
            deep: true
        }
    },
    methods: {
        showSRL() {
            this.$emit('showSRL', this.resultsOb.results)
        },
        submitTask() {
            let task = this.task
            // Add comment
            if (this.comment !== '') {
                let user = this.$store.state.constants.username
                task.order_comment = ' ' + user + ': ' + this.comment
            }
            if (task.sub_task === "0") {
                if (task.type === "2") {
                    this.$refs.resultsForm.validate((valid) => {
                        if(valid) {
                            this.task.sub_3 = this.resultsOb.results
                            this.doRequest('updateTask' , this.task).then(result => {
                                this.$emit('done', task.ID)
                            })
                        }
                    })
                    return
                }
            }
            this.doRequest('updateTask' , this.task).then(result => {
                this.$emit('done', task.ID)
            })
        },
        saveKKSD() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let kssd = this.task.kksdData
                    let orderID = this.task.ID
                    this.doRequest('updateKenkoushindan', {kssdData: kssd, mode: "commit", orderID: orderID}).then( result => {
                        this.$emit('done', orderID)
                    })
                }
            })
        },
        openSelectLocation() {
            this.locationSelectOpen = true
        },
        selectLocation(loc) {
            this.task.sub_3 = loc
            this.locationSelectOpen = false
        },
        fetchResults() {
            this.resultsFilter = ""
            if (!this.resultsFull) {
                this.resultsLoading = true
                this.doRequest('kensaResults', this.task.sub_1).then(result => {
                    this.resultsFull = result.data
                    this.resultsLoading = false
                    this.resultSelectOpen = true
                })
            } else {
                this.resultSelectOpen = true
            }
        },
        addResult(result) {
            this.resultsOb.results.push(result)
            this.resultSelectOpen = false
        },
        removeResult(result) {
            this.resultsOb.results = this.resultsOb.results.filter(item => item !== result)
        }
    }
}
</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center
}
.mainBorder {
    border-bottom: solid 1px #ebeef5;
    padding: 10px;
    margin-bottom: 25px
}
</style>

<style>
.resultSelector {
    overflow: hidden
}
</style>
