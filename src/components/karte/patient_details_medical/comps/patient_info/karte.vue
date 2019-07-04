<template>
    <div ref="cont" style="margin: -10px; height: calc(100% - 30px)">
        <div style="margin: 10px">
            <el-table
                ref="karteList"
                :data="data"
                stripe
                size="mini"
                @select="selectRow"
                @row-click="selectRowIndirect"
                :max-height="tableHeight"
                class="cctable">
                <el-table-column
                    type="selection"
                    width="40"/>
                <el-table-column
                    label="日付"
                    prop="dispDate"
                    sortable/>
                <el-table-column
                    label="診察内容"
                    prop="typeName"
                    sortable/>
                <el-table-column
                    v-for="(item,index) in types"
                    :key="index"
                    :label="item.label"
                    width="50">
                    <template slot-scope="scope">
                        <span v-if="scope.row[item.prop] > 0"> {{ item.label }} </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

export default {
    props: [
        'data'
    ],
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight - 100})
    },
    data() {
        return {
            tableHeight: 0,
            types: [
                {label: '処方', prop: 'shohouCount'},
                {label: '注射', prop: 'shotCount'},
                {label: '予防', prop: 'prevVacCount'},
                {label: '処置', prop: 'treatCount'},
                {label: '手術', prop: 'opCount'},
                {label: '検査', prop: 'kensaCount'},
                {label: '編集', prop: 'edited'}
            ],
        }
    },
    methods: {
        removeTab(row) {
            let row2 = this.data.find(function(item) {return item.ID === row})
            row2.selected = false
            this.$emit('select', {mode: 'remove', data: row})
        },
        removeTabIndr(row) {
            let row2 = this.data.find(function(item) {return item.ID === row})
            this.$refs.karteList.toggleRowSelection(row2, false)
            this.$emit('select', {mode: 'remove', data: row})
        },
        selectRowIndirect(row) {
            if (!row.selected) {
                this.$refs.karteList.toggleRowSelection(row, true)                
            } else {
                this.$refs.karteList.toggleRowSelection(row, false)
            }
        },
        selectRow(rows, row) {
            if (!row.selected) {
                row.selected = true
                this.doRequest('karteDisplay', row.ID).then(result => {
                    result.data.meta = {
                        ID: row.ID,
                        date: row.dispDate
                    }
                    this.$emit('select', {mode: 'add', data: result.data})
                })                
            } else {
                this.removeTab(row.ID)
            }
        }
    }
}
</script>

