<template>
    <div>
        <el-table
            :size="size"
            :emptyText="emptyText"
            :data="filteredData"
            :row-key="rowKey"
            @sort-change="sort"
            @select="select"
            :height="height"
            :stripe="stripe"
            style="width: 100%">
            <slot></slot>
        </el-table>
        <el-pagination
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            style="text-align: center; margin-top: 10px"
            @size-change="sizeChange"
            @current-change="currentChange"
            :total="totalPages">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        data: Array,
        size: String,
        rowKey: String,
        maxHeight: Number,
        height: Number,
        stripe: String,
        emptyText: String,
        pageSizes: {default: function(){return [20,50,100]}}
    },
    computed: {
        filteredData() {
            let start = this.pageSize*this.currentPage - this.pageSize
            let end = start + this.pageSize
            let filtered = this.dataCopy.slice(start, end)
            return filtered
        },
        totalPages() {
            if (this.data) {
                return this.data.length                
            }
            return 0
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: this.pageSizes[0],
            dataCopy: []
        }
    },
    watch: {
        data() {
            this.dataCopy = JSON.parse(JSON.stringify(this.data))
        }
    },
    methods: {
        sort(val) {
            let direction = 'asc'
            if (val.order === 'descending') {
                direction = 'desc'
            }
            let copy = JSON.parse(JSON.stringify(this.data))
            this.dataCopy = _.orderBy(copy, val.prop, direction)
        },
        select(data) {
            this.$emit('select', data)
        },
        sizeChange(val) {
            this.pageSize = val
        },
        currentChange(val) {
            this.currentPage = val
        }
    }
}
</script>

