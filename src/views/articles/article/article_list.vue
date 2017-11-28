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
            <span class="status0" v-if="scope.row.post_status == 0 && scope.row.status != 0">待审核</span>
            <span class="status1" v-if="scope.row.post_status == 1 && scope.row.status != 0">已通过</span>
            <span class="status2" v-if="scope.row.post_status == -1 && scope.row.status != 0">未通过</span>
            <span class="status2" v-if="scope.row.status == 0">已删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button v-if="scope.row.status == 0 || scope.row.post_status == -1" :disabled="true" size="small" >修改</el-button>
            <el-button v-else size="small" @click.stop="updateArticle(scope.row.id)">修改</el-button>
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
            <div class="add_types">
              <el-select v-model="spuOptions" filterable clearable remote placeholder="请输入SPU名称" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id">
                <el-option v-for="item in spuItems" :label="item.name" :key="item.value" :value="item.id"></el-option>
              </el-select>
            </div>
            <el-table :data="updateForm.types" stripe style="width: 620px;" border>
              <el-table-column label="款式">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.goodsType"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格" width="70">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.goodsPrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="库存" width="120">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.goodsStock" class="stock"></el-input>
                  <span class="reality_stock" v-if="scope.row.skus_info != null">{{scope.row.skus_info.quantity}}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮费"  prop="postage" width="70">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.postage"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="商品查询"  prop="hk_sku_id" width="80">
                <template scope="scope">
                  <span v-if="scope.row.skus_info != null">{{scope.row.skus_info.spu_name}}/{{scope.row.skus_info.type}}</span>
                  <el-button v-if="scope.row.skus_info == null && scope.row.hk_sku_id != 0" type="text" @click.once="query_stock(scope.row.hk_sku_id,scope.$index)"  class="btn" size="mini" >商品查询</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="130">
                <template scope="scope">
                  <el-button class="btn" size="small" @click.stop="updateSku(updateForm.id,scope.$index)">修改</el-button>
                  <el-button class="btn" size="small" type="danger" @click.stop="deleteSku(updateForm.id,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="add_types" stripe style="width: 620px;" border :show-header="false">
              <el-table-column label="款式">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.type"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格" width="70">
                <template scope="scope">
                  <el-input placeholder="价格" size="mini" v-model="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="库存" width="120">
                <template scope="scope">
                  <el-input placeholder="库存" size="mini" v-model="scope.row.quantity"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="邮费" width="70">
                <template scope="scope">
                  <el-input placeholder="邮费" size="mini" v-model="scope.row.postage"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="商品查询" prop="id" width="80">
              </el-table-column>
              </el-table-column>
              <el-table-column label="操作" width="130">
                <template scope="scope">
                  <el-button class="btn" size="small" type="primary " @click.stop="addType(updateForm.id,scope.$index)">添加</el-button>
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
  import { article_list, query_goods, update_type } from '@/api/article';
  import { skus_list, spus_list, sku_info } from '@/api/goods';
  import { getToken } from '@/utils/auth';
  import { numberInt } from '@/utils/index';

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
        },
        add_types: [{
          type: '',
          quantity: '',
          price: '',
          postage: '',
          id: '0'
        }],
        // sku搜索
        spuOptions: '',
        loading: false,
        spuItems: [],
        openArticleId: null
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
          Object.assign(params, obj)
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
        this.openArticleId = id;
        this.article_info(id);
      },
      // 关闭dialog时，初始化状态
      closeDialog() {
        this.openArticleId = null;
        this.$refs.updateForm.resetFields();
        this.spuOptions = '';
        this.add_types = [{
          type: '',
          quantity: '',
          price: '',
          postage: '',
          id: '0'
        }];
      },
      // 搜索spu
      remoteMethod(query) {
        const that = this;
        const obj = {
          name: query,
          size: 20
        }
        if(query){
          spus_list(obj).then((res) => {
            that.spuItems = res.result;
          })
        }
      },
      // 将选择的sku放入table列表中
      selectChange(val) {
        if(!val){
          return false;
        }
        const that = this;
        const obj = {
          spu_id: val,
          size: 20
        }
        skus_list(obj).then((res) => {
          if(!res.result.length){
            that.$message({
              message: '该商品没有添加sku，请添加后再选择',
              type: 'error'
            });
            return false;
          }
          res.result.forEach((n, i) => {
            n['postage'] = 0;
            that.add_types.unshift(n);
          })
        })
      },
      // 提交修改
      updateSku(goodsId, index) {
        const that = this;
        const arr = [];
        const obj = {
          id: this.updateForm.types[index]['goodsTypeID'],
          name: this.updateForm.types[index]['goodsType'],
          price: this.updateForm.types[index]['goodsPrice'],
          postage: this.updateForm.types[index]['postage'],
          stock: this.updateForm.types[index]['goodsStock']
        };
        // 添加前检测
        if(verification(obj, that)) return false;
        arr.push(obj);
        update_type(goodsId, JSON.stringify(arr)).then((res) => {
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
      // 添加 款式sku
      addType(goodsId, index) {
        const that = this;
        let status = false;
        // 初始化提交数据
        const skus = [];
        const submit_type = {
          name: that.add_types[index]['type'],
          stock: that.add_types[index]['quantity'],
          price: that.add_types[index]['price'],
          postage: that.add_types[index]['postage']
        }
        // 添加前检测
        if(verification(submit_type, that)) return false;
        // 检测提交数据中是否有 sku_id
        if(that.add_types[index]['id'] != 0){
          submit_type['sku_id'] = that.add_types[index]['id'];
          // 检测 当前待添加sku 是否已经在商品中
          that.updateForm.types.forEach((item, i) => {
            if(item.hk_sku_id == that.add_types[index]['id']){
              that.$message({
                message: '此SKU已关联',
                type: 'error'
              });

              status = true;
              return status;
            }
          })
          if(status) return status;
        }
        // 数据提交
        skus.push(submit_type);
        update_type(goodsId, JSON.stringify(skus)).then((res) => {
          that.$message({
            message: '添加成功',
            type: 'success'
          });
          // 更新已添加款式
          that.article_info(that.openArticleId);
          // 将成功提交的数据 在列表中删除
          that.add_types.splice(index, 1);
          // 提交最后一个款式后，增加新的输入表单
          const add_types_length = that.add_types.length;
          if(add_types_length == index){
            const obj = {
              type: '',
              quantity: '',
              price: '',
              postage: '',
              id: '0'
            }
            that.add_types.push(obj);
          }
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
      },
      // 删除款式sku
      deleteSku(goodsId, index) {
        console.log(goodsId)
        console.log(index)
        const that = this;
        that.$message({
          message: '待添加',
          type: 'error'
        });
        // 成功后操作
        // that.updateForm.types.splice(index, 1);
      },
      // 查询库存
      query_stock(id, index) {
        const that = this;
        sku_info(id).then((res) => {
          that.updateForm.types[index]['skus_info'] = res;
        },(error) => {
          that.$message({
            type: 'error',
            message: error.message
          })
        })
      },
      // 查询商品详情
      article_info(id) {
        const that = this;
        query_goods(id).then((res) => {
          // 增加一个实际库存参数，方便后面显示
          res.types.forEach((item, index) => {
            item['skus_info'] = null;
          })
          that.updateForm = res;
        })
      }
    }
  };
  // 对提交信息进行验证， 错误返回true
  function verification(active_type, that) {
    if(numberInt(active_type.price) || numberInt(active_type.stock) || !active_type.name || numberInt(active_type.postage)){
      that.$message({
        message: '请正确填写款式信息(数字中不要出现小数)',
        type: 'error'
      });
      return true;
    }
  }
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
    .btn{
      display: inline-block;
      margin: 0 5px;
    }
    .add_types{
      margin: 6px 0;
    }
    .stock{
      width: 50px;
    }
    .cell{
      padding: 0 10px;
    }
    .reality_stock{
      color: #67C23A;
    }
  }
</style>
