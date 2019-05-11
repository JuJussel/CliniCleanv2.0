<template>
    <div ref="cont" style="height: calc(100% - 30px)">
        <el-table
            ref="table"
            :data="data"
            :max-height="tableHeight"
            size="mini"
            class="cctable"
            stripe
            @row-click="handleRowClick"
            row-class-name="row2212">
            <el-table-column
                width="50">
                <template slot-scope="scope">
                    <el-icon v-if="scope.row.type === '1'" class="el-icon-document"></el-icon>
                    <el-icon v-else-if="scope.row.type === '2'" class="el-icon-picture-outline"></el-icon>
                </template>
            </el-table-column>
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="130">
            </el-table-column>
            <el-table-column
                sortable
                label="名前"
                prop="title">
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
        this.$nextTick(function() {this.tableHeight = contHeight - 40})
    },
    data() {
        return {
            tableHeight: 0
        }
    },
    methods: {
        handleRowClick(row) {
            let api = this.$globals.apiURL
            if (typeof nw !== 'undefined') {
                nw.Window.open(api + "/patient_files/" + row.file, {})                
            } else{
                window.open(api + "/patient_files/" + row.file, row.title, "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10")
            }
        }
    }
}
</script>

<style>
.row2212 {
    cursor: pointer
}
</style>
