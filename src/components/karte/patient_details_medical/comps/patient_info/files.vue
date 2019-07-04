<template>
    <div ref="cont" style="height: calc(100% - 30px)" v-loading="loading">
        <el-popover v-model="upload.open" width="300" @hide="openUpload">
            <div>
                <el-form>
                    <el-form-item label="タイトル">
                        <el-input style="width: 150px" v-model="upload.title"></el-input>
                    </el-form-item>
                    <el-form-item label="ファイル">
                        <el-upload
                            ref="files"
                            :action="$globals.apiURL + $globals.fileUploadURL"
                            :data="{
                                patientID: $store.state.componentData.karteDetails.patient.id,
                                title: upload.title
                            }"
                            with-credentials
                            :limit="1"
                            :on-success="handleSuccess"
                            :on-exceed="handleExceed"
                            :auto-upload="false">
                            <el-button @click="$refs.files.clearFiles()" size="small" type="primary">ファイル選択</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 10px">
                    <el-button 
                        @click="uploadFiles"
                        style="float: right"
                        type="primary"
                        :disabled="upload.title === '' || $refs.files.uploadFiles.length < 1">
                        保存
                    </el-button>
                    <el-button @click="upload.open = false" style="float: right; margin-right: 5px" type="text">キャンセル</el-button>
                </div>
            </div>
            <el-button slot="reference" size='small'>アップロード</el-button>
        </el-popover>
        <el-table
            ref="table"
            :data="data"
            :max-height="tableHeight"
            size="mini"
            class="cctable"
            stripe
            @row-click="handleRowClick"
            row-class-name="row2212"
            style="margin-top: 10px">
            <el-table-column
                width="50">
                <template slot-scope="scope">
                    <el-icon v-if="scope.row.type === '1'" class="el-icon-document"></el-icon>
                    <el-icon v-else-if="scope.row.type === '2'" class="el-icon-picture-outline"></el-icon>
                </template>
            </el-table-column>
            <el-table-column
                sortable
                label="日付"
                prop="dispDate"
                width="130">
            </el-table-column>
            <el-table-column
                sortable
                label="名前"
                prop="title">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: [
        'data'
    ],
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.tableHeight = contHeight - 40})
    },
    data() {
        return {
            tableHeight: 0,
            loading: false,
            upload: {
                open: false,
                title: '',
                files: []
            }
        }
    },
    watch: {
        data() {
            this.loading = false
        }
    },
    methods: {
        handleRowClick(row) {
            let api = this.$globals.apiURL
            if (typeof nw !== 'undefined') {
                nw.Window.open(api + "/patient_files/" + row.file, {})                
            } else{
                window.open(api + "/patient_files/" + row.file, row.title, "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10")
            }
        },
        openUpload() {
            this.upload.title = ""
            this.$refs.files.clearFiles()
        },
        handleExceed() {
            this.$message.warning('他のファイルをアップロードするには既存のファイルを削除してください。ファイル1個以上をアップロードすることができません。');
        },
        uploadFiles() {
            this.loading = true
            this.$refs.files.submit()
        },
        handleSuccess(response, file, fileList) {
            this.$eventHub.$emit('kartePatientDataUpdate')
            this.upload.open = false
        }
    }
}
</script>

<style>
.row2212 {
    cursor: pointer
}
</style>
