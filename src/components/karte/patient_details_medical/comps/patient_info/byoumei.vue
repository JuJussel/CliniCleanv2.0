<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <h4 style="margin: 0 0 10px 0">
            <span>有効　</span>
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
                prop="main"
                width="100">
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
    }
}
</script>

<style>
.childTable .el-table__body-wrapper {
    overflow-y: auto!important
}
</style>
