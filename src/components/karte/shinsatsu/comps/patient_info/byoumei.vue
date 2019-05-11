<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <h4 style="margin: 0 0 10px 0">
            <span>有効　</span>
            <el-popover v-model="newBM.opem">
                <div>
                    <el-form label-width="100px">
                        <el-form-item label="薬剤名">
                            <el-autocomplete
                                style="width: 350px"
                                v-model="newBM.item"
                                :fetch-suggestions="getBM"
                                :readonly="newBMSelected"
                                placeholder="検索"
                                value-key="name_kanji"
                                :trigger-on-focus="false"
                                @select="selectBM">
                            </el-autocomplete>
                            <el-button style="margin-left: 10px" :disabled="!newBMSelected" @click="clearNewBM">クリア</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="newBM.utagai">疑い</el-checkbox>
                            <el-checkbox v-model="newBM.main">主病</el-checkbox>
                        </el-form-item>
                        <el-form-item label="傷病名補足">
                            <el-input v-model="newBM.addition" maxlength="25"></el-input>
                        </el-form-item>
                    </el-form>
                    <span style="float: right">
                        <el-button type="text" @click="closeNewBM">キャンセル</el-button>
                        <el-button :disabled="!newBMValid" type="primary" @click="saveNewBM">保存</el-button>
                    </span>
                </div>
                <el-button slot="reference" size="small">登録</el-button>
            </el-popover>
        </h4>
        <el-table
            ref="active"
            :data="data.active"
            row-key="ID"
            :height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable childTable"
            stripe>
            <el-table-column
                sortable
                label="開始日"
                prop="dispDateStart"
                width="180">
            </el-table-column>
            <el-table-column
                sortable
                label="転帰日"
                prop="dispDateEnd"
                width="120">
            </el-table-column>
            <el-table-column
                label="病名"
                prop="name">
            </el-table-column>
            <el-table-column
                label="疑い"
                width="50">
                <template slot-scope="scope">
                    <span v-if="scope.row.utagai">疑い</span>
                </template>
            </el-table-column>
            <el-table-column
                label="主病"
                width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.main">主</span>
                    <el-popover v-if="scope.row.done !== '1'" v-model="scope.row.edit" @show="editByoumei(scope.row)">
                        <div>
                            <el-form label-width="100px">
                                <el-form-item>
                                    <el-checkbox v-model="editBM.utagai">疑い</el-checkbox>
                                    <el-checkbox v-model="editBM.main">主病</el-checkbox>
                                </el-form-item>
                                <el-form-item label="転帰">
                                    <el-radio-group v-model="editBM.outcome">
                                        <el-radio :label="1">治癒</el-radio>
                                        <el-radio :label="2">死亡</el-radio>
                                        <el-radio :label="3">中止</el-radio>
                                        <el-radio :label="null">継続</el-radio>
                                </el-radio-group>
                                </el-form-item>
                                <el-form-item label="転帰">
                                    <el-date-picker
                                        :disabled="!editBM.outcome"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy年MM月dd日"
                                        v-model="editBM.finish_date"
                                        type="date"
                                        placeholder="選択しない場合は本日">
                                    </el-date-picker>
                                </el-form-item>
                            </el-form>
                            <span style="float: right">
                                <el-button type="text" @click="scope.row.edit = false">キャンセル</el-button>
                                <el-button type="primary" @click="saveEditBM(scope.row)">保存</el-button>
                            </span>
                        </div>
                        <el-button slot="reference" size="mini">編集</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>済　</span>
        </h4>
        <el-table
            ref="done"
            :data="data.done"
            row-key="ID"
            :height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable childTable"
            stripe>
            <el-table-column
                sortable
                label="開始日"
                prop="dispDateStart"
                width="120">
            </el-table-column>
            <el-table-column
                sortable
                label="転帰日"
                prop="dispDateEnd"
                width="120">
            </el-table-column>
            <el-table-column
                label="病名"
                prop="name">
            </el-table-column>
            <el-table-column
                label="転帰"
                width="50">
                <template slot-scope="scope">
                    {{ outcomes[scope.row.outcome] }}
                </template>
            </el-table-column>
            <el-table-column
                label="疑い"
                width="50">
                <template slot-scope="scope">
                    <span v-if="scope.row.utagai">疑い</span>
                </template>
            </el-table-column>
            <el-table-column
                label="主病"
                width="50">
                <template slot-scope="scope">
                    <span v-if="scope.row.main">主</span>
                </template>
            </el-table-column>
        </el-table>    </div>
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
    computed: {
        newBMValid() {
            if (this.newBM.item !== '' && this.newBM.selectedItem.ID) {
                return true
            }
            return false
        },
        newBMSelected() {
            if (this.newBM.selectedItem.ID) {
                return true
            }
            return false
        }
    },
    watch: {
        data() {
            this.loading = false
        }
    },
    data() {
        return {
            loading: false,
            tableHeight: 0,
            outcomes: {
                '0': '確定',
                '1': '治癒',
                '2': '死亡',
                '3': '中止',
                '4': '移行'
            },
            newBM: {
                item: "",
                utagai: false,
                main: false,
                addition: "",
                open: false,
                search: [],
                selectedItem: {}
            },
            editBM: {
                date: new Date(),
                utagai: false,
                main: false
            }
        }
    },
    methods: {
       clearNewBM() {
            this.newBM.item= ""
            this.newBM.selectedItem = {}
        },
        closeNewBM() {
            this.newBM = {
                item: "",
                utagai: false,
                main: false,
                addition: "",
                open: false,
                search: [],
                selectedItem: {}
            }
        },
        saveNewBM () {
            this.newBM.open = false
            this.loading = true
            let data={
                'ID': this.newBM.selectedItem.ID,
                'comm': this.newBM.addition,
                'name': this.newBM.selectedItem.name_kanji,
                'utagai': this.newBM.utagai,
                'main': this.newBM.main,
                'karteID': this.$store.state.componentData.karteDetails.shinsatsu.karteID,
                'patientID': this.$store.state.componentData.karteDetails.patient.id,
                'shinsatsuID': this.$store.state.componentData.home.shinsatsu
            }
            this.doRequest('insertByoumei', data).then(result => {
                this.closeNewBM()
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        },
        getBM(query, cb) {
            if (xhr) {
                xhr.abort();
            }
            if (query === "") {
                this.newBM.search = []
            }
            else {
                const data = {searchKey: query}
                this.doRequest('getByoumeiList', data).then(result => {
                    let resultsFiltered = result.data.slice(0, 101)
                    if (result.data.length > 100) {
                        resultsFiltered.push({name_kanji: '------100件以上見つかりました------', id: "dummy"})                        
                    }
                    cb(resultsFiltered)
                })
            }
        },
        selectBM(item) {
            this.newBM.selectedItem = item
        },
        editByoumei(row) {
            row = JSON.parse(JSON.stringify(row))
            this.editBM = row
        },
        saveEditBM(row) {
            row.edit = false
            this.loading = true
            let data = this.editBM
            if (data.outcome && !data.finish_date) {
                data.finish_date = this.$moment().format("YYYY-MM-DD")
            }
            data.utagai = +data.utagai; //convert boolean to int
            data.main = +data.main; //convert boolean to int
            data.patientID = this.$store.state.componentData.karteDetails.patient.id
            data.karteID = this.$store.state.componentData.karteDetails.shinsatsu.karteID
            data.shinsatsuID = this.$store.state.componentData.home.shinsatsu
            this.doRequest('updateByoumei', data).then(result => {
                this.closeNewBM()
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
