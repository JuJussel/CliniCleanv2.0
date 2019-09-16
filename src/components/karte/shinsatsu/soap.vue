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
                trigger="manual"
                v-model="display.schemaOpen">
                <span style="display: flex">
                    <schemaSelect @select="addImg" style="width: 330px; overflow: auto; height: 500px"></schemaSelect>
                    <jupaint ref="schemaPainter" v-if="display.schemaOpen" :parentWidth="800" :parentHeight="500"></jupaint>
                </span>
                <span style="float: right">
                    <el-button type="text" @click="display.schemaOpen = false">キャンセル</el-button>
                    <el-button type="primary" @click="addSchema">追加</el-button>
                </span>
                <button @click="display.schemaOpen = true" style="width: 82px" slot="reference" class="ql-customBtn"><i class="fas fa-pencil-alt"> シェーマ</i></button>
            </el-popover>
        </div>
        <vue-editor
            style="max-height: 770px; overflow: auto"
            ref="editor"
            useCustomImageHandler
            @imageAdded="imageAdd"
            :customModules="editorModules"
            :editorOptions="editorOptions"
            v-model="text">
        </vue-editor>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import ImageResize from 'quill-image-resize'
import jupaint from '../../shared/jupaint'
import schemaSelect from './comps/schema_select'

export default {
    props: [
        'soapContent'
    ],
    components: {
        VueEditor,
        jupaint,
        schemaSelect
    },
    created() {
        this.$emit('loading', {type: 'loading', el: 'soap'})
        this.$eventHub.$on('updateTask', this.addKensaResult)
        this.$eventHub.$on('recordVitals', this.recordVitals)
        this.$eventHub.$on('addVital', this.addVital)
        this.$eventHub.$on('addText', this.addText)
    },
    beforeDestroy() {
        this.$eventHub.$off('updateTask')
        this.$eventHub.$off('recordVitals')
        this.$eventHub.$off('addVital')
        this.$eventHub.$off('addText')
    },
    watch: {
        soapContent() {
            this.text = this.soapContent
        }
    },
    data() {
        return {
            display: {
                schemaOpen: false
            },
            text: "",
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
                        }
                        }
                    }
                }
            }
        }
    },
    methods: {
        addText(text) {
            this.text = this.text + text + '</br>'
        },
        addVital(vital) {
            let string = vital[0] + ": " + vital[1] + " " + vital[2] + vital[3]
            this.text = this.text + string + '</br>'
        },
        recordVitals(cont) {
            let string = ""
            cont.forEach(element => {
                string = string + 
                    "<strong>" + 
                    element.nameShort + 
                    "：</strong>" + 
                    element.value +
                    element.unit
            });
            this.text = this.text + string + '</br>'
        },
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
        },
        addImg(img) {
            this.$refs.schemaPainter.addImage(img);
        },
        addSchema() {
            let cursorLocation = this.$refs.editor.quill.getSelection()
            let img = this.$refs.schemaPainter.getPainting()
            this.doRequest('schemaUpload', img).then(result => {
                let url = result.url
                this.$refs.editor.quill.insertEmbed(cursorLocation, 'image', url)
                this.display.schemaOpen = false
            })
        },
        addKensaResult(data) {
            if (data.status) {
                if (data.subTask === "0") {
                let text = "<p>　</p><p><strong>" + data.name + "</strong></p>";
                for (var i = 0; i < data.results_raw.length; i++) {
                    text = text + "<p>" + data.results_raw[i].name + "：" + data.results_raw[i].value;
                }
                text = text + "<p></p>";
                this.soapContent = this.soapContent + text
                }
            }
        }
    }
}
</script>

<style scoped>
.content {
    margin: 10px
}
</style>
