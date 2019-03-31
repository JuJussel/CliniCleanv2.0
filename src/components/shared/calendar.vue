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
        <full-calendar ref='calendar' :config="calConfig"></full-calendar>
    </div>

</template>

<script>
export default {
    data() {
        return {
            calConfig: {
                header: "false",
                firstDay: 1,
                displayEventTime: false,
                fixedWeekCount: false,
                navLinks: true,
                height: "auto",
                minTime: "09:00:00",
                maxTime: "20:00:00",
                defaultView: "month",
                allDaySlot: false,
                editable: false,
                locale: 'ja',
                businessHours: [
                    {dow: [ 1, 2, 3, 4, 5 ], start: '09:00', end: '12:00'},
                    {dow: [ 1, 2, 3, 5 ], start: '16:00', end: '20:00'},
                    {dow: [6], start: '09:00', end: '12:00'}
                ],
                events: this.$store.state.constants.apiUrl + "/api/get/patient/getReceptionHistory.php?session_id=" + (sessionStorage.getItem("session_id")==null?"":sessionStorage.getItem("session_id"))
            },
            view: 'month'
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
