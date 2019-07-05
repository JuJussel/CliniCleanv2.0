<template>
    <div style="height: 100%; display: flex">
        <el-card class="cardDash" :body-style="{ height: 'calc(100% - 100px', overflow: 'auto' }">
            <div slot="header" class="clearfix">
                <span>ニュースmedley</span>
            </div>
            <Timeline id="medley_life" sourceType="profile" :options="{ tweetLimit: '10' }"/>
        </el-card>
        <el-card class="cardDash" :body-style="{ height: 'calc(100% - 100px', overflow: 'auto' }">
            <div slot="header" class="clearfix">
                <span>ニュースm3.com</span>
            </div>
            <Timeline id="m3com_editors" sourceType="profile" :options="{ tweetLimit: '10' }"/>
        </el-card>
        <el-card class="cardDash" style="width: 550px" :body-style="{ height: 'calc(100% - 100px', overflow: 'auto' }">
            <div slot="header" class="clearfix">
                <span>患者ニュース</span>
            </div>
            <el-table class="cctable" :data="news" size="mini">
                <el-table-column
                    label="患者名">
                    <template slot-scope="scope">
                        <span> {{ scope.row.name_last_kanji}} {{scope.row.name_first_kanji}} </span>
                    </template>
                </el-table-column>
                <el-table-column
                label="タイプ">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === '1'">SRL検査結果</span>
                        <span v-if="scope.row.type === '2'">院内検査結果</span>
                        <span v-if="scope.row.type === '3'">予防接種</span>
                        <span v-if="scope.row.type === '4'">注射</span>
                        <span v-if="scope.row.type === '5'">タスク完了</span>
                        <span v-if="scope.row.type === '7'">処置完了 </span>
                        <span v-if="scope.row.type === '8'">手術完了</span>
                        <span v-if="scope.row.type === '9'">エックス線完了</span>
                        <span v-if="scope.row.type === '95'">健康診断検査結果</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="項目">
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button size="mini" @click="gotoItem(scope.row)">詳細見る</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card style="width: 550px; height: 380px">
            <div slot="header" class="clearfix">
                <span>天気予報</span>
            </div>
            <weather 
                api-key="634cea1fa2d841d73a5906f59534aa4d"
                latitude="35.6895"
                longitude="139.6917"
                language="ja"
                bar-color="#00a48f"
                units="ca"
                style="margin-top: 30px">
            </weather>
        </el-card>
    </div>
</template>

<script>
import Timeline from 'vue-tweet-embed/src/timeline'
import weather from 'vue-weather-widget'

export default {
    components: {
        'Timeline': Timeline,
        'weather': weather
    },
    created() {
        this.getData()
    },
    data() {
        return {
            news: []
        }
    },
    methods: {
      getData() {
          this.doRequest('getNews').then(result => {
              this.news = result.data
          })
      },
      gotoItem(item) {
        this.$store.commit('SET_PATIENTDETAILS_PATIENT_ID', item.patientID);
        this.$eventHub.$emit('homeTrigger', {mode: 'gotoPatientDetailsMedical'})
        this.markAsRead(item)
      },
      markAsRead(item) {
        let type = 'kensa'
        if (item.kenkoushindan_ID) {
            type = 'kksd'
        }
        let patientID = this.$store.state.componentData.patientDetails.IDselected;
        this.doRequest('markNewsRead', {type: type, notID: item.ID}).then(result => {
            this.getData()
        })
      }
    }
}
</script>

<style>
.cardDash {
    width: 400px;
    height: calc(100% - 30px);
    margin-right: 10px
}
</style>
