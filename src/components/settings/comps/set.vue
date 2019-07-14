<template>
    <div style="display: flex">
        <el-card style="width: 400px" v-loading="loading">
            <div slot="header">
                <span>セットリスト</span>
                <el-button style="float: right; margin-top: -6px" size="small" @click="openNewSet">新規</el-button>
            </div>
            <el-tree
                :data="sets"
                :auto-expand-parent="true"
                children='children'
                label='label'
                @node-click="selectSet"
                @node-drop="nodeDrop"
                node-key="unique"
                :default-expanded-keys="expandedNodes"
                :highlight-current="true"
                :draggable="true"
                :allow-drag="checkAllowDrag"
                :allow-drop="checkAllowDrop">
                <span class="custom-tree-node" slot-scope="{ node }">
                    <span>
                        <i v-if="node.childNodes.length > 0" class="far fa-folder"></i>
                        {{ node.label }}
                        </span>
                    <el-button
                        v-if="node.data.unique !== 'patientFoler44030D0e-s'"
                        type="danger"
                        size="mini"
                        @click="removeSet(node, $event)">
                        <span>削除</span>
                    </el-button>
                </span>
            </el-tree>
        </el-card>
        <el-card v-if="newSet.open" style="margin-left: 10px; width: 500px">
            <div slot="header">
                <span>新規セット</span>
                <el-button style="float: right; margin-top: -6px" size="small" @click="saveNewSet()">保存</el-button>
                <el-button style="float: right; margin-top: -6px; margin-right: 10px" type="text" size="small" @click="newSet.open = false">キャンセル</el-button>
            </div>
            <div>
                <el-form size="small" label-width="100px">
                    <el-form-item label="セット名">
                        <el-input v-model="newSet.name" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="フォルダー">
                        <el-radio-group v-model="newSet.folderMode">
                            <el-radio :label="'existing'" style="margin: 0 5px">既存フォルダー</el-radio>
                            <el-radio :label="'new'" style="margin: 0 5px">新規フォルダー</el-radio>
                            <el-radio :label="'patient'" style="margin: 0 5px">患者</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="margin-top: -15px">
                        <el-input v-if="newSet.folderMode === 'new'" v-model="newSet.folderName" placeholder="フォルダー名" style="width: 150px"></el-input>
                        <el-select
                            v-model="newSet.patientID"
                            value-key="patientID"
                            filterable
                            remote
                            placeholder="氏名又はIDで検索"
                            v-else-if="newSet.folderMode === 'patient'"
                            :remote-method="searchPatient"
                            :loading="newSet.searchLoading">
                            <el-option
                                v-for="item in newSet.searchResults"
                                :key="item.patientID"
                                :label="item.name_last_kanji + item.name_first_kanji"
                                :value="item.patientID">
                                <span style="display: flex; justify-content: space-between; width: 280px">
                                    <span style="color: #8492a6; font-size: 13px">ID: {{ item.patientID}}</span>
                                    <span>{{ item.name_last_kanji + item.name_first_kanji }}</span>
                                    <span style="color: #8492a6; font-size: 13px">
                                        {{ item.birthdate_year + "年" + item.birthdate_month + "月" + item.birthdate_day + "日"}}
                                    </span>
                                </span>
                            </el-option>
                        </el-select>
                        <el-select v-else v-model="newSet.folderID">
                            <el-option
                                v-for="folder in setFodlersList"
                                :key="folder.id"
                                :label="folder.name"
                                :value="folder.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <div style="margin-bottom: 10px">
                    <span>セット内容</span>
                    <el-button @click="bufferAdd('newSet')" v-if="buffer.length > 0" size="mini" style="float: right">追加</el-button>
                    <el-button @click="bufferReplace('newSet')" v-if="buffer.length > 0" size="mini" style="float: right">上書き</el-button>
                </div>
                <div style="border: 1px solid #ebeef5; border-rdius: 4px">
                    <kouiItem v-for="(koui, index) in newSet.items" :key="index" :item="koui" @delete="removeNewSetItem(index)"></kouiItem>
                </div>
            </div>
        </el-card>
        <el-card v-if="editSet.open" style="margin-left: 10px; width: 500px">
            <div slot="header">
                <span>セット編集</span>
                <el-button style="float: right; margin-top: -6px" size="small" @click="saveEditSet">保存</el-button>
                <el-button style="float: right; margin-top: -6px; margin-right: 10px" type="text" size="small" @click="editSet.open = false">キャンセル</el-button>
            </div>
            <div>
                <el-form size="small" label-width="100px">
                    <el-form-item label="セット名">
                        <el-input v-model="editSet.setName" style="width: 200px"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <div style="margin-bottom: 10px">
                    <span>セット内容</span>
                    <el-button @click="bufferCopy" size="mini" style="float: right; margin-left: 10px">コピー</el-button>
                    <el-button @click="bufferAdd('editSet')" v-if="buffer.length > 0" size="mini" style="float: right">追加</el-button>
                    <el-button @click="bufferReplace('editSet')" v-if="buffer.length > 0" size="mini" style="float: right">上書き</el-button>
                </div>
                <div style="border: 1px solid #ebeef5; border-rdius: 4px">
                    <kouiItem v-for="(koui, index) in editSet.items" :key="index" :item="koui" @delete="removeEditSetItem(index)"></kouiItem>
                </div>
            </div>
        </el-card>
        <el-card v-if="newSet.open || editSet.open" style="margin-left: 10px; width: 500px" :body-style="{height: 'calc(100% - 100px)', padding: 0}">
            <div slot="header">
                <span>行為選択</span>
            </div>
            <kouiList @addItem="addItem"></kouiList>
        </el-card>
    </div>
    
