<template>
    <div style="height: 100%">
        <el-card class="tweet" :body-style="{ height: 'calc(100% - 100px', overflow: 'auto' }">
            <div slot="header" class="clearfix">
                <span>ニュース</span>
            </div>
            <Timeline id="medley_life" sourceType="profile" :options="{ tweetLimit: '10' }"/>
        </el-card>
    </div>
</template>

<script>
import Timeline from 'vue-tweet-embed/src/timeline'

export default {
    components: {
        'Timeline': Timeline
    }
}
</script>

<style>
.tweet {
    width: 400px;
    height: calc(100% - 30px);
}
</style>
