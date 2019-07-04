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
                prop="sub_3"
                width="110">
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
</style>

