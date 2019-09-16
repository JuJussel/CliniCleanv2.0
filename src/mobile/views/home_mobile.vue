<template>
    <div class="main-cont">
        <el-menu default-active="2" class="el-menu-vertical" mode="horizontal">
            <el-menu-item index="2">
                <i class="fas fa-camera" style="margin-right: 5px"></i>
                <span slot="title">カメラ</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="fas fa-list" style="margin-right: 5px"></i>
                <span slot="title">タスク</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="fas fa-sign-out-alt" style="margin-right: 5px"></i>
                <span slot="title">ログアウト</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'mobile_home',
    data() {
        return {
            isCollapse: true
        }
    }
}
</script>

<style>
.main-cont {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #f1f1f1;
    overflow: hidden
}
.el-menu-vertical:not(.el-menu--collapse) {
    width: 100%;
  }
</style>
