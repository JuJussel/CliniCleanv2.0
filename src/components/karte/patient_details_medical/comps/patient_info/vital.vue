<template>
    <div v-loading="loading">
        <el-table
            class="cctable"
            border
            stripe
            :data="tableItems"
            size="mini">
            <el-table-column
                fixed
                label="バイタル"
                prop="name"
                width="100">
            </el-table-column>
            <el-table-column
                v-for="date in data.dates"
                :key="date"
                :label="date"
                :prop="date"
                width="120">
                <template slot="header">
                    <dateDisplay :date="date"></dateDisplay>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

export default {
    props: [
        'data'
    ],
    computed: {
        tableItems() {
            if (this.data.measures) {
                let result = Object.values(this.data.measures)
                return result
            } else {
                return []
            }
        },
    },
    watch: {
        data() {
            this.loading = false
        }
    },
    data() {
        return {
            loading: false,
            recordOpen: false,
            chart: false,
            showChart: false,
            chartInit: {},
        }
    }
}
</script>

<style>
.hidden {
    display: none
}

</style>
