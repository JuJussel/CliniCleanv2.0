<template>
    <div v-loading ="display.loading" style="height: calc(100% - 50px)">
        <el-radio-group v-model="activeTab" size="medium" style="margin-bottom: 10px">
            <el-radio-button label="dashboard">概要</el-radio-button>
            <el-radio-button label="basic">基本データ</el-radio-button>
            <el-radio-button label="social">ソーシャル</el-radio-button>
            <el-radio-button label="history">履歴</el-radio-button>
        </el-radio-group>
        <div class="cont" style="padding-right: 10px">
            <dashboard v-if="!display.loading" :data="patientData" @update="getData()" v-bind:class="{'visible': activeTab === 'dashboard'}" class="tabCont112"></dashboard>
            <basic v-if="!display.loading" :data="patientData" @update="getData()" v-bind:class="{'visible': activeTab === 'basic'}" class="tabCont112"></basic>
            <history v-if="!display.loading" :data="patientData" @update="getData()" v-bind:class="{'visible': activeTab === 'history'}" class="tabCont112"></history>
        </div>
  </div>
</template>

<script>
import basic from '../../patient/patient_details/patient_details_main'
import dashboard from './comps/dashboard'
import history from './comps/history'

export default {
    components: {
        'basic': basic,
        'dashboard': dashboard,
        'history': history
    },
    created() {
        this.getData()
    },
    data() {
        return {
            activeTab: "dashboard",
            display: {
                loading: true
            },
            patientData: {}
        }
    },
    methods: {
        getData() {
            this.loading = true
            let patientID = this.$store.state.componentData.patientDetails.IDselected
            this.doRequest('patientDetailsKarte', {patientID: patientID}).then(result => {
                this.patientData = result.data
                this.display.loading = false
            })
        }
    },
}
</script>

<style scoped>
 .tabCont112 {
     margin-left: -10000px;
     position: absolute;
     height: calc(100% - 65px)!important;
     width: calc(100% - 20px)
 }
 .visible {
     margin-left: 0px
 }
</style>

