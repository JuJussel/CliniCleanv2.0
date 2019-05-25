<template>
    <div class="back">
        <div class="header"></div>
        <div class="login">
            <el-card v-loading="loading" class="box-card login-box" body-style="display: flex; flex-direction: column; align-items: center">
                <span class="logo"></span>
                <div class="form">
                    <el-input @keyup.enter.native="login" placeholder="ユーザー名"  v-model="userData.user" style="margin-bottom: 10px"></el-input>
                    <el-input @keyup.enter.native="login" placeholder="パスワード"  v-model="userData.pass" type="password" style="margin-bottom: 20px"></el-input>
                    <el-button @click="login()" type="primary">ログイン</el-button>
                </div>
            </el-card>
        </div>
        <div class="footer">
           CliniClean Clinic Management System Version 0.2.0.D. Copyright Jussel Peter 2017.
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            loading: false,
            userData: {
                user: "",
                pass: ""
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
                    this.$message.error({message: 'ユーザー名又はパスワードが違います。確認してください。', customClass: 'notification'})
                }
            })
        }
    }
}
</script>

<style>
    .notification {
        margin-top: 50px;
        font-size: 30px
    }
    .login {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100% - 68px);
        width: 100%;
    }
    .back {
        background: url('../assets/img/login_back_light.jpg');
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 100%
    }
    .logo {
        background: url('../assets/img/CliniCleanLogo.png');
        background-size: contain;
        background-repeat: no-repeat;
        height: 120px;
        width: 350px;
        display: block;
        margin-bottom: 20px;
    }
    .form {
        width: 300px;
    }
    .login-box {
        width: 500px; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center
    }
    .header {
        background-color: rgba(55, 71, 79, 0.4);;
        width: 100%;
        height: 48px;
    }
    .footer {
        background-color: white;
        position: absolute;
        width: 100%;
        height: 20px;
        text-align: center;
        bottom: 0px;
        color: #9d9d9d;
        font-size: 8px
    }
    .err {
        font-size: 12px;
        color: #F44336;
        margin-bottom: 10px
    }
</style>
