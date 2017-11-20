<template>
  <div class="dialog">
    <p class="title">{{express.msg}}</p>
    <p>快递: {{express.expTextName}}</p>
    <p>单号: {{express.mailNo}}</p>
    <p>电话: {{express.tel}}</p>
    <div v-if="activeNum">
      <el-steps :space="200" :active="activeNum" direction="vertical" space="80px">
        <template v-for="item in express.data">
          <el-step :title="item.time" :description="item.context"></el-step>
        </template>
      </el-steps>
    </div>
  </div>
</template>

<script>
    export default {
      props: ['express', 'activeNum']
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dialog{
    padding: 0 110px;
    .title{
      color: #FF4949;
    }
  }
</style>
