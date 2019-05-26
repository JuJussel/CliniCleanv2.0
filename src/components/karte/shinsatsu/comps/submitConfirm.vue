<template>
    <div>
        <div>診察終了しますか？</div>
            <div v-for="koui in kouiNotDone" :key="koui.ID" style="display: flex; align-items: center; margin: 5px 0">
            <el-checkbox v-model="koui.waitForMe">
                <kouiItemDisplay :item="koui"></kouiItemDisplay>
            </el-checkbox>
        </div>
        <div style="margin-top: 10px; display: flex; justify-content: flex-end">
            <el-button @click="close" style="margin-right: 5px" type="text">キャンセル</el-button>
            <el-button @click="submit" type="primary">確認</el-button>
        </div>
    </div>
</template>

<script>

import kouiItemDisplay from './kouiItemDisplay'

export default {
    props: [
        'koui'
    ],
    components: {
        'kouiItemDisplay': kouiItemDisplay
    },
    computed: {
        kouiNotDone() {
            return this.kouiCopy.filter(item => !item.done)
        }
    },
    data() {
        return {
            kouiCopy: JSON.parse(JSON.stringify(this.koui))
        }
    },
    methods: {
        submit() {
            let waitItems = []
            if (this.addOrderTimer) {
               let waitItemsFull = this.orderKoui.filter(item => item.waitForMe)
               waitItemsFull.forEach(element => {
                   waitItems.push(element.orderID)
               })
            }
            this.$emit('confirm', waitItems)
        },
        close() {
            this.$emit('close')
        }
    }

}
</script>
