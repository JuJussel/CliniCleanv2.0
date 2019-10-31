<template>
    <div>
        <span class="logo"></span>
        <div class="loginm">
            <div class="form">
                <el-input @keyup.enter.native="login" placeholder="ユーザー名"  v-model="userData.user" style="margin-bottom: 10px"></el-input>
                <el-input @keyup.enter.native="login" placeholder="パスワード"  v-model="userData.pass" type="password" style="margin-bottom: 20px"></el-input>
                <el-button @click="login()" type="primary" style="margin-left: calc(50% - 56px)">ログイン</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loginMobile',
    data() {
        return {
            loading: false,
            userData: {
                user: "",
                pass: "",
                mobile: true
            },
            err: false
        }
    },
    methods: {
        login() {
            this.loading = true
            this.doRequest('login', this.userData).then(result => {
                if (result.OK) {
                    sessionStorage.setItem("session_id", result.sessionID)
                    document.cookie = "PHPSESSID=" + result.sessionID
                    this.$router.push(result.location)
                } else {
                    this.loading = false
                    this.$message.error({message: 'ユーザー名又はパスワードが違います。', customClass: 'notification'})
                }
            })
        }
    }
}
</script>

<style>
    .notification {
        margin-top: 50px;
        margin-left: -10px;
        font-size: 30px;
        min-width: 0;
        width: 80%
    }
    .loginm {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: white;
        padding-top: 20px;
        height: 265px
    }
    .logo {
        background: url('../../assets/img/CliniCleanLogo.png');
        background-size: contain;
        background-repeat: no-repeat;
        height: 125px;
        width: 100%;
        display: block;
        margin-bottom: 0px;
    }
    .form {
        width: 90%;
    }
    .login-box {
        width: 90%; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1;
    }
    .header {
        background-color: rgba(55, 71, 79, 0.4);;
        width: 100%;
        height: 48px;
    }
    .err {
        font-size: 12px;
        color: #F44336;
        margin-bottom: 10px
    }
    .mobile {
        margin-bottom: 20px;
        margin-top: -20px;
        color: #818181;
        font-family: -webkit-body;
    }
</style>
