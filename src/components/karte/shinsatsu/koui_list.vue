<template>
    <div class="content">
        <kouiItems 
            class="koui" 
            v-for="(item, index) in items" 
            :key="index" 
            @delete="deleteItem(index)"
            @changeCalc="checkKoui(item, '_re', ...arguments)"
            :item="item"
            :insurances="display.insurances">
        </kouiItems>
        <el-dialog
            :visible.sync="display.confOpen"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="30%">
            <div v-html="addConfData.text"></div>
            <span slot="title" style="display: flex; align-items: center">
                <i class="fas fa-exclamation-triangle" style="color: #FF9800; font-size: 30px"></i>
                <span style="margin-left: 10px; color: #606266">行為確認</span>
            </span>
            <span slot="footer" class="dialog-footer">
                <div v-if="addConfData.mode === 'norm'">
                    <el-button @click="display.confOpen = false" type="text">キャンセル</el-button>
                    <el-button @click="addItemAfterConf('noCalc')">算定しない</el-button>
                    <el-button @click="addItemAfterConf('jihi')" type="primary">自費</el-button>
                </div>
                <div v-else-if="addConfData.mode === 'special'">
                    <div>
                        <span style="margin-right: 10px; max-width: 320px">{{ addConfData.item1 }}</span>
                        <el-button @click="addItemAfterConf('noCalc')">算定しない</el-button>
                        <el-button @click="addItemAfterConf('jihi')" type="primary">自費</el-button>
                    </div>
                    <div style="margin-top: 10px">
                        <span style="margin-right: 10px; max-width: 320px">{{ addConfData.item2.name }} {{ addConfData.item2.med_name }}</span>
                        <el-button @click="addItemAfterConf('item2noCalc')">算定しない</el-button>
                        <el-button @click="addItemAfterConf('item2jihi')" type="primary">自費</el-button>
                    </div>
                    <div>
                        <el-button @click="display.confOpen = false" type="text">キャンセル</el-button>
                    </div>
                </div>
                <div v-else-if="addConfData.mode === 'special_re'">
                    <div>
                        <span style="margin-right: 10px; max-width: 320px">{{ addConfData.item1 }}</span>
                        <el-button @click="addItemAfterConfEx('noCalc')">算定しない</el-button>
                        <el-button @click="addItemAfterConfEx('jihi')" type="primary">自費</el-button>
                    </div>
                    <div style="margin-top: 10px">
                        <span style="margin-right: 10px; max-width: 320px">{{ addConfData.item2.name }} {{ addConfData.item2.med_name }}</span>
                        <el-button @click="addItemAfterConfEx('item2noCalc')">算定しない</el-button>
                        <el-button @click="addItemAfterConfEx('item2jihi')" type="primary">自費</el-button>
                    </div>
                </div>
                <div v-else-if="addConfData.mode === 'norm_re'">
                    <div>
                        <el-button @click="addItemAfterConfEx('noCalc')">算定しない</el-button>
                        <el-button @click="addItemAfterConfEx('jihi')" type="primary">自費</el-button>
                    </div>
                </div>
            </span>
            
        </el-dialog>
    </div>
</template>

<script>

import kouiItems from './comps/koui_item'

