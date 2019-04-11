<template>
    <div class="home">
        <el-menu 
            :default-active="currentView" 
            mode="horizontal"
            menu-trigger="click"
            @select="handleSelect"
            class="menu-bar-main"
            :background-color="toolbarColor.back"
            :text-color="toolbarColor.text"
            :active-text-color="toolbarColor.sel">
            <el-tooltip content="ホーム" placement="bottom" effect="light">
              <el-menu-item index="dashboard"><i class="fa fa-home menu-icon"></i></el-menu-item>
            </el-tooltip>
            <el-tooltip content="受付事務" placement="bottom" effect="light">
                <el-submenu index="2">
                    <template slot="title"><i class="fa fa-users menu-icon"></i></template>
                    <el-menu-item index="receptionFlow"><i class="fa fa-users sub-menu-icon"></i>受付</el-menu-item>
                    <el-menu-item index="patientSearch"><i class="fa fa-search sub-menu-icon"></i>患者検索</el-menu-item>
                    <el-menu-item index="newPatient"><i class="fas fa-file-medical sub-menu-icon"></i>患者登録</el-menu-item>
                </el-submenu>
            </el-tooltip>
            <el-tooltip content="診療事務" placement="bottom" effect="light">
                <el-submenu index="3">
                    <template slot="title"><i class="fa fa-notes-medical menu-icon"></i></template>
                    <el-menu-item index="patientSearchMedical">患者検索</el-menu-item>
                    <el-menu-item index="kensaInput">検査結果入力</el-menu-item>
                    <el-menu-item index="karteTasks">タスク</el-menu-item>
                </el-submenu>
            </el-tooltip>
            <el-tooltip content="カレンダー" placement="bottom" effect="light">
                <el-menu-item index="schedule"><i class="fa fa-calendar menu-icon"></i></el-menu-item>
            </el-tooltip>
            <el-submenu index="5" style="float: right; margin-right: 100px">
                <template slot="title">
                    <span class="avatar" v-bind:style="{'background-image': avatarUrl}"></span>
                    {{$store.state.constants.username}}さん
                </template>
                <el-menu-item index="account">アカウント</el-menu-item>
                <el-menu-item index="settings">設定</el-menu-item>
                <el-menu-item index="logout">ログアウト</el-menu-item>
            </el-submenu>
            <span class="location-title">{{pageTitle}}</span>
        </el-menu>
        <div class="main-cont">
            <transition name="el-fade-in-linear" >
                <child-component @resetMeta="childMeta=''" @triggerParent="childTriggers" :is="currentView" :meta="childMeta" ref="reception"></child-component>
            </transition>
        </div>
    </div>
</template>
 
<script>

import receptionFlow from '../components/patient/reception_flow/reception_flow_main'
import newPatient from '../components/patient/new_patient/new_patient_main'
import patientSearch from '../components/patient/patient_search/patient_search_main'
import patientDetails from '../components/patient/patient_details/patient_details_main'
import schedule from '../components/schedule/schedule_main'
import { setTimeout } from 'timers'

