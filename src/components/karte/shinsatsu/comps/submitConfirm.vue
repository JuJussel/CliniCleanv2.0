<template>
    <div>
        <div>診察終了しますか？</div>
        <h4 v-if="kouiNotDone.length > 0">オーダーのない未済の行為があります。確認の上チェックを入れて終了してください。</h4>
        <div v-for="koui in kouiNotDone" :key="koui.ID" style="display: flex; align-items: baseline; margin: 5px 0">
            <span>確認　</span>
            <el-checkbox v-model="koui.waitForMe">
                <kouiItemDisplay :item="koui"></kouiItemDisplay>
            </el-checkbox>
        </div>
        <div v-if="orderKoui.length > 0" style="margin: 10px 0">
            <h4>タイマー追加　　</h4>
            <el-checkbox v-model="addOrderTimer">オーダータイマー追加</el-checkbox>
        </div>
        <div v-if="addOrderTimer">
            <div v-for="koui in orderKoui" :key="koui.ID" style="display: flex; align-items: center; margin: 5px 0">
                <el-checkbox v-model="koui.waitForMe">
                    <kouiItemDisplay :item="koui"></kouiItemDisplay>
                </el-checkbox>
            </div>
        </div>
        <div style="margin-top: 10px; display: flex; justify-content: flex-end">
            <el-button @click="close" style="margin-right: 5px" type="text">キャンセル</el-button>
            <el-button :disabled="checked.length > 0" @click="submit" type="primary">確認</el-button>
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
            return this.kouiCopy.filter(item => !item.done && !item.orderSent && item.kouiType !== 'sh')
        },
        checked() {
            return this.kouiNotDone.filter(item => !item.waitForMe)
        },
        orderKoui() {
            return this.koui.filter(item => item.orderSent)
        }
    },
    data() {
        return {
            addOrderTimer: false,
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
