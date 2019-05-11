<template>
    <div ref="cont" style="height: calc(100% - 30px)">
        <div style="margin-bottom: 10px">
            <el-button size="small" @click="clearFilter">フィルター新規化</el-button>
        </div>
        <el-table
            ref="table"
            :data="data.table"
            :max-height="tableHeight"
            size="mini"
            border
            stripe
            class="hoverButtonTable">
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="130"
                :filters="filters.dates"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                sortable
                label="検査項目"
                prop="name"
                :filters="filters.kensa"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                label="分析名"
                prop="name_bunseki"
                :filters="filters.bunseki"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                label="結果"
                prop="value"
                width="60">
            </el-table-column>
            <el-table-column
                label="単位"
                width="100">
                <template slot-scope="scope">
                    <span> {{scope.row.unit}} </span>
                    <el-button @click="handleRowClick(scope.row,'koui')" size="mini" type="text"><i class="fas fa-list"></i></el-button>
                    <el-button @click="handleRowClick(scope.row, 'text')" size="mini" type="text" style="margin-right: 5px"><i class="fas fa-font"></i></el-button>
                </template>
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
        this.$nextTick(function() {this.tableHeight = contHeight - 40})
    },
    methods: {
        handleRowClick(val, type) {
            if (type === 'text') {
                const text = val.dispDate + ": " + val.name + val.name_bunseki + " " + val.value + val.unit
                this.$eventHub.$emit('addText', text)                
            } else if(type === 'koui') {
                row.kouiType = '60'
                this.$eventHub.$emit('addKouiHist', row)
            }
        },
        clearFilter() {
            this.$refs.table.clearFilter();
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        }
    },
    computed: {
        filters() {
            let dateArray = []
            let kensaArray = []
            let bunsekiArray = []
            let returnArray = {dates: [], kensa: [], bunseki: []}
            this.data.table.forEach(item => {
                dateArray.push(item.dispDate)
                kensaArray.push(item.name)
                bunsekiArray.push(item.name_bunseki)
            })
            dateArray = [...new Set(dateArray)]
            kensaArray = [...new Set(kensaArray)]
            bunsekiArray = [...new Set(bunsekiArray)]
            dateArray.forEach(item => {
                returnArray.dates.push({text: item, value: item})
            })
            kensaArray.forEach(item => {
                returnArray.kensa.push({text: item, value: item})
            })
            bunsekiArray.forEach(item => {
                returnArray.bunseki.push({text: item, value: item})
            })
            return returnArray
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

