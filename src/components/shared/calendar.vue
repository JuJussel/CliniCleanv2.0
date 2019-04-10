<template>
    <div>
        <div style="margin-bottom: -20px; display: flex; justify-content: flex-end">
            <el-button-group style="margin-right: 10px">
                <el-button @click="changeDate('prev')" size="medium" icon="el-icon-arrow-left">前</el-button>
                <el-button @click="changeDate('today')" size="medium">今日</el-button>
                <el-button @click="changeDate('next')" size="medium">次<i class="el-icon-arrow-right el-icon-right"></i></el-button>
            </el-button-group>
            <el-radio-group v-model="view" size="medium">
                <el-radio-button label="agendaDay">日</el-radio-button>
                <el-radio-button label="agendaWeek">週</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
        </div>
        <full-calendar ref='calendar' :config="config"></full-calendar>
    </div>

</template>

<script>
export default {
    props: [
        'config',
        'baseView'
    ],
    created() {
        this.$refs.calendar.fireMethod('changeView', this.baseView)
    },
    data() {
        return {
            view: ""
        }
    },
    methods: {
        changeDate(mode) {
            this.$refs.calendar.fireMethod(mode)
        }
    },
    watch: {
        view() {
            this.$refs.calendar.fireMethod('changeView', this.view)
        }
    }
}
</script>

<style>

</style>
