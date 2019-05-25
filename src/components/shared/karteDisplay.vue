<template>
    <div class="mainCont">
        <div class="section">
            <div>
                <h4>診察内容</h4>
            </div>
            <div v-html="data.soap">
            </div>
        </div>
        <div class="section">
            <div v-if="data.koui.length > 0"><h4>行為</h4></div>
            <div class="itemsContainer">
                <div v-for="(koui) in data.koui" :key="koui.ID" class="kouiItem">
                    <div>
                        <i :class="kouiTypes[koui.koui_cat].icon" style="width: 30px"></i>
                    </div>
                    <div>
                        <div style="color: #606266; display: flex; align-items: center">
                            <span> {{ kouiTypes[koui.koui_cat].title }}　</span>
                            <span class="titleSpan">{{ koui.kouiName }}</span>
                        </div>
                        <div>
                           <b class="titleSpan">{{ koui.medName }} {{ koui.measureName }} {{ koui.prevVacName }}</b> 
                        </div>
                        <div v-if="koui.koui_cat === '30'">
                            接種量： {{ koui.sub_1 }} ml　
                            位置： {{ koui.sub_3 }}　<br>
                            LotNo：{{ koui.sub_2 }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="data.shohou.length > 0"><h4>処方</h4></div>
            <div class="itemsContainer">
                <div v-for="(shohou) in data.shohou" :key="shohou.ID" class="kouiItem">
                    <div>
                        <i class="fas fa-capsules" style="width: 30px"></i>
                    </div>
                    <div>
                        <div style="color: #606266; display: flex; align-items: center">
                            <b class="titleSpan">{{ shohou.med_name }}</b>
                        </div>
                        <div>
                            {{ shohou.med_med_val }} {{ shohou.med_med_unit }}<br>
                            {{ shohou.med_timing }}　{{ shohou.med_times }} {{ shohou.med_times_unit }}分
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'data'
    ],
    data() {
        return {
            kouiTypes: {
                'sh': {title: '処方', icon: 'fas fa-capsules'},
                '30': {title:'注射', icon: 'fas fa-syringe'},
                '60': {title:'検査', icon: 'fas fa-microscope'},
                '71': {title:'健康診断', icon: 'fas fa-file-medical-alt'},
                '30_prev': {title:'予防接種', icon: 'fas fa-syringe'},
                '40': {title:'手術', icon: 'fas fa-procedures'},
                '50': {title:'処置', icon: 'fas fa-band-aid'}
            }
        }
    }
}
</script>

<style scoped>
.mainCont {
    display: flex;
    justify-content: space-between;
    margin-top: -20px;
    max-width: 100%;
}
.section {
    width: 49%;
    overflow: hidden;
    word-break: break-all;
    flex-shrink: 0
}
.kouiItem {
    border-bottom: solid 1px #ebeef5;
    padding: 5px;
    display: flex
}
.itemsContainer {
    border: solid 1px #ebeef5;
    border-radius: 4px;
}
</style>
