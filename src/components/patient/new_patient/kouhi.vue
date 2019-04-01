<template>
    <div>
        <el-card class="box-card">
            <div>
                <el-form :model="khData" label-width="150px">
                    <el-form-item label="公費負担者番号" required>
                        <el-input style="width: 200px" v-model="khData.khFuSha"></el-input>
                    </el-form-item>
                    <el-form-item label="公費受給者番号" required>
                        <el-input style="width: 200px" v-model="khData.khRecp"></el-input>
                    </el-form-item>
                    <el-form-item label="有効期限" required>
                        <el-date-picker
                            v-model="khData.valid"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="から"
                            end-placeholder="まで">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div style="display: flex; align-items: center">
                    <span style="width: 138px; text-align: right; padding-right: 12px">
                        証写アップロード
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
                <div style="margin-top: 10px;margin-bottom: 15px; float: right">
                    <el-button @click="close()" type="text">キャンセル</el-button>
                    <el-button @click="addNew" :disabled="!inputOK" type="primary">追加</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            khData: {
                khFuSha: '',
                khRecp: '',
                valid: false,
                images: []
            }
        }
    },
    methods: {
        addNew() {
            let that = this
            let files = this.$refs.files.uploadFiles
            files.forEach(element => {
                var fr = new FileReader()
                fr.onload = function () {
                    that.khData.images.push(fr.result)
                    if (files.length === that.khData.images.length) {
                        that.khData.validDisp = 
                        that.$moment(that.khData.valid[0]).format('YYYY年M月D日') +
                        '~' +
                        that.$moment(that.khData.valid[1]).format('YYYY年M月D日')
                        that.$emit('add', that.khData)
                        that.$emit('close')                     
                    }
                }
                fr.readAsDataURL(element.raw)
            })
        },
        close() {
            this.$emit('close')
        }
    },
    computed: {
        inputOK() {
            if (
                this.khData.khFuSha !== '' && 
                this.khData.khRecp !== '' && 
                this.khData.valid &&
                this.$refs.files.uploadFiles.length > 0) {
                return true
            }
            return false
        }
    }
}
</script>

<style>

</style>
