<template>
    <div v-loading="display.loading" style="display: flex">
        <el-card style="width: 580px">
            <div slot="header" style="display: flex; justify-content: start; align-items: baseline">
                <i class="far fa-id-card"></i>
                <span style="margin-left: 5px">基本</span>
            </div>
            <el-form :rules="rulesBasic" ref="formBasic" :model="formData.basic" label-width="100px">
                <el-form-item label="名前" required>
                    <el-col :span="12">
                        <el-form-item prop="nameLastKanji">
                            <el-input @change="checkDoublePatient()" v-model="formData.basic.nameLastKanji" placeholder="性"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="nameFirstKanji">
                            <el-input @change="checkDoublePatient()" v-model="formData.basic.nameFirstKanji" placeholder="名" style="margin-left: 10px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="フリガナ" required>
                    <el-col :span="12">
                        <el-form-item prop="nameLastKana">
                            <el-input v-model="formData.basic.nameLastKana" placeholder="性"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="nameFirstKana">
                            <el-input v-model="formData.basic.nameFirstKana" placeholder="名" style="margin-left: 10px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="生年月日" prop="birthDate">
                    <el-date-picker
                        @change="checkDoublePatient()"
                        v-model="formData.basic.birthDate"
                        type="date"
                        format="yyyy年MM月dd日"
                        value-format="yyyy/MM/dd"
                        placeholder="選択又は入力">
                    </el-date-picker>
                    <span style="margin-left: 20px" v-if="age !== ''">年齢：{{ age }}年</span>
                </el-form-item>
                <el-form-item label="性別">
                    <el-radio-group v-model="formData.basic.gender">
                        <el-radio label="男性">男性</el-radio>
                        <el-radio style="margin-left: -20px" label="女性">女性</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="職業">
                    <el-select v-model="formData.basic.occupation" placeholder="選択">
                        <el-option v-for="item in display.occupations" :label="item.label" :key="item.id" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住所">
                    <el-input autocomplete="new-password" @change="getAddress(formData.basic.address)" v-model="formData.basic.address.zip" placeholder="郵便番号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input autocomplete="new-password" v-model="formData.basic.address.addr1" placeholder="都道府県"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item>
                            <el-input autocomplete="new-password" v-model="formData.basic.address.addr2" placeholder="市区町村" style="margin-left: 16px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="9">
                        <el-form-item>
                            <el-input autocomplete="new-password" v-model="formData.basic.address.addr3" placeholder="番地など"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-input autocomplete="new-password" v-model="formData.basic.address.buildg" placeholder="ビル名" style="margin-left: 8px"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="formData.basic.address.room" placeholder="部屋番号" style="margin-left: 16px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="連絡">
                    <el-col :span="12">
                        <el-input autocomplete="new-password" v-model="formData.basic.tel1" placeholder="電話番号１"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input autocomplete="new-password" v-model="formData.basic.tel2" placeholder="電話番号２" style="margin-left: 10px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-input autocomplete="new-password" v-model="formData.basic.mail1" placeholder="メール１"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input autocomplete="new-password" v-model="formData.basic.mail2" placeholder="メール２" style="margin-left: 10px"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-card>
        <div style="margin-left: 10px">
            <el-card style="width: 580px">
                <div slot="header" style="display: flex; justify-content: start; align-items: baseline">
                    <i class="far fa-id-card"></i>
                    <span style="margin-left: 5px">会社・学校</span>
                </div>
                <el-form :rules="rulesCompany" ref="formCompany" :model="formData.company" label-width="100px">
                    <el-form-item label="名" prop="name">
                        <el-input v-model="formData.company.name" placeholder="入力"></el-input>
                    </el-form-item>
                    <el-form-item label="住所">
                        <el-input autocomplete="new-password" @change="getAddress(formData.company.address)" v-model="formData.company.address.zip" placeholder="郵便番号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="12">
                            <el-form-item>
                                <el-input autocomplete="new-password" v-model="formData.company.address.addr1" placeholder="都道府県"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item>
                                <el-input autocomplete="new-password" v-model="formData.company.address.addr2" placeholder="市区町村" style="margin-left: 16px"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="9">
                            <el-form-item>
                                <el-input autocomplete="new-password" v-model="formData.company.address.addr3" placeholder="番地など"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-input autocomplete="new-password" v-model="formData.company.buildg" placeholder="ビル名" style="margin-left: 8px"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-input v-model="formData.company.room" placeholder="部屋番号" style="margin-left: 16px"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="連絡">
                        <el-input autocomplete="new-password" v-model="formData.company.tel" placeholder="電話番号"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card style="width: 580px; margin-top: 10px">
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">配偶者・保護者</span>
                    </span>
                    <span style="float: right">
                        <el-popover
                            placement="left"
                            width="500"
                            popper-class="dep-pop"
                            trigger="click"
                            v-model="display.dependentOpen">
                            <dependent v-if="display.dependentOpen" @close="display.dependentOpen = false" @add="registerDependent"></dependent>
                            <el-button size="small" slot="reference">追加</el-button>               
                        </el-popover>
                    </span>
                </div>
                <div>
                    <el-table
                        size="mini"
                        empty-text="登録なし"
                        :data="formData.dependent.registered"
                        row-key="patientID"
                        style="width: 100%; border-radius: 4px; border: solid 1px #dcdfe6">
                        <el-table-column
                            prop="name"
                            label="名前">
                        </el-table-column>
                        <el-table-column
                            prop="birthdateForm"
                            label="誕生日">
                        </el-table-column>
                        <el-table-column
                            prop="rel"
                            label="関連">
                            <template slot-scope="scope">
                                <el-select size="mini" v-model="scope.row.rel" placeholder="選択">
                                    <el-option
                                        v-for="item in display.rels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="80">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                @click="removeDependent(scope.$index, scope.row)" type="danger">削除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
        <div style="margin-left: 10px">
            <el-card style="width: 580px">
                <div slot="header" style="display: flex; justify-content: start; align-items: baseline">
                    <i class="far fa-id-card"></i>
                    <span style="margin-left: 5px">保険</span>
                    <el-checkbox style="margin-left: 20px" v-model="formData.regIns">登録</el-checkbox>
                </div>
                <div>
                    <el-form :disabled="!formData.regIns" :rules="rulesIns" ref="formIns" :model="formData.insurance" label-width="100px">
                        <el-form-item label="記号" prop="kigou">
                            <el-input @change="checkDoubleInsurance()" v-model="formData.insurance.kigou" placeholder="入力"></el-input>
                        </el-form-item>
                        <el-form-item label="番号" prop="bangou">
                            <el-input @change="checkDoubleInsurance()" v-model="formData.insurance.bangou" placeholder="入力"></el-input>
                        </el-form-item>
                        <el-form-item label="被保険者" required>
                            <el-col :span="13">
                                <el-form-item v-if="formData.insurance.relation === '本人'" prop="name">
                                    <el-input disabled :value="formData.basic.nameLastKanji + formData.basic.nameFirstKanji" placeholder="氏名"></el-input>
                                </el-form-item>
                                <el-form-item v-else prop="name">
                                    <el-select v-model="formData.insurance.name" placeholder="選択">
                                        <el-option v-for="item in formData.dependent.registered" :label="item.name" :key="item.name" :value="item.name"></el-option>
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
                                    <el-input autocomplete="new-password" @change="checkDoubleInsurance();getHokensha()" v-model="formData.insurance.hokenshaNumber" placeholder="入力"></el-input>
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
                        </div>                     
                    </el-form>
                </div>
            </el-card>
            <el-card style="width: 580px; margin-top: 10px">
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">公費負担医療</span>
                    </span>
                    <span style="float: right">
                        <el-popover
                            placement="left"
                            width="550"
                            popper-class="dep-pop"
                            trigger="click"
                            v-model="display.kouhiOpen">
                            <kouhi v-if="display.kouhiOpen" @close="display.kouhiOpen = false" @add="registerKouhi"></kouhi>
                            <el-button size="small" slot="reference">追加</el-button>               
                        </el-popover>
                    </span>
                </div>
                <div>
                    <el-table
                        size="mini"
                        empty-text="登録なし"
                        :data="formData.kouhi"
                        style="width: 100%; border-radius: 4px; border: solid 1px #dcdfe6;">
                        <el-table-column
                            prop="khFuSha"
                            label="公費負担者番号">
                        </el-table-column>
                        <el-table-column
                            prop="khRecp"
                            label="公費受給者番号">
                        </el-table-column>
                        <el-table-column
                            prop="validDisp"
                            label="有効期限">
                        </el-table-column>
                        <el-table-column
                            width="80">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                @click="removeDependent(scope.$index, scope.row)" type="danger">削除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
        <div style="margin-left: 10px; flex: 1; height: 20px">
            <div>
                <el-button :disabled="ageWarn" @click="validate()" type="primary" style="width: 112px">登録</el-button>
            </div>
            <div style="margin-top: 10px">
                <el-button type="danger" @click="cancel()">キャンセル</el-button>
            </div>
        </div>
        <el-dialog
            title="登録完了しました。"
            :visible.sync="display.doneModal"
            width="20%"
            custom-class="ccmodal"
            :close-on-click-modal="false"
            :lock-scroll="true"
            :show-close="false">
            <div style="text-align: end">
                <el-button @click="backToHome()" type="text">ホームへ</el-button>
                <el-button @click="dialogVisible = false">要約する</el-button>
                <el-button @click="gotToRec()" type="primary">受付する</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import dependent from './dependent'
