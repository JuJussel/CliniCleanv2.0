<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <h4 style="margin: 0 0 10px 0">
            <span>定期処方　</span>
        </h4>
        <el-table
            ref="table"
            :data="data"
            :max-height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable"
            stripe>
            <el-table-column
                sortable
                label="開始"
                prop="start_date"
                width="120">
            </el-table-column>
            <el-table-column
                sortable
                label="終了"
                prop="end_date"
                width="120">
            </el-table-column>
            <el-table-column
                label="薬剤名"
                prop="med_name">
            </el-table-column>
            <el-table-column
                width="90">
                <template slot-scope="scope">
                    <span style="display: flex; align-items: center">
                        <el-tooltip :content="scope.row.note" placement="right" effect="light" v-if="scope.row.note !== null" popper-class="teiComm">
                            <i class="el-icon-chat-square" style="margin-left: 5px"></i>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>定期行為　</span>
        </h4>
        <el-table
            ref="table"
            :data="data"
            :max-height="tableHeight"
            size="mini"
            class="cctable"
            stripe>
            <el-table-column
                sortable
                label="開始"
                prop="start_date"
                width="130">
            </el-table-column>
            <el-table-column
                sortable
                label="終了"
                prop="end_date"
                width="130">
            </el-table-column>
            <el-table-column
                label="薬剤名"
                prop="med_name">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { log } from 'util';
export default {
    props: [
        'data'
    ],
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight/2 - 60})
    },
    data() {
        return {
            loading: false,
            tableHeight: 0,
            newSHTeiki: {
                open: false,
                dateRange: null,
                item: "",
                comment: "",
                selectedItem: {}
            }
        }
    },
    watch: {
        data() {
            this.loading = false
        }
    },
    methods: {
        getMeds(query, cb) {
            if (query === "") {
                this.newSHTeiki.search = []
            }
            else {
                const data = {type: 'sh', mode: 'search', searchKey: query}
                this.doRequest('getKouiList', data).then(result => {
                    let resultsFiltered = result.data.slice(0, 101)
                    if (result.data.length > 100) {
                        resultsFiltered.push({name: '------100件以上見つかりました------', id: "dummy"})                        
                    }
                    cb(resultsFiltered)
                })
            }
        },
        selectMed(item) {
            this.newSHTeiki.selectedItem = item
        }
    } 
}
</script>
<style>
.teiComm {
    max-width: 200px
}
</style>


