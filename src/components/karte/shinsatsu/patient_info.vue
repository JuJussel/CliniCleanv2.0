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
                    {{ tab.name }} 
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
        byoumei
    },
    data() {
        return {
            activeTab: 'info',
            tabs: [
                [
                    {name: '患者情報', id: 'info'},
                    {name: 'カルテ', id: 'karte'},
                    {name: 'バイタル', id: 'vital'},
                    {name: '病名', id: 'byoumei'},
                    {name: 'アレルギー・プロブレム', id: 'alpr'},
                    {name: '検査結果', id: 'kensa'},
                ], 
                [
                    {name: '投薬履歴', id: 'meds'},
                    {name: '予防接種', id: 'prevVac'},
                    {name: '手術・処置', id: 'op'},
                    {name: 'ファイル', id: 'files'},
                    {name: '定期', id: 'teiki'}
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
