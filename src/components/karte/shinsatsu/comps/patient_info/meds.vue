<template>
    <div ref="cont" style="height: calc(100% - 30px)">
        <h4 style="margin: 0 0 10px 0">
            <span>処方　</span><el-button size="small" @click="clearFilter('meds')">フィルター新規化</el-button>
        </h4>
        <el-table
            ref="meds"
            :data="data.meds"
            :max-height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable"
            stripe>
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="120"
                :filters="filters.meds.dates"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                sortable
                label="薬名"
                prop="med_name"
                :filters="filters.meds.names"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                label="薬剤量"
                width="60">
                <template slot-scope="scope">
                    {{ scope.row.med_med_val }} {{ scope.row.med_med_unit }}
                </template>
            </el-table-column>
            <el-table-column
                label="錠用法">
                <template slot-scope="scope">
                    {{ scope.row.type_display }} {{ scope.row.med_timing }}
                </template>
            </el-table-column>
            <el-table-column
                label="分"
                width="100">
                <template slot-scope="scope">
                    <span> {{ scope.row.times }} {{ scope.row.timesUnit }} </span>
                    <el-button @click="handleRowClickMed(scope.row,'koui')" size="mini" type="text"><i class="fas fa-list"></i></el-button>
                    <el-button @click="handleRowClickMed(scope.row, 'text')" size="mini" type="text" style="margin-right: 5px"><i class="fas fa-font"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin: 20px 0 10px 0">
            <span>接種　</span><el-button size="small" @click="clearFilter('shots')">フィルター新規化</el-button>
        </h4>
        <el-table
            ref="shots"
            :data="data.shots"
            :max-height="tableHeight"
            size="mini"
            class="cctable hoverButtonTable"
            stripe>
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="120"
                :filters="filters.shots.dates"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                sortable
                label="薬名"
                prop="med_name"
                :filters="filters.shots.names"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                label="接種量"
                width="60">
                <template slot-scope="scope">
                    {{ scope.row.sub_1 }} ml
                </template>
            </el-table-column>
            <el-table-column
                label="位置"
                width="110">
                <template slot-scope="scope">
                    <span> {{ scope.row.sub_3 }}  </span>
                    <el-button @click="handleRowClickShot(scope.row,'koui')" size="mini" type="text"><i class="fas fa-list"></i></el-button>
                    <el-button @click="handleRowClickShot(scope.row, 'text')" size="mini" type="text" style="margin-right: 5px"><i class="fas fa-font"></i></el-button>
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
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight/2 - 60})
    },
    methods: {
        handleRowClickShot(row, type) {
            if (type === 'text') {
                const text = "<strong>注射</strong>　" + row.dispDate + ": " + row.med_name + row.sub_1 + "ml " + row.sub_3
                this.$eventHub.$emit('addText', text)                
            } else if(type === 'koui') {
                row.kouiType = '30'
                this.$eventHub.$emit('addKouiHist', row)
            }
        },
        handleRowClickMed(row, type) {
            if (type === 'text') {
                const text = "<strong>処方</strong>　" + row.dispDate + ": " + row.med_name + row.med_med_row + row.med_med_unit + " "  + row.type_display + row.med_timing + " " + row.times + row.timesUnit
                this.$eventHub.$emit('addText', text)                
            } else if(type === 'koui') {
                row.kouiType = 'sh'
                this.$eventHub.$emit('addKouiHist', row)
            }
        },
        clearFilter(val) {
            this.$refs[val].clearFilter();
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        }
    },
    computed: {
        filters() {
            let meds = {
                dates: [],
                names: []
            }
            let shots = {
                dates: [],
                names: []
            }
            let returnData = {
                meds: {
                    dates: [],
                    names: []
                },
                shots: {
                    dates: [],
                    names: []
                }
            }


            this.data.meds.forEach(item => {
                meds.dates.push(item.dispDate)
                meds.names.push(item.med_name)
            })
            meds.dates = [...new Set(meds.dates)]
            meds.names = [...new Set(meds.names)]
            meds.dates.forEach(item => {
                returnData.meds.dates.push({text: item, value: item})
            })
            meds.names.forEach(item => {
                returnData.meds.names.push({text: item, value: item})
            })
            this.data.shots.forEach(item => {
                shots.dates.push(item.dispDate)
                shots.names.push(item.med_name)
            })
            shots.dates = [...new Set(shots.dates)]
            shots.names = [...new Set(shots.names)]
            shots.dates.forEach(item => {
                returnData.shots.dates.push({text: item, value: item})
            })
            shots.names.forEach(item => {
                returnData.shots.names.push({text: item, value: item})
            })
            
            return returnData
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

