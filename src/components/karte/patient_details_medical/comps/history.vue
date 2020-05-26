<template>
    <div style="display: flex">
        <div style="width: 50%; flex: 1 0 auto; padding-right: 5px">
            <el-card body-style="height: calc(100% - 40px); padding: 0" style="height: 100%">
                <div>
                    <div v-for="(row, index) in tabs" :key="index" class="tab-header">
                        <div
                            v-for="(tab) in row"
                            @click="changeTab(tab.id)"
                            :key="tab.id" 
                            class="tab" 
                            v-bind:class="{'tab-active': activeTab === tab.id}"
                            >
                            <i :class="tab.icon" style="margin-right: 5px"></i>
                            <span>{{ tab.name }} </span>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px; padding:10px; height: calc(100% - 65px); overflow: auto">
                    <vital v-if="activeTab === 'vital'" :data="data.vital"></vital>
                    <kensa v-if="activeTab === 'kensa'" :data="data.kensa"></kensa>
                    <meds v-if="activeTab === 'shohou'" :data="{meds: data.shohou, shots: data.shot}"></meds>
                    <prevVac v-if="activeTab === 'prevVac'" :data="data.prevVac"></prevVac>
                    <op v-if="activeTab === 'oper'" :data="{treat: data.treat, oper: data.oper}"></op>
                    <teiki v-if="activeTab === 'teikiShohou'" :data="data.teikiShohou"></teiki>
                    <files v-if="activeTab === 'files'" :data="data.files"></files>
                    <byoumei v-if="activeTab === 'byoumei'" :data="data.byoumei"></byoumei>
                    <apro v-if="activeTab === 'allergy'" :data="{allergy: data.allergy, problem: data.problem}"></apro>
                    <karte v-if="activeTab === 'kartes'" :data="data.kartes" @select="karteSelect"  ref="karte" ></karte>
                    <shindan v-if="activeTab === 'kenkoushindan'" :data="data.kenkoushindan" @select="shindanSelect" ref="shindan"></shindan>
                </div>
            </el-card>
        </div>
        <div style="width: calc(50% - 10px); flex: 1 0 auto; padding-left: 5px;">
            <el-card :body-style="{height: '100%', padding: 0}" style="height: 100%">
                <el-tabs @tab-remove="tabClose" v-model="activeTabVar" style="height: 100%; position: relative" type="border-card" class="dumy11">
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
						style="height: 100%">
						<karteDisplay v-if="item.type === 'karte'" :data="item"></karteDisplay>
                    </el-tab-pane>
                    <el-tab-pane
						v-for="(item) in varTabs.shindan"
						:key="item.name"
						:label="item.title"
						:name="item.name"
						:closable="true"
						style="height: 100%; overflow: auto">
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
            tabs: [
                [
                    {name: 'カルテ', id: 'kartes', icon: 'fas fa-notes-medical'},
                    {name: '健康診断', id: 'kenkoushindan', icon: 'fas fa-file-medical-alt'},
                    {name: 'バイタル', id: 'vital', icon: 'fas fa-chart-line'},
                    {name: '病名', id: 'byoumei', icon: 'far fa-sad-tear'},
                    {name: 'アレルギー・プロブレム', id: 'allergy', icon: 'fas fa-allergies'}
                ], 
                [
                    {name: '検査結果', id: 'kensa', icon: 'fas fa-microscope'},
                    {name: '投薬履歴', id: 'shohou', icon: 'fas fa-capsules'},
                    {name: '予防接種', id: 'prevVac', icon: 'fas fa-syringe'},
                    {name: '手術・処置', id: 'oper', icon: 'fas fa-procedures'},
                    {name: 'ファイル', id: 'files', icon: 'fas fa-paperclip'},
                    {name: '定期', id: 'teikiShohou', icon: 'fas fa-redo-alt'}
                ]                
            ]
        }
    },
    methods: {
        changeTab(type) {
            this.activeTab = type
        },
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
    .tab-header {
        display: flex;
        border-top: solid 1px #ebeef5
    }
    .tab-header:last-child {
        border-top: none
    }
    .tab {
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
        padding: 5px;
        flex-grow: 1; cursor: pointer;
        transition: all .2s ease;
        font-size: 14px
    }
    .tab:first-child {
        border-left: solid 1px #ebeef5
    }
    .tab:hover {
        background-color: #e0f2f1;
    }
    .tab-active {
        color: #00A48F;
    }
    .tab-body {
        margin: 10px
    }
</style>
