<template>
    <div>
        <el-table
            :size="size"
            :emptyText="emptyText"
            :data="filteredData"
            :row-key="rowKey"
            :show-header="showHeader"
            @sort-change="sort"
            @select="select"
            @row-click="rowClick"
            @filter-change="filterHandler"
            :height="height"
            :stripe="stripe"
            style="width: 100%"
            v-bind:style="{'max-height': maxHeight, 'cursor': cursor}">
            <slot></slot>
        </el-table>
        <el-pagination
            v-if="pagination"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :pager-count="5"
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
        pagination: {default: false},
        size: String,
        showHeader: Boolean,
        rowKey: String,
        maxHeight: Number,
        height: Number,
        stripe: String,
        emptyText: String,
        cursor: {default: 'default'},
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
        },
        dataCopy() {
            if (this.data) {
                if (this.data.length > 0) {
                    return JSON.parse(JSON.stringify(this.data))                 
                }
                return []                
            } else {
                return []
            }
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: this.pageSizes[0]
        }
    },
    watch: {
        data() {
            this.currentPage = 1
        }
    },
    methods: {
        filterHandler(val) {
            this.$emit('filter-change', val)
        },
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
        },
        rowClick(data) {
            this.$emit('row-click', data)
        }
    }
}
</script>

