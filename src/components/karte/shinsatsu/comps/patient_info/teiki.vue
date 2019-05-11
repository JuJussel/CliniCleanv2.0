<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <h4 style="margin: 0 0 10px 0">
            <span>定期処方　</span>
            <el-popover
                v-model="newSHTeiki.open">
                <div>
                    <el-form label-width="60px">
                        <el-form-item label="期間">
                            <el-date-picker
                                v-model="newSHTeiki.dateRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="~"
                                start-placeholder="開始"
                                end-placeholder="終了">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="薬剤名">
                            <el-autocomplete
                                style="width: 350px"
                                v-model="newSHTeiki.item"
                                :fetch-suggestions="getMeds"
                                :readonly="newSHTeikiSelected"
                                placeholder="検索"
                                value-key="name"
                                :trigger-on-focus="false"
                                @select="selectMed">
                            </el-autocomplete>
                            <el-button style="margin-left: 10px" :disabled="!newSHTeikiSelected" @click="clearNewSHTeiki">クリア</el-button>
                        </el-form-item>
                        <el-form-item label="メモ">
                            <el-input 
                                type="textarea" 
                                maxlength="145"
                                show-word-limit
                                v-model="newSHTeiki.comment">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <span style="float: right">
                        <el-button type="text" @click="closeNewSHTeiki">キャンセル</el-button>
                        <el-button :disabled="!newSHTeikiValid" type="primary" @click="saveNewSHTeiki">保存</el-button>
                    </span>
                </div>
                <el-button slot="reference" size="small">登録</el-button>
            </el-popover>
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
                        <el-button size="mini" type="danger" style="opacity: 0" @click="deleteSHTeiki(scope.row)">削除</el-button>
                        <el-tooltip :content="scope.row.note" placement="right" effect="light" v-if="scope.row.note !== null" popper-class="teiComm">
                            <i class="el-icon-chat-square" style="margin-left: 5px"></i>
                        </el-tooltip>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>定期行為　</span><el-button size="small">登録</el-button>
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
    computed: {
        newSHTeikiValid() {
            if (this.newSHTeiki.dateRange !== null && this.newSHTeiki.item !== '' && this.newSHTeiki.selectedItem !== {}) {
                return true
            }
            return false
        },
        newSHTeikiSelected() {
            if (this.newSHTeiki.selectedItem.id) {
                return true
            }
            return false
        }
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
        clearNewSHTeiki() {
            this.newSHTeiki.item= ""
            this.newSHTeiki.selectedItem = {}
        },
        closeNewSHTeiki() {
            this.newSHTeiki = {
                open: false,
                dateRange: null,
                item: "",
                comment: "",
                selectedItem: {}
            }
        },
        saveNewSHTeiki () {
            this.loading = true
            const patientID = this.$store.state.componentData.karteDetails.patient.id
            this.doRequest('insertTeikiShohou', {
                code: this.newSHTeiki.selectedItem.id,
                patientID: patientID,
                mode: 'add',
                note: this.newSHTeiki.comment,
                dateRange: this.newSHTeiki.dateRange
            }).then(result => {
                this.$eventHub.$emit('kartePatientDataUpdate')
                this.closeNewSHTeiki()
            })
        },
        deleteSHTeiki(row) {
            this.loading = true
            const patientID = this.$store.state.componentData.karteDetails.patient.id
            this.doRequest('insertTeikiShohou', {
                mode: 'remove',
                editID: row.ID,
            }).then(result => {
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        },
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


