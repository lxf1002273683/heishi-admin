<template>
  <div class="app-container">
    id为{{userId}}, {{name}} 的评论
  </div>
</template>

<script>
  import { spus_list, update_spus } from '@/api/goods';
  import { getToken } from '@/utils/auth';

  export default {
    data() {
      return {
        name: this.$route.query.name,
        userId: this.$route.query.id
      }
    },
    created() {
      // 获取现有的分类
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
