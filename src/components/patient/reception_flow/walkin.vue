<template>
    <div>
        <el-form ref="form" :model="newWalkin" label-width="100px">
            <el-form-item label="患者選択" v-if="mode !== 'res'">
                <el-select
                    v-model="newWalkin.patient.patientID"
                    value-key="patientID"
                    filterable
                    remote
                    @change="getInsurance()"
                    placeholder="氏名又はIDで検索"
                    :remote-method="searchPatient"
                    :loading="searchLoading">
                    <el-option
                        v-for="item in searchResults"
                        :key="item.patientID"
                        :label="item.name_last_kanji + item.name_first_kanji"
                        :value="item.patientID">
                        <span style="float: left">{{ item.name_last_kanji + item.name_first_kanji }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">
                        ID: {{ item.patientID}}
                        {{ item.birthdate_year + "年" + item.birthdate_month + "月" + item.birthdate_day + "日"}}
                        </span>
                    </el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="診察内容">
                <el-radio-group v-model="newWalkin.examType">
                    <el-radio style="margin: 10px" v-for="(item) in display.shinsatsuTypes" :key="item.ID" :label="item.ID">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="コメント">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="入力"
                    maxlength=145
                    v-model="newWalkin.comment">
                </el-input>
            </el-form-item>  
        </el-form>
        <el-table
            size="mini"
            v-loading="display.loadingInsurance"
            highlight-current-row
            empty-text="患者を選択してください。"
            @current-change="selectInsurance"
            :data="newWalkin.insurance.valid.rows"
            style="width: 100%; border-radius: 4px; border: solid 1px #dcdfe6;">
            <el-table-column
                prop="wholeName"
                label="保険">
            </el-table-column>
            <el-table-column
                prop="pub1"
                label="公費１">
            </el-table-column>
            <el-table-column
                prop="pub2"
                label="公費２">
            </el-table-column>
            <el-table-column
                prop="pub3"
                label="公費３">
            </el-table-column><el-table-column
                prop="pub4"
                label="公費４">
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px; float: right">
            <el-button style="color: #606266" type="text" @click="closePop()">キャンセル</el-button>
            <el-button :disabled="!newWalkin.insurance.selected || !newWalkin.examType" @click="submitNewWalkin" type="primary">受付する</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'mode',
        'meta'
    ],
    data() {
        return {
            newWalkin:{
                examType: false,
                comment: "",
                patient: {patientID: ""},
                insurance: {
                    selected: false,
                    valid: {
                        rows: []
                    },
                    invalid: {},
                    jihi: false
                },
                eventID: ""            
            },
            searchLoading: false,
            searchResults: [],
            display: {
                shinsatsuTypes: [],
                loadingInsurance: false
            }
        }
    },
    created() {
        this.doRequest('getShinsatsuType', '').then(result => {
           this.display.shinsatsuTypes = result.data 
        })
        if (this.mode === 'res') {
            this.newWalkin.patient.patientID = this.meta.res
            this.newWalkin.examType = this.meta.exm
            this.newWalkin.comment = this.meta.comm
            this.newWalkin.insurance.selected = this.meta.ins
            this.getInsurance()
        }
    },
    methods: {
        searchPatient(query) {
            if (query !== '') {
                this.searchLoading = true
                this.doRequest('getQuickPatientSearch', query).then(result => {
                    this.searchResults = result.data
                    this.searchLoading = false
                })
            } else {
                this.searchResults = []
            }
        },
        getInsurance() {
            this.display.loadingInsurance = true
            if (!this.meta.ins) {
                this.newWalkin.insurance.selected = ""                
            }
            this.doRequest('getReceptionInsurance', this.newWalkin.patient.patientID).then(result => {
                if (result.data.length < 1) {
                    this.newWalkin.insurance.selected = "0001";
                    return;
                }
                this.newWalkin.insurance.valid.rows = result.data;
                this.display.loadingInsurance = false;
            })
        },
        selectInsurance(val) {
            this.newWalkin.insurance.selected = val.ID
            this.newWalkin.insurance.jihi = false
            if (val.wholeName === "自費") {
                this.newWalkin.insurance.jihi = true
            }
        },
        submitNewWalkin() {
            this.$emit('submit', this.newWalkin)
        },
        closePop() {
            this.$emit('close')
        }
    }
}
</script>

<style>

</style>

