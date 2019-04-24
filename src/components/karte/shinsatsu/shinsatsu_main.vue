<template>
    <div style="display: flex; height: 100%" v-loading="loading">
        <span style="width: 32%" class="contentCard">
            <el-card>
                <div slot="header">
                    <span>患者情報</span>
                </div>
                <patientInfo @loading="handleLoading"></patientInfo>
            </el-card>
        </span>
        <span style="width: 20%" class="contentCard">
            <el-card body-style="padding: 0">
                <div slot="header">
                    <span>診察内容</span>
                </div>
                <soap ref="soap"></soap>
            </el-card>
        </span>
        <span style="width: 28%" class="contentCard">
            <el-card body-style="padding: 0">
                <div slot="header">
                    <span>行為・処方</span>
                </div>
                <kouiList ref="kouiList" @loading="handleLoading"></kouiList>
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
    beforeDestroy() {
        if (!this.karteDone) {
            let kouiData = this.$refs.kouiList.items
            let shinsatsuID = this.$store.state.componentData.home.shinsatsu
            this.doRequest('tempSaveKouiState', {
                kouiString: JSON.stringify(kouiData),
                shinsatsuID: shinsatsuID,
                kouiArray: kouiData
            })
            let soapData = this.$refs.soap.soapContent
            this.doRequest('tempSaveShinsatsuState', {
                shinsatsuString: soapData,
                shinsatsuID: shinsatsuID
            })
        }
    },
    computed:{
        loading() {
            if(this.display.loading.info || this.display.loading.kouiList || this.display.loading.soap) {
                return true
            }
            return false
        }
    },
    data() {
        return {
            display: {
                loading: {
                    info: false,
                    content: false,
                    koui: false
                }
            },
            karteDone: false
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
            this.$refs.kouiList.items.push(item)
        }
    }
}
</script>

<style scoped>
    .contentCard {
        padding: 2px
    }
</style>

