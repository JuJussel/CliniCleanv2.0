<template>
    <div style="display: flex" v-loading="loading">
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
                <soap></soap>
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
        <span style="width: 20%" class="contentCard">
            <el-card>
                <div slot="header">
                    <span>診療行為</span>
                </div>
                <koui @loading="handleLoading"></koui>
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
            this.doRequest('tempSaveKouiState', {
                kouiString: JSON.stringify(kouiData),
                shinsatsuID: this.$store.state.componentData.home.shinsatsu,
                kouiArray: kouiData
            })
        }
    },
    computed:{
        loading() {
            if(this.display.loading.info || this.display.loading.content || this.display.loading.koui) {
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
        }
    }
}
</script>

<style scoped>
    .contentCard {
        padding: 2px
    }
</style>

