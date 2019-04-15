<template>
    <div>
         <div id="customToolbar">
            <button class="ql-italic"></button>
            <button class="ql-bold"></button>
            <button class="ql-underline"></button>
            <select style="margin-top: -3px" class="ql-color"></select>
            <button class="ql-image"></button>
            <el-popover
                placement="bottom"
                title="シェーマ"
                trigger="click"
                v-model="display.schemaOpen">
                <span style="display: flex">
                    <schemaSelect style="width: 220px; overflow: auto; height: 500px"></schemaSelect>
                    <jupaint v-if="display.schemaOpen" :parentWidth="800" :parentHeight="500"></jupaint>
                </span>
                <span style="float: right">
                    <el-button type="text" @click="display.schemaOpen = false">キャンセル</el-button>
                    <el-button type="primary">追加</el-button>
                </span>
                <button style="width: 82px" slot="reference" class="ql-customBtn"><i class="fas fa-pencil-alt"> シェーマ</i></button>
            </el-popover>

              
        </div>
        <vue-editor
            useCustomImageHandler
            @imageAdded="imageAdd"
            :customModules="editorModules"
            :editorOptions="editorOptions"
            v-model="soapContent">
        </vue-editor>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import ImageResize from 'quill-image-resize'
import jupaint from '../../shared/jupaint'
import schemaSelect from './comps/schema_select'

export default {
    components: {
        VueEditor,
        jupaint,
        schemaSelect
    },
    data() {
        return {
            display: {
                schemaOpen: false
            },
            soapContent: "",
            editorModules: [
                {alias: 'imageResize', module: ImageResize}
            ],
            editorOptions: {
                modules: {
                    imageResize: {},
                    toolbar: {
                        container: "#customToolbar",
                        handlers: {
                        customBtn: () => {
                            console.log("custom button was clicked");
                        }
                        }
                    }
                }
            }
        }
    },
    methods: {
        imageAdd(file, Editor, cursorLocation, resetUploader) {
            var that = this
            var fr = new FileReader()
            fr.onload = function () {
                that.doRequest('uploadImage', fr.result).then(result => {
                let url = result.url
                Editor.insertEmbed(cursorLocation, 'image', url)
                resetUploader()
            })
            }
            fr.readAsDataURL(file)                
        }
    }
}
</script>

<style scoped>
.content {
    margin: 10px
}
</style>
