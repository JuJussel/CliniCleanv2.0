<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <h4 style="margin: 0 0 10px 0">
            <span>アレルギー　</span>
            <el-popover v-model="newAllergy.open" width="500">
                <div>
                    <el-form label-width="120px">
                        <el-form-item label="アレルギー物質">
                            <el-input v-model="newAllergy.title" maxlength="25"></el-input>
                        </el-form-item>
                        <el-form-item label="重症度">
                            <el-rate
                                v-model="newAllergy.grade"
                                :texts="gradeTexts"
                                show-text
                                :icon-classes="gradeIcons"
                                void-icon-class="el-icon-warning"
                                :colors="gradeColors"
                                style="margin-top: 8px">
                            </el-rate>
                        </el-form-item>
                        <el-form-item label="コメント">
                            <el-input 
                                type="textarea" 
                                maxlength="145"
                                show-word-limit
                                v-model="newAllergy.comment">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <span style="float: right">
                        <el-button type="text" @click="closeNewAllergy">キャンセル</el-button>
                        <el-button :disabled="newAllergy.title === '' || newAllergy.grade == 0" type="primary" @click="saveNewAllergy">保存</el-button>
                    </span>
                </div>
                <el-button slot="reference" size="small">登録</el-button>
            </el-popover>
        </h4>
        <el-table
            ref="allergy"
            :data="data.allergy"
            row-key="ID"
            :height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable"
            stripe>
            <el-table-column
                sortable
                label="アレルギー物質"
                prop="name">
            </el-table-column>
            <el-table-column
                sortable
                label="重症度">
                <template slot-scope="scope">
                    <el-rate
                        v-model="scope.row.grade"
                        :texts="gradeTexts"
                        show-text
                        disabled
                        :icon-classes="gradeIcons"
                        void-icon-class="el-icon-warning"
                        :colors="gradeColors">
                    </el-rate>
                </template>
            </el-table-column>
            <el-table-column
                width="90">
                <template slot-scope="scope">
                    <span style="display: flex; align-items: center">
                        <el-button size="mini" type="danger" style="opacity: 0" @click="deleteAllergy(scope.row)">削除</el-button>
                        <el-tooltip :content="scope.row.comment" placement="right" effect="light" v-if="scope.row.comment !== ''" popper-class="teiComm">
                            <i class="el-icon-chat-square" style="margin-left: 5px"></i>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>プロブレム　</span>
            <el-popover v-model="newProblem.open" width="500">
                <div>
                    <el-form label-width="120px">
                        <el-form-item label="プロブレム名">
                            <el-input v-model="newProblem.title" maxlength="25"></el-input>
                        </el-form-item>
                        <el-form-item label="コメント">
                            <el-input 
                                type="textarea" 
                                maxlength="145"
                                show-word-limit
                                v-model="newProblem.comment">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <span style="float: right">
                        <el-button type="text" @click="closeNewProblem">キャンセル</el-button>
                        <el-button :disabled="newProblem.title === ''" type="primary" @click="saveNewProblem">保存</el-button>
                    </span>
                </div>
                <el-button slot="reference" size="small">登録</el-button>
            </el-popover>
        </h4>
        <el-table
            ref="problem"
            :data="data.problem"
            row-key="ID"
            :height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable childTable"
            stripe>
            <el-table-column
                sortable
                label="プロブレム名"
                prop="name">
            </el-table-column>
            <el-table-column
                width="90">
                <template slot-scope="scope">
                    <span style="display: flex; align-items: center">
                        <el-button size="mini" type="danger" style="opacity: 0" @click="deleteProblem(scope.row)">削除</el-button>
                        <el-tooltip :content="scope.row.comment" placement="right" effect="light" v-if="scope.row.comment !== ''" popper-class="teiComm">
                            <i class="el-icon-chat-square" style="margin-left: 5px"></i>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
var xhr
export default {
    props: [
        'data'
    ],
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight/2 - 60})
    },
    watch: {
        data() {
            this.loading = false
        }
    },
    data() {
        return {
            gradeIcons: ['el-icon-warning','el-icon-warning','el-icon-warning'],
            gradeTexts: ['軽症','軽症', '中等症','重症', '重症'],
            gradeColors: ['#607d8b', '#F7BA2A', '#e53935'],
            loading: false,
            tableHeight: 0,
            newAllergy: {
                open: false,
                title: "",
                grade: 0,
                comment: ""
            },
            newProblem: {
                open: false,
                title: "",
                comment: ""
            }
        }
    },
    methods: {
        closeNewAllergy() {
            this.newAllergy = {
                open: false,
                title: "",
                grade: 0,
                comment: ""
            }
        },
        saveNewAllergy () {
            this.newAllergy.open = false
            this.loading = true
            let data={
                'title': this.newAllergy.title,
                'comment': this.newAllergy.comment,
                'grade': this.newAllergy.grade,
                'karteID': this.$store.state.componentData.karteDetails.shinsatsu.karteID,
                'patientID': this.$store.state.componentData.karteDetails.patient.id
            }
            this.doRequest('insertAllergy', data).then(result => {
                this.closeNewAllergy()
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        },
        deleteAllergy(row) {
            this.loading = true
            let data = row.ID
            this.doRequest('updateAllergy', data).then(result => {
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        },
        closeNewProblem() {
            this.newProblem = {
                open: false,
                title: "",
                comment: ""
            }
        },
        saveNewProblem () {
            this.newProblem.open = false
            this.loading = true
            let data={
                'title': this.newProblem.title,
                'comment': this.newProblem.comment,
                'karteID': this.$store.state.componentData.karteDetails.shinsatsu.karteID,
                'patientID': this.$store.state.componentData.karteDetails.patient.id
            }
            this.doRequest('insertProblem', data).then(result => {
                this.closeNewProblem()
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        },
        deleteProblem(row) {
            this.loading = true
            let data = row.ID
            this.doRequest('updateProblem', data).then(result => {
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        }
    }
}
</script>

<style>
.childTable .el-table__body-wrapper {
    overflow-y: auto!important
}
</style>
