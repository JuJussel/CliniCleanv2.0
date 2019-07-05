<template>
    <div>
        <el-card :body-style="{display: 'flex'}">
            <div>
                <el-avatar :size="150" :src="avatarURL"></el-avatar>
            </div>
            <div style="margin-left: 20px">
                <el-popover v-model="pass.open" width="300">
                    <div>
                        <el-form>
                            <el-form-item label="タイトル">
                                <el-input style="width: 150px" v-model="pass.old"></el-input>
                            </el-form-item>
                        </el-form>
                        <div style="margin-top: 10px">
                            <el-button 
                                style="float: right"
                                type="primary">
                                保存
                            </el-button>
                        </div>
                    </div>
                    <el-button slot="reference" size='small'>画像変更</el-button>
                </el-popover>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    computed: {
        avatarURL () {
            return this.$globals.apiURL + '/profiles/user' + this.$store.state.constants.userID + '.png'
        }
    },
    data() {
        return {
            pass: {
                old: "",
                open: false
            }
        }
    }
}
</script>

<style>

</style>
