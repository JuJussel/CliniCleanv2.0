<template>
    <div style="display: flex; height: 100%" v-loading="display.loading">
        <span style="width: 36%; flex-shrink: 0" class="contentCard">
            <el-card bodyStyle="padding: 0; height: 100%" style="height: 100%">
                <patientInfo @dataUpdate="updatePatientData" v-if="!display.loading" :data="detailsData" @loading="handleLoading"></patientInfo>
            </el-card>
        </span>
        <span style="width: 20%" class="contentCard">
            <el-card body-style="padding: 0">
                <div slot="header">
                    <span>診察内容</span>
                </div>
                <soap :soapContent="soapContent" ref="soap"></soap>
            </el-card>
        </span>
        <span style="width: 24%" class="contentCard">
            <el-card body-style="padding: 0">
                <div slot="header">
                    <span>行為・処方</span>
                </div>
                <kouiList :insCombNr="insCombNr" :insSet="insCombNrSet" :kouiItems="kouiListItems" @loading="handleLoading" ref="kouiList"></kouiList>
            </el-card>
        </span>
        <span style="width: 20%; min-width:378px; height: 100%; flex-grow: 0" class="contentCard">
            <el-card bodyStyle="padding: 0; height: 100%" style="height: 100%">
                <koui @loading="handleLoading" @addItem="addKoui"></koui>
            </el-card>
        </span>
    </div>
</template>

<script>

import patientInfo from './patient_info'
import soap from './soap'
import kouiList from './koui_list'
import koui from './koui'
import { log } from 'util';

export default {
    components: {
        'patientInfo': patientInfo,
        'soap': soap,
        'kouiList': kouiList,
        'koui': koui
    },
    created() {
        this.getData()
        this.$eventHub.$on('kartePatientDataUpdate', this.updatePatientData)
    },
    beforeDestroy() {
        this.$eventHub.$off('kartePatientDataUpdate')
        if (!this.karteDone) {
            let shinsatsuID = this.$store.state.componentData.home.shinsatsu
            this.doRequest('tempSaveKouiState', {
                kouiString: JSON.stringify(this.$refs.kouiList.items),
                shinsatsuID: shinsatsuID,
                kouiArray: this.$refs.kouiList.items
            })
            this.doRequest('tempSaveShinsatsuState', {
                shinsatsuString: this.$refs.soap.text,
                shinsatsuID: shinsatsuID
            })
        }
    },
    data() {
        return {
            display: {
                loading: true
            },
            karteDone: false,
            indexNr: 0,
            kouiListItems: [],
            soapContent: "",
            detailsData: {},
            insCombNr: "",
            insCombNrSet: ""
        }
    },
    methods: {
        handleLoading(trans) {
            if (trans.type === 'loading') {
                this.display.loading[trans.el] = true
            } 
            else if (trans.type === 'loadingDone') {
                this.display.loading[trans.el] = false
            }
        },
        addKoui(item) {           
            this.$refs.kouiList.addKoui(item)
        },
        async getData() {
            this.display.loading = true
            let shinsatsuID = this.$store.state.componentData.home.shinsatsu
            let patientID = this.$store.state.componentData.karteDetails.patient.id
            let karteID = this.$store.state.componentData.karteDetails.shinsatsu.karteID
            // Koui State
            await this.doRequest('getKouiState', shinsatsuID).then(result => {
                this.kouiListItems = JSON.parse(result.data)
            })
            // Shinsatsu State
            await this.doRequest('getShinsatsuState', shinsatsuID).then(result => {
              this.soapContent = result.data
            })
            // Patient and General data
            await this.doRequest('patientDetailsKarte', {patientID: patientID, karteID: karteID}).then(result => {
                this.detailsData = result.data
                this.insCombNr = result.insCombNr
                this.insCombNrSet = result.insCombNrSet
            })
            this.display.loading = false
        },
        updatePatientData() {
            this.$message({
                message: 'データ保存しました。',
                type: 'success'
            })
            let patientID = this.$store.state.componentData.karteDetails.patient.id
            let karteID = this.$store.state.componentData.karteDetails.shinsatsu.karteID
            this.doRequest('patientDetailsKarte', {patientID: patientID, karteID: karteID}).then(result => {
                this.detailsData = result.data
            })
        }
    }
}
</script>

<style scoped>
    .contentCard {
        padding: 2px
    }
</style>

