<template>
    <div class="cont" v-loading="loading">
        <el-card style="width: 500px; margin-right: 10px">
            <h3>未済検査</h3>
            <div>
                <el-form size="small">
                    <el-form-item label="検索">
                        <el-input 
                            clearable
                            v-model="searchInput"
                            placeholder="名前又はカルテID"
                            style="width: 200px">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                class="cctable"
                :data="filteredMainList"
                highlight-current-row
                :default-sort = "{prop: 'ID', order: 'descending'}"
                @current-change="selectMain"
                size="mini">
                <el-table-column sortable prop="name" label="患者"></el-table-column>
                <el-table-column sortable prop="ID" label="カルテID"></el-table-column>
                <el-table-column label="項目数">
                    <template slot-scope="scope">
                        {{ scope.row.items.length }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card style="width: 600px">
            <h3>検査結果入力</h3>
            <div v-if="detailsList.length > 0" class="inputCont">
                <kensaInput
                    @insertStart="loading = true"
                    @insertDone="insertDone"
                    :task="task"
                    v-for="task in detailsList"
                    :key="task.ID">
                </kensaInput>
            </div>
        </el-card>
    </div>    
</template>

<script>
import kensaInput from './comps/kensa_input'
export default {
    components: {
        'kensaInput': kensaInput
    },
    created () {
        this.getData()
    },
    data() {
        return {
            mainList: [],
            detailsList: [],
            loading: false,
            searchInput: ""
        }
    },
    computed: {
        filteredMainList() {
            let reg = new RegExp(this.searchInput + ".*")
            return this.mainList.filter(item => item.ID.match(reg) || item.name.match(reg))
        }
    },
    methods: {
        getData() {
            this.loading = true
            this.doRequest('openSRLOrders').then(result => {
                this.mainList = result.data
                this.detailsList = []
                this.loading = false
            })
        },
        selectMain(selection) {
            this.detailsList = selection.items
        },
        insertDone() {
            this.getData()
        }
    }
}
</script>

<style>
    .cont {
        display: flex;
        height: 100%
    }
    .inputCont {
        max-width: 500px;
        border: solid 1px #ebeef5;
        border-radius: 4px;
    }
</style>
