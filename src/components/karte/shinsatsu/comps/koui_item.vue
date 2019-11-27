<template>
        <el-collapse @change="handleChange">
            <el-collapse-item name="1" class="hasHover">
                <template slot="title">
                    <div class="kouiItemHeader">
                        <span style="color: #606266; display: flex; align-items: center">
                            <div class="calcInfo" v-bind:style="{'background-color': calcColor}"></div>
                            <i :class="display.kouiTypes[item.kouiType].icon"></i>
                            <span style="margin-left: 5px; width: 70px; font-size: 14px">
                                {{ display.kouiTypes[item.kouiType].title }}
                                <span v-if="item.kouiType === '60' && item.type === '院内'">内</span>
                                <span v-if="item.kouiType === '60' && item.type === 'SRL'">外</span>
                            </span>
                            <span class="titleSpan">{{ item.med_name }} {{ item.name }}</span>
                        </span>
                        <span style="margin-right: 10px" class="ops">
                            <el-button v-if="!item.done && item.kouiType !== '71' && !item.orderSent" @click="deleteItem" size="mini" type="danger">削除</el-button>
                            <el-button v-if="item.kouiType === '71'" size="mini">見る</el-button>
                        </span>
                        <i v-if="item.done" class="fas fa-check-square" style="margin-right: 10px; color: #606266"></i>
                        <i v-if="item.orderSent" class="fas fa-hourglass" style="margin-right: 10px; color: #606266"></i>
                    </div>
                </template>
                <div style="margin: 0 10px">
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px">
                        <el-popover
                            placement="bottom"
                            title="算定"
                            width="100px"
                            trigger="click"
                            v-model="display.calcOpen">
                            <div>
                                <el-checkbox @change="calcChange('noCalc')" v-model="item.noCalc" label="算定しない" border size="small"></el-checkbox>
                                <el-checkbox @change="calcChange('jihi')" v-model="item.jihi" label="自費" border size="small"></el-checkbox>
                                <el-checkbox @change="calcChange('gai')" v-model="item.gai" label="公費・保険外" border size="small" :disabled="item.kouiType === '71'"></el-checkbox>
                            </div>
                            <el-table
                                v-if="item.gai"
                                highlight-current-row
                                :data="insurances"
                                size="mini"
                                @current-change="selectIns"
                                style="margin-top: 10px; width: 100%; border-radius: 4px; border: solid 1px #dcdfe6">
                                <el-table-column
                                    prop="wholeName"
                                    label="保険">
                                </el-table-column>
                                <el-table-column
                                    prop="pub1"
                                    label="公費1">
                                </el-table-column>
                                <el-table-column
                                    prop="pub2"
                                    label="公費２">
                                </el-table-column>
                                <el-table-column
                                    prop="pub3"
                                    label="公費３">
                                </el-table-column>
                                <el-table-column
                                    prop="pub4"
                                    label="公費４">
                                </el-table-column>
                            </el-table>
                            <el-button slot="reference" size="mini">算定</el-button>
                        </el-popover>
                        <el-popover
                            v-if="item.kouiType !== 'sh' && item.kouiType !== '71'"
                            placement="bottom"
                            title="オーダー"
                            trigger="click"
                            style="margin-left: 10px"
                            v-bind:style="{'margin-right': display.fixMargin2}"
                            v-model="display.orderOpen">
                            <div>
                                <el-form label-width="70px" size="mini">
                                    <el-form-item label="担当者" required>
                                        <el-select v-model="item.userExec" placeholder="選択">
                                            <el-option
                                                v-for="item in $store.state.constants.userList"
                                                :key="item.id"
                                                :label="item.firstname + item.lastname"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="コメント">
                                        <el-input v-model="item.orderComment" style="width: 200px" type="textarea" :rows="1"></el-input>
                                    </el-form-item>
                                </el-form>
                                <el-checkbox style="margin-top: 10px" v-model="item.subTask">終了可能</el-checkbox>
                                <el-button @click="submitOrder" type="primary" style="float: right">送信</el-button>
                                <el-button @click="display.orderOpen = false" type="text" style="float: right; margin-right: 10px">キャンセル</el-button>
                            </div>
                            <el-button :disabled="item.orderSent || item.done" slot="reference" size="mini">オーダー</el-button>
                        </el-popover>
                        <el-checkbox
                            v-model="item.done"
                            label="済"
                            size="mini"
                            :disabled="item.orderSent"
                            v-bind:style="{'margin-left': display.fixMargin}"
                            style="padding-top: 4px"
                            v-if="item.kouiType !== 'sh' && item.kouiType !== '71' && item.type !== 'SRL'"
                            border>
                        </el-checkbox>
                    </div>
                    <!-- Shohou -->
                    <div v-if="item.kouiType === 'sh'">
                        <el-form :inline="true" size="mini" label-width="70px">
                            <el-form-item label="薬剤量">
                                <el-input v-model="item.med_med_val" style="width:70px">
                                    <template slot="append"> {{ item.med_med_unit }} </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="錠用法">
                                <el-popover
                                    placement="bottom"
                                    title="錠用法"
                                    trigger="click"
                                    v-model="display.timingOpen">
                                    <div style="margin-bottom: 10px">
                                        <el-radio-group @change="getShohouTiming" v-model="item.type">
                                            <el-radio :label="'1'">内服</el-radio>
                                            <el-radio :label="'3'">屯服</el-radio>
                                            <el-radio :label="'5'">外用</el-radio>
                                       </el-radio-group>
                                    </div>
                                    <el-select @change="display.timingOpen = false" v-model="item.med_timing" filterable placeholder="選択又は検索">
                                        <el-option
                                        v-for="item in display.shohouData"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name">
                                        </el-option>
                                    </el-select>
                                    <el-tag style="cursor:pointer" slot="reference" size="medium" type="info">
                                        {{ display.shohouTypes[item.type][0] }} {{ item.med_timing }}
                                    </el-tag>
                                </el-popover>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="item.times" style="width:70px">
                                    <template slot="append"> {{ display.shohouTypes[item.type][1] }} </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- Kensa -->
                    <div v-else-if="item.kouiType === '60'">
                        <el-form :inline="true" size="mini" label-width="70px">
                            <el-form-item label="材料">
                                <el-select v-model="item.specSelected" :disabled="item.spec.length < 2 || item.orderSent">
                                    <el-option
                                        v-for="spec in item.spec"
                                        :key="spec.id"
                                        :value="spec.id"
                                        :label="spec.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div v-if="item.done">
                                <el-dropdown
                                    trigger="click"
                                    @visible-change="fetchResults"
                                    @command="addResult"
                                    :disabled="resultsFiltered.length < 1">
                                    <el-button size="small" :disabled="resultsFiltered.length < 1">結果追加</el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <div style="padding: 0 10px" v-if="resultsFull.length >10">
                                            <el-input v-model="resultsFilter" prefix-icon="el-icon-search" size="small"></el-input>
                                        </div>
                                        <div style="max-height: 200px; overflow: auto">
                                            <el-dropdown-item
                                                v-for="result in resultsFiltered"
                                                :key="result.ID"
                                                :command="result">
                                                {{ result.name }}
                                            </el-dropdown-item>
                                        </div>
                                    </el-dropdown-menu>
                                    </el-dropdown>
                                <div style="margin-top: 10px">
                                    <el-form-item v-for="result in item.results" :key="result.JLAC" :label="result.name">
                                        <el-input v-model="result.value" style="width: 150px">
                                            <template slot="append"> {{ result.unit }} </template>
                                        </el-input>
                                        <el-button @click="removeResult(result)" type="text" style="margin-left: 10px">削除</el-button>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <!-- Shot / PrevVac -->
                    <div v-else-if="item.kouiType === '30' || item.kouiType === '30_prev'">
                        <el-form :inline="true" size="mini" label-width="70px" :disabled="item.orderSent || item.done">
                            <el-form-item label="位置">
                                <el-select @change="shotTypeChange" v-model="item.location" placeholder="選択又は検索" style="width: 100px">
                                    <el-option
                                        v-for="item in display.locations"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="接種量">
                                <el-input v-model="item.amount" style="width:90px">
                                    <template slot="append">ml</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="LotNo">
                                <el-input v-model="item.lotNo" style="width:80px"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- Kenkoushindan -->
                    <div v-else-if="item.kouiType === '71'">
                      <kenkoushindanEdit :data="item.kksdData"></kenkoushindanEdit>
                    </div>
                    <div>
                        <el-form :inline="true" size="mini" label-width="70px">
                            <el-form-item label="コメント">
                                <el-input v-model="item.comment.comm" style="width: 300px" type="textarea" :rows="1"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
