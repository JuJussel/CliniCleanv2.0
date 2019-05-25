<template>
    <div v-loading="!ready">
        <div style="display: flex; justify-content: space-between">
            <div style="flex-basis: 49%">
                <el-table :data="basic" border :show-header="false" size="small" :span-method="rowSpanMethod" v-if="ready">
                    <el-table-column prop="title"></el-table-column>
                    <el-table-column prop="subtitle"></el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div v-if="scope.row.type === 'yn' && scope.row.value === '1'"><b>あり</b></div>
                            <div v-else-if="scope.row.type === 'yn' && scope.row.value === '0'">なし</div>
                            <div v-else-if="scope.row.type === 'syn' && scope.row.value === '1'"><b>所見あり</b></div>
                            <div v-else-if="scope.row.type === 'syn' && scope.row.value === '0'">所見なし</div>
                            <div v-else-if="scope.row.type === 'val'"> {{ scope.row.value }} {{ scope.row.unit }} </div>
                            
                            <div v-if="scope.row.type === 'yn' && scope.row.value === '1'"> {{ scope.row.comment }} </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="flex-basis: 49%">
                <el-table :data="kensa" border :show-header="false" size="small" :span-method="rowSpanMethod">
                    <el-table-column width="95" prop="title"></el-table-column>
                    <el-table-column prop="subtitle"></el-table-column>
                    <el-table-column width="90">
                        <template slot-scope="scope">
                            <div> {{ scope.row.value }} {{ scope.row.unit }} </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-if="data.x_ray_issue==='1'" v-bind:style="{'background-image': xrayURL}" 
                    style="width: 250px; height: 250px; background-size: contain; margin-bottom: 10px; margin-left: 55px">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
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
            result.data.forEach(element => {
            this.ecgTypes[element.ID] = element.short_name
          })
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
            if (Object.keys(this.data.results).length < 12) {
                this.kensa = []
            } else {
                this.kensa = [
                    {title: '貧血検査', subtitle: 'ヘモグロビン', value: this.data.results['2A990000001930953'].value, comment: '', type: 'val', unit: 'g/dL', multi: 2},
                    {title: '貧血検査', subtitle: '赤血球数', value: this.data.results['2A990000001930951'].value, comment: '', type: 'val', unit: '万/μL', multi: -1},
                    {title: '肝機能検査', subtitle: 'GOT(AST)', value: this.data.results['3B035000002327201'].value, comment: '', type: 'val', unit: 'U/L', multi: 3},
                    {title: '肝機能検査', subtitle: 'GPT(ALT)', value: this.data.results['3B045000002327201'].value, comment: '', type: 'val', unit: 'U/L', multi: -1},
                    {title: '肝機能検査', subtitle: 'g -GTP', value: this.data.results['3B090000002327101'].value, comment: '', type: 'val', unit: 'U/L', multi: -1},
                    {title: '中性脂質検査', subtitle: 'トリグリセリド', value: this.data.results['3F015000002327101'].value, comment: '', type: 'val', unit: 'mg/dL', multi: 3},
                    {title: '中性脂質検査', subtitle: 'HDL-コレステロール', value: this.data.results['3F070000002327101'].value, comment: '', type: 'val', unit: 'mg/dL', multi: -1},
                    {title: '中性脂質検査', subtitle: 'LDL-コレステロール', value: this.data.results['3F077000002327101'].value, comment: '', type: 'val', unit: 'mg/dL', multi: -1},
                    {title: '血糖検査', subtitle: 'グルコース', value: this.data.results['3D010000002227201'].value, comment: '', type: 'val', unit: 'mg/dL', multi: 2},
                    {title: '血糖検査', subtitle: 'グリコヘモグロビンA1c（NGSP）', value: this.data.results['3D046000001906202'].value, comment: '', type: 'val', unit: '%', multi: -1},
                    {title: '尿検査', subtitle: '糖定性', value: this.data.results['1A990000000192054'].value, comment: '', type: 'val', unit: '', multi: 2},
                    {title: '尿検査', subtitle: '蛋白定性', value: this.data.results['1A990000000192053'].value, comment: '', type: 'val', unit: '', multi: -1},
                ]            
            }
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
