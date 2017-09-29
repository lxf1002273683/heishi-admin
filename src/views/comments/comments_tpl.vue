<!-- 评论nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">评论列表</el-menu-item>
      <el-menu-item index="2">短语列表</el-menu-item>
    </el-menu>
    <div class="comments_content">
      <template v-if="activeIndex == 1"><Comments :user_name="query.name" :user_id="query.id"></Comments></template>
      <template v-if="activeIndex == 2"><Quickphrases :user_name="query.name" :user_id="query.id"></Quickphrases></template>
    </div>
  </div>
</template>

<script>
  import Comments from './index';
  import Quickphrases from './quickphrases';
  
  export default {
    components: {
      Comments,
      Quickphrases
    },
    data() {
      return {
        activeIndex: '1',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        }
      }
    },
    methods: {
      // 切换nav
      select(key) {
        this.activeIndex = key;
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .comments_content{
    padding: 20px;
  }
</style>
