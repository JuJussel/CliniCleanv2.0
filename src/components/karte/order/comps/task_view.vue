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
        <!-- SRL End -->
            <div>
                <el-button @click="addComment = !addComment" type="text" style="padding: 0"><i class="far fa-comment-alt"></i></el-button>
                {{ task.order_comment }}
            </div>
            <div v-if="addComment">
                <el-form label-width="80" size="mini">
                    <el-form-item label="コメント">
                        <el-input v-model="comment" style="max-width: 300px" type="textarea"></el-input>
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
            resultsFilter: ""
        }
    },
    computed: {
        resultsFiltered() {
            let returnArr = _.differenceWith(this.resultsFull, this.resultsOb.results, _.isEqual)
            returnArr = returnArr.filter(item => item.name && item.name.includes(this.resultsFilter))
            return returnArr
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
                if (task.type === "3" || task.type === "4") {
                    if (this.submitData.lot === "" && task.sub_2 === null) {
                        task.valid.lot = false;
                        validated = false;
                    }
                    if (this.submitData.amt === "" && task.sub_1 === null) {
                        task.valid.amt = false;
                        validated = false;
                    }
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
