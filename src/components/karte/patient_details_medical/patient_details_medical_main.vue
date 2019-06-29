<template>
    <div v-loading ="display.loading" style="height: calc(100% - 50px)">
        <el-radio-group v-model="activeTab" size="medium" style="margin-bottom: 10px">
            <el-radio-button label="dashboard">概要</el-radio-button>
            <el-radio-button label="basic">基本データ</el-radio-button>
            <el-radio-button label="social">ソーシャル</el-radio-button>
            <el-radio-button label="history">履歴</el-radio-button>
        </el-radio-group>
        <div class="cont">
            <child-component v-if="!display.loading" :is="activeTab" :data="patientData" @update="getData()" style="width: 100%"></child-component>
        </div>
  </div>
</template>

<script>
import basic from '../../patient/patient_details/patient_details_main'
import dashboard from './comps/dashboard'

export default {
    components: {
        'basic': basic,
        'dashboard': dashboard
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

<style>

</style>

