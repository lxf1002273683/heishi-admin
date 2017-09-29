<!-- 查询商品信息模板 -->
<template>
  <div class="goods">
    <el-form label-width="80px">
      <el-form-item label="封面图">
        <span><img class="filepath" :src="goods.filepath + '@!320x320'"></span>
      </el-form-item>
      <el-form-item label="商品名称">
        <span>{{goods.post_title}}</span>
      </el-form-item>
      <el-form-item label="时间">
        <span>{{goods.post_date}}</span>
      </el-form-item>
      <!-- <el-form-item label="浏览量">
        <span>{{goods.post_hits}}</span>
      </el-form-item>
      <el-form-item label="点赞">
        <span>{{goods.post_like}}</span>
      </el-form-item> -->
      <el-form-item label="内容">
        <span v-html="goods.post_excerpt"></span>
      </el-form-item>
      <el-form-item label="类型">
        <p v-for="item in goods.types">款式:{{item.goodsType}}&nbsp;&nbsp;价格:{{item.goodsPrice}}&nbsp;&nbsp;库存:{{item.goodsStock}}&nbsp;&nbsp;邮费:{{item.postage}}</p>
      </el-form-item>
      <el-form-item label="图片列表">
        <div class="images">
          <img v-for="item in goods.images" :src="item + '@!320x320'">
        </div>
      </el-form-item>
      <el-form-item label="评论列表">
        <div class="comments">
          <p v-for="item in goods.comments">
            {{item.full_name}} 回复<span class="to_user" v-if="item.to_nickname">@{{item.to_nickname}}</span>
            <span v-if="item.type == 0">{{item.content}}</span>
            <span v-if="item.type == 1">{{item.content}}</span>
            <span v-if="item.type == 2" style="color: red;">{{item.content}}</span>
            <span v-if="item.type == 3" style="color: #00f;">{{item.content}}</span>
            <span v-if="item.type == 4"><img :src="item.content + '@!320x320'"></span>
            <span v-if="item.type == 14" style="color: #7b7b7b;">该用户言论因过于二逼被删除</span>
            <span class="time">{{item.createtime}}</span>
          </p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { query_goods } from '@/api/comment';

  export default {
    props: ['goods_id'],
    data() {
      return {
        goods: {
          filepath: '',
          post_title: '',
          post_date: '',
          post_hits: '',
          post_like: '',
          post_excerpt: '',
          types: [],
          images: [],
          comments: []
        }
      }
    },
    watch: {
      goods_id() {
        this.initGoods();
      }
    },
    created() {
      this.initGoods();
    },
    methods: {
      initGoods() {
        const id = this.goods_id;
        const that = this
        query_goods(id).then((res) => {
          that.goods = res
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .goods{
    .filepath{
      width: 100px;
    }
    .el-form-item{
      border-bottom: 1px solid #ccc;
      margin: 0;
    }
    .images{
      img{
        width: 100px;
        margin: 10px 20px;
      }
    }
    .comments{
      color: #aaa;
      .to_user{
        color: #494949;
        font-weight: 700;
      }
      img{
        width: 100px;
        vertical-align: top;
      }
      .time{
        float: right;
      }
    }
    p{
      margin: 0;
      border-bottom: 1px solid #ccc;
      padding: 5px;
      &:last-child{
        border-bottom: none;
      }
    }
  }
</style>
