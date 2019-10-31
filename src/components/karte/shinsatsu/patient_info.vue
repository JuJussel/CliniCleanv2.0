<template>
    <div style="height: 100%">
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
            <info v-if="activeTab === 'info'" :data="data"></info>
            <vital v-if="activeTab === 'vital'" :data="data.vital"></vital>
            <kensa v-if="activeTab === 'kensa'" :data="data.kensa"></kensa>
            <meds v-if="activeTab === 'meds'" :data="{meds: data.shohou, shots: data.shot}"></meds>
            <prevVac v-if="activeTab === 'prevVac'" :data="data.prevVac"></prevVac>
            <op v-if="activeTab === 'op'" :data="{treat: data.treat, oper: data.oper}"></op>
            <teiki v-if="activeTab === 'teiki'" :data="data.teikiShohou"></teiki>
            <files v-if="activeTab === 'files'" :data="data.files"></files>
            <byoumei v-if="activeTab === 'byoumei'" :data="data.byoumei"></byoumei>
            <apro v-if="activeTab === 'apro'" :data="{allergy: data.allergy, problem: data.problem}"></apro>
            <karte v-if="activeTab === 'karte'" :data="data.kartes"></karte>
            <shindan v-if="activeTab === 'shindan'" :data="data.kenkoushindan"></shindan>
        </div>
    </div>
</template>

<script>

import info from './comps/patient_info/info'
import vital from './comps/patient_info/vital'
import kensa from './comps/patient_info/kensa'
import meds from './comps/patient_info/meds'
import prevVac from './comps/patient_info/prevVac'
import byoumei from './comps/patient_info/byoumei'
import op from './comps/patient_info/op'
import files from './comps/patient_info/files'
import teiki from './comps/patient_info/teiki'
import apro from './comps/patient_info/apro'
import karte from './comps/patient_info/karte'
import shindan from './comps/patient_info/kenkoushindan'

export default {
    props: [
        'data'
    ],
    components: {
        info,
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
        shindan
    },
    data() {
        return {
            activeTab: 'info',
            tabs: [
                [
                    {name: '患者情報', id: 'info', icon: 'fas fa-info'},
                    {name: 'カルテ', id: 'karte', icon: 'fas fa-notes-medical'},
                    {name: '健康診断', id: 'shindan', icon: 'fas fa-file-medical-alt'},
                    {name: 'バイタル', id: 'vital', icon: 'fas fa-chart-line'},
                    {name: '病名', id: 'byoumei', icon: 'far fa-sad-tear'},
                    {name: 'アレルギー・プロブレム', id: 'apro', icon: 'fas fa-allergies'}
                ], 
                [
                    {name: '検査結果', id: 'kensa', icon: 'fas fa-microscope'},
                    {name: '投薬履歴', id: 'meds', icon: 'fas fa-capsules'},
                    {name: '予防接種', id: 'prevVac', icon: 'fas fa-syringe'},
                    {name: '手術・処置', id: 'op', icon: 'fas fa-procedures'},
                    {name: 'ファイル', id: 'files', icon: 'fas fa-paperclip'},
                    {name: '定期', id: 'teiki', icon: 'fas fa-redo-alt'}
                ]                
            ]
        }
    },
    methods: {
        changeTab(type) {
            this.activeTab = type
        }
    }
}
</script>

<style scoped>
.tab-header {
    display: flex;
}
.tab {
    border-right: solid 1px #ebeef5;
    border-bottom: solid 1px #ebeef5;
    padding: 5px;
    flex-grow: 1; cursor: pointer;
    transition: all .2s ease;
    font-size: 14px
}
.tab:last-child {
    border-right: none
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