export default {
    props: [
        'kouiItems',
        'insCombNr',
        'insSet'
    ],
    components: {
        'kouiItems': kouiItems
    },
    created() {
        let patientID = this.$store.state.componentData.karteDetails.patient.id
        this.doRequest('getReceptionInsurance', patientID).then(result => {
            let array = result.data.filter(function(item) { return item.wholeName !== '自費' && item.ID !== this.insSet}.bind(this))
            this.display.insurances = array
        })
        this.$eventHub.$on('updateTask', this.updateTask)
    },
    beforeDestroy() {
        this.$eventHub.$off('updateTask')
    },
    watch: {
        kouiItems() {
            this.items = this.kouiItems
        }
    },
    data() {
        return {
            items: [],
            indexNr: 0,
            display: {
                insurances: [],
                confOpen: false
            },
            addConfData: {
                temp: "",
                mode: "",
                text: "",
                item2: {},
                item2: {}
            }
        }
    },
    methods: {
        deleteItem(index) {
            this.items.splice(index,1)
        },
        updateTask(data) {
            let target = this.items.find(item => item.trackingID == data.trackingID)
            target.update = '!'
            target.orderSent = false
            target.orderComment = data.order_comment
            if (data.subTask === "0") {
                target.done = true
                target.orderDone = true
                if (data.type === "2") {
                    target.results_raw = data.results_raw
                }
            }
            if (data.type === "3" || data.type === "4") {
                target.amount = data.amount
                target.lotNo = data.lotNo
            }
        },
        addKoui(item) {
            this.indexNr++
            let kindOfUnique = new Date().valueOf()
            let trackingID =
                this.$store.state.componentData.karteDetails.patient.id +
                this.$store.state.componentData.karteDetails.shinsatsu.karteID +
                kindOfUnique +
                this.indexNr
            item.trackingID = trackingID
            if (
                item.kouiType !=="30_prev" && 
                item.kouiType !=="sh" && 
                !this.$store.state.componentData.karteDetails.jihi
            ) { 
                this.checkKoui(item, '')
            } else {
                this.items.push(item)
            }
        },
        checkKoui(newItem, mode, type) {
            let filteredKoui = this.items.filter(item2 => (!item2.jihi && !item2.noCalc))
            this.doRequest('checkKoui', {
                shinsatsuID: this.$store.state.componentData.home.shinsatsu,
                patientID: this.$store.state.componentData.karteDetails.patient.id,
                koui: filteredKoui,
                newKoui: newItem.kouiID,
                newType: newItem.kouiType,
                insCombNr: this.insCombNr
            }).then(result => {
                if (!result.checkOK) {
                    this.addConfData.temp = newItem
                    this.addConfData.mode = 'norm' + mode
                    if (result.special) {
                        //Find item in current items array
                        this.addConfData.item2 = this.items.find(
                            function(citem){
                                return citem.kouiID === result.vioCode
                            }
                        ),
                        this.addConfData.mode = 'special' + mode
                        this.addConfData.item1 = result.item1
                    }
                    this.addConfData.text = result.message
                    this.display.confOpen = true
                } else {
                    if (mode === '') {
                        this.items.push(newItem)                        
                    } else if (mode ==='_re') {
                        if (type === 'noCalc') {
                            newItem.jihi = false
                            newItem.gai = false
                            this.display.calcOpen = false
                        } else if (type === 'jihi') {
                            newItem.noCalc = false
                            newItem.gai = false
                            this.display.calcOpen = false
                        } else if (type === 'gai') {
                            newItem.jihi = false
                            newItem.noCalc = false
                        }
                    }
                }
            })
        },
        addItemAfterConf(selection) {
            if (selection === "noCalc") {
                this.addConfData.temp.noCalc = true
                this.addConfData.temp.jihi = false
                this.addConfData.temp.gai = false
                this.items.push(this.addConfData.temp)
            } else if (selection === "jihi") {
                this.addConfData.temp.jihi = true
                this.addConfData.temp.noCalc = false
                this.addConfData.temp.gai = false
                this.items.push(this.addConfData.temp)
            } else if (selection === "item2noCalc") {
                this.addConfData.item2.noCalc = true
                this.addConfData.item2.jihi = false
                this.addConfData.item2.gai = false
                this.items.push(this.addConfData.temp)
            } else if (selection === "item2jihi") {
                this.addConfData.item2.noCalc = false
                this.addConfData.item2.jihi = true
                this.addConfData.item2.gai = false
                this.items.push(this.addConfData.temp)
            }
            this.display.confOpen = false
        },
        addItemAfterConfEx(selection) {
            if (selection === "noCalc") {
                this.addConfData.temp.noCalc = true
                this.addConfData.temp.jihi = false
                this.addConfData.temp.gai = false
            } else if (selection === "jihi") {
                this.addConfData.temp.noCalc = false
                this.addConfData.temp.jihi = true
                this.addConfData.temp.gai = false
            } else if (selection === "item2noCalc") {
                this.addConfData.item2.noCalc = true
                this.addConfData.item2.jihi = false
                this.addConfData.item2.gai = false
            } else if (selection === "item2jihi") {
                this.addConfData.item2.noCalc = false
                this.addConfData.item2.jihi = true
                this.addConfData.item2.gai = false
            }
            this.display.confOpen = false
        }

    }
}
</script>

<style scoped>
.content {
    margin: 10px;
    border: solid 1px #ebeef5;
    border-radius: 4px;
}
</style>

