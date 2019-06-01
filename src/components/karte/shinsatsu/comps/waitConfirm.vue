<template>
    <div>
        <div>診察一時的に停止しますか？</div>
        <div style="margin: 10px 0">
            <span>タイマー追加　　</span>
            <el-checkbox v-if="orderKoui.length > 0" v-model="addOrderTimer">オーダータイマー追加</el-checkbox>
            <el-checkbox v-model="addTimeTimer" disabled>時間タイマー追加</el-checkbox>
        </div>
        <div v-if="addOrderTimer">
            <div v-for="koui in orderKoui" :key="koui.ID" style="display: flex; align-items: center; margin: 5px 0">
                <el-checkbox v-model="koui.waitForMe">
                    <kouiItemDisplay :item="koui"></kouiItemDisplay>
                </el-checkbox>
            </div>
        </div>
        <div v-else-if="addTimeTimer" style="display: flex; align-items: center; margin: 5px 0">
            <span>待ち時間：</span>
            <el-input v-model="waitTime" type="number" style="width: 100px" size="small" max="300">
                <template slot="append">分</template>
            </el-input>
        </div>
        <div style="margin-top: 10px; display: flex; justify-content: flex-end">
            <el-button @click="closePause" style="margin-right: 5px" type="text">キャンセル</el-button>
            <el-button @click="submitPause" type="primary">確認</el-button>
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
        orderKoui() {
            return this.koui.filter(item => item.orderSent)
        }
    },
    data() {
        return {
            addOrderTimer: false,
            addTimeTimer: false,
            waitTime: 0
        }
    },
    watch: {
        addOrderTimer() {
            if (this.addOrderTimer) {
                this.addTimeTimer = false
            }
        },
        addTimeTimer() {
            if (this.addTimeTimer) {
                this.addOrderTimer = false
            }
        }
    },
    methods: {
        submitPause() {
            let waitItems = []
            if (this.addOrderTimer) {
               let waitItemsFull = this.orderKoui.filter(item => item.waitForMe)
               waitItemsFull.forEach(element => {
                   waitItems.push(element.orderID)
               })
            }
            this.$emit('confirm', waitItems)
        },
        closePause() {
            this.$emit('close')
        }
    }

}
</script>
