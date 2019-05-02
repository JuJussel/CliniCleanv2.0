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
        </div>
    </div>
</template>

<script>

import info from './comps/patient_info/info'

export default {
    props: [
        'data'
    ],
    components: {
        info
    },
    data() {
        return {
            activeTab: 'info',
            tabs: [
                [
                    {name: '患者情報', id: 'info'},
                    {name: 'カルテ', id: 'karte'},
                    {name: 'バイタル', id: 'vital'},
                    {name: '検査結果', id: 'kensa'},
                    {name: '投薬履歴', id: 'meds'}
                ], 
                [
                    {name: '病名・アレルギー・プロブレム', id: 'byoumei'},
                    {name: '手術', id: 'op'},
                    {name: '処置', id: 'treat'},
                    {name: 'ファイル', id: 'file'},
                    {name: '定期処方', id: 'tei'}
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
