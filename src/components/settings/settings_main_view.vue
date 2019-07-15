<template>
    <div v-loading ="display.loading" style="height: calc(100% - 50px)">
            <el-radio-group v-model="activeTab" size="medium" style="margin-bottom: 10px">
                <el-radio-button label="set" v-if="acl.set">セット管理</el-radio-button>
            </el-radio-group>
            <div class="cont" style="padding-right: 10px">
                <set v-if="acl.set && !display.loading" v-bind:class="{'visible': activeTab === 'set'}" class="tabCont112"></set>
            </div>
    </div>
</template>

<script>

import set from'./comps/set'

export default {
    components: {
        set
    },
    computed: {
        acl() {
            let userRole = this.$store.state.constants.userRole
            let returnArr = {
                set: checkACL('set')
            }
            function checkACL(view) {
                if (userRole === '1') { // Admin
                    return true
                } else if (userRole === '2') { // Doctor
                    if (
                        view === 'set'
                    ) {
                        return true
                    }
                }
                return false
            }
            return returnArr
        }
    },
    data() {
        return {
            display: {
                loading: false
            },
            activeTab: 'set'

        }
    }

}
</script>

<style scoped>
 .tabCont112 {
     margin-left: -10000px;
     position: absolute;
     height: calc(100% - 65px)!important;
     width: calc(100% - 20px)
 }
 .visible {
     margin-left: 0px
 }
</style>
