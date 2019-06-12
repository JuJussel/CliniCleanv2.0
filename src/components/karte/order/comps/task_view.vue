<template>
    <div class="mainBorder">
        <!-- SRL --->
        <div v-if="task.type === '1'" class="wrapper">
            <div style="width: 220px">
                <div>
                    <b> {{ task.title }} </b>
                </div>
                <div>
                    <span>検体量(ml)：</span>
                    <span> {{ task.specName }} </span>
                    <span> {{ task.srlData.specimen_amount }} </span>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; width: 100px; font-size: 14px">
                <div>容器</div>
                <div>
                    <span> {{ task.srlData.container_1 }} </span>
                    <span v-if="task.srlData.container_1_b !== '0'">→ {{ task.srlData.container_1_b }} </span>
                    <span v-if="task.srlData.container_2 !== '0'">→ {{ task.srlData.container_2 }} </span>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center">
                <div style="margin-bottom: 5px">
                    <el-button @click="showSRL" size="mini"><i class="fas fa-info-circle"></i></el-button>
                </div>
                <div>
                    <el-button @click="submitTask" size="mini" type="primary">済</el-button>
                </div>
            </div>
        </div>
        <!-- SRL End -->
            <div>
                <el-button type="text" style="padding: 0"><i class="far fa-comment-alt"></i></el-button>
                {{ task.order_comment }}
            </div>
            <div v-if="addComment">
                <el-form label-width="80" size="mini">
                    <el-form-item label="コメント">
                        <el-input style="max-width: 300px" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>

    </div>
</template>

<script>
export default {
    props: [
        'task'
    ],
    data() {
        return {
            addComment: false
        }
    },
    methods: {
        showSRL() {
            this.$emit('showSRL', this.task.sub_3)
        },
        submitTask() {
            if (task.sub_task === "0") {
                if (task.type === "2") {
                task.sub_1.forEach(result => {
                    if (result.value === "") {
                        result.valid = false;
                        validated = false;
                        }
                    });
                }
                if (task.type === "3" || task.type === "4") {
                    if (this.submitData.lot === "" && task.sub_2 === null) {
                        task.valid.lot = false;
                        validated = false;
                    }
                    if (this.submitData.amt === "" && task.sub_1 === null) {
                        task.valid.amt = false;
                        validated = false;
                    }
                }
            }

            this.doRequest('updateTask' , this.task).then(function() {

            })
        }
    }
}
</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: space-between
}
.mainBorder {
    border-bottom: solid 1px #ebeef5;
    padding: 10px;
}
</style>