import kouhi from './kouhi'

export default {
    components: {
        'dependent' : dependent,
        'kouhi': kouhi
    },
    data() {
        return {
            transferData: {},
            rulesBasic: {
                nameLastKanji: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                nameFirstKanji: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ],
                nameLastKana: [
                    { required: true, message: '入力してください', trigger: 'manual' },
                    { pattern: '^[ァ-ン]+$', message: '全角カタカナで入力', trigger: 'manual' }
                ],
                nameFirstKana: [
                    { required: true, message: '入力してください', trigger: 'manual' },
                    { pattern: '^[ァ-ン]+$', message: '全角カタカナで入力', trigger: 'manual' }
                ],
                birthDate: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ]          
            },
            rulesCompany: {
                name: [
                    { required: true, message: '入力してください', trigger: 'manual' }
                ]
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
            display: {
                doneModal: false,
                loading: false,
                dependentOpen: false,
                kouhiOpen: false,
                hokenshaName: '',
                doubleNot: false,
                ageNot: false,
                doubleNotIns: false,
                insEx: false,
                occupations: [{id: 1, label: '会社員'},{id: 2, label: '自営業'},{id: 3, label: '学生'},{id: 4, label: 'その他'}],
                rels:[
                  {value:"母親", label:"母親"},
                  {value:"父親", label:"父親"},
                  {value:"祖母", label:"祖母"},
                  {value:"祖父", label:"祖父"},
                  {value:"兄弟", label:"兄弟"},
                  {value:"娘", label:"娘"},
                  {value:"息子", label:"息子"},
                  {value:"孫", label:"孫"},
                  {value:"姪", label:"姪"},
                  {value:"甥", label:"甥"},
                  {value:"叔母", label:"叔母"},
                  {value:"叔父", label:"叔父"},
                  {value:"いとこ", label:"いとこ"},
                  {value:"その他の親戚", label:"その他の親戚"},
                  {value:"保護者", label:"保護者"},
                  {value:"親友", label:"親友"},
                  {value:"交際", label:"交際"},
                  {value:"同僚", label:"同僚"}
                ]
            },
            formData: {
                regIns: false,
                basic: {
                    nameLastKana: "",
                    nameFirstKana: "",
                    nameLastKanji: "",
                    nameFirstKanji: "",
                    birthDate: "",
                    gender: "男性",
                    occupation: "会社員",
                    tel1: "",
                    tel2: "",
                    address: {
                        zip: "",
                        addr1: "",
                        addr2: "",
                        addr3: "",
                        buildg: "",
                        room: "",
                    },
                    mail1: "",
                    mail2: "",
                },
                company: {
                    name: "",
                    address: {
                        zip: "",
                        addr1: "",
                        addr2: "",
                        addr3: "",
                    },
                    tel: "",
                    building: "",
                    room: ""
                },
                dependent: {
                    registered: []
                },
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
                },
                kouhi: []
            }
        }
    },
    computed: {
        age() {
            let age = 0
            let bd = this.formData.basic.birthDate
            if (this.$moment(bd, 'YYYY/M/D', true).isValid()) {
                age = this.$moment().diff(this.$moment(bd, 'YYYY-MM-DD'), 'years')
            } else {
                age = ''
            }
            return age;
        },
        ageWarn() {
            if (this.age !=='' && this.age < 20 && this.formData.dependent.registered.length < 1) {
                return true
            }
            return false
        }
    },
    watch: {
        ageWarn() {
            if (this.display.ageNot) {
                    this.display.ageNot.close()
                    this.display.ageNot = false
            }
            if (this.ageWarn) {
                this.display.ageNot =  this.$notify({
                    title: '未成年者',
                    dangerouslyUseHTMLString: true,
                    message: '患者が未成年者です。</ br>配偶者を登録してください。',
                    type: 'error',
                    offset: 140,
                    duration: 0,
                    showClose: false,
                    customClass: 'notific'
                }) 
            }
        }
    },
    methods: {
        getHokensha() {
            let hks = this.formData.insurance.hokenshaNumber
            this.doRequest('getInsuranceInfo', hks).then(result => {
                this.display.hokenshaName = result.data.short
            })
        },
        getAddress(target) {
            this.doRequest('getAddressFromZip', target.zip).then(result => {
                target.addr1 = result.addr1
                target.addr2 = result.addr2
                target.addr3 = result.addr3
            })
        },
        validate() {
            let ok = true
            this.$refs['formBasic'].validate((valid) => {
                if (!valid) {
                    ok = false
                }
            })
            if (this.formData.regIns) {
                this.$refs['formIns'].validate((valid) => {
                    if (!valid) {
                        ok = false
                    }
                })
            }
            this.$refs['formCompany'].validate((valid) => {
                if (!valid) {
                    ok = false
                }
            })
            if (ok) {
                this.submit()
            }
        },
        submit() {
            this.display.loading = true
            this.formData.basic.tel1 = this.formData.basic.tel1.replace(/\-/g, '')
            this.formData.basic.tel2 = this.formData.basic.tel2.replace(/\-/g, '')
            this.formData.company.tel = this.formData.company.tel.replace(/\-/g, '')
            this.formData.basic.address.zip = this.formData.basic.address.zip.replace(/\-/g, '')
            this.formData.company.address.zip = this.formData.company.address.zip.replace(/\-/g, '')
            let files = this.$refs.files.uploadFiles
            var that = this
            files.forEach(element => {
                var fr = new FileReader()
                fr.onload = function () {
                    that.formData.insurance.files.push(fr.result)
                    if (files.length === that.formData.insurance.files.length) {
                        that.doRequest('newPatient', that.formData).then(result => {
                            that.transferData = result
                            that.display.loading = false
                            that.display.doneModal = true
                        })
                    }
                }
                fr.readAsDataURL(element.raw)
            })
        },
        cancel() {

        },
        removeDependent(index, row) {
            this.formData.dependent.registered.splice(index, 1)
            if (this.formData.insurance.name === row.name) {
                this.formData.insurance.name = ""
            }
        },
        checkDoublePatient() {
            if (
                this.formData.basic.nameLastKanji !== '' &&
                this.formData.basic.nameFirstKanji !== '' &&
                this.formData.basic.birthDate !== ''
            ) {
                this.doRequest('patientDouble', this.formData.basic).then(result => {
                    if (this.display.doubleNot) {
                        this.display.doubleNot.close()
                        this.display.doubleNot = false             
                    }
                    if (result.exists) {
                        this.display.doubleNot =  this.$notify({
                            title: '患者の重複',
                            message: '患者さんはすでに登録されている可能性があります。',
                            type: 'warning',
                            offset: 140,
                            duration: 0,
                            customClass: 'notific'
                        }) 
                    }
                })
            }
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
                    this.display.insEx = false
                    let that = this
                    if (result.exists) {
                        this.display.insEx = result
                        if (this.formData.insurance.relation === '本人') {
                            this.display.doubleNotIns =  this.$notify({
                                title: '保険の重複',
                                dangerouslyUseHTMLString: true,
                                message: '保険はすでに登録してます。<br><span style="color: #409eff; cursor: pointer">配偶者として登録？</span>',
                                type: 'error',
                                offset: 140,
                                duration: 0,
                                customClass: 'notific',
                                onClick: function() {that.registerDependent('', true); that.display.doubleNotIns.close()}
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
        registerDependent(data, noti) {
            if (noti) {
                data = this.display.insEx
                this.formData.insurance.name = this.display.insEx.name
            } 
            this.formData.dependent.registered.push(data)
        },
        registerKouhi(data) {
            this.formData.kouhi.push(data)
        },
        validateHoken(rule, data, callback) {
            if (data.length != 8 && data.length != 6) {
                callback(new Error('6桁又は8桁を入力してください'))
            }
            var ns = data.toString(10);
            if (ns.length == 6) {
                ns = "00" + ns;
            }
            ns = ns.split('');
            var x1 = ns[0]*2;
            if (x1 > 9) {
                x1 = (x1-9);
            }
            var x2 = ns[1];
            var x3 = ns[2]*2;
            if (x3 > 9) {
                x3 = (x3-9);
            }
            var x4 = ns[3];
            var x5 = ns[4]*2;
            if (x5 > 9) {
                x5 = (x5-9);
            }
            var x6 = ns[5];
            var x7 = ns[6]*2;
            if (x7 > 9) {
                x7 = (x7-9);
            }
            var x8 = ns[7];
            if (x8 !== "") {
            var check = x1*1+x2*1+x3*1+x4*1+x5*1+x6*1+x7*1;
            var check_str = check.toString();
            var check_pos = check_str.length-1;
            var check_number = 10 - check_str[check_pos];

            if (check_str[check_pos] == 0) {
                check_number = 0;
            }
            }
            if (check_number != x8) {
                callback(new Error('番号に誤りがあります'))
            } else {
                callback()
            }
        },
        backToHome() {
            this.$eventHub.$emit('homeTrigger', {mode: 'goToHome'})
        },
        gotToRec() {
            this.$eventHub.$emit('homeTrigger', {mode: 'receivePat', data: this.transferData})
        }
    }
}
</script>

<style>
.el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6
}
.el-form-item.is-success .el-input__inner:focus {
    border-color: #dcdfe6
}
.notific {
    width: 220px;
}
.dep-pop {
    padding: 0!important
}
</style>
