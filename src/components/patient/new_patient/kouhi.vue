<template>
    <div>
        <el-card class="box-card">
            <div>
                <el-form :rules="rules" :model="khData" label-width="150px" ref="form">
                    <el-form-item label="公費負担者番号" required prop="khFuSha">
                        <el-input style="width: 200px" v-model="khData.khFuSha"></el-input>
                    </el-form-item>
                    <el-form-item label="公費受給者番号" required prop="khRecp">
                        <el-input style="width: 200px" v-model="khData.khRecp"></el-input>
                    </el-form-item>
                    <el-form-item label="有効期限" required>
                        <el-date-picker
                            v-model="khData.valid"
                            type="daterange"
                            range-separator="~"
                            value-format="yyyy/MM/dd"
                            start-placeholder="から"
                            end-placeholder="まで">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div style="display: flex; align-items: baseline">
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
            },
            rules: {
                khFuSha: [
                    { validator: this.validateKouhi1, trigger: 'manual' }
                ],
                khRecp : [
                    { validator: this.validateKouhi2, trigger: 'manual' }
                ]
            }
        }
    },
    methods: {
        addNew() {
            this.$refs.form.validate(valid => {
                if(valid) {
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
                }
            })
        },
        close() {
            this.$emit('close')
        },
        validateKouhi1 (rule, data, callback) {
            let check_number = 0;
            if (data.length != 8) {
                callback(new Error('8桁を入力してください'))
            }
            var ns = data.toString(10);
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
            check_number = 10 - check_str[check_pos];
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
        validateKouhi2 (rule, data, callback) {
            let check_number = 0;
            if (data.length != 7) {
              callback(new Error('7桁を入力してください'))
            }
            var ns = data.toString(10);
            ns = ns.split('');
            var x1 = ns[0];
            var x2 = ns[1]*2;
            if (x2 > 9) {
                x2 = (x2-9);
            }
            var x3 = ns[2];
            var x4 = ns[3]*2;
            if (x4 > 9) {
                x4 = (x4-9);
            }
            var x5 = ns[4];
            var x6 = ns[5]*2;
            if (x6 > 9) {
                x6 = (x6-9);
            }
            var x7 = ns[6];
            if (x7 !== "") {
            var check = x1*1+x2*1+x3*1+x4*1+x5*1+x6*1;
            var check_str = check.toString();
            var check_pos = check_str.length-1;
            check_number = 10 - check_str[check_pos];
            if (check_str[check_pos] == 0) {
                check_number = 0;
            }
            }
            if (check_number != x7) {
                callback(new Error('番号に誤りがあります'))
            } else {
                callback()
            }
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
.el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6!important
}
.el-form-item .is-success .el-input__inner:focus {
    border-color: #dcdfe6!important
}
</style>
