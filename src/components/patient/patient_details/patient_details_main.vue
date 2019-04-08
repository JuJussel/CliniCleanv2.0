<template>
    <div style="height: 100%; display: flex; overflow-x: hidden; overflow-y: auto" v-loading="display.loading">
        <el-card style="width: 540px; flex-shrink: 0">
            <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline; height: 24px">
                <span>
                    <i class="far fa-id-card"></i>
                    <span style="margin-left: 5px">基本</span>
                </span>
                <span v-if="!edit.basic">
                    <el-button @click="openEdit('basic')" size="small">編集</el-button>
                </span>
                <span v-else>
                    <el-button type="text" @click="closeEdit('basic')" size="small">キャンセル</el-button>
                    <el-button :disabled="!changebasic.change" type="primary" @click="saveEdit('basic')" size="small">保存</el-button>
                </span>
            </div>
            <el-form v-if="edit.basic" :rules="rulesBasic" ref="basic" :model="clone.basic" label-width="100px">
                <el-form-item label="名前" required>
                    <el-col :span="12">
                        <el-form-item prop="nameLastKanji">
                            <el-input @change="checkDoublePatient()" v-model="clone.basic.nameLastKanji" placeholder="性"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="nameFirstKanji">
                            <el-input @change="checkDoublePatient()" v-model="clone.basic.nameFirstKanji" placeholder="名" style="margin-left: 10px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="フリガナ" required>
                    <el-col :span="12">
                        <el-form-item prop="nameLastKana">
                            <el-input v-model="clone.basic.nameLastKana" placeholder="性"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="nameFirstKana">
                            <el-input v-model="clone.basic.nameFirstKana" placeholder="名" style="margin-left: 10px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="生年月日" prop="birthDate">
                    <el-date-picker
                        @change="checkDoublePatient()"
                        v-model="clone.basic.birthDate"
                        type="date"
                        format="yyyy年MM月dd日"
                        value-format="yyyy/MM/dd"
                        placeholder="選択又は入力">
                    </el-date-picker>
                    <span style="margin-left: 20px">年齢：wewfef年</span>
                </el-form-item>
                <el-form-item label="性別">
                    <el-radio-group v-model="clone.basic.gender">
                        <el-radio label="男性">男性</el-radio>
                        <el-radio style="margin-left: -20px" label="女性">女性</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="職業">
                    <el-select v-model="clone.basic.occupation" placeholder="選択">
                        <el-option v-for="item in display.occupations" :label="item.label" :key="item.id" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住所">
                    <el-input autocomplete="new-password" @change="getAddress(clone.basic.address)" v-model="clone.basic.address.zip" placeholder="郵便番号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-form-item>
                            <el-input autocomplete="new-password" v-model="clone.basic.address.addr1" placeholder="都道府県"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item>
                            <el-input autocomplete="new-password" v-model="clone.basic.address.addr2" placeholder="市区町村" style="margin-left: 16px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="9">
                        <el-form-item>
                            <el-input autocomplete="new-password" v-model="clone.basic.address.addr3" placeholder="番地など"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-input autocomplete="new-password" v-model="clone.basic.address.buildg" placeholder="ビル名" style="margin-left: 8px"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="clone.basic.address.room" placeholder="部屋番号" style="margin-left: 16px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="連絡">
                    <el-col :span="12">
                        <el-input autocomplete="new-password" v-model="clone.basic.tel1" placeholder="電話番号１"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input autocomplete="new-password" v-model="clone.basic.tel2" placeholder="電話番号２" style="margin-left: 10px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-input autocomplete="new-password" v-model="clone.basic.mail1" placeholder="メール１"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input autocomplete="new-password" v-model="clone.basic.mail2" placeholder="メール２" style="margin-left: 10px"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div v-else>
                <div class="line"><span class="label">名前</span><span class="dataBox">{{patientData.basic.nameLastKanji}}{{patientData.basic.nameFirstKanji}}</span></div>
                <div class="line"><span class="label">フリガナ</span><span class="dataBox">{{patientData.basic.nameLastKana}}{{patientData.basic.nameFirstKana}}</span></div>
                <div class="line"><span class="label">生年月日</span><dateDisplay class="dataBox" :date="patientData.basic.birthDate"></dateDisplay></div>
                <div class="line"><span class="label">性別</span><span class="dataBox">{{patientData.basic.gender}}</span></div>
                <div class="line"><span class="label">職業</span><span class="dataBox">{{patientData.basic.occupation}}</span></div>
                <div class="line" style="height: auto">
                    <span class="label" style="margin-top: -76px">住所</span>
                    <span class="dataBox" style="height: auto">
                        <div>〒{{patientData.basic.address.zip}}</div>
                        <div>{{patientData.basic.address.addr1}}{{patientData.basic.address.addr2}}{{patientData.basic.address.addr3}}</div>
                        <div>{{patientData.basic.address.buildg}} {{patientData.basic.address.room}}</div>
                    </span>
                </div>
                <div class="line"><span class="label">連絡</span>
                    <span v-if="patientData.basic.tel1 !==''" class="dataBox">{{patientData.basic.tel1}}</span>
                    <span v-if="patientData.basic.tel2 !==''" class="dataBox" style="margin-left: 20px">{{patientData.basic.tel2}}</span>
                </div>
                <div class="line"><span class="label"></span>
                    <span v-if="patientData.basic.mail1 !==''" class="dataBox">{{patientData.basic.mail1}}</span>
                    <span v-if="patientData.basic.mail2 !==''" class="dataBox" style="margin-left: 20px">{{patientData.basic.mail2}}</span>
                </div>
            </div>
        </el-card>
        <div style="margin-left: 10px; flex-shrink: 0">
            <el-card style="width: 540px">
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline; height: 24px">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">会社・学校</span>
                    </span>
                    <span v-if="!edit.company">
                        <el-button @click="openEdit('company')" size="small">編集</el-button>
                    </span>
                    <span v-else>
                        <el-button type="text" @click="closeEdit('company')" size="small">キャンセル</el-button>
                        <el-button :disabled="!changecompany.change" type="primary" @click="saveEdit('company')" size="small">保存</el-button>
                    </span>
                </div>
                <el-form v-if="edit.company" :rules="rulesCompany" ref="company" :model="clone.company" label-width="100px">
                    <el-form-item label="名" prop="name">
                        <el-input v-model="clone.company.name" placeholder="入力"></el-input>
                    </el-form-item>
                    <el-form-item label="住所">
                        <el-input autocomplete="new-password" @change="getAddress(clone.company.address)" v-model="clone.company.address.zip" placeholder="郵便番号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="12">
                            <el-form-item>
                                <el-input autocomplete="new-password" v-model="clone.company.address.addr1" placeholder="都道府県"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item>
                                <el-input autocomplete="new-password" v-model="clone.company.address.addr2" placeholder="市区町村" style="margin-left: 16px"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="9">
                            <el-form-item>
                                <el-input autocomplete="new-password" v-model="clone.company.address.addr3" placeholder="番地など"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-input autocomplete="new-password" v-model="clone.company.building" placeholder="ビル名" style="margin-left: 8px"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-input v-model="clone.company.room" placeholder="部屋番号" style="margin-left: 16px"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="連絡">
                        <el-input autocomplete="new-password" v-model="clone.company.tel" placeholder="電話番号"></el-input>
                    </el-form-item>
                </el-form>
                <div v-else>
                   <div class="line"><span class="label">名</span><span class="dataBox">{{patientData.company.name}}</span></div>
                    <div class="line" style="height: auto">
                        <span class="label" style="margin-top: -76px">住所</span>
                        <span class="dataBox" style="height: auto">
                            <div>〒{{patientData.company.address.zip}}</div>
                            <div>{{patientData.company.address.addr1}}{{patientData.company.address.addr2}}{{patientData.company.address.addr3}}</div>
                            <div>{{patientData.company.building}} {{patientData.company.room}}</div>
                        </span>
                    </div>
                    <div class="line"><span class="label">連絡</span><span class="dataBox">{{patientData.company.tel}}</span></div>
                </div>

            </el-card>
            <el-card style="width: 540px; margin-top: 10px">
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline; height: 24px">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">配偶者・保護者</span>
                    </span>
                    <span v-if="!edit.dependents">
                        <el-button @click="openEdit('dependents')" size="small">編集</el-button>
                    </span>
                    <span v-else>
                        <el-button type="text" @click="closeEdit('dependents')" size="small">キャンセル</el-button>
                        <el-popover
                            placement="left"
                            width="500"
                            popper-class="dep-pop"
                            trigger="click"
                            style="margin-left: 5px"
                            v-model="display.dependentOpen">
                            <dependent v-if="display.dependentOpen" @close="display.dependentOpen = false" @add="registerDependent"></dependent>
                            <el-button size="small" slot="reference">追加</el-button>               
                        </el-popover>
                        <el-button :disabled="!changesPresent.dependents" type="primary" @click="saveEdit('dependents')" size="small" style="margin-left: 5px">保存</el-button>
                    </span>
                </div>
                <div>
                    <el-table
                        size="small"
                        empty-text="登録なし"
                        :data="dependentsDisplay"
                        row-key="patientID"
                        style="width: 100%; border-radius: 4px; border: solid 1px #dcdfe6;">
                        <el-table-column
                            prop="name"
                            label="名前">
                        </el-table-column>
                        <el-table-column
                            prop="birthdate"
                            label="誕生日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.birthdate"></dateDisplay>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="rel"
                            label="関連">
                            <template slot-scope="scope">
                                <el-select v-if="edit.dependents" size="mini" v-model="scope.row.rel" placeholder="選択">
                                    <el-option
                                        v-for="item in display.rels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <span v-else>{{ scope.row.rel }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="edit.dependents"
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
        <div style="margin-left: 10px; flex: 1">
            <el-card>
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">保険組み合わせ履歴</span>
                    </span>
                </div>
                <div>
                    <el-table-pag
                        size="mini"
                        empty-text="登録なし"
                        :data="patientData.insurance.set"
                        row-key="id"
                        :page-sizes="[4,10,20]"
                        style="border-radius: 4px; border: solid 1px #dcdfe6; margin-top: -10px">
                        <el-table-column
                            width="50px"
                            prop="id"
                            label="番号">
                        </el-table-column>
                        <el-table-column
                            prop="kh1"
                            label="公費1">
                        </el-table-column>
                        <el-table-column
                            prop="kh2"
                            label="公費2">
                        </el-table-column>
                        <el-table-column
                            prop="kh3"
                            label="公費3">
                        </el-table-column>
                        <el-table-column
                            prop="kh4"
                            label="公費4">
                        </el-table-column>
                        <el-table-column
                            prop="startDate"
                            label="適用開始日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.startDate"></dateDisplay>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="endDate"
                            label="適用終了日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.endDate"></dateDisplay>
                            </template>
                        </el-table-column>
                    </el-table-pag>
                </div>
            </el-card>
            <el-card style="margin-top: 10px">
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline; height: 24px">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">保険</span>
                    </span>
                    <span>
                        <el-popover
                            placement="left"
                            width="500"
                            popper-class="dep-pop"
                            trigger="click"
                            style="margin-left: 5px"
                            v-model="display.insuranceOpen">
                            <insurance 
                                :dependents="patientData.dependents"
                                :patientData="patientData.basic"
                                v-if="display.insuranceOpen" 
                                @close="display.insuranceOpen = false"
                                @loading="display.loading = true"
                                @noLoading="display.loading = false"
                                @submit="display.loading = false; getpatientData()">
                            </insurance>
                            <el-button size="small" slot="reference">追加</el-button>               
                        </el-popover>
                    </span>
                </div>
                <div>
                    <el-table-pag
                        size="mini"
                        empty-text="登録なし"
                        :data="patientData.insurance.ins"
                        row-key="id"
                        :page-sizes="[4,10,20]"
                        style="border-radius: 4px; border: solid 1px #dcdfe6; margin-top: -10px">
                        <el-table-column
                            width="50px"
                            prop="hokenSha"
                            label="保険">
                        </el-table-column>
                        <el-table-column
                            width="80px"
                            prop="hokenShaBangou"
                            label="保険者番号">
                        </el-table-column>
                        <el-table-column
                            width="50px"
                            prop="name"
                            label="本家">
                        </el-table-column>
                        <el-table-column
                            width="50px"
                            prop="perc"
                            label="補助">
                        </el-table-column>
                        <el-table-column
                            prop="kigou"
                            label="記号">
                        </el-table-column>
                        <el-table-column
                            prop="bangou"
                            label="番号">
                        </el-table-column>
                        <el-table-column
                            prop="startDate"
                            label="有効開始日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.startDate"></dateDisplay>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="endDate"
                            label="有効終了日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.endDate"></dateDisplay>
                            </template>
                        </el-table-column>
                    </el-table-pag>
                </div>
            </el-card>
            <el-card style="margin-top: 10px">
                <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline; height: 24px">
                    <span>
                        <i class="far fa-id-card"></i>
                        <span style="margin-left: 5px">公費</span>
                    </span>
                    <span>
                        <el-popover
                            placement="left"
                            width="500"
                            popper-class="dep-pop"
                            trigger="click"
                            style="margin-left: 5px"
                            v-model="display.kouhiOpen">
                            <dependent v-if="display.kouhiOpen" @close="display.kouhiOpen = false" @add="registerDependent"></dependent>
                            <el-button size="small" slot="reference">追加</el-button>               
                        </el-popover>
                    </span>
                </div>
                <div>
                    <el-table-pag
                        size="mini"
                        empty-text="登録なし"
                        :data="patientData.insurance.ins"
                        row-key="id"
                        :page-sizes="[4,10,20]"
                        style="border-radius: 4px; border: solid 1px #dcdfe6; margin-top: -10px">
                        <el-table-column
                            prop="name"
                            label="保険">
                        </el-table-column>
                        <el-table-column
                            prop="bangou"
                            label="担当者番号">
                        </el-table-column>
                        <el-table-column
                            prop="recNr"
                            label="受給者番号">
                        </el-table-column>
                        <el-table-column
                            prop="startDate"
                            label="適用開始日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.startDate"></dateDisplay>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="endDate"
                            label="適用開始日">
                            <template slot-scope="scope">
                                <dateDisplay :date="scope.row.endDate"></dateDisplay>
                            </template>
                        </el-table-column>
                    </el-table-pag>
                </div>
            </el-card>


        </div>

    </div>