</template>

<script>
import kouiList from '../../karte/shinsatsu/koui'
import kouiItem from './koui_item_display'

export default {
    components: {
        kouiList,
        kouiItem
    },
    created() {
        this.getSets()
    },
    computed: {
        setFodlersList() {
            let returnArray = []
            this.sets.forEach(folder => {
                if (folder.label !== '患者') {
                    returnArray.push({name: folder.label, id: folder.id})
                }
            })
            return returnArray
        }
    },
    data() {
        return {
            buffer: [],
            loading: false,
            sets: [],
            treeProps: {
                children: 'children',
                label: 'label'
            },
            expandedNodes: [],
            newSet: {
                open: false,
                name: "",
                items: [],
                folderMode: 'new',
                folderName: '',
                folderID: '',
                patientID: null,
                searchLoading: false,
                searchResults: []
            },
            editSet: {
                open: false,
                items: [],
                setName: "",
                setID: "",
                unique: ""
            }
        }
    },
    methods: {
        bufferCopy() {
            this.buffer = JSON.parse(JSON.stringify(this.editSet.items))
        },
        bufferAdd(mode) {
           this[mode].items = this[mode].items.concat(this.buffer)
        },
        bufferReplace(mode) {
            this[mode].items = this.buffer
        },
        getSets() {
            this.loading = true
            let user = this.$store.state.constants.userID
            this.doRequest('getSets', {user: user}).then(result => {
                this.sets = result.data
                this.loading = false
            })
        },
        selectSet(item, node) {
            this.newSet.open = false
            if (!item.children) {
                this.doRequest('getSetItems', item.setID).then(result => {
                    this.editSet.items = result.data
                })
                this.editSet.open = true
                this.editSet.setName = JSON.parse(JSON.stringify(item.setName))
                this.editSet.setID = JSON.parse(JSON.stringify(item.setID))
                this.editSet.unique = JSON.parse(JSON.stringify(node.parent.data.unique))
            }
        },
        removeSet(item, e) {
            e.stopPropagation()
            if (item.childNodes && item.childNodes.length > 0) {
                this.$confirm('フォルダー内のすべての項目削除しますか？取り戻すことができません。', '削除確認', {
                    confirmButtonText: '削除',
                    cancelButtonText: 'キャンセル',
                    type: 'warning'
                }).then(() => {
                    this.doRequest('removeSet', item.data).then(result => {
                        let parent = item.parent.data.unique
                        this.expandedNodes = [parent]
                        this.getSets()
                        this.$message({
                            type: 'success',
                            message: '削除しました'
                        })
                    })
                }).catch(() => {})
            } else {
                this.doRequest('removeSet', item.data).then(result => {
                    let parent = item.parent.data.unique
                    this.expandedNodes = [parent]
                    this.getSets()
                    this.$message({
                        type: 'success',
                        message: '削除しました'
                    })
                })
            }
        },
        openNewSet() {
            this.editSet.open = false
            this.newSet = {
                open: true,
                name: "",
                items: [],
                folderMode: 'new',
                folderName: '',
                folderID: '',
                searchLoading: false,
                searchResults: []
            }
        },
        addItem(item) {
            if (this.newSet.open) {
                this.newSet.items.push(item)
            } else {
                this.editSet.items.push(item)
            }
        },
        saveNewSet() {
            this.loading = true
            this.doRequest('newSet', {
                data: JSON.stringify(this.newSet.items),
                patientID: this.newSet.patientID,
                folder: this.newSet.folderID,
                mode: this.newSet.folderMode,
                folderName: this.newSet.folderName,
                name: this.newSet.name
            }).then(result => {
                this.$message({
                    type: 'success',
                    message: '保存しました'
                })
                this.newSet.open = false
                this.getSets()
            })
        },
        saveEditSet() {
            this.loading = true
            this.doRequest('editSet', {
                setID: this.editSet.setID,
                data: JSON.stringify(this.editSet.items),
                name: this.editSet.setName
            }).then(result => {
                this.$message({
                    type: 'success',
                    message: '保存しました'
                })
                this.editSet.open = false
                this.expandedNodes = [this.editSet.unique]
                this.getSets()
            })
        },
        nodeDrop(node, targetNode, mode, e) {
            
            this.loading = true
            let target = 'folder'
            let targetID = targetNode.data.id
            if (targetNode.parent.data.label === '患者') {
                target = 'patient'
                targetID = targetNode.data.children[0].patientID
            }

            
            this.doRequest('moveSet', {
                setID: node.data.setID,
                target: target,
                targetID: targetID
            }).then(result => {
                this.$message({
                    type: 'success',
                    message: '保存しました'
                })
                this.loading = false
            })
        },
        checkAllowDrag(node) {
            if (node.data.children) {
                return false
            }
            return true
        },
        checkAllowDrop(draggedNode,targetNode,mode) {
            if (targetNode.data.children && mode === 'inner' && targetNode.data.label !== '患者') {
                return true
            }
            return false
        },
        removeNewSetItem(item) {
            this.newSet.items.splice(item, 1)
        },
        removeEditSetItem(item) {
            this.editSet.items.splice(item, 1)
        },
        searchPatient(query) {
            if (query !== '') {
                this.newSet.searchLoading = true
                this.doRequest('getQuickPatientSearch', query).then(result => {
                    this.newSet.searchResults = result.data
                    this.newSet.searchLoading = false
                })
            } else {
                this.newSet.searchResults = []
            }
        },
    }
}
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.custom-tree-node button {
    opacity: 0
}
.custom-tree-node:hover button {
    opacity: 1
}
</style>