export default {
  name: 'home',
  components: {
      'receptionFlow': receptionFlow,
      'newPatient': newPatient,
      'patientSearch': patientSearch,
      'patientDetails': patientDetails,
      'schedule': schedule
  },
  data() {
    return {
        childMeta: '', 
        avatarUrl: "url('https://192.168.11.99/profiles/eri.png')",
        currentView: 'dashboard',
        pageTitle: 'クリニクリンホーム',
        taskCount: "",
        pageTitles: {
            dashboard: "クリニクリンホーム",
            receptionFlow: "受付",
            newPatient: "患者登録",
            patientSearch: "患者検索",
            patientSearchMedical: "患者検索",
            kensaInput: "検索結果入力",
            karteTasks: "タスク",
            schedule: "スケジュール"
        },
        msgOpen: false
    }
  },
  computed: {
    toolbarColor() {
        //let string = "url(/static/img/toolbar_gray.jpg)";
        let backgroundColor = '#353c44'
        let color = "#e3e4e5"
        let highlight = "#33b6a5"
        if (this.currentView === 'karteDetails') {
            if (this.$store.state.componentData.karteDetails.jihi == 1) {
                //string = "url(/static/img/toolbar_blue.jpg)";
                backgroundColor = '#03a9f4'
                color = "#e3e4e5"
                highlight = "#E91E63"
                } else if (this.$store.state.componentData.karteDetails.kouhi) {
                //string = "url(/static/img/toolbar_pink.jpg)";
                backgroundColor = '#e91e63'
                color = "#e3e4e5"
                highlight = "#FDD835"
            }
        }
        return {back: backgroundColor, text: color, sel: highlight}
    },
    appendix() {
        if (this.$store.state.componentData.karteDetails.jihi == 1) {
            return ' (自費)'
        } else if (this.$store.state.componentData.karteDetails.kouhi) {
            return ' (公費)'
        } else {
            return ' (保険)'
        }
    }
  },
    methods: {
        handleSelect(key) {
        if (key === 'logout') {
            this.logout()
        }
        this.currentView = key
        this.pageTitle = this.pageTitles[key]
        },
        openToast(cont) {
        this.$message(cont);
        },
        checkSession() {      
        let warningThreshold = 300 //in sec
        this.doRequest('sessionCheck','').then(result => {
            if (!result.err) {
                if(result.timeRemaining < 1) {
                if (this.msgOpen) {
                    this.$msgbox.close()                
                }
                this.logout()
                } else {
                if (result.timeRemaining > warningThreshold) {
                    let timeout = (result.timeRemaining * 1000) - (warningThreshold*1000)
                    setTimeout(function(timeout) {this.checkSession()}.bind(this), timeout)
                } else {
                    let timeRemaining = result.timeRemaining
                    let timeRemainigDisp = timeRemaining/60
                    let deadline = setTimeout(function(){this.checkSession()}.bind(this), 10000)
                    if (this.msgOpen) {
                    this.$msgbox.close()                
                    }
                    this.msgOpen = true
                    this.$confirm('セッションが'+ timeRemainigDisp + '分後無効にります。< /br>セッションを延長しますか？', 'セッションタイムアウト', {
                    confirmButtonText: '延長する',
                    cancelButtonText: 'ログアウト',
                    type: 'warning'
                    }).then(() => {
                    clearTimeout(deadline)
                    this.updateTaskCount()
                    this.checkSession()   
                    this.msgOpen = false          
                    }).catch(() => {
                    clearTimeout(deadline)
                    this.logout()                
                    });
                }
                }
            } else {
                alert(result.msg);
            }
        })
        },
        sessionTimeout() {
            if (this.msgOpen) {
                this.$msgbox.close()                
            }
                this.$alert('セッションがタイムアウトしました。</ br>再ログインしてください。', 'セッションタイムアウト', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '再ログイン',
                callback: action => {
                    this.logout()
                }
            });
        },
        childTriggers( meta) {
            if (meta.mode === "goToHome") {
                this.currentView='dashboard'
            } else if (meta.mode === "gotoPatientDetails") {
                this.currentView = 'patientDetails'
                this.pageTitle = '患者詳細'
            } else if (meta.mode === "receivePat") {
                this.childMeta = meta
                this.currentView = 'receptionFlow'
                this.pageTitle = '患者受付'
                setTimeout(function() {this.$refs.reception.receivePat(meta.data)}.bind(this), 100)
            } else if (meta.mode === "patientDetailsMedical") {
                this.currentView = 'patientDetailsMedical'
                this.pageTitle = '患者詳細'
            }
        },
        logout() {
            this.doRequest('logout','').then(result => {
                sessionStorage.removeItem("session_id")
                console.log(result)
                this.$router.push(result.data)
                location.reload()
            })
        },
        showKarteDetails: function(mode) {
            this.currentView='karteDetails';
            this.pageTitle = '患者録';
            this.$store.commit('UPDATE_KARTEDETAILSMODE', mode);
        },
        updateTaskCount: function() {
            this.doRequest('getTaskNumber','').then(result => {
                this.taskCount = result.count        
            })
        }
    },
    sockets: {
        connect() {
            console.log('connected to notification system');
        },
        disconnect() {
            console.log('disconnected from notification system');
        },
        broadcast(data) {
            //Notification for new Shinsatsu////////////////////////////////////////
            if (data.action === 'newShinsatsu') {
                if (data.target === this.$store.state.constants.userID) {
                    this.$store.commit('SET_SHINSATSU_INFO', data.data);
                    this.$message({message: '新しい診察：' + this.$store.state.componentData.karteDetails.patient.name, type: 'success'})
                }
                this.doRequest('getUserList','').then(result => {
                    this.$store.commit('SET_USERLIST', result.list)  
                })
            }
            //Notification for closing Shinsatsu////////////////////////////////////
            if (data.action === 'closeShinsatsu') {
                if (data.target === this.$store.state.constants.userID) {
                    this.doRequest('getTasksShinsatsu').then(result => {
                        // store wont set if array is null, so have to create this dummy array
                        var nullShinsatsu = {
                            shinsatsuID:"",
                            karteID:"",
                            patientID:"",
                            patientLastname:"",
                            jihi: false
                        }
                        this.$store.commit('SET_SHINSATSU_INFO', nullShinsatsu)
                    })
                    this.doRequest('getUserList','').then(result => {
                        this.$store.commit('SET_USERLIST', result.list)  
                    })
                    this.currentView='dashboard'
                }
            }
            //Notification for updated Tasks////////////////////////////////////////
            if (data.action === 'updateTask' && data.target.includes(this.$store.state.constants.userID)) {
                if (this.currentView !=='karteTasks' ) {
                    this.snackbarCont = "新しいタスク情報：" + this.$store.state.componentData.karteDetails.patient.name;
                    this.$refs.snackbar.open();
                    this.newTask = true;
                }
                this.updateTaskCount();
            }
            if (data.action === 'updateTask') {
                this.$eventHub.$emit('updateTask',data.data)
            }
        }
    },
    created() {
        this.doRequest('getUsername','').then(result => {
            this.userName = result.username;
            this.$store.commit('SET_USERNAME', result.username);
            this.$store.commit('SET_USERID', result.userID);
        })
        this.doRequest('getLists','').then(result => {
            this.$store.commit('SET_LISTS', result.data)        
        })
        this.doRequest('getUserList','').then(result => {
            this.$store.commit('SET_USERLIST', result.list)        
        })
        this.doRequest('getDate','').then(result => {
            this.$store.commit('SET_DATE', result.date)        
        })
        this.doRequest('getTasksShinsatsu','').then(result => {
            this.$store.commit('SET_SHINSATSU_INFO', result.data)        
        })
        this.updateTaskCount();
        this.$eventHub.$on('sessionInvalid', this.sessionTimeout)
        this.$eventHub.$on('toast', this.openToast)
        this.$eventHub.$on('homeTrigger', this.childTriggers)
        setTimeout(function(){this.checkSession()}.bind(this), 1000)
    },
    beforeDestroy: function() {
        this.$eventHub.$off('sessionInvalid')
        this.$eventHub.$off('toast')
        this.$eventHub.$off('homeTrigger')
    }
}
</script>

<style>
a {
    color: #33b6a5
}
.ccmodal {
    border-radius: 4px
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #e0f2f1
}
.el-table--mini td {
    padding: 2px 0!important
}
.el-table--small td {
    padding: 6px 0!important
}
.avatar {
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50px
}
.el-popover {
    border: solid 2px #33b6a5;
}
</style>


<style scoped>
.sub-menu-icon {
    margin-right: 5px;
    color: white
}
.menu-icon {
  font-size: 25px!important;
  color: inherit!important;
  margin-right: 5px
}
.el-menu-item {
  padding: 0 10px
}
.avatar {
  height: 40px;
  width: 40px;
  background-size: contain;
  display: inline-block;
  border-radius: 20px
}
.menu-bar-main {
  margin-top: -10px
}
.location-title {
    top: 20px;
    position: absolute;
    right: 50%;
    font-weight: bold;
    font-size: 20px;
    color: #e3e4e5;
}
.el-submenu__title {
  padding: 0 10px
}
.main-cont {
    height: calc(100% - 71px);
    width: calc(100% - 20px);
    position: absolute;
    padding: 10px;
    background-color: #f1f1f1;
    overflow: hidden
}
</style>

