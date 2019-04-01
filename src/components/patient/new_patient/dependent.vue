<template>
    <el-tabs type="border-card">
        <el-tab-pane label="検索">
            <div style="display: flex; align-items: center; width: 300px">
                <span style="display: block; width: 100px; text-align: right; padding-right: 10px">患者選択</span>
                <el-select
                    v-model="depEx"
                    value-key="patientID"
                    filterable
                    remote
                    placeholder="氏名又はIDで検索"
                    :remote-method="searchPatient"
                    :loading="display.searchLoading">
                    <el-option
                        v-for="item in searchResults"
                        :key="item.patientID"
                        :label="item.name_last_kanji + item.name_first_kanji"
                        :value="item">
                        <span style="display: flex; justify-content: space-between; width: 280px">
                            <span style="color: #8492a6; font-size: 13px">ID: {{ item.patientID}}</span>
                            <span>{{ item.name_last_kanji + item.name_first_kanji }}</span>
                            <span style="color: #8492a6; font-size: 13px">
                                {{ item.birthdate_year + "年" + item.birthdate_month + "月" + item.birthdate_day + "日"}}
                            </span>
                        </span>
                    </el-option>
                </el-select>
            </div>
            <div style="margin-top: 10px; float: right">
                <el-button @click="close()" type="text">キャンセル</el-button>
                <el-button @click="addEX" :disabled="depEx === ''" type="primary">追加</el-button>
            </div>
        </el-tab-pane>
        <el-tab-pane label="新規" style="padding-right: 10px">
            <el-form :model="dep" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="名前" required>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="dep.nameLastKanji" placeholder="性"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="dep.nameFirstKanji" placeholder="名" style="margin-left: 10px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="フリガナ" required>
                    <el-col :span="12">
                        <el-form-item prop="nameLastKana">
                            <el-input pattern="^[ァ-ン]+$" v-model="dep.nameLastKana" placeholder="性"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="nameFirstKana">
                            <el-input v-model="dep.nameFirstKana" placeholder="名" style="margin-left: 10px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="生年月日" required>
                    <el-date-picker
                        v-model="dep.birthdate"
                        type="date"
                        format="yyyy年MM月dd日"
                        value-format="yyyy/MM/dd"
                        placeholder="選択又は入力">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="電話番号">
                    <el-input type="tel" v-model="dep.tel"></el-input>
                </el-form-item>
            </el-form>
            <div style="margin-top: 10px; float: right">
                <el-button @click="close()" type="text">キャンセル</el-button>
                <el-button @click="addNew" :disabled="!inputOK" type="primary">追加</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>

</template>

<script>
export default {
    data() {
        return {
            display: {
                searchLoading: false
            },
            depEx: '',
            dep: {
                nameFirstKanji: '',
                nameLastKanji: '',
                nameLastKana: '',
                nameFirstKana: '',
                birthdate: null,
                tel: ''
            },
            rules: {
                nameFirstKana: [
                    { pattern: '^[ァ-ン]+$', message: '全角カタカナで入力', trigger: 'manual' }
                ],
                nameLastKana: [
                    { pattern: '^[ァ-ン]+$', message: '全角カタカナで入力', trigger: 'manual' }
                ]
            },
            searchResults: []
        }
    },
    computed: {
        inputOK() {
            if (this.dep.nameFirstKanji !== '' && this.dep.nameLastKanji !== '' &&
                this.dep.nameFirstKana !== '' && this.dep.nameLastKana !== '' && 
                this.dep.birthdate) {
                return true
            }
            return false
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
        close() {
            this.$emit('close')
        },
        addEX() {
            this.depEx.name = this.depEx.name_last_kanji + this.depEx.name_first_kanji
            this.depEx.rel = '母親'
            this.$emit('add', this.depEx)
            this.$emit('close')
        },
        addNew() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.doRequest('newDependent', this.dep).then(result => {
                        this.$emit('add', result.data)
                        this.$emit('close')
                    })
                }
            })
        }
    }
}
</script>

<style>

</style>
