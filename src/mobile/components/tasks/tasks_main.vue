<template>
    <div :v-loading="loading" class="stepper" v-bind:style="{width: width*3 + 'px', 'margin-left': '-' + width * step + 'px'}">
        <div v-bind:style="{width: width + 'px'}">
            <div v-if="tasks.my.length < 1 && tasks.open.length < 1" style="padding: 20px">
                タスクなし
            </div>
            <div v-if="tasks.open.length > 0">
                <el-divider content-position="left">オーペンタスク</el-divider>
                <div>
                    <div v-for="pat in tasks.open" :key="pat.ID" class="list_item" @click="takeTask(scope.row)">
                        <span>{{ pat.name }}</span>
                        <span style="float: right"><i class="fas fa-chevron-right"></i></span>
                    </div>
                </div>
            </div>
            <div v-if="tasks.my.length > 0">
                <el-divider content-position="left">マイタスク</el-divider>
                <div>
                    <div v-for="pat in tasks.my" :key="pat.ID" class="list_item" @click="showTasks(pat)">
                        <span>{{ pat.name }}</span>
                        <span style="float: right"><i class="fas fa-chevron-right"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div v-bind:style="{width: width + 'px'}">
            <div class="list_item" @click="--step"><i class="fas fa-chevron-left"></i>　戻る</div>
            <el-divider content-position="left"> {{ patName }}のタスク</el-divider>
            <div v-for="task in tasks.list" :key="task.ID" class="list_item" @click="openTask(task)" v-loading="detailsLoading">
                <span>{{ task.name }}</span>
                <span style="float: right"><i class="fas fa-chevron-right"></i></span>
            </div>
        </div>
        <div v-bind:style="{width: width + 'px'}" v-if="step == 2">
            <div class="list_item" @click="--step"><i class="fas fa-chevron-left"></i>　戻る</div>
            <el-divider content-position="left"> {{ patName }}のタスク詳細</el-divider>
            <taskView ref="taskView" @done="closeTask" @showSRL="showSRLCard" :task="task" v-for="task in tasks.details" :key="task.ID"></taskView>
        </div>
        <!--
        <el-card class="card" :body-style="{height: 'calc(100% - 100px)'}" v-loading="detailsLoading">
            <div slot="header">
                <span>タスク詳細</span>
            </div>
            <div v-if="type === 1">
                <el-table :data="specs" class="cctable">
                    <el-table-column prop="name" label="検体物"></el-table-column>
                    <el-table-column prop="amount" label="検体量(ml)"></el-table-column>
                    <el-table-column prop="cont" label="容器"></el-table-column>
                </el-table>
            </div>
            <div style="margin-top: -65px; float: right" v-if="type == '95'" @click="saveKKSD">
                <el-button type="primary">保存</el-button>
            </div>
            <div v-if="tasks.details.length > 0" class="content">
                <taskView ref="taskView" @done="closeTask" @showSRL="showSRLCard" :task="task" v-for="task in tasks.details" :key="task.ID"></taskView>
            </div>
        </el-card>
        -->
    </div>
</template>

<script>

import taskView from './task_view_mobile'

export default {
    components: {
        'taskView': taskView
    },
    created() {
        this.taskUpdate()        
    },
    methods: {
        taskUpdate() {
            this.loading = true
            this.doRequest('getTasks').then(result => {
                this.tasks.my = result.data.my
                this.tasks.open = result.data.open
                this.tasks.details = {}
                this.loading = false
            })
        }
    },
    data() {
        return {
            type: "",
            showSRL: false,
            srlLink: "",
            loading: true,
            detailsLoading: false,
            loading: false,
            tasks: {
                open: [],
                my: [],
                list: [],
                details: {}
            },
            step: 0,
            width: window.innerWidth,
            patName: ""
        }
    },
    methods: {
        closeTask(ID){
            this.tasks.details = this.tasks.details.filter(item => item.ID !== ID)
            this.taskUpdate
            if (this.tasks.details.length < 1) {
                this.step = 0
            }
        },
        taskUpdate() {
            this.loading = true
            this.doRequest('getTasks').then(result => {
                this.tasks.my = result.data.my
                this.tasks.open = result.data.open
                this.tasks.details = {}
                this.loading = false
            })
        },
        takeTask(task) {
            this.loading = true
            this.doRequest('assignTask',{taskID: task.ID, type: task.type}).then(result => {
                this.taskUpdate()
            })
        },
        showTasks(pat) {
            this.step = 1
            this.patName = pat.name
            this.tasks.list = pat.children
        },
        openTask(task) {
            this.showSRL = false
            this.detailsLoading = true,
            this.doRequest('getTaskDetails',{
                type: task.type,
                patientID: task.patientID
            }).then(result => {
                this.type = task.type
                this.tasks.details = result.data
                this.detailsLoading = false
                this.step = 2
            })
        },
        showSRLCard(link) {
            this.srlLink = "https://test-guide.srl.info/hachioji/test/detail/" + link
            this.showSRL = true
        },
        saveKKSD() {
            this.$refs['taskView'][0].$refs['form'].validate((valid) => {
                if (valid) {
                    let kssd = this.tasks.details[0].kksdData
                    let orderID = this.tasks.details[0].ID
                    this.doRequest('updateKenkoushindan', {kssdData: kssd, mode: "commit", orderID: orderID}).then( result => {
                        this.taskUpdate
                    })
                }
            })
        }
    },
    sockets: {
        broadcast(data) {
            //Notification for updated Tasks////////////////////////////////////////
            let that = this
            setTimeout(function() {
               if (data.action === 'updateTask') {
                that.taskUpdate();
            }
            if (data.action === 'assignTask') {
                that.taskUpdate();
            } 
            },1000)
        }
    }
}
</script>

<style>
.top-flex {
    display: flex;
    width: 100%;
}
.stepper {
    display: flex;
    transition: all .25s ease
}
</style>