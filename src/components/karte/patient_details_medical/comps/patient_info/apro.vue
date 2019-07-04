<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <h4 style="margin: 0 0 10px 0">
            <span>アレルギー　</span>
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
                        <el-tooltip :content="scope.row.comment" placement="right" effect="light" v-if="scope.row.comment !== ''" popper-class="teiComm">
                            <i class="el-icon-chat-square" style="margin-left: 5px"></i>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>プロブレム　</span>
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
    }
}
</script>

<style>
.childTable .el-table__body-wrapper {
    overflow-y: auto!important
}
</style>
