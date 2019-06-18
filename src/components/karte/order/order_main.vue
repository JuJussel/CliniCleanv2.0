<template>
    <div style="display: flex; height: 100%">
        <el-card class="card" style="width: 300px" v-loading="loading">
            <div slot="header">
                <span>オープンタスク</span>
            </div>
            <div>
                <el-table :data="tasks.open" row-key="ID" :show-header="false" default-expand-all size="mini" class="cctable">
                    <el-table-column prop="name"></el-table-column>
                    <el-table-column width="80">
                        <template slot-scope="scope">
                            <el-button @click="takeTask(scope.row)" v-if="!scope.row.children" size="mini">開始</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card class="card" style="width: 350px" v-loading="loading">
            <div slot="header">
                <span>マイタスク・患者</span>
            </div>
            <div>
                <el-table :data="tasks.my" row-key="ID" :show-header="false" size="mini" class="cctable">
                    <el-table-column prop="name"></el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <span v-if="scope.row.size">
                                <span>タスク数：</span>
                                <b> {{ scope.row.size }} </b>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template slot-scope="scope">
                            <el-button @click="openTask(scope.row)" v-if="!scope.row.children" size="mini">詳細</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card class="card" style="width: 500px" :body-style="{height: 'calc(100% - 100px)'}" v-loading="detailsLoading">
            <div slot="header">
                <span>タスク詳細</span>
            </div>
            <div v-if="type === 1">
                <el-table :data="specs" class="cctable" size="mini">
                    <el-table-column prop="name" label="検体物"></el-table-column>
                    <el-table-column prop="amount" label="検体量(ml)"></el-table-column>
                    <el-table-column prop="cont" label="容器"></el-table-column>
                </el-table>
            </div>
            <div v-if="tasks.details.length > 0" class="content">
                <taskView @done="closeTask" @showSRL="showSRLCard" :task="task" v-for="task in tasks.details" :key="task.ID"></taskView>
            </div>
        </el-card>
        <el-card v-if="showSRL" style="flex: 1" :body-style="{height: '100%', width: '100%'}" class="card">
            <iframe :src="srlLink" style="width: calc(100% - 50px); height: calc(100% - 50px); border: none"></iframe>
        </el-card>
    </div>
</template>

<script>
import taskView from './comps/task_view'

export default {
    components: {
        'taskView': taskView
    },
    created() {
        this.taskUpdate()
    },
    computed: {
        specs() {            
            if (this.type === 1) {                
                let result = {}
                this.tasks.details.forEach(element => {
                    if (result[element.sub_2]) {
                        if (isNaN(element.srlData.specimen_amount)) {
                            result[element.sub_2].amount++
                        } else {
                            result[element.sub_2].amount = result[element.sub_2].amount + parseFloat(element.srlData.specimen_amount)
                        }
                    } else {
                        if (isNaN(element.srlData.specimen_amount)) {
                            result[element.sub_2] = {
                                name: element.specName + " " + element.srlData.specimen_amount,
                                amount: 1,
                                code: element.sub_2,
                                cont: element.srlData.container_1
                            }
                        } else {
                            result[element.sub_2] = {
                                name: element.specName,
                                amount: parseFloat(element.srlData.specimen_amount),
                                code: element.sub_2,
                                cont: element.srlData.container_1
                            }
                        }
                        
                    }
                })
                return Object.values(result)                
            } else {
                return []
            }
        }
    },
    data() {
        return {
            type: "",
            showSRL: false,
            srlLink: "",
            loading: true,
            detailsLoading: false,
            tasks: {
                my: [],
                open: [],
                details: []
            }
        }
    },
    methods: {
        closeTask(ID){
            this.tasks.details = this.tasks.details.filter(item => item.ID !== ID)
            this.taskUpdate
        },
        taskUpdate() {
            this.loading = true
            this.doRequest('getTasks').then(result => {
                this.tasks.my = result.data.my
                this.tasks.open = result.data.open
                this.loading = false
            })
        },
        takeTask(task) {
            this.loading = true
            this.doRequest('assignTask',{taskID: task.ID, type: task.type}).then(result => {
                this.taskUpdate()
            })
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
            })
        },
        showSRLCard(link) {
            this.srlLink = "https://test-guide.srl.info/hachioji/test/detail/" + link
            this.showSRL = true
        },
    },
    sockets: {
        broadcast(data) {
            //Notification for updated Tasks////////////////////////////////////////
            if (data.action === 'updateTask') {
                this.taskUpdate();
            }
            if (data.action === 'assignTask') {
                this.taskUpdate();
            }
        }
    }
}
</script>

<style>
.card {
    margin: 5px;
}
</style>

<style scoped>
.content {
    margin-top: 30px;
    border: solid 1px #ebeef5;
    border-radius: 4px;
    height: calc(100% - 110px);
    overflow: auto;
}
</style>

