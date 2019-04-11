<template>
    <div style="padding: 10px">
        <el-form :rules="rulesIns" ref="formIns" :model="formData.insurance" label-width="100px">
            <el-form-item label="記号" prop="kigou">
                <el-input @change="checkDoubleInsurance()" v-model="formData.insurance.kigou" placeholder="入力"></el-input>
            </el-form-item>
            <el-form-item label="番号" prop="bangou">
                <el-input @change="checkDoubleInsurance()" v-model="formData.insurance.bangou" placeholder="入力"></el-input>
            </el-form-item>
            <el-form-item label="被保険者" required>
                <el-col :span="13">
                    <el-form-item v-if="formData.insurance.relation === '本人'" prop="name">
                        <el-input disabled :value="patientData.nameLastKanji + patientData.nameFirstKanji" placeholder="氏名"></el-input>
                    </el-form-item>
                    <el-form-item v-else prop="name">
                        <el-select v-model="formData.insurance.name" placeholder="選択">
                            <el-option v-for="item in dependents" :label="item.name" :key="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-radio-group @change="checkDoubleInsurance()" v-model="formData.insurance.relation" style="margin-left: 30px">
                        <el-radio label="配偶者">配偶者</el-radio>
                        <el-radio style="margin-left: -20px" label="本人">本人</el-radio>
                    </el-radio-group>
                </el-col>
            </el-form-item>
            <el-form-item label="保険者番号">
                <el-col :span="11">
                    <el-form-item prop="hokenshaNumber">
                        <el-input autocomplete="new-password" @change="checkDoubleInsurance(); getHokensha()" v-model="formData.insurance.hokenshaNumber" placeholder="入力"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-input disabled v-model="display.hokenshaName" style="margin-left: 16px"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="資格取得" prop="getDate">
                <el-date-picker
                    v-model="formData.insurance.getDate"
                    type="date"
                    format="yyyy年MM月dd日"
                    value-format="yyyy/MM/dd"
                    placeholder="選択又は入力">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="資格期限" prop="validDate">
                <el-date-picker
                    v-model="formData.insurance.validDate"
                    type="daterange"
                    range-separator="~"
                    value-format="yyyy/MM/dd"
                    start-placeholder="から"
                    end-placeholder="まで">
                </el-date-picker>
            </el-form-item>
            <div style="display: flex; align-items: baseline">
                <span style="width: 88px; text-align: right; padding-right: 12px; font-size: 14px">
                    証写
                </span>
                <el-upload
                    action="222"
                    multiple
                    :limit="2"
                    ref="files"
                    :auto-upload="false">
                    <el-button size="small" type="primary">ファイル選択</el-button>
                </el-upload>
                <div v-if="display.noFiles" style="margin-left: 10px; color: #f56c6c">保険証の証写を登録してください。</div>
            </div>                     
        </el-form>
        <div style="margin-top: 10px; text-align: end">
            <el-button type="text" @click="close()">キャンセル</el-button>
            <el-button :disabled="!inputOK" type="primary" @click="validate()" style="margin-left: 5px">保存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'dependents',
        'patientData'
    ],
    data() {
        return {
            display: {
                hokenshaName: "",
                doubleNotIns: false,
                noFiles: false
            },
            formData: {
                insurance: {
                    kouhiNomi: false,
                    name: "",
                    occupation: "会社員",
                    kigou: "",
                    getDate: "",
                    relation: "配偶者",
                    bangou: "",
                    validDate: [],
                    hokenshaNumber: "",
                    files: []
                }
            },
            rulesIns: {
                name: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                kigou: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                bangou: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                hokenshaNumber: [
                    { required: true, message: '入力してください', trigger: 'manual' },
                    { validator: this.validateHoken, trigger: 'manual' }
                ],
                getDate: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                validDate: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ]
            },
        }
    },
    computed: {
        inputOK() {
            if (
                this.formData.insurance.bangou !=='' &&
                this.$refs.files.uploadFiles.length > 0) {
                return true
            }
            return false
        }
    },
    methods: {
        resetNoFile() {
            this.display.noFiles = false
        },
        checkDoubleInsurance() {
            if (
                this.formData.insurance.kigou !== '' &&
                this.formData.insurance.bangou !== '' &&
                this.formData.insurance.hokenshaNumber  !== ''
            ) {
                let data = {
                    kigou: this.formData.insurance.kigou,
                    bangou: this.formData.insurance.bangou,
                    hokensha: this.formData.insurance.hokenshaNumber}
                this.doRequest('getInsuranceCheck', data).then(result => {
                    if (this.display.doubleNotIns) {
                        this.display.doubleNotIns.close()
                        this.display.doubleNotIns = false             
                    }
                    let that = this
                    if (result.exists) {
                        if (this.formData.insurance.relation === '本人') {
                            this.display.doubleNotIns =  this.$notify({
                                title: '保険の重複',
                                dangerouslyUseHTMLString: true,
                                message: '保険はすでに登録してます。<br>ID:' + result.patientID + ' 名前:' + result.name,
                                type: 'error',
                                offset: 140,
                                duration: 5000,
                                customClass: 'notific',
                            }) 
                        }
                        this.formData.insurance.name = ""
                        this.formData.insurance.relation = "配偶者"
                        return
                    }
                })
            }
                this.formData.insurance.name = ''
        },
        getHokensha() {
            let hks = this.formData.insurance.hokenshaNumber
            this.doRequest('getInsuranceInfo', hks).then(result => {
                this.display.hokenshaName = result.data.short
            })
        },
        close() {
            if (this.display.doubleNotIns) {
                this.display.doubleNotIns.close()
                this.display.doubleNotIns = false             
            }
            this.$emit('close')
        },
        validate() {
            this.$refs.formIns.validate(result => {
                if (result && !this.display.noFiles) {
                    this.submit()
                }
            })
        },
        submit() {
            this.$emit('loading')
            let files = this.$refs.files.uploadFiles
            var that = this
            files.forEach(element => {
                var fr = new FileReader()
                fr.onload = function () {
                    that.formData.insurance.files.push(fr.result)
                    if (files.length === that.formData.insurance.files.length) {
                        if (that.formData.insurance.relation === '本人') {
                            that.formData.insurance.name = that.patientData.nameLastKanji + that.patientData.nameFirstKanji                    
                        }
                        let sendData = {
                            patientID: that.$store.state.componentData.patientDetails.IDselected,
                            changeData: that.formData.insurance,
                            changes: "1",
                            mode: 'insurance'
                        }
                        that.doRequest('updatePatientData', sendData).then(result => {
                            if (result.orcaErr) {
                                that.$emit('noLoading')
                                that.$message.error({duration: 6000, message: result.msg, customClass: 'notification'})    
                            } else {
                                that.$emit('submited')
                            }
                        })
                    }
                }
                fr.readAsDataURL(element.raw)
            })
        }
    }
}
</script>