</template>

<script>

import dependent from '../new_patient/dependent'
import insurance from './insurance'

export default {
    components: {
        'dependent': dependent,
        'insurance': insurance
    },
    data() {
        return {
            patientData: {
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
            },
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
                dependentOpen: false,
                insuranceOpen: false,
                kouhiOpen: false,
                loading: true,
                doubleNot: false,
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
            edit: {
                basic: false,
                company: false,
                dependents: false,
                insurance: false,
                kouhi: false,
                dependentsChange: {
                    added: [],
                    removed: []
                },
                insuranceChange: {
                    added: [],
                },
                kouhiChange: {
                    added: [],
                }
            },
            clone: {
                basic: false,
                company: false,
                dependents: false
            }
        }
    },
    created() {
        let patientID = this.$store.state.componentData.patientDetails.IDselected
        this.getpatientData(patientID)
    },
    computed: {
        changebasic() {
            let object = this.clone.basic
            let base = this.patientData.basic
            return this.detectChange(base, object)
        },
        changecompany() {
            let object = this.clone.company
            let base = this.patientData.company
            return this.detectChange(base, object)  
        },
        changesPresent(){
            let result = {dependents: false}
            if (this.edit.dependentsChange.added.length > 0 || this.edit.dependentsChange.removed.length > 0 || this.dependentsChange.length > 0) {
                result.dependents = true
            }
            return result
        },
        dependentsChange() {
            let result = []
            this.clone.dependents.forEach(element => {
                let row = this.patientData.dependents.find(function(el) { return el.relID === element.relID})
                if (row) {
                    if (row.rel !== element.rel) {
                        result.push(element)
                    }                    
                }
            })
            return result
        },
        dependentsDisplay() {
            if (this.edit.dependents) {
                return this.clone.dependents
            } else {
                return this.patientData.dependents
            }
        }
    },
    methods: {
        detectChange(base, object) {
            function changes(object, base) {
                return _.transform(object, function(result, value, key) {
                    if (!_.isEqual(value, base[key])) {
                        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                    }
                });
            }
            let change = changes(object, base)
            if (_.isEmpty(change)) {
                return {change: false}
            } else {
                return {change: change}
            }
        },
        getpatientData(id) {
            this.display.loading = true
            this.doRequest('getPatientDetails', id).then(result => {
                this.patientData = result.data
                this.display.loading = false
            })
        },
        openEdit(mode) {
            this.edit[mode] = true,
            this.clone[mode] = JSON.parse(JSON.stringify(this.patientData[mode]))
        },
        closeEdit(mode) {
            this.edit[mode] = false
            this.clone[mode] = false
            if (mode === 'dependents') {
                this.edit.dependentsChange.added = []
                this.edit.dependentsChange.removed = []
            }
        },
        saveEdit(mode) {
            if (mode === 'basic' || mode === 'company') {
                this.$refs[mode].validate((valid) => {
                    if (valid) {
                        this.display.loading = true
                        var patientID = this.$store.state.componentData.patientDetails.IDselected
                        let change = 'change' + mode
                        let sendData = {patientID: patientID, changes: this[change], changeData: this.clone[mode], mode: mode}
                        this.doRequest('updatePatientData', sendData).then(result => {
                            if (!result.err1) {
                                this.getpatientData(patientID)
                                this.edit[mode] = false                        
                            }
                        })
                    }
                })                
            } else if (mode === 'dependents') {
                let ident = mode + 'Change'
                this.display.loading = true
                var patientID = this.$store.state.componentData.patientDetails.IDselected
                let changes = this.edit[ident]
                changes.edited = this[ident]
                let sendData = {
                    changeData: changes,
                    changes: "none",
                    patientID: patientID,
                    mode: mode
                }
                this.doRequest('updatePatientData', sendData).then(result => {
                    if (!result.err) {
                        this.edit[ident].added = []
                        this.edit[ident].removed = []
                        this.getpatientData(patientID)
                        this.edit[mode] = false                     
                    }
                })
            }
        },
        checkDoublePatient() {
            if (
                this.clone.basic.nameLastKanji !== this.patientData.basic.nameLastKanji &&
                this.clone.basic.nameFirstKanji !== this.patientData.basic.nameFirstKanji &&
                this.clone.basic.birthDate !== this.patientData.basic.birthDate &&
                this.changebasic.change
            ) {
                this.doRequest('patientDouble', this.clone.basic).then(result => {
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
        registerDependent(data) {
            data.addID = 'new_' + Math.floor(Math.random() * 100)
            this.edit.dependentsChange.added.push(data)
            this.clone.dependents.push(data)
        },
        removeDependent(index, row) {
            if (row.addID) {
                let index = this.edit.dependentsChange.added.findIndex(item => {item.addID === row.addID})
                this.edit.dependentsChange.added.splice(index, 1)
                this.clone.dependents.splice(index, 1)
            } else {
                this.edit.dependentsChange.removed.push(row)
                this.clone.dependents.splice(index, 1)
            }

        }
    }
}
</script>

<style scoped>
    .label {
        width: 88px;
        text-align: end;
        display: inline-block;
        margin-right: 12px;
        color: #606266;
        font-size: 14px
    }
    .line {
        height: 40px;
        display: flex;
        align-items: center;
        margin-bottom: 22px
    }
    .dataBox {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 0 15px;
        height: 38px;
        line-height: 38px;
        font-size: 14px
    }
</style>

