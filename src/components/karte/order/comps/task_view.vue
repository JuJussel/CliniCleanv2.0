<template>
    <div class="mainBorder">
        <!-- SRL --->
        <div v-if="task.type === '1'" class="wrapper">
            <div style="width: 220px">
                <div>
                    <b> {{ task.title }} </b>
                </div>
                <div>
                    <span>検体量(ml)：</span>
                    <span> {{ task.specName }} </span>
                    <span> {{ task.srlData.specimen_amount }} </span>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; width: 100px; font-size: 14px">
                <div>容器</div>
                <div>
                    <span> {{ task.srlData.container_1 }} </span>
                    <span v-if="task.srlData.container_1_b !== '0'">→ {{ task.srlData.container_1_b }} </span>
                    <span v-if="task.srlData.container_2 !== '0'">→ {{ task.srlData.container_2 }} </span>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center">
                <div style="margin-bottom: 5px">
                    <el-button @click="showSRL" size="mini"><i class="fas fa-info-circle"></i></el-button>
                </div>
                <div>
                    <el-button @click="submitTask" size="mini" type="primary">済</el-button>
                </div>
            </div>
        </div>
        <!-- SRL End -->
        <!-- Inhouse --->
        <div v-else-if="task.type === '2'" class="wrapper">
            <div>
                <div>
                    <b> {{ task.title }} </b>
                </div>
                <div>
                    <el-dropdown
                        trigger="click"
                        @visible-change="fetchResults"
                        @command="addResult"
                        :disabled="resultsFiltered.length < 1">
                        <el-button :disabled="resultsFull && resultsFiltered.length < 1" size="small">結果追加</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <div style="padding: 0 10px" v-if="resultsFull.length >10">
                                <el-input v-model="resultsFilter" prefix-icon="el-icon-search" size="small"></el-input>
                            </div>
                            <div style="max-height: 200px; overflow: auto">
                                <el-dropdown-item
                                    v-for="result in resultsFiltered"
                                    :key="result.ID"
                                    :command="result"> 
                                    {{ result.name }}
                                </el-dropdown-item>
                            </div>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div style="margin-top: 10px">
                        <el-form size="mini" label-width="150px" ref="resultsForm" :model="resultsOb">
                            <el-form-item
                                v-for="(result, index) in resultsOb.results"
                                :key="result.JLAC"
                                :label="result.name"
                                :prop="'results[' + index + '].value'"
                                :rules="{
                                    required: true, message: '入力してください', trigger: 'blur'
                                }">
                                <el-input v-model="result.value" style="width: 150px">
                                    <template slot="append"> {{ result.unit }} </template>
                                </el-input>
                                <el-button @click="removeResult(result)" type="text" style="margin-left: 10px">削除</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div>
                <el-button
                    @click="submitTask"
                    :disabled="task.sub_task === '0' && resultsOb.results.length < 1"
                    size="mini"
                    type="primary">
                    済
                </el-button>
            </div>
        </div>
        <!-- Inhouse End --->
        <!-- Prev/Shot --->
        <div v-if="task.type === '3' || task.type === '4'" class="wrapper">
            <div>
                <div>
                    <b> {{ task.title }} </b>
                </div>
                <div>
                    <el-form size="mini" :inline="true">
                        <el-form-item label="位置">
                            <el-select v-model="task.sub_3" placeholder="選択又は検索" style="width: 85px">
                                <el-option
                                    v-for="item in locations"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="量">
                            <el-input v-model="task.sub_1" style="width: 70px">
                                <template slot="append">ml</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="LotNo">
                            <el-input v-model="task.sub_2" style="width: 70px"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div>
                <el-button
                    @click="submitTask"
                    :disabled="task.sub_1 ==='' || task.sub_2 === ''"
                    size="mini"
                    type="primary">
                    済
                </el-button>
            </div>
        </div>
        <!-- Prev/Shot End --->
        <!-- OP/Treat --->
        <div v-if="task.type === '7' || task.type === '8'" class="wrapper">
            <div>
                <div>
                    <b> {{ task.title }} </b>
                </div>
            </div>
            <div>
                <el-button
                    @click="submitTask"
                    :disabled="task.sub_1 ==='' || task.sub_2 === ''"
                    size="mini"
                    type="primary">
                    済
                </el-button>
            </div>
        </div>
        <!-- OP/Treat End --->
        <!-- Kenkoushindan --->
        <el-form v-if="task.type === '95'" ref="form" :rules="rules" :model="task.kksdData" label-width="100px" size="small">
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
            <el-form-item label="身長(cm)" prop="height" style="width: 200px">
                <el-input type="number" placeholder="入力" v-model.number="task.kksdData.height"></el-input>
            </el-form-item>
            <el-form-item label="体重(kg)" prop="weight" style="width: 200px">
                <el-input type="number" placeholder="入力" v-model.number="task.kksdData.weight"></el-input>
            </el-form-item>
            <el-form-item label="BMI" prop="bmi" style="width: 200px">
                <el-input type="number" placeholder="入力" v-model.number="task.kksdData.bmi"></el-input>
            </el-form-item>
            <el-form-item label="腹囲" prop="stomache_width" style="width: 200px">
                <el-input type="number" placeholder="入力" v-model.number="task.kksdData.stomache_width"></el-input>
            </el-form-item>
            <el-form-item label="心電図ID" prop="ecg" style="width: 200px">
                <el-input placeholder="入力  " v-model="task.kksdData.ecg"></el-input>
            </el-form-item>
            <el-form-item label="X線番号" prop="x_ray_ID" style="width: 200px">
                <el-input placeholder="入力" v-model="task.kksdData.x_ray_ID"></el-input>
            </el-form-item>
            <h4>血圧</h4>
            <el-form-item label="血圧最高(S)" prop="blood_pressure_max" style="width: 200px">
                <el-input type="number" placeholder="入力  " v-model.number="task.kksdData.blood_pressure_max"></el-input>
            </el-form-item>
            <el-form-item label="血圧最低(D)" prop="blood_pressure_min" style="width: 200px">
                <el-input type="number" placeholder="入力  " v-model.number="task.kksdData.blood_pressure_min"></el-input>
            </el-form-item>
            <h4>視力</h4>
            <el-form-item label="視力左" prop="sight_left" style="width: 200px">
                <el-input type="number" placeholder="入力  " v-model.number="task.kksdData.sight_left"></el-input>
            </el-form-item>
                <el-form-item label="視力右" prop="sight_right" style="width: 200px">
                <el-input type="number" placeholder="入力  " v-model.number="task.kksdData.sight_right"></el-input>
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
        <!-- Kenkoushindan End -->
        <div>
            <el-button @click="addComment = !addComment" type="text" style="padding: 0"><i class="far fa-comment-alt"></i></el-button>
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
            resultsFull: false,
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
        fetchResults(open) {
            this.resultsFilter = ""
            if (!this.resultsFull) {
                this.doRequest('kensaResults', this.task.sub_1).then(result => {
                    this.resultsFull = result.data
                })
            }
        },
        addResult(result) {
            this.resultsOb.results.push(result)
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
    justify-content: space-between
}
.mainBorder {
    border-bottom: solid 1px #ebeef5;
    padding: 10px;
}
</style>
