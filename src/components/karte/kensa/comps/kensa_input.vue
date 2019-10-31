<template>
    <div class="mainBorder">
        <div class="wrapper">
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
                    :disabled="resultsOb.results.length < 1"
                    size="mini"
                    type="primary">
                    保存
                </el-button>
            </div>
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
        submitTask() {
            let task = this.task
            this.$refs.resultsForm.validate((valid) => {
                if(valid) {
                    this.$emit('insertStart')
                    this.task.results = this.resultsOb.results
                    this.doRequest('insertSRLOrders', this.task).then(result => {
                        this.$emit('insertDone')
                    })
                }
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
