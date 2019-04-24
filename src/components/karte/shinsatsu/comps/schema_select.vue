<template>
    <div style="margin: 5px">
        <div v-for="(cat, catIndex) in items" :key="catIndex">
            {{ cat.cat }} 
            <div style="display: flex; flex-wrap: wrap"> 
                <el-card
                    shadow="hover" 
                    v-for="(rowImg, rowIndex) in cat.img" 
                    @click.native="selectImg(rowImg.filename)" 
                    :key="rowIndex" 
                    style="width: 100px; margin: 2px; cursor: pointer" 
                    :body-style="{ padding: '0px' }">
                    <div v-bind:style="{'background-image': 'url(' + $globals.apiURL + '/ASSETS/SCHEMA/' + rowImg.filename + 'S.png)'}" class="itemImage"></div>
                    <div style="padding: 14px;">
                        <span> {{ rowImg.title }} </span>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created() {
        this.doRequest('getSchemas').then(result => {
            this.items = result.data
        })
    },
    data() {
        return {
            items: []
        }
    },
    methods: {
        selectImg(img) {
            this.$emit('select',img)
        }
    }
}
</script>

<style>
  .itemImage {
    height: 100px;
    width: 100px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
