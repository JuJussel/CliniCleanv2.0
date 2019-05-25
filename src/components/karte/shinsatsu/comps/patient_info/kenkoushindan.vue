<template>
    <div ref="cont" style="margin: -10px; height: calc(100% - 30px)">
        <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab">
            <el-tab-pane
                label="リスト"
                name="list">
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
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane
                v-for="(item) in tabs"
                :key="item.meta.ID"
                closable=""
                :label="item.meta.date"
                :name="item.meta.ID"
                @tab-remove="removeTab">
                <div v-bind:style="{'max-height': tableHeight + 'px'}" style="margin: 10px; overflow: auto">
                    <kenkoushindanDisplay :data="item"></kenkoushindanDisplay>
                </div>
            </el-tab-pane>
        </el-tabs>
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
        removeTab(tab) {
            this.tabs = this.tabs.filter(tab => tab.name !== tab)
            let row = this.data.find(function(item) {return item.ID === tab})
            row.selected = false
            this.$refs.karteList.toggleRowSelection(row, false)
            let tabs = this.tabs
            let activeName = this.activeTab
            if (activeName === tab) {
                tabs.forEach((tab2, index) => {
                    if (tab2.meta.ID === tab) {
                        let nextTab = tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.meta.ID
                        } else {
                           activeName = ('list')
                        }
                    }
                })
            }
            this.activeTab = activeName
            this.tabs = this.tabs.filter(tab3 => tab3.meta.ID !== tab)
        },
        selectRowIndirect(row) {
            console.log(row);
            if (!row.selected) {
                this.selectRow('', row)
                this.$refs.karteList.toggleRowSelection(row, true)                
            } else {
                this.removeTab(row.ID)
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
                    this.tabs.push(result.data)
                    this.activeTab = row.ID
                })
            } else {
                this.removeTab(row.ID)
            }
        }
    }
}
</script>