</template>

<script>

import kenkoushindanEdit from './kenkoushindanEdit'

export default {
    props: {
        item: Object,
        insurances: Array
    },
    components: {
      'kenkoushindanEdit': kenkoushindanEdit
    },
    created() {
        if (this.item.kouiType === "sh") {
            let type = this.item.type
            this.doRequest('shohou_timing', type).then(result => {
                this.display.shohouData = result.list
            })
        } 
    },
    data() {
        return {
            display: {
                activeKoui: "",
                calcOpen: false,
                orderOpen: false,
                fixMargin: '10px',
                fixMargin2: '0',
                timingOpen: false,
                shohouData: [],
                locations: [
                    '右上腕',
                    '左上腕',
                    '右大腿',
                    '左大腿',
                    '右臀部',
                    '左臀部',
                    '静脈'
                ],
                kouiTypes: {
                    'sh': {title: '処方', icon: 'fas fa-capsules'},
                    '30': {title:'注射', icon: 'fas fa-syringe'},
                    '60': {title:'検査', icon: 'fas fa-microscope'},
                    '71': {title:'健康診断', icon: 'fas fa-file-medical-alt'},
                    '30_prev': {title:'予防接種', icon: 'fas fa-syringe'},
                    '40': {title:'手術', icon: 'fas fa-procedures'},
                    '50': {title:'処置', icon: 'fas fa-band-aid'}
                },
                shohouTypes: {
                    '1': ['内服','日'],
                    '2': ['内服',''],
                    '3': ['屯服','回'],
                    '5': ['外用',''],
                    '6': ['浸煎',''],
                    '7': ['湯','']
                },
            },
            resultsFull: false,
            resultsFilter: ""
        }
    },
    computed: {
        calcColor() {
            if (this.item.jihi) {
                return '#90CAF9'
            } else if (this.item.gai) {
                return '#F48FB1'
            } else if (this.item.noCalc) {
                return '#B0BEC5'
            } else {
                return 'white'
            }
        },
        resultsFiltered() {
            if (this.resultsFull) {
                let returnArr = JSON.parse(JSON.stringify(this.resultsFull))
                this.item.results.forEach(element => {
                    returnArr = returnArr.filter(item => item.JLAC !== element.JLAC)
                })
                returnArr = returnArr.filter(item => item.name && item.name.includes(this.resultsFilter))
                return returnArr
            } else {
                return []
            }
            //return _.differenceWith(this.resultsFull, this.item.results, _.isEqual);
        }
    },
    methods: {
        shotTypeChange(sel) {
            if(sel === "静脈") {
                this.item.kouiID = "130003510"
            } else {
                this.item.kouiID = "130000510"
            }
            this.$emit('shotTypeChange')
        },
        toggleExpand() {
            this.display.expanded = !this.display.expanded
        },
        deleteItem(e) {
            e.stopPropagation()
            this.$emit('delete')
        },
        handleChange() {
            // OK, Element UI seems to have a bug when using checkbox with collapse. If checkbox is true, the checkbox icon will not be displayed.
            // Changing the position once fixes the issue. Not them most elegant one, but well..
            if (this.item.done) {
                this.display.fixMargin = '9px'
                this.display.fixMargin2 = '1px'
                setTimeout(function() {this.display.fixMargin = '10px';this.display.fixMargin2 = '0'}.bind(this), 250)
            }

        },
        getShohouTiming() {
            this.item.med_timing = ""
            let type = this.item.type
            this.doRequest('shohou_timing', type).then(result => {
                this.display.shohouData = result.list
            })
        },
        calcChange(type) {
            if (!this.item.jihi && !this.item.gai && !this.item.noCalc) {
                this.$emit('changeCalc')
            } else if (type === 'noCalc') {
                this.item.jihi = false
                this.item.gai = false
                this.display.calcOpen = false
            } else if (type === 'jihi') {
                this.item.noCalc = false
                this.item.gai = false
                this.display.calcOpen = false
            } else if (type === 'gai') {
                this.$emit('changeCalc', type)
            }
        },
        selectIns(item) {
            this.item.insCombNr = item.ID
            this.display.calcOpen = false
        },
        submitOrder() {
            let sendData = JSON.parse(JSON.stringify(this.item))
            sendData.patientID = this.$store.state.componentData.karteDetails.patient.id
            sendData.karteID = this.$store.state.componentData.karteDetails.shinsatsu.karteID
            this.doRequest('insertOrder', [sendData]).then(result => {
                this.item.orderSent = true
                this.item.orderID = result.orderID
                this.display.orderOpen = false
            })
        },
        fetchResults(open) {
            this.resultsFilter = ""
            if (!this.resultsFull) {
                this.doRequest('kensaResults', this.item.analyte).then(result => {
                    this.resultsFull = result.data
                })
            }
        },
        addResult(result) {
            this.item.results.push(result)
        },
        removeResult(result) {
            this.item.results = this.item.results.filter(item => item !== result)
        }
    }
}
</script>

<style scoped>
.titleSpan {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 230px
}
.kouiItemHeader {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all .2s ease-in-out;
    width: 100%;
    font-size: 16px
}
.hasHover:hover {
    background-color: #e0f2f1;
}
.ops {
    opacity: 0;
    transition: all .2s ease
}
.hasHover:hover .ops {
    opacity: 1;
}
.kouiItemBody {
    max-height: 0;
    overflow: hidden;
    transition: all .2s ease-in-out
}
.el-collapse {
    border-top: none
}
.el-collapse-item__arrow {
    display: none;
}
.calcInfo {
    overflow: hidden;
    margin-right: 5px;
    font-size: 12px;
    color: #03a9f4;
    width: 3px;
    height: 48px
}
</style>

<style>
.el-collapse-item__arrow {
    display: none;
}
</style>

