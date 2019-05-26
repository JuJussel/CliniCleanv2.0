<template>
    <div class="item">
        <i :class="kouiTypes[item.kouiType].icon" style="width: 25px; flex-shrink: 0; margin-top: 3px"></i>
        {{ item.name }}{{ item.med_name }}
    </div>
</template>
<script>
export default {
    props: [
        'item'
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
.item {
    margin: 10px;
    display: flex
}
</style>
