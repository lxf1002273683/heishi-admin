<!-- spu列表 -->
<template>
  <div class="app-container">
    <div class="spus_list">
      <div class="search">
        <el-input placeholder="请输入查询的分类" v-model="searchInputCategory" class="searchInput">
        </el-input>
        <el-input placeholder="请输入查询的店铺" v-model="searchInputShop" class="searchInput">
          <el-button slot="append" icon="search" v-on:click="handleIconClick"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="category_name" label="分类" width="120">
        </el-table-column>
        <el-table-column prop="shop_name" label="店铺">
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.name}}</span>
            <el-input v-model="scope.row.name" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="short_name" label="简称">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.short_name}}</span>
            <el-input v-model="scope.row.short_name" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="brand_name" label="品牌名称">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.brand_name}}</span>
            <el-input v-model="scope.row.brand_name" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="图片" width="180">
          <template scope="scope">
            <img :src="scope.row.image" v-if="inputstatus != scope.$index">
            <el-upload :headers="header" :action="action" list-type="picture-card" :on-success="handleSuccess" :show-file-list="false" v-if="inputstatus == scope.$index">
              <img v-if="imageUrl" :src="imageUrl" class="imageUrl">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input v-model="scope.row.image" class="avatar"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.desc}}</span>
            <el-input v-model="scope.row.desc" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.memo}}</span>
            <el-input v-model="scope.row.memo" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-input v-model="scope.row.id" type="hidden" class="hiddenbox"></el-input>
            <el-button size="small" @click="compileModule(scope.$index)" class="operation">
              <span v-if="inputstatus != scope.$index">编辑SPU</span>
              <span v-else="inputstatus != scope.$index">确认修改</span>
            </el-button>
            <el-button size="small" @click="addSkus(scope.row.id)" class="operation">创建SKU</el-button>
            <el-button size="small" @click="querySkus(scope.row.id)" class="operation">查询SKU</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="创建SKU" :visible.sync="addSkudialogStatus" top="15%">
      <div>
        <el-form label-width="80px" :model="addForm" ref="addForm">
          <el-form-item label="款式名称" prop="type" required>
            <el-input v-model="addForm.type"></el-input>
          </el-form-item>
          <el-form-item label="销售价格" prop="price" required>
            <el-input v-model="addForm.price"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input v-model="addForm.desc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSkudialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="insertSku">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="querySkudialogTitle" :visible.sync="querySkudialogStatus" top="15%">
      <div>
        <el-table :data="skuData" style="width: 100%" stripe border >
          <el-table-column prop="type" label="款式名称"></el-table-column>
          <el-table-column prop="desc" label="描述"></el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { spus_list, update_spus, add_skus, skus_list } from '@/api/goods';
  import { getToken } from '@/utils/auth';

  export default {
    data() {
      return {
        searchInputCategory: '', // 搜索店铺
        searchInputShop: '', // 搜索分类
        tableData: [],
        inputstatus: null,
        totalPages: 0,
        header: {
          Authorization: getToken()
        },
        // imageUrl 上传预览图 image存储要提交到服务端的url 
        imageUrl: '',
        image: '',
        action: this.$store.getters.hosts + '/warehouse/api/v1/images',
        // 创建sku
        addSkudialogStatus: false,
        addForm: {
          spu_id: '',
          type: '',
          desc: '',
          price: ''
        },
        // 查询sku
        querySkudialogStatus: false,
        skuData: [],
        querySkudialogTitle: ''
      }
    },
    created() {
      // 获取现有的分类
      this.initSpusList();
    },
    methods: {
      // 修改spu部分信息
      compileModule(index){
        var that = this;
        if(that.inputstatus !== null){
          const inputstatus = that.inputstatus;
          const id = that.tableData[inputstatus]['id'];
          const obj = {
            name: that.tableData[inputstatus]['name'],
            short_name: that.tableData[inputstatus]['short_name'],
            brand_name: that.tableData[inputstatus]['brand_name'],
            image: that.image,
            desc: that.tableData[inputstatus]['desc'],
            memo: that.tableData[inputstatus]['memo']
          }
          update_spus(id, obj).then(()=>{
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.imageUrl = '';
            that.inputstatus = null;
          }).catch(function(err){
            that.$message({
              message: '修改失败',
              type: 'error'
            });
            that.inputstatus = null;
            that.imageUrl = '';
          })
        }else{
          that.inputstatus = index;
        }
      },
      // 上传成功后的回调
      handleSuccess(res, file) {
        this.tableData[this.inputstatus]['image'] = URL.createObjectURL(file.raw);
        this.image = res.uri;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 分页
      handleCurrentChange(val) {
        const obj = {
          page: val,
          category_name: this.searchInputCategory,
          shop_name: this.searchInputShop
        }
        this.initSpusList(obj);
      },
      // 店铺搜索
      handleIconClick() {
        const obj = {
          shop_name: this.searchInputShop,
          category_name: this.searchInputCategory
        }
        this.initSpusList(obj);
      },
      // 打开创建SKU模态框
      addSkus(id) {
        this.addForm.spu_id = id;
        this.addSkudialogStatus = true;
      },
      // 检验sku信息并创建
      insertSku() {
        const that = this
        if(!this.addForm.type){
          that.$message({
            message: '请填写款式名称',
            type: 'error'
          });
          return false;
        }
        if(!this.addForm.price || !$.isNumeric(this.addForm.price)){
          that.$message({
            message: '请填写销售价格，注意格式是否正确',
            type: 'error'
          });
          return false;
        }
        add_skus(that.addForm).then(() => {
          that.$message({
            message: '创建成功',
            type: 'success'
          });
          that.$refs.addForm.resetFields();
          that.addSkudialogStatus = false;
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
        })
      },
      // 查询当前spu对象的所有sku
      querySkus(id) {
        const obj = {
          spu_id: id
        }
        const that = this;
        skus_list(obj).then((res) => {
          that.skuData = res.result;
          that.querySkudialogTitle = res.result[0]['spu_name'];
        })
        this.querySkudialogStatus = true;
      },
      // 获取spu列表
      initSpusList(obj) {
        const that = this;
        const params = {};
        if(obj){
          $.extend(params, obj)
        }
        spus_list(params).then((res) => {
          that.tableData = res.result;
          // 重置totalPages 计算是否有分页
          that.totalPages = res.totalPages*10;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .spus_list{
    .search{
      .searchInput{
        float: left;
        width: 240px;
        padding: 0 0 20px ;
      }
    }
    img{
      width: 100%;
      max-width: 120px;
      padding: 10px;
    }
    .hiddenbox{
      display: none;
    }
    .el-upload--picture-card{
      width: 80px;
      height: 80px;
    }
    .imageUrl{
      width: 100%;
      height: 100%;
    }
    .avatar{
      display: none;
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .operation{
      margin: 3px 0;
    }
  }
</style>

