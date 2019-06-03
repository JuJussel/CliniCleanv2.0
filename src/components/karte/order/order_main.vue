<template>
    <div style="display: flex; height: 100%">
        <el-card class="card" style="width: 400px" v-loading="loading">
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
        <el-card class="card" style="width: 400px" v-loading="loading">
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
        <el-card class="card" style="width: 600px" v-loading="detailsLoading">
            <div slot="header">
                <span>タスク詳細</span>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.taskUpdate()
    },
    data() {
        return {
            loading: true,
            detailsLoading: false,
            tasks: {
                my: [],
                open: []
            }
        }
    },
    methods: {
        taskUpdate() {
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
            this.detailsLoading = true,
            this.doRequest('getTaskDetails',{
                type: task.type,
                patientID: task.patientID
            }).then(result => {
                this.detailsLoading = false
            })
        }
    },
    sockets: {
        broadcast(data) {
            //Notification for updated Tasks////////////////////////////////////////
            if (data.action === 'updateTask') {
                this.showSpinner = true;
                this.taskUpdate();
                this.taskData = [];
                if (this.activeTask.index) {
                this.selectPatientTasks(this.activeTask.index, this.activeTask.patientID);
                }
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
