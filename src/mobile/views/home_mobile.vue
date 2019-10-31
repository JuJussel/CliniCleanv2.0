<template>
    <div class="main-cont">
        <el-menu 
            default-active="tasks"
            class="el-menu-vertical"
            mode="horizontal"
            background-color="#353c44"
            text-color="#e3e4e5"
            active-text-color="#33b6a5"
            @select="selectTab">
            <el-menu-item index="camera">
                <i class="fas fa-camera" style="margin-right: 5px"></i>
                <span slot="title">カメラ</span>
            </el-menu-item>
            <el-menu-item index="tasks">
                <span  slot="title">
                    <i class="fas fa-list" style="margin-right: 5px"></i>
                    <span>タスク</span>
                    <el-badge v-if="taskCount > 0" :value="taskCount" class="badgeItem">
                    </el-badge>
                </span>
            </el-menu-item>
            <el-menu-item index="logout">
                <i class="fas fa-sign-out-alt" style="margin-right: 5px"></i>
                <span slot="title">終了</span>
            </el-menu-item>
        </el-menu>
        <transition name="el-fade-in-linear" >
            <child-component :is="activeTab" ref="childComp"></child-component>
        </transition>
    </div>
</template>

<script>

import tasks from '../components/tasks/tasks_main'

export default {
    components: {
        'tasks': tasks
    },
    name: 'mobile_home',
    data() {
        return {
            activeTab: 'tasks',
            taskCount: 0
        }
    },
    created() {
        this.doRequest('getUsername','').then(result => {
            this.userName = result.username;
            this.$store.commit('SET_USER', result);
        })
        this.updateTaskCount()
    },
    sockets: {
        connect() {
            console.log('connected to notification system');
        },
        disconnect() {
            console.log('disconnected from notification system');
        },
        broadcast(data) {
            /*
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
            */
            //Notification for updated Tasks////////////////////////////////////////
            console.log(data);
            
            if (data.action === 'updateTask' && data.target.includes(this.$store.state.constants.userID)) {
                console.log("catch");
                
                if (this.activeTab !=='tasks' ) {
                    console.log("awesome");
                    
                    //this.snackbarCont = "新しいタスク情報：" + this.$store.state.componentData.karteDetails.patient.name;
                    if (!stopper) {
                      this.$message({message: '新しいタスク', type: 'info'})
                      var stopper = true
                      setTimeout((x) => {
                        stopper = false
                      }, 3000);
                    }
                    this.newTask = true;
                }
                let that = this
                setTimeout(function(){
                    that.updateTaskCount()
                },1000)
            }
            if (data.action === 'updateTask') {
                this.$eventHub.$emit('updateTask',data.data)
            }
        }
    },
    methods: {
        selectTab(tab) {
            this.activeTab = tab
        },
        updateTaskCount: function() {
            this.doRequest('getTaskNumber','').then(result => {
                this.taskCount = result.count
            })
        },
    }
}
</script>

<style>
.main-cont {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: white;
    overflow: hidden
}
.el-menu-vertical:not(.el-menu--collapse) {
    width: 100%;
}
.cctable {
    border-radius: 4px;
    border: 1px solid #dcdfe6
}
.list_item {
    border-top: solid 1px #dcdfe6;
    border-bottom: solid 1px #dcdfe6;
    padding: 15px;
    transition: all .2s ease
}
.list_item:active {
    background-color: #eeeeee
}
.badgeItem {
  display: flex;
  float: right;
  margin-top: 10px;
  margin-right: -20px
}
</style>
