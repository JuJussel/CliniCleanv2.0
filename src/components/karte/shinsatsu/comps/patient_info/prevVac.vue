<template>
    <div ref="cont" style="height: calc(100% - 30px)">
        <div style="margin-bottom: 10px">
            <el-button size="small" @click="clearFilter">フィルター新規化</el-button>
        </div>
        <el-table
            ref="table"
            :data="data"
            :max-height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable"
            stripe>
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
                label="薬名"
                prop="med_name"
                :filters="filters.meds"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                label="薬量"
                prop="name_bunseki"
                width="60">
                <template slot-scope="scope">
                    <span v-if="scope.row.sub_1 !== ''">{{ scope.row.sub_1 }} ml</span>
                </template>
            </el-table-column>
            <el-table-column
                label="位置"
                width="110">
                <template slot-scope="scope">
                    <span> {{scope.row.sub_3}} </span>
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
        handleRowClick(row, type) {
            if (type === 'text') {
                const text = "<strong>予防接種　</strong>" + row.dispDate + ": " + row.med_name
                this.$eventHub.$emit('addText', text)                
            } else if(type === 'koui') {
                row.kouiType = '30_prev'
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
            let medArray = []
            let returnArray = {dates: [], meds: []}
            this.data.forEach(item => {
                dateArray.push(item.dispDate)
                medArray.push(item.med_name)
            })
            dateArray = [...new Set(dateArray)]
            medArray = [...new Set(medArray)]
            dateArray.forEach(item => {
                returnArray.dates.push({text: item, value: item})
            })
            medArray.forEach(item => {
                returnArray.meds.push({text: item, value: item})
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

