<template>
  <div class="main">
    <el-breadcrumb class="app-levelbar" separator="/">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item">
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1'>{{item.name}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
      <div class="history">
        <template v-for="(item, index) in routers">
          <router-link :to="item.url">
            <el-tag closable :disable-transitions="false" @close.stop.prevent="handleClose(index)">{{item.name}}</el-tag>
          </router-link>
        </template>
      </div>
  </div>
</template>

<script>
    export default {
      created() {
        this.getBreadcrumb()
      },
      data() {
        return {
          levelList: null,
          routers: this.$store.getters.routerPath
        }
      },
      methods: {
        getBreadcrumb() {
          let matched = this.$route.matched.filter(item => item.name);
          const first = matched[0];
          if (first && (first.name !== '首页' || first.path !== '')) {
            matched = [{ name: '首页', path: '/' }].concat(matched)
          }
          this.levelList = matched;
        },
        handleClose(index) {
          this.$store.dispatch('DeletePath', index)
        }
      },
      watch: {
        // 当路由发送变化时，重新返回levelList
        $route() {
          this.getBreadcrumb();
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main{
    display: inline-block;
    width: 86%;
    overflow: hidden;
    white-space:nowrap;  
    .app-levelbar.el-breadcrumb {
      display: inline-block;
      font-size: 14px;
      line-height: 50px;
      margin-left: 10px;
      .no-redirect {
        color: #97a8be;
        cursor: text;
      }
    }
    .history{
      display: inline-block;
      vertical-align: top;
      padding-left: 20px;
      height: 50px;
      overflow: hidden;
    }
    .el-tag {
      margin-left: 10px;
      background-color: rgba(64,158,255,.1);
      display: inline-block;
      padding: 0 10px;
      height: 32px;
      line-height: 30px;
      font-size: 12px;
      color: #409eff;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid rgba(64,158,255,.2);
      white-space: nowrap;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
