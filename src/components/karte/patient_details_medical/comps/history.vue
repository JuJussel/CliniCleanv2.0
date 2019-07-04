<template>
    <div style="display: flex">
        <div style="width: 50%; flex: 1 0 auto; padding-right: 5px">
            <el-card body-style="height: calc(100% - 40px)" style="height: 100%">
                <el-tabs type="card" style="height: 100%" class="dumy11" v-model="activeTab">
                    <el-tab-pane name="kartes" label="カルテ" style="height: 100%">
                        <karte v-if="activeTab === 'kartes'" ref="karte" :data="data.kartes" @select="karteSelect"></karte>
                    </el-tab-pane>
                    <el-tab-pane name="kenkoushindan" label="健康診断" style="height: 100%">
                        <shindan v-if="activeTab === 'kenkoushindan'" ref="shindan" :data="data.kenkoushindan" @select="shindanSelect"></shindan>
                    </el-tab-pane>
                    <el-tab-pane name="vital" label="バイタル" style="height: 100%">
                        <vital :data="data.vital"></vital>
                    </el-tab-pane>
                    <el-tab-pane name="kensa" label="検査" style="height: 100%">
                        <kensa v-if="activeTab === 'kensa'" :data="data.kensa"></kensa>
                    </el-tab-pane>
                    <el-tab-pane name="shohou" label="処方" style="height: 100%">
                        <meds v-if="activeTab === 'shohou'" :data="{meds: data.shohou, shots: data.shot}"></meds>
                    </el-tab-pane>
                    <el-tab-pane name="prevVac" label="予防接種" style="height: 100%">
                        <prevVac v-if="activeTab === 'prevVac'" :data="data.prevVac"></prevVac>
                    </el-tab-pane>
                    <el-tab-pane name="oper" label="処置" style="height: 100%">
                        <op v-if="activeTab === 'oper'" :data="{treat: data.treat, oper: data.oper}"></op>
                    </el-tab-pane>
                    <el-tab-pane name="teikiShohou" label="定期" style="height: 100%">
                        <teiki v-if="activeTab === 'teikiShohou'" :data="data.teikiShohou"></teiki>
                    </el-tab-pane>
                    <el-tab-pane name="byoumei" label="病名" style="height: 100%">
                        <byoumei v-if="activeTab === 'byoumei'" :data="data.byoumei"></byoumei>
                    </el-tab-pane>
                    <el-tab-pane name="allergy" label="アレルギー・プロブレム" style="height: 100%">
                        <apro v-if="activeTab === 'allergy'" :data="{allergy: data.allergy, problem: data.problem}"></apro>
                    </el-tab-pane>
                    <el-tab-pane name="files" label="ファイル" style="height: 100%">
                        <files v-if="activeTab === 'files'" :data="data.files"></files>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
        <div style="width: calc(50% - 10px); flex: 1 0 auto; padding-left: 5px;">
            <el-card :body-style="{height: 'calc(100% - 40px)'}" style="height: 100%">
                <el-tabs @tab-remove="tabClose" v-model="activeTabVar" style="height: 100%; position: relative" type="card" class="dumy11">
                    <el-tab-pane
                        label="データ"
                        name="dataExplorer"
                        :closable="false"
                        style="height: 100%">
						<dataExplorer @kensaSelectChange="kensaSelectChange" :varChartsSelectPre="varChartsSelect" :dataSet="data" v-if="data"></dataExplorer>
                    </el-tab-pane>
					<el-tab-pane
						v-for="(item) in varTabs.karte"
						:key="item.name"
						:label="item.title"
						:name="item.name"
						:closable="true"
						style="height: 100%"
					>
						<karteDisplay v-if="item.type === 'karte'" :data="item"></karteDisplay>
                    </el-tab-pane>
                    <el-tab-pane
						v-for="(item) in varTabs.shindan"
						:key="item.name"
						:label="item.title"
						:name="item.name"
						:closable="true"
						style="height: 100%; overflow: auto"
					>
						<kksd v-if="item.type === 'shindan'" :data="item"></kksd>
                    </el-tab-pane>
				</el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script>
import vital from './patient_info/vital'
import kensa from './patient_info/kensa'
import meds from './patient_info/meds'
import prevVac from './patient_info/prevVac'
import byoumei from './patient_info/byoumei'
import op from './patient_info/op'
import files from './patient_info/files'
import teiki from './patient_info/teiki'
import apro from './patient_info/apro'
import karte from './patient_info/karte'
import shindan from './patient_info/kenkoushindan'
import karteDisplay from '../../../shared/karteDisplay'
import kksd from '../../../shared/kenkoushindanDisplay'
import dataExplorer from'./patient_info/dataExplorer'

export default {
    props: [
        'data'
    ],
    components: {
        vital,
        kensa,
        meds,
        prevVac,
        op,
        teiki,
        files,
        byoumei,
        apro,
        karte,
        shindan,
        karteDisplay,
        kksd,
        dataExplorer
    },
    data() {
        return {
            activeTab: "kartes",
            activeTabVar: "dataExplorer",
            varTabs: {
                karte: [],
                shindan: []
            },
            varChartsSelect: [],
        }
    },
    methods: {
        karteSelect(el) {
            if (el.mode === 'add') {
                el.data.type = 'karte'
                el.data.title = 'カルテ' + el.data.meta.date
                el.data.name = 'karte?' + el.data.meta.ID
                this.varTabs.karte.push(el.data)
                this.activeTabVar = el.data.name
            } else {
                this.varTabs.karte = this.varTabs.karte.filter( tab => tab.meta.ID != el.data)
                this.activeTabVar = "dataExplorer"
            }
        },
        tabClose(el) {
            let strings = el.split('?')
            if (strings[0] === 'karte') {
                this.$refs.karte.removeTabIndr(strings[1])
            } else if (strings[0] === 'shindan') {
                this.$refs.shindan.removeTabIndr(strings[1])
            }
        },
        shindanSelect(el) {
            if (el.mode === 'add') {
                el.data.type = 'shindan'
                el.data.title = '健康診断' + el.data.meta.date
                el.data.name = 'shindan?' + el.data.meta.ID
                this.varTabs.shindan.push(el.data)
                this.activeTabVar = el.data.name
            } else {
                this.varTabs.shindan = this.varTabs.shindan.filter( tab => tab.meta.ID != el.data)
                this.activeTabVar = "dataExplorer"
            }
        },
        kensaSelectChange() {

        },
    }
}
</script>

<style>
    .dumy11 .el-tabs__content {
        height: calc(100% - 55px)
    }
</style>
