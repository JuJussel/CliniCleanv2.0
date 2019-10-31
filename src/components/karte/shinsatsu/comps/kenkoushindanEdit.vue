<template>
    <div v-loading="!ready">
        <div style="display: flex; justify-content: space-between">
            <div>
                <el-table :data="basic" border :show-header="false" size="small" :span-method="rowSpanMethod" v-if="ready">
                    <el-table-column prop="title"></el-table-column>
                    <el-table-column width="120px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.title === '心電図' || scope.row.title === 'X線'">
                                <el-button type="text" size="small"> {{ scope.row.subtitle }} </el-button>
                            </span>
                            <span v-else> {{ scope.row.subtitle }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.title === '心電図'">
                                <el-select v-model="data.ecg_result" placeholder="選択" size="small">
                                    <el-option
                                    v-for="item in ecgTypes"
                                    :key="item.ID"
                                    :label="item.short_name"
                                    :value="item.ID">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="scope.row.title === 'X線'">
                                <div>
                                    <span>異常：</span>
                                    <el-radio-group v-model="data.x_ray_issue" size="small">
                                        <el-radio-button label="1">あり</el-radio-button>
                                        <el-radio-button label="0">なし</el-radio-button>
                                    </el-radio-group>
                                </div>
                                <div v-if="data.x_ray_issue === '1'" style="margin-top: 10px">
                                    <el-input
                                        type="textarea"
                                        :rows="2"
                                        placeholder="入力"
                                        v-model="data.x_ray_issue_text">
                                    </el-input>
                                </div>
                            </div>
                            <div v-else-if="scope.row.type === 'yn' && scope.row.value === '1'"><b>あり</b></div>
                            <div v-else-if="scope.row.type === 'yn' && scope.row.value === '0'">なし</div>
                            <div v-else-if="scope.row.type === 'syn' && scope.row.value === '1'"><b>所見あり</b></div>
                            <div v-else-if="scope.row.type === 'syn' && scope.row.value === '0'">所見なし</div>
                            <div v-else-if="scope.row.type === 'val'"> {{ scope.row.value }} {{ scope.row.unit }} </div>
                            <div v-else-if="scope.row.type === 'yn' && scope.row.value === '1'"> {{ scope.row.comment }} </div>
                        </template>
                    </el-table-column>
                </el-table>
                <xrayPaint 
                    v-if="data.x_ray_issue === '1'" 
                    :parentWidth="400"
                    :parentHeight="400"
                    ref="xrayDraw"
                    @mouseUp="saveSchema"
                    style="margin-top: 10px"
                    :schema="data.x_ray_schema_id"
                    :x-ray="true"
                    id="K675g">
                </xrayPaint>
            </div>
        </div>

    </div>
</template>

<script>

import xrayPaint from '../../../shared/jupaint'

export default {
    components: {
        'xrayPaint': xrayPaint
    },
    props: [
        'data'
    ],
    data() {
        return {
            ecgTypes: {},
            basic: [],
            kensa: [],
            xrayURL: '',
            ready: false
        }
    },
    created() {
        this.doRequest('getECGTypes').then(result => {
            this.ecgTypes = result.data
            this.basic = [
                {title: '薬剤歴', subtitle: '', value: this.data.medication_history, comment: this.data.medication_history_text, type: 'yn', unit: '', multi: 0},
                {title: '既往歴', subtitle: '', value: this.data.medical_history, comment: this.data.medical_history_text, type: 'yn', unit: '', multi: 0},
                {title: '自覚症状', subtitle: '', value: this.data.subjective_symtoms, comment: this.data.subjective_symtoms_text, type: 'yn', unit: '', multi: 0},
                {title: '他覚症状', subtitle: '', value: this.data.objective_symtoms, comment: this.data.objective_symtoms_text, type: 'yn', unit: '', multi: 0},
                {title: '身長', subtitle: '', value: this.data.height, comment: '', type: 'val', unit: 'cm', multi: 0},
                {title: '体重', subtitle: '', value: this.data.weight, comment: '', type: 'val', unit: 'kg', multi: 0},
                {title: 'BMI', subtitle: '', value: this.data.bmi, comment: '', type: 'val', unit: '', multi: 0},
                {title: '腹囲', subtitle: '', value: this.data.stomache_width, comment: '', type: 'val', unit: 'cm', multi: 0},
                {title: '血圧', subtitle: '最低(D)', value: this.data.blood_pressure_min, comment: '', type: 'val', unit: '', multi: 2},
                {title: '血圧', subtitle: '最高(S)', value: this.data.blood_pressure_max, comment: '', type: 'val', unit: '', multi: -1},
                {title: '視力', subtitle: '左', value: this.data.sight_left, comment: '', type: 'val', unit: '', multi: 2},
                {title: '視力', subtitle: '右', value: this.data.sight_right, comment: '', type: 'val', unit: '', multi: -1},
                {title: '聴力左', subtitle: '1000Hz', value: this.data.hearing_left_low, comment: '', type: 'syn', unit: '', multi: 2},
                {title: '聴力左', subtitle: '4000Hz', value: this.data.hearing_left_high, comment: '', type: 'syn', unit: '', multi: -1},
                {title: '聴力左', subtitle: '1000Hz', value: this.data.hearing_right_low, comment: '', type: 'syn', unit: '', multi: 2},
                {title: '聴力右', subtitle: '4000Hz', value: this.data.hearing_right_high, comment: '', type: 'syn', unit: '', multi: -1},
                {title: '心電図', subtitle: '番号: ' + this.data.ecg, value: this.ecgTypes[this.data.ecg_result], comment: '', type: 'val', unit: '', multi: 0},
                {title: 'X線', subtitle: '番号: ' + this.data.x_ray_ID, value: this.data.x_ray_issue, comment: '', type: 'syn', unit: '', multi: 0}
            ]
            this.xrayURL = 'url("' + this.$globals.apiURL + '/SCHEMAS/' + this.data.x_ray_schema_id + '.png")'
            this.ready = true
        })
    },
    methods: {
        rowSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (row.multi > 0) {
                    return {
                        rowspan: row.multi,
                        colspan: 1
                    };
                } else if (row.multi < 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }

            }
        },
        saveSchema() {
            let img = this.$refs.xrayDraw.getFullCanvas()
            let shmID = this.data.x_ray_schema_id
            this.doRequest('schemaUpload', {data: img, schemaID: shmID})
        }
    }
}
</script>

<style>
.kscell {
    display: flex;
}
.kscell > span {
    border: solid 1px
}
</style>
