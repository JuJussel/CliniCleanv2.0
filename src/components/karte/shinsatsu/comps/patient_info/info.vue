<template>
    <div v-if="data !== []" v-loading="loading" >
        <div  style="display: flex; justify-content: space-between" v-bind:class="{'editing': editBasicData}">
            <div style="margin: 10px">
                <div style="font-size: 20px"> {{ data.basicMedInfo.patientName }} </div>
                <div>ID: {{ patientID }} </div>
                <div> {{ data.basicMedInfo.age }}歳の{{ data.basicMedInfo.gender }} </div>
            </div>
            <div style="display: flex; padding: 10px">
                <div v-if="editBasicData" style="margin-right: 10px; width: 328px; color: #606266!important">
                    <div>
                        <div>
                            <div style="display: flex; align-items: center; margin-top: 2px; margin-bottom: 7px">
                                <el-checkbox v-model="copy.basic.pregnant.has">妊娠中</el-checkbox>
                                <el-date-picker
                                    v-model="copy.basic.pregnant.pregnantBirthdate"
                                    size="mini"
                                    placeholder="予定日"
                                    :clearable="false"
                                    :disabled="!copy.basic.pregnant.has"
                                    format="yyyy年M月d日"
                                    value-format="yyyy-MM-dd"
                                    style="width: 150px; margin-left: 54px">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="editFormItem">
                            <div>
                                <i class="fas fa-tint" style="width: 25px"></i>
                                <span>血液型</span>
                            </div>
                            <el-select size="mini" style="width: 80px; margin-bottom: 6px" placeholder="選択" v-model="copy.basic.bloodType">
                                <el-option v-for="type in bloodTypes" :key="type" :label="type" :value="type"></el-option>
                            </el-select>
                        </div>
                        <div class="editFormItem">
                            <div>
                                <i class="fas fa-glass-martini-alt" style="width: 25px"></i>
                                <span>アルコール</span>
                            </div>
                            <el-input size="mini" v-model="copy.basic.alcohol.value" style="width: 80px; margin-bottom: 5px"><template slot="append">杯</template></el-input> 
                        </div>
                        <div class="editFormItem">
                            <div>
                                <i class="fas fa-smoking" style="width: 25px"></i>
                                <span>タバコ</span>
                            </div>
                            <el-input size="mini" v-model="copy.basic.tabak.value" style="width: 80px; margin-bottom: 5px"><template slot="append">本</template></el-input> 
                        </div>
                    </div>
                    <div v-if="editBasicData">
                        <span style="float: right">
                            <el-button size="small" @click="editBasicData = false" type="text">キャンセル</el-button>
                            <el-button size="small" @click="saveData('basic')" :disabled="noBasicChange" type="primary">保存</el-button>
                        </span>
                    </div>
                </div>
                <div v-else style="margin-right: 10px; width: 200px">
                    <div style="color: #606266!important">
                        <el-tag v-if="data.basicMedInfo.pregnant.has" type="warning">
                            <i class="fas fa-baby" style="margin-right: 5px"></i>
                            妊娠中　予定: <dateDisplay :date="data.basicMedInfo.pregnant.pregnantBirthdate"></dateDisplay>
                        </el-tag>
                        <div style="margin-bottom: 10px; margin-top: 5px"><i class="fas fa-tint" style="width: 25px"></i>血液型: {{ data.basicMedInfo.bloodType }} </div>
                        <div style="margin-bottom: 9px"><i class="fas fa-ruler-vertical" style="width: 25px"></i>身長: {{ data.basicMedInfo.height }} </div>
                        <div style="margin-bottom: 10px"><i class="fas fa-weight" style="width: 25px"></i>体重: {{ data.basicMedInfo.weight }} </div>
                        <div v-if="data.basicMedInfo.alcohol.has" style="margin-bottom: 10px">
                            <i class="fas fa-glass-martini-alt" style="width: 25px"></i>アルコール: {{ data.basicMedInfo.alcohol.value }} 杯
                        </div>
                        <div v-if="data.basicMedInfo.tabak.has">
                            <i class="fas fa-smoking" style="width: 25px"></i>タバコ: {{ data.basicMedInfo.tabak.value }} 本
                        </div>
                    </div>
                </div>
                
                <div v-if="!editBasicData" style="width: 128px">
                    <el-button size="small" @click="toggleBasicEdit" style="float: right">編集</el-button>
                </div>
            </div>
        </div>
        <div style="margin-bottom: 20px">
            <h4 style="margin: 0" class="link1">病名</h4>
            <el-table 
                :data="data.byoumei.disp" 
                size="mini"
                :show-header="false"
                class="tableItem">
                <el-table-column
                    label="病名"
                    prop="name">
                </el-table-column>
                <el-table-column
                    width="50">
                    <template slot-scope="scope"><span v-if="scope.row.main">主病</span></template>
                </el-table-column>
                <el-table-column
                    width="50">
                     <template slot-scope="scope"><span v-if="scope.row.utagai">疑い</span></template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-bottom: 20px">
            <h4 style="margin: 0" class="link1">アレルギー</h4>
            <el-table :data="activeAllergy" size="mini" :show-header="false" class="tableItem">
                <el-table-column
                    label="病名"
                    prop="name">
                </el-table-column>
            </el-table>
        </div>
        <div v-if="data.notes.length > 0">
            <h4 style="margin: 0 0 16px 0">
                <span>メモ</span>
                <el-popover v-model="newNoteOpen" @show="newNote = ''">
                    <div>
                        <el-input 
                            type="textarea" 
                            :autosize="{minRows: 2}" 
                            placeholder="入力" 
                            v-model="newNote" 
                            maxlength="145" 
                            show-word-limit
                            style="width: 300px">
                        </el-input>
                    </div>
                    <div style="margin-top: 10px">
                        <el-button @click="saveNote({'id': ''},'add')" style="float: right" type="primary">保存</el-button>
                        <el-button @click="closeNewNote" style="float: right; margin-right: 5px" type="text">キャンセル</el-button>
                    </div>
                    <el-button slot="reference" style="float: right; margin-right: 10px" size="small">追加</el-button>
                </el-popover>
            </h4>                
            <el-timeline style="padding-right: 5px">
                <el-timeline-item
                    class="noteHover"
                    v-for="note in data.notes"
                    :key="note.ID" 
                    :timestamp="note.insert_Date" 
                    placement="top">
                    <div class="note">
                        <span style="float: right; margin-top: -40px; margin-right: -10px; opacity: 0">
                            <el-button v-if="!note.edit" @click="note.edit = true" icon="el-icon-edit" size="mini" ></el-button>
                            <span v-else>
                                <el-button @click="saveNote(note, 'remove')" type="danger" size="mini">削除</el-button>
                                <el-button @click="note.edit = false" type="text" size="mini" >キャンセル</el-button>
                                <el-button @click="saveNote(note, 'edit')" icon="el-icon-check" type="primary" size="mini"></el-button>
                            </span>
                        </span>
                        <span v-if="!note.edit">{{ note.note }}</span>
                        <el-input
                            v-else
                            type="textarea" 
                            :autosize="{minRows: 2}" 
                            placeholder="入力" 
                            v-model="note.dummy" 
                            maxlength="145" 
                            show-word-limit>
                        </el-input>
                    </div>
                </el-timeline-item>
            </el-timeline>
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
            newNoteOpen: false,
            newNote: '',
            loading: false,
            editBasicData: false,
            copy: {
                basic: {}
            },
            bloodTypes: [
                '0-',
                '0+',
                'A-',
                'A+',
                'B-',
                'B+',
                'AB-',
                'AB+'
            ]
        }
    },
    computed: {
        activeAllergy() {
            return this.data.allergy.filter(item => item.done !== '0')
        },
        patientID() {
            return this.$store.state.componentData.karteDetails.patient.id
        },
        noBasicChange() {
            return _.isEqual(this.copy.basic, this.data.basicMedInfo);
        }
    },
    watch: {
        data() {
            this.loading = false
        }
    },
    methods: {
        closeNewNote() {
            this.newNoteOpen = false
            this.newNote = ''
        },
        saveNote(note, mode) {
            if (mode === "edit") {
                this.newNote = note.dummy
            }
            this.doRequest('patientNote', {
                patientID: this.patientID,
                karteID: this.$store.state.componentData.karteDetails.shinsatsu.karteID,
                mode: mode,
                noteID: note.ID,
                note: this.newNote
            }).then(result => {
                this.newNoteOpen = false
                this.loading = true
                this.$eventHub.$emit('kartePatientDataUpdate')
            })
        },
        toggleBasicEdit() {
            this.editBasicData = true
            this.copy.basic = JSON.parse(JSON.stringify(this.data.basicMedInfo))
        },
        saveData(mode) {
            if (mode === 'basic') {
                let changes = []
                if (this.copy.basic.alcohol.value !== this.data.basicMedInfo.alcohol.value) {
                    if (this.copy.basic.alcohol.value > 0) {
                        this.copy.basic.alcohol.has = true
                    } else {
                        this.copy.basic.alcohol.has = false
                    }
                    let data = {patientID: this.patientID, itemData: this.copy.basic.alcohol, mode: '1'}
                    changes.push(data)
                }
                if (this.copy.basic.tabak.value !== this.data.basicMedInfo.tabak.value) {
                    if (this.copy.basic.tabak.value > 0) {
                        this.copy.basic.tabak.has = true
                    } else {
                        this.copy.basic.tabak.has = false
                    }
                    let data = {patientID: this.patientID, itemData: this.copy.basic.tabak, mode: '2'}
                    changes.push(data)
                }
                if (this.copy.basic.bloodType !== this.data.basicMedInfo.bloodType) {
                    let data = {patientID: this.patientID, itemData: this.copy.basic.bloodType, mode: 'blood'}
                    changes.push(data)
                }
                if (
                    this.copy.basic.pregnant.has !== this.data.basicMedInfo.pregnant.has
                    || this.copy.basic.pregnant.pregnantBirthdate !== this.data.basicMedInfo.pregnant.pregnantBirthdate
                ) {
                    let data = {patientID: this.patientID, itemData: this.copy.basic.pregnant, mode: '3'}
                    changes.push(data)
                }
                changes.forEach(change => {
                    this.doRequest('patientSupData', change).then(result => {
                        this.loading = true
                        this.$eventHub.$emit('kartePatientDataUpdate')
                        this.editBasicData = false
                    })
                })
                    
            }
        }
    }
}
</script>

<style scoped>
.editing {
    box-shadow: inset 0 0 0px 2px #33b6a5;
    border-radius: 4px
}
.editFormItem {
    display: flex
}
.editFormItem > div {
    width: 120px
}
.editFormItem > el-input {
    width: 80px;
    margin-bottom: 5px
}
.note {
    border: solid 1px #cccccc;
    border-radius: 4px;
    padding: 10px;
    color: #606266
}
.noteHover:hover * {
    opacity: 1!important;
}
.tableItem {
    border-radius: 4px;
    border: 1px solid rgb(220, 223, 230);
    margin: 5px 0;
}
.link1:hover {
    cursor: pointer;
    color: #33b6a5
}
</style>
