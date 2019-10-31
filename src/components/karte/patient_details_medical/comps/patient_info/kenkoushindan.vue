<template>
    <div ref="cont" style="margin: 0px; height: calc(100% - 30px)">
        <el-table
            ref="karteList"
            :data="data"
            stripe
            size="mini"
            @select="selectRow"
            :max-height="tableHeight"
            class="cctable">
            <el-table-column
                type="selection"
                width="42"/>
            <el-table-column
                label="日付"
                prop="dispDate"
                sortable/>
        </el-table>
    </div>
</template>

<script>

import kenkoushindanDisplay from '../../../../shared/kenkoushindanDisplay'

export default {
    props: [
        'data'
    ],
    components: {
        kenkoushindanDisplay
    },
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight - 100})
    },
    data() {
        return {
            activeTab: 'list',
            tableHeight: 0,
            tabs: []
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
            row2.selected = false
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
                this.doRequest('kenkoushindanDisplay', row.ID).then(result => {
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
