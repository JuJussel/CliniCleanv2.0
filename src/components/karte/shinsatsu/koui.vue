<template>
    <div ref="cont" style="height: 100%">
        <div>
            <div v-for="(row, index) in tabs" :key="index" class="tab-header">
                <div 
                    v-for="(tab) in row"
                    @click="changeTab(tab.id)"
                    :key="tab.id" 
                    class="tab" 
                    v-bind:class="{'tab-active': display.activeTab === tab.id}"
                    > 
                    {{ tab.name }} 
                </div>
            </div>
        </div>
        <div style="padding: 10px">
            <el-input
                size="small"
                placeholder="検索"
                clearable
                prefix-icon="el-icon-search"
                v-model="searchInput">
            </el-input>
        </div>
        <!-- History ------------------------->
        <div v-if="list.length <1">
            <div style="padding: 10px; height: 50px; border-bottom: solid 1px #ebeef5">
                <span>履歴</span>
            </div>
            <div>
                <el-table-pag
                    :data="history"
                    :height="display.tableHeight"
                    :show-header="false"
                    cursor="pointer"
                    v-loading="display.loading"
                    size="small"
                    @row-click = "rowClick"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="name">
                        <template slot-scope="scope">
                            <span style="display: flex; align-items: baseline">
                                <i :class="kouiTypes[scope.row.kouiType].icon" style="width: 20px"></i>
                                <span>{{ scope.row.name }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="100"
                        label="name">
                        <template slot-scope="scope">
                            <span v-for="prov in scope.row.provs" :key="prov">
                                <el-button @click.stop="addItem(scope.row, true)" size="mini">
                                    <img v-if="prov === 'SRL'" src="../../../assets/img/SRL.png" alt="SRL">
                                </el-button>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" prop="cost"></el-table-column>
                </el-table-pag>
            </div>
        </div>
        <!-- Kensa --------------------------->
        <div v-else-if="display.activeTab === '60'">
            <div style="padding: 10px; height: 50px; border-bottom: solid 1px #ebeef5">
                    <i class="fas fa-microscope" style="color: #606266; margin-right: 5px"></i>
                    <span @click="changeTab('60')" class="link">トップ</span>
                    <span v-if="display.nav[0]" @click="rowClick(display.nav[0])" class="link">
                        <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                        <span> {{ display.nav[0].name }} </span>
                    </span>
                    <span v-if="display.nav[1]">
                        <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                        <span class="link"> {{ display.nav[1].name }} </span>
                    </span>
            </div>
            <div>
                <el-table-pag
                    :data="list"
                    :height="display.tableHeight"
                    :show-header="false"
                    cursor="pointer"
                    v-loading="display.loading"
                    size="small"
                    @row-click = "rowClick"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="name">
                        <template slot-scope="scope">
                            <i v-if="scope.row.folder" class="far fa-folder"></i>
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="100"
                        label="name">
                        <template slot-scope="scope">
                            <span v-for="prov in scope.row.provs" :key="prov">
                                <el-button @click.stop="addItem(scope.row, true)" size="mini">
                                    <img v-if="prov === 'SRL'" src="../../../assets/img/SRL.png" alt="SRL">
                                </el-button>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" prop="cost"></el-table-column>
                </el-table-pag>
            </div>
        </div>
        <!-- Shohou --------------------------->
        <div v-else-if="display.activeTab === 'sh'">
            <div style="padding: 10px; height: 50px; border-bottom: solid 1px #ebeef5">
                <i class="fas fa-capsules" style="color: #606266; margin-right: 5px"></i>
                <span @click="changeTab('sh')" class="link">トップ</span>
                <span v-if="display.nav[0]" @click="rowClick(display.nav[0])" class="link">
                    <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                    <span> {{ display.nav[0].name }} </span>
                </span>
                <span v-if="display.nav[1]">
                    <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                    <span class="link"> {{ display.nav[1].name }} </span>
                </span>
            </div>
            <div>
                <el-table-pag
                    :data="list"
                    :height="display.tableHeight"
                    :show-header="false"
                    cursor="pointer"
                    v-loading="display.loading"
                    size="small"
                    @row-click = "rowClick"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="name">
                        <template slot-scope="scope">
                            <i v-if="scope.row.folder" class="far fa-folder"></i>
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                </el-table-pag>
            </div>
        </div>
        <!-- Prev Vac --------------------------->
        <div v-else-if="display.activeTab === '30_prev'">
            <div style="padding: 10px; height: 50px; border-bottom: solid 1px #ebeef5">
                <i class="fas fa-syringe" style="color: #606266; margin-right: 5px"></i>
                <span @click="changeTab('30_prev')" class="link">トップ</span>
                <span v-if="display.nav[0]" @click="rowClick(display.nav[0])" class="link">
                    <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                    <span> {{ display.nav[0].name }} </span>
                </span>
                <span v-if="display.nav[1]">
                    <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                    <span class="link"> {{ display.nav[1].name }} </span>
                </span>
            </div>
            <div>
                <el-table-pag
                    :data="list"
                    :height="display.tableHeight"
                    :show-header="false"
                    cursor="pointer"
                    v-loading="display.loading"
                    size="small"
                    @row-click = "rowClick"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="name">
                        <template slot-scope="scope">
                            <i v-if="scope.row.folder" class="far fa-folder"></i>
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                </el-table-pag>
            </div>
        </div>
        <!-- Set  --------------------------->
        <div v-else-if="display.activeTab === 'set'">
            <div style="padding: 10px; height: 50px; border-bottom: solid 1px #ebeef5">
                <i class="fas fa-layer-group" style="color: #606266; margin-right: 5px"></i>
                <span @click="changeTab('set')" class="link">トップ</span>
                <span v-if="display.nav[0]" @click="rowClick(display.nav[0])" class="link">
                    <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                    <span> {{ display.nav[0].name }} </span>
                </span>
                <span v-if="display.nav[1]">
                    <i class="el-icon-arrow-right" style="color: #33b6a5; font-weight: bold"></i>
                    <span class="link"> {{ display.nav[1].name }} </span>
                </span>
            </div>
            <el-table-pag
                :data="list"
                :height="display.tableHeight"
                :show-header="false"
                cursor="pointer"
                v-loading="display.loading"
                size="small"
                @row-click = "rowClick"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="name">
                    <template slot-scope="scope">
                          <el-popover
                                v-if="scope.row.content"
                                placement="left"
                                title="Title"
                                width="200"
                                trigger="hover"
                                content="this is content, this is content, this is content">
                                <span v-for="(item, index) in scope.row.content" :key="index">
                                    <kouiDisplay :item="item"></kouiDisplay>
                                </span>
                                <span slot="reference">
                                   <span style="width: 150px; display: flex">{{ scope.row.name }}</span>
                                </span>
                            </el-popover>
                            <span v-else>
                                <i v-if="scope.row.folder" class="far fa-folder"></i>
                                {{ scope.row.name }}
                            </span>
                    </template>
                </el-table-column>
            </el-table-pag>
        </div>
        <!-- Shot, OP, Treat  --------------------------->
        <div v-else-if="display.activeTab === '30' || display.activeTab === '40' || display.activeTab === '50'">
            <el-table-pag
                :data="list"
                :height="display.tableHeight"
                :show-header="false"
                cursor="pointer"
                v-loading="display.loading"
                size="small"
                @row-click = "rowClick"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="name">
                    <template slot-scope="scope">
                        <i v-if="scope.row.folder" class="far fa-folder"></i>
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column width="60" prop="cost"></el-table-column>
            </el-table-pag>
        </div>

    </div>
</template>

<script>
import kouiDisplay from './comps/koui_item_display'

export default {
    components: {
        'kouiDisplay': kouiDisplay
    },
    data(){
        return {
            tabs: [
                [
                    {name: 'お気に入り', id: 'fav'},
                    {name: '処方', id: 'sh'},
                    {name: '検査', id: '60'},
                    {name: '予防接種', id: '30_prev'},
                    {name: '接種', id: '30'}
                ], 
                [
                    {name: '手術', id: '40'},
                    {name: '処置', id: '50'},
                    {name: '画像', id: '?'},
                    {name: 'セット', id: 'set'}
                ]                
            ],
            display: {
                activeTab: 'fav',
                nav: [],
                loading: false,
                tableHeight: 0
            },
            searchInput: "",
            list: [],
            history: [],
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
    },
    mounted() {
        let contHeight = this.$refs.cont.clientHeight
        this.$nextTick(function() {this.display.tableHeight = contHeight -250})
        this.getData({type: 'fav', mode: 'listMain'})
    },
    watch: {
        searchInput() {
            if (this.searchInput !== '') {
                this.getData({type: this.display.activeTab, mode: 'search', searchKey: this.searchInput})
            } else {
                this.getData({type: this.display.activeTab, mode: 'listMain'})
                this.display.nav = []
            }
        }
    },
    methods: {
        getData(data) {
            this.display.loading = true
            this.doRequest('getKouiList', data).then(result => {
                if (this.display.activeTab === 'set' && result.data[0].action === 'addSet') {
                    result.data.forEach(function(item) {
                        item.content = JSON.parse(item.content)
                    })
                }
                this.history = []
                var arr = []
                result.hist.forEach(item => {                    
                    let k = JSON.parse(item.cont)
                    k.kouiType = item.type
                    arr.push(k)
                })
                this.list = result.data
                this.history = arr
                this.display.loading = false
            }) 
        },
        changeTab(type) {
            this.searchInput = ""
            this.display.nav = []
            this.display.activeTab = type
            let patientID = this.$store.state.componentData.karteDetails.patient.id
            this.getData({type: type, mode: 'listMain', patientID: patientID})
        },
        rowClick(row) {
            if (row.action === 'getSub') {
                this.display.nav = [row]
                this.getData({type: this.display.activeTab, mode: row.action, searchKey: row.code})
            } else if (row.action === 'getItems') {
                this.display.nav.push(row)
                if (this.display.activeTab === '60') {
                    var searchKey = this.display.nav[0].code + row.code                    
                } else if (this.display.activeTab === 'sh'|| this.display.activeTab === '30_prev') {
                    var searchKey = row.name
                } else if (this.display.activeTab === 'set') {
                    var searchKey = row.ID
                }
                this.getData({type: this.display.activeTab, mode: row.action, searchKey: searchKey})
            } else if (row.action === "addItem") {
                this.addItem(row)
            } else if (row.action === 'addSet') {
                this.addSet(row)
            }
        },
        async addItem(item, srl, set) {
            event.stopPropagation()
            let kouiType = this.display.activeTab
            if (set) {
                kouiType = item.kouiType
            }
            let kouiArray = {
                id:"",
                comment: {
                    hasComm: false,
                    comm: ""
                },
                gai: false,
                hasOrder: false,
                jihi: true,
                kouiID: "",
                kouiType: kouiType,
                name: "",
                noCalc: false,
                orderComment: "",
                orderDone: false,
                orderID: "",
                orderSent: false,
                subTask: false,
                trackingID: "",
                update: "",
                userExec: "",
                done: false,
                waitForMe:false
            }
            if (kouiType === "sh") {
                var addArray = {
                    times : "1",
                    timesUnit : "",
                    med_med_val : "",
                    med_timing : ""
                }
            } else if (kouiType === "60") {
                if (srl) {
                    kouiArray.type = "SRL"
                    let specs = await this.doRequest('getKensaSpec', item.analyte)
                    kouiArray.spec = specs.data
                    kouiArray.specSelected = specs.data[0].id
                } else {
                    kouiArray.type = "院内"
                }
                var addArray = {
                    values: [],
                    ident: [],
                    identSelected: "",
                    met: [],
                    metSelected: ""
                }
            } else if (kouiType === "30_prev") {
                var addArray = {
                    amount: "",
                    location: "右上腕",
                    lotNo: "",
                    med_med_unit: "ml"
                }
            } else if (kouiType === "30") {
                var addArray = {
                    amount: "",
                    location: "右上腕",
                    lotNo: ""
                }
            }
            Object.assign(kouiArray, item)
            Object.assign(kouiArray, addArray)
            this.$emit('addItem', kouiArray)
            if (kouiType !== 'fav') {
                this.doRequest('addKouiHistory', {'item': item, type: kouiType})                     
            }
        },
        addSet(item) {
            item.content.forEach(function(koui) {
                if (koui.kouiType === '60' && koui.type === 'SRL') {
                    this.addItem(koui, true, true)
                } else {
                    this.addItem(koui, false, true)
                }
            }.bind(this))
        },
    }
}
</script>

<style scoped>
.tab-header {
    display: flex;
}
.tab {
    border-right: solid 1px #ebeef5;
    border-bottom: solid 1px #ebeef5;
    padding: 5px;
    flex-grow: 1; cursor: pointer;
    transition: all .2s ease;
    font-size: 14px
}
.tab:last-child {
    border-right: none
}
.tab:hover {
    background-color: #e0f2f1;
}
.tab-active {
    color: #00A48F;
}
.tabBody {
    margin: 10px
}
</style>

