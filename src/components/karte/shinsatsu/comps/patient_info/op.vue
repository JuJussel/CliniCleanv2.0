<template>
    <div ref="cont" style="height: calc(100% - 30px)">
            <h4 style="margin: 0 0 10px 0">
                <span>手術　</span><el-button size="small" @click="clearFilter('oper')">フィルター新規化</el-button>
            </h4>
        <el-table
            ref="oper"
            :data="data.oper"
            :max-height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable "
            stripe>
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="120"
                :filters="filters.op.dates"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                sortable
                label="項目名"
                prop="short_name_kanji"
                :filters="filters.op.names"
                :filter-method="filterHandler">
                <template slot-scope="scope">
                    <span> {{scope.row.short_name_kanji}} </span>
                    <el-button @click="handleRowClickOP(scope.row,'koui')" size="mini" type="text"><i class="fas fa-list"></i></el-button>
                    <el-button @click="handleRowClickOP(scope.row, 'text')" size="mini" type="text" style="margin-right: 5px"><i class="fas fa-font"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>処置　</span><el-button size="small" @click="clearFilter('treat')">フィルター新規化</el-button>
        </h4>
        <el-table
            ref="treat"
            :data="data.treat"
            :max-height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable"
            stripe
            @row-click="handleRowClickTreat"
            row-class-name="row2212">
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="120"
                :filters="filters.treat.dates"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                sortable
                label="項目名"
                prop="short_name_kanji"
                :filters="filters.treat.names"
                :filter-method="filterHandler">
                <template slot-scope="scope">
                    <span> {{scope.row.short_name_kanji}} </span>
                    <el-button @click="handleRowClickTreat(scope.row,'koui')" size="mini" type="text"><i class="fas fa-list"></i></el-button>
                    <el-button @click="handleRowClickTreat(scope.row, 'text')" size="mini" type="text" style="margin-right: 5px"><i class="fas fa-font"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: [
        'data'
    ],
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight/2 - 60})
    },
    methods: {
        handleRowClickOP(row, type) {
            if (type === 'text') {
                const text = "<strong>手術</strong>　" + row.dispDate + ": " + row.short_name_kanji
                this.$eventHub.$emit('addText', text)                
            } else if(type === 'koui') {
                row.kouiType = '40'
                this.$eventHub.$emit('addKouiHist', row)
            }
        },
        handleRowClickTreat(row, type) {
            if (type === 'text') {
                const text = "<strong>処置</strong>　" + row.dispDate + ": " + row.short_name_kanji
                this.$eventHub.$emit('addText', text)                
            } else if(type === 'koui') {
                row.kouiType = '50'
                this.$eventHub.$emit('addKouiHist', row)
            }
        },
        clearFilter(val) {
            this.$refs[val].clearFilter();
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        }
    },
    computed: {
        filters() {
            let treat = {
                dates: [],
                names: []
            }
            let op = {
                dates: [],
                names: []
            }
            let returnData = {
                treat: {
                    dates: [],
                    names: []
                },
                op: {
                    dates: [],
                    names: []
                }
            }


            this.data.treat.forEach(item => {
                treat.dates.push(item.dispDate)
                treat.names.push(item.short_name_kanji)
            })
            treat.dates = [...new Set(treat.dates)]
            treat.names = [...new Set(treat.names)]
            treat.dates.forEach(item => {
                returnData.treat.dates.push({text: item, value: item})
            })
            treat.names.forEach(item => {
                returnData.treat.names.push({text: item, value: item})
            })
            this.data.oper.forEach(item => {
                op.dates.push(item.dispDate)
                op.names.push(item.short_name_kanji)
            })
            op.dates = [...new Set(op.dates)]
            op.names = [...new Set(op.names)]
            op.dates.forEach(item => {
                returnData.op.dates.push({text: item, value: item})
            })
            op.names.forEach(item => {
                returnData.op.names.push({text: item, value: item})
            })
            return returnData
        }
    },
    data() {
        return {
            tableHeight: 0
        }
    }
    
}
</script>

<style>
.row2212 {
    cursor: pointer
}
</style>

