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
            :page-sizes="[20, 50, 100]"
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
    props: [
        'data',
        'size',
        'rowKey',
        'maxHeight',
        'height',
        'stripe',
        'emptyText'
    ],
    computed: {
        filteredData() {
            let start = this.pageSize*this.currentPage - this.pageSize
            let end = start + this.pageSize
            let filtered = this.dataCopy.slice(start, end)
            return filtered
        },
        totalPages() {
            return this.data.length
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 20,
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
            this.dataCopy = this.$_.orderBy(copy, val.prop, direction)
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

