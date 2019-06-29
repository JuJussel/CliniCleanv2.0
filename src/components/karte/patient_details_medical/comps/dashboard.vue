<template>
    <div style="display: flex">
        <div style="width: 400px; display: flex; flex-direction: column">
            <el-card :body-style="{display: 'flex'}" style="margin-bottom: 10px">
                <div style="margin: 10px; width: 200px">
                    <span>
								<span v-bind:style="{ 'background-image': 'url(https://192.168.11.99/profiles/' + $store.state.componentData.patientDetails.IDselected + '.png)' }" alt="Profile Picture" class="profilePicture"></span>
							</span>
                    <div style="font-size: 20px"> {{ data.basicMedInfo.patientName }} </div>
                    <div>ID: {{ patientID }} </div>
                    <div> {{ data.basicMedInfo.age }}歳の{{ data.basicMedInfo.gender }} </div>
                </div>
                <div style="margin-right: 10px; width: 200px">
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
            </el-card>
            <el-card body-style="height: calc(100% - 40px)">
                <div v-if="data.notes.length > 0" style="height: 100%">
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
                    <el-timeline style="padding-right: 5px; padding-top: 10px; height: calc(100% - 30px); overflow: auto">
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
                                <span v-if="!note.edit" style="white-space: pre-line">{{ note.note }}</span>
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
            </el-card>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: space-between; overflow: hidden">
            <div style="display: flex; height: 300px">
                <el-card style="margin-left: 10px">
                    <div slot="header" class="clearfix">
                        <span>病名</span>
                    </div>
                    <div>
                        <el-table 
                            :data="data.byoumei.disp" 
                            size="mini"
                            height="190"
                            class="cctable">
                            <el-table-column
                                label="病名"
                                width="200"
                                prop="name">
                            </el-table-column>
                            <el-table-column
                                label="主病"
                                width="50">
                                <template slot-scope="scope"><span v-if="scope.row.main">主病</span></template>
                            </el-table-column>
                            <el-table-column
                                label="疑い"
                                width="50">
                                <template slot-scope="scope"><span v-if="scope.row.utagai">疑い</span></template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
                <el-card style="margin-left: 10px">
                    <div slot="header" class="clearfix">
                        <span>プロブレム</span>
                    </div>
                    <div>
                        <el-table 
                            :data="data.problem"
                            size="mini"
                            height="190"
                            class="cctable">
                            <el-table-column
                                label="プロブレム"
                                width="230"
                                prop="name">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
                <el-card style="margin-left: 10px">
                    <div slot="header" class="clearfix">
                        <span>アレルギー</span>
                    </div>
                    <div>
                        <el-table 
                            :data="data.allergy" 
                            size="mini" 
                            height="190"
                            class="cctable">
                            <el-table-column
                                label="アレルギー物質"
                                width="180"
                                prop="name">
                            </el-table-column>
                            <el-table-column
                                sortable
                                label="重症度">
                                <template slot-scope="scope">
                                    <el-rate
                                        v-model="scope.row.grade"
                                        :texts="gradeTexts"
                                        show-text
                                        disabled
                                        :icon-classes="gradeIcons"
                                        void-icon-class="el-icon-warning"
                                        :colors="gradeColors">
                                    </el-rate>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
                <el-card style="margin-left: 10px">
                    <div slot="header" class="clearfix">
                        <span>定期処方</span>
                    </div>
                    <div>
                        <el-table 
                            :data="data.teikiShohou" 
                            size="mini"
                            height="190"
                            class="cctable">
                            <el-table-column
                                label="処方"
                                width="200"
                                prop="med_name">
                            </el-table-column>
                            <el-table-column
                                label="開始"
                                width="120"
                                prop="start_date">
                            </el-table-column>
                            <el-table-column
                                label="終了"
                                width="120"
                                prop="end_date">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </div>
            <div style="flex: 1; padding: 10px 0 0 10px">
                <el-card style="height: 100%" :body-style="{height: 'calc(100% - 40px)', display: 'flex'}">
                    <vitalChart :data="data.vital" style="width: 100%"></vitalChart>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>

import vitalChart from './vital_chart'

export default {
    components: {
        'vitalChart': vitalChart
    },
    props: [
        'data'
    ],
    data() {
        return {
            gradeIcons: ['el-icon-warning','el-icon-warning','el-icon-warning'],
            gradeTexts: ['軽症','軽症', '中等症','重症', '重症'],
            gradeColors: ['#607d8b', '#F7BA2A', '#e53935'],
            patientID: this.$store.state.componentData.patientDetails.IDselected,
            newNoteOpen: false,
            newNote: "",
            loading: false
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
                mode: mode,
                noteID: note.ID,
                note: this.newNote
            }).then(result => {
                this.newNoteOpen = false
                this.$emit('update')
            })
        }
    },

}
</script>

<style>
    .note {
        border: solid 1px #cccccc;
        border-radius: 4px;
        padding: 10px;
        color: #606266
    }
    .noteHover:hover * {
        opacity: 1!important;
    }
</style>
