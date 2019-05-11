<template>
    <div v-loading="loading">
        <div style="margin-bottom: 10px">
            <el-popover v-model="recordOpen" width="300" @show="clearTemp">
                <el-form size="small" label-width="130px">
                    <el-form-item
                        v-for="vital in data.types"
                        :key="vital.ID"
                        :label="vital.nameShort">
                        <el-input style="width: 130px" type="number" v-model="vital.value">
                            <template v-if="vital.unit !== ''" slot="append"> {{vital.unit}} </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-button style="float: right" @click="recordVital" type="primary">保存</el-button>
                <el-button style="float: right; margin-right: 10px" @click="recordOpen = false" type="text">キャンセル</el-button>
                <el-button size="small" slot="reference">登録</el-button>
            </el-popover>
        </div>
        <el-table
            class="cctable"
            border
            stripe
            @selection-change="updateChart"
            @cell-click="cellClick"
            :data="tableItems"
            size="mini"
            cell-class-name="vitalCell">
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
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
        <div style="height: 350px; margin-top: 20px">
            <IEcharts @ready="onChartReady" :option="chartInit" :resizable="true" v-bind:class="{hidden: !showChart}"></IEcharts>
            <div v-if="!showChart">項目を選択してください</div>
        </div>
    </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'

export default {
    props: [
        'data'
    ],
    components: {
        IEcharts
    },
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
    methods: {
        cellClick(row, column,cell,e) {
            let date = this.$moment(column.label).format('YYYY年M月D日')
            let value = row[column.label]
            this.$eventHub.$emit('addVital', [date, row.nameShort, value, row.unit])            
        },
        clearTemp() {
            this.data.types.forEach(item => {
                item.value = ''
            })
        },
        recordVital() {
            this.loading = true
            const vitals = this.data.types.filter(item => item.value !== "")
            this.doRequest('insertVital', {
                data: vitals,
                patientID: this.$store.state.componentData.karteDetails.patient.id,
                karteID: this.$store.state.componentData.karteDetails.shinsatsu.karteID
            }).then(result => {
                this.$eventHub.$emit('kartePatientDataUpdate')
                this.$eventHub.$emit('recordVitals', vitals)
                this.recordOpen = false
            })
        },
        onChartReady(instance) {
            this.chart = instance
        },
        updateChart(val) {
            if (val.length < 1) {
                this.showChart = false
                return
            }
            this.showChart = true
            let reverseDates = JSON.parse(JSON.stringify(this.data.dates))
            this.chartOptions.xAxis[0].data = reverseDates.reverse()
            let seriesArray = []
            val.forEach(element => {
                this.chartOptions.legend.data.push(element.name)
                var seriesDataTemplate = {
                    connectNulls: true,
                    name: element.name,
                    data: [],
                    catID: element.vitalID,
                    type:"bar",
                    lineStyle:{
                        normal:{
                            width:3,
                            shadowColor:"rgba(0,0,0,0.4)",
                            shadowBlur:10,
                            shadowOffsetY:10
                        }
                    }
                }
                this.data.dates.forEach(date => {
                    seriesDataTemplate.data.push(null)
                })
                Object.keys(element).forEach(item => {
                    if (item !== 'name' && item !== 'vitalID') {
                        let index = reverseDates.findIndex(search => search === item)
                        seriesDataTemplate.data[index] = element[item]
                    }
                })
                seriesArray.push(seriesDataTemplate)
            })
            this.chartOptions.series = seriesArray
            this.chart.setOption(this.chartOptions, true)
        },
    },
    data() {
        return {
            loading: false,
            recordOpen: false,
            chart: false,
            showChart: false,
            chartInit: {},
            chartOptions: {
                legend: {
                    data: [],
                    top: "bottom",
                    selected: false
                },
                color:[
                    "#009688",
                    "#00695c",
                    "#607d8b",
                    "#424242",
                    "#004d40",
                    "#90caf9",
                    "#353c44",
                    "#512da8",
                    "#ff5349",
                    "#29ab87",
                    "#5f0f0f",
                ],
                tooltip: {
                    trigger:"axis",
                    axisPointer:{
                        lineStyle:{
                            type:"dashed"
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {type: ['line', 'bar'], title: {line: 'ライン', bar: 'バー'}},
                        saveAsImage: {show: true, title: '保存'}
                    }
                },
                axisPointer:{
                    type:"shadow"
                },
                xAxis: [{
                    type: 'category',
                    splitLine: {show: false},
                    data: []
                }],
                grid:{
                    left: '3%',
                    right: '4%',
                    bottom: '60px',
                    top: '3%',
                    containLabel: true
                },
                yAxis:[
                    {
                    min: 0,
                    max:"dataMax"
                    }
                ],
                series:[]
            }
        }
    }
}
</script>

<style>
.vitalCell:hover {
    cursor: pointer;
    box-shadow: inset 0 0 0 1px #00a48f
}
.hidden {
    display: none
}

</style>
