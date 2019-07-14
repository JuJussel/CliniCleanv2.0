<template>
    <div>
        <div style="display: flex; justify-content: center">
            <vue-croppie
                v-loading="imageLoading"
                ref="resize" 
                style="height: 200px; width: 200px"
                :viewport="{ width: 150, height: 150, type: 'circle' }"
                :enableResize="false"
                :enableOrientation="true">
            </vue-croppie>
        </div>
        <div style="margin-top: 50px">
            <el-upload
            action=""
            :auto-upload="false"
            :show-file-list="false"
            style="float: left"
            :on-change="chooseImage">
                <el-button type="primary">画像選択</el-button>
            </el-upload>
            <el-button
                :disabled="!hasImage"
                style="float: right"
                @click="submit"
                type="primary">
                保存
            </el-button>
            <el-button
                style="float: right; margin-right: 10px"
                @click="close"
                type="text">
                キャンセル
            </el-button>
        </div>
        
    </div>

</template>

<script>
export default {
    props: [
        'target'
    ],
    data() {
        return {
            imageLoading: false,
            hasImage: false,
            image: false,
            targets: {
                avatar: 'updateAvatar'
            }
        }
    },
    methods: {
        chooseImage(input) {
            let that = this
            this.imageLoading = true
            var reader = new FileReader();
            reader.onload = function (e) {
                that.$refs.resize.bind({url: e.target.result
                }).then(function() {
                    that.imageLoading = false
                    that.hasImage = true
                })
            }
            reader.readAsDataURL(input.raw);
        },
        close() {
            this.$emit('hide')
        },
        submit() {
            var that = this
            this.$refs.resize.result({format: 'png'}, (file) => {                
                that.doRequest(that.targets[that.target], file).then(result => {
                    that.$emit('done', result.url)
                })
            });
        }
    }


}
</script>

<style>
</style>
