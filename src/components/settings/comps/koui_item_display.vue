<template>
        <el-collapse>
            <el-collapse-item name="1" class="hasHover">
                <template slot="title">
                    <div class="kouiItemHeader">
                        <span style="color: #606266; display: flex; align-items: center">
                            <div class="calcInfo"></div>
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
export default {
    props: {
        item: Object,
        insurances: Array
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
        getShohouTiming() {
            this.item.med_timing = ""
            let type = this.item.type
            this.doRequest('shohou_timing', type).then(result => {
                this.display.shohouData = result.list
            })
        },
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

