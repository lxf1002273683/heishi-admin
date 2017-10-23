 <!-- 商品列表 -->
<template>
  <div class="app-container">
    <div class="article_list">
      <div class="search">
        <el-input v-model="articleTitle" placeholder="请输入查询的文章标题" class="searchInput" @change="selectArticle"></el-input>
      </div>
      <el-table :data="tableData" border stripe style="width: 100%;"  v-loading.body="listLoading" element-loading-text="拼命加载中">
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column prop="hits" label="浏览量" width="80"></el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="170"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template scope='scope'>
            <span class="status0" v-if="scope.row.post_status == 0">待审核</span>
            <span class="status1" v-if="scope.row.post_status == 1">已通过</span>
            <span class="status2" v-if="scope.row.post_status == -1">未通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button size="small" @click.stop="updateArticle(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'></el-pagination>
    </div>
    <el-dialog title="文章详情" :visible.sync="dialogStatus" top="5%" size="large" class="dialog" @close="closeDialog">
      <el-form label-width="30%" ref="updateForm" :model="updateForm">
        <el-form-item label="文章标题：" prop="post_title">
          <span class="post_title">{{updateForm.post_title}}</span>
        </el-form-item>
        <el-form-item label="内容：" prop="post_excerpt">
          <span class="post_excerpt" v-html="updateForm.post_excerpt"></span>
        </el-form-item>
        <el-form-item label="封面图：" prop="filepath">
          <img :src="updateForm.filepath">
        </el-form-item>
        <el-form-item label="款式列表：" prop="types">
          <div class="sku_list">
            <el-table :data="updateForm.types" stripe style="width: 500px;" border>
              <el-table-column prop="goodsType" label="款式"></el-table-column>
              <el-table-column label="价格"  prop="goodsPrice"></el-table-column>
              <el-table-column label="库存">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.goodsStock"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="邮费"  prop="postage"></el-table-column>
              <el-table-column label="操作" width="80">
                <template scope="scope">
                  <el-button size="small" @click.stop="updateStock(updateForm.id,scope.$index)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="图片列表：">
          <template scope="scope">
            <img class="images" :src="item + '@!320x320'" v-for="item in updateForm.images">
            <div></div>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { article_list, query_goods, update_stock } from '@/api/article';
  import { getToken } from '@/utils/auth';

  export default {
    props: ['user_name', 'user_id'],
    data() {
      return {
        tableData:[],
        totalPages: 0,
        articleTitle: '',
        listLoading: true,
        dialogStatus: false,
        updateForm: {
          post_title: '',
          post_excerpt: '',
          images: [],
          filepath: '',
          types: [],
          postage: ''
        }
      }
    },
    created() {
      this.initArticleList();
    },
    methods: {
      // 初始化列表
      initArticleList(obj) {
        const that = this;
        // 初始化用户每页20
        const params = {
          size: 10,
          user_id: this.user_id
        }
        if(obj){
          $.extend(params, obj)
        }
        that.listLoading = true;
        article_list(params).then((res) => {
          that.tableData = res.result;
          that.totalPages = res.totalPages*10;
          that.listLoading = false;
        })
      },
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        if(this.articleTitle){
          obj.title = this.articleTitle
        }
        this.initArticleList(obj);
      },
      // 搜索文章
      selectArticle() {
        const obj = {
          title: this.articleTitle
        }
        this.initArticleList(obj);
      },
      // 打开修改窗口
      updateArticle(id) {
        this.dialogStatus = true;
        const that = this;
        query_goods(id).then((res) => {
          that.updateForm = res;
        })
      },
      updateStock(goodsId, index) {
        const that = this;
        const arr = [];
        const obj = {
          sid: this.updateForm.types[index]['goodsTypeID'],
          stock: this.updateForm.types[index]['goodsStock']
        };
        arr.push(obj);
        update_stock(goodsId, JSON.stringify(arr)).then((res) => {
          that.$message({
            message: '修改成功',
            type: 'success'
          });
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
      },
      // 关闭dialog时，初始化状态
      closeDialog() {
        this.$refs.updateForm.resetFields();
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .article_list{
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .search{
      text-align: center;
      .searchInput{
        width: 240px;
        padding-bottom: 20px;
      }
    }
    .status0{
      color: #20A0FF;
    }
    .status1{
      color: #13CE66;
    }
    .status2{
      color: #FF4949;
    }
    
  }
  .dialog{
    img{
      max-width: 500px;
    }
    .images{
      width: 200px;
      margin-right: 50px
    }
    .post_title,
    .post_excerpt{
      max-width: 700px;
      display: block;
    }
  }
</style>
