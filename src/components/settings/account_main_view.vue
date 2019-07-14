<template>
    <div>
        <el-card style="width: 200px">
            <div slot="header" class="clearfix">
                <span>アカウント画像</span>
            </div>
            <div>
                <el-avatar :size="150" :src="avatarURL"></el-avatar>
            </div>
            <div>
                <el-popover v-model="avatar.open" width="280" :placement="'right-end'">
                    <div style="margin-bottom: 10px">注意！アップデート後ページの再読み込みが必要です。</div>
                    <imageCropUpload target="avatar" v-if="avatar.open" @hide="hideAvatar" @done="avatarUpdate"></imageCropUpload>
                    <el-button slot="reference" size='small' style="margin-left: 30px">画像変更</el-button>
                </el-popover>
            </div>
        </el-card>
    </div>
</template>

<script>

import imageCropUpload from'../shared/imageCropUpload'

export default {
    components: {imageCropUpload},
    computed: {
        avatarURL () {
            return this.$globals.apiURL + '/profiles/user' + this.$store.state.constants.userID + '.png'
        }
    },
    data() {
        return {
            avatar: {
                open: false
            }
        }
    },
    methods: {
        hideAvatar() {
            this.avatar.open = false
        },
        avatarUpdate() {
            this.hideAvatar()
            location.reload()
        }
    }
}
</script>

<style>

</style>
