<template>
    <el-menu class="navbar" mode="horizontal">
        <!-- 侧边栏模块切换按钮 没有使用图标折叠功能未添加-->
        <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
        <!-- header部位的面包屑 -->
        <levelbar></levelbar>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <span>{{name}}</span>
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class='inlineBlock' to="/">
                    <el-dropdown-item>
                        我的
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided><span @click="logout" class="logout" >退出</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Levelbar from './Levelbar';
    import Hamburger from '@/components/Hamburger';

    export default {
      components: {
        Levelbar,
        Hamburger
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'name'
        ])
      },
      methods: {
        toggleSideBar() {
          this.$store.dispatch('ToggleSideBar')
        },
        logout() {
          this.$store.dispatch('FedLogOut').then(() => {
            location.reload();  // 为了重新实例化vue-router对象 避免bug
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                position: relative;
                margin: 5px 20px;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 22px;
                    font-size: 12px;
                }
            }
            .user-dropdown{
                font-size: 14px;
            }
        }
    }
    .logout{
        display: block;
        width: 100%;
        height: 100%;
    }
</style>



