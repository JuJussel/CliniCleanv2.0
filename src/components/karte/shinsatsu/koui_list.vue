<template>
    <div class="content">
        <kouiItems 
            @delete="deleteItem(index)" 
            class="koui" 
            v-for="(item, index) in items" 
            :key="index" 
            :item="item" 
            :insurances="display.insurances">
        </kouiItems>
    </div>
</template>

<script>

import kouiItems from './comps/koui_item'

export default {
    components: {
        'kouiItems': kouiItems
    },
    created() {
        this.$emit('loading', {type: 'loading', el: 'kouiList'})
        let shinsatsuID = this.$store.state.componentData.home.shinsatsu
        this.doRequest('getKouiState', shinsatsuID).then(result => {
            this.items = JSON.parse(result.data)
            this.$emit('loading', {type: 'loadingDone', el: 'kouiList'})
        })
        let patientID = this.$store.state.componentData.karteDetails.patient.id
        this.doRequest('getReceptionInsurance', patientID).then(result => {
            let array = result.data.filter(item => item.wholeName !== '自費')
            this.display.insurances = array
        })
        this.$eventHub.$on('updateTask', this.updateTask)
    },
    beforeDestroy() {
        this.$eventHub.$off('updateTask')
    },
    data() {
        return {
            items: [],
            display: {
                insurances: []
            }
        }
    },
    methods: {
        deleteItem(index) {
            this.items.splice(index,1)
        },
        updateTask(data) {
            console.log(data);
            
            let target = this.items.find(item => item.trackingID == data.trackingID)
            console.log(target);
                      
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

