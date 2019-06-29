<template>
    <div class="container">
        <el-card style="margin-right: 10px; width:600px" body-style="overflow: auto; max-height: calc(100% - 101px)">
            <div slot="header" style="display: flex; justify-content: start; align-items: baseline">
                <i class="fas fa-search"></i>
                <span style="margin-left: 5px">検索項目</span>
            </div>
            <el-form label-width="130px">
                <div>基本</div>
                <el-form-item label="ID">
                    <el-input @keyup.enter.native="enterSearch" autocomplete="new-password" v-model="searchInput.id"></el-input>
                </el-form-item>
                <el-form-item label="氏名">
                    <el-input autocomplete="new-password" v-model="searchInput.name"></el-input>
                </el-form-item>
                <el-form-item label="生年月日" prop="birthDate">
                    <el-date-picker
                        @change="checkDoublePatient()"
                        v-model="searchInput.birthdate"
                        type="date"
                        format="yyyy年MM月dd日"
                        value-format="yyyy/M/d"
                        placeholder="選択又は入力">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="電話番号">
                    <el-input autocomplete="new-password" v-model="searchInput.tel"></el-input>
                </el-form-item>
                <el-form-item label="メール">
                    <el-input autocomplete="new-password" v-model="searchInput.mail"></el-input>
                </el-form-item>
                <el-form-item label="住所">
                    <el-input autocomplete="new-password" v-model="searchInput.address"></el-input>
                </el-form-item>
                <div>詳細</div>
                <el-form-item label="性別">
                    <el-checkbox-group v-model="searchInput.gender">
                        <el-checkbox label="男性"></el-checkbox>
                        <el-checkbox label="女性"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="職業">
                    <el-select v-model="searchInput.occupation" multiple placeholder="Select">
                        <el-option
                        v-for="item in display.occupations"
                        :key="item.id"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保険記号">
                    <el-input autocomplete="new-password" v-model="searchInput.hokenKigou"></el-input>
                </el-form-item>
                <el-form-item label="保険番号">
                    <el-input autocomplete="new-password" v-model="searchInput.hokenBangou"></el-input>
                </el-form-item>
                <el-form-item label="保険者番号 ">
                    <el-input autocomplete="new-password" v-model="searchInput.hokenShaBangou"></el-input>
                </el-form-item>
                <el-form-item label="公費者番号">
                    <el-input autocomplete="new-password" v-model="searchInput.kouhiBangou"></el-input>
                </el-form-item>
                <el-form-item label="公費受給者番号">
                    <el-input autocomplete="new-password" v-model="searchInput.kouhiRec"></el-input>
                </el-form-item>
                <el-form-item label="会社・学校名">
                    <el-input autocomplete="new-password" v-model="searchInput.workName"></el-input>
                </el-form-item>
                <el-form-item label="会社・学校住所">
                    <el-input autocomplete="new-password" v-model="searchInput.workAddress"></el-input>
                </el-form-item>
                <el-form-item label="会社・学校電話">
                    <el-input autocomplete="new-password" v-model="searchInput.workTel"></el-input>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="width: 700px">
            <div slot="header" style="display: flex; justify-content: space-between; align-items: baseline">
                <span>
                    <i class="fas fa-list"></i>
                    <span style="margin-left: 5px">検索結果</span>
                </span>
                <span>{{ searchResults.length }}件見つかりました</span>
            </div>
            <el-table-pag
                size="small"
                empty-text="該当する項目は見つかりませんでした。"
                :data="searchResults"
                row-key="patientID"
                :height="730"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="patientID"
                    sortable="custom"
                    label="ID">
                </el-table-column>
                <el-table-column
                    prop="name"
                    sortable="custom"
                    label="名前">
                </el-table-column>
                <el-table-column
                    prop="birthdate"
                    sortable="custom"
                    label="誕生日">
                </el-table-column>
                <el-table-column
                    width="120">
                    <template slot-scope="scope">
                        <el-button @click="patientAction(scope.row)">詳細</el-button>
                    </template>
                </el-table-column>
            </el-table-pag>
        </el-card>
    </div>
</template>

<script>

export default {
    data() {
        return {
            searchInput: {
                id: "",
                name: "",
                birthdate: "",
                tel: "",
                mail: "",
                address: "",
                gender: [],
                occupation: [],
                hokenKigou: "",
                hokenBangou: "",
                hokenShaBangou: "",
                kouhiBangou: "",
                kouhiRec: "",
                workName: "",
                workAddress: "",
                workTel: ""
            },
            searchResults: [],
            display: {
                occupations: [{id: 1, label: '会社員'},{id: 2, label: '自営業'},{id: 3, label: '学生'},{id: 4, label: 'その他'}]
            }
        }
    },
    watch: {
        searchInput: {
            handler: function() {
                this.updateSearch()
            },
            deep: true
        }
    },
    methods: {
        enterSearch() {
            let id = this.searchInput.id
            this.doRequest('patientIDSearch', id).then(result => {
                if (result.ok) {
                    this.patientAction({patientID: id})
                } else {
                    this.$message.error({message: '該当の患者番号が存在しません', customClass: 'notification'})
                }
            })
        },
        updateSearch() {
            if (
                this.searchInput.id === "" &&
                this.searchInput.name === "" &&
                this.searchInput.birthdate === "" &&
                this.searchInput.tel === "" &&
                this.searchInput.mail === "" &&
                this.searchInput.address === "" &&
                this.searchInput.gender.length < 1 &&
                this.searchInput.occupation.length < 1 &&
                this.searchInput.hokenKigou === "" &&
                this.searchInput.hokenBangou === "" &&
                this.searchInput.hokenShaBangou === "" &&
                this.searchInput.kouhiBangou === "" &&
                this.searchInput.kouhiRec === "" &&
                this.searchInput.workName === "" &&
                this.searchInput.workAddress === "" &&
                this.searchInput.workTel === ""
            ) {
                this.searchResults = []              
            } else {
                this.doRequest('getPatientSearch', this.searchInput).then(result => {
                    this.searchResults = result.data
                })
            }
        },
        patientAction(pat) {
            let patientID = pat.patientID
            this.$store.commit('SET_PATIENTDETAILS_PATIENT_ID',patientID)           
            this.$eventHub.$emit('homeTrigger', {mode: 'gotoPatientDetailsMedical'})                
        }
    }
}
</script>

<style scoped>
 .container {
     display: flex;
     max-height: 100%
 }
 .card {
   flex: 1
 }
 .cardBody {
     overflow: auto
 }
</style>
