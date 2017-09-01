<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">SPU列表</el-menu-item>
      <router-link to="/goods/add_spus">
        <el-menu-item index="2">创建SPU</el-menu-item>
      </router-link>
      <router-link to="/goods/add_shops">
        <el-menu-item index="3">创建店铺</el-menu-item>
      </router-link>
      <router-link to="/goods/add_categories">
        <el-menu-item index="4">创建分类</el-menu-item>
      </router-link>
    </el-menu>
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
        <el-table-column label="操作" width="70">
          <template scope="scope">
            <el-input v-model="scope.row.id" type="hidden" class="hiddenbox"></el-input>
            <el-button size="small" @click="compileModule(scope.$index)">
              <span v-if="inputstatus != scope.$index">编辑</span>
              <span v-else="inputstatus != scope.$index">确认</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { spus_list, update_spus } from '@/api/goods';
  import { getToken } from '@/utils/auth';

  export default {
    data() {
      return {
        activeIndex: '1',
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
        action: this.$store.getters.hosts + '/warehouse/api/v1/images'
      }
    },
    created() {
      // 获取现有的分类
      this.getSpus();
    },
    methods: {
      getSpus() {
        const that = this;
        spus_list().then((res) => {
          that.tableData = res.result;
          that.totalPages = res.totalPages*10;
        })
      },
      compileModule(index){
        var that = this;
        if(this.inputstatus !== null){
          this.inputstatus = null;
          const id = this.tableData[index]['id'];
          const obj = {
            name: this.tableData[index]['name'],
            short_name: this.tableData[index]['short_name'],
            brand_name: this.tableData[index]['brand_name'],
            image: this.image,
            desc: this.tableData[index]['desc'],
            memo: this.tableData[index]['memo']
          }
          update_spus(id, obj).then(()=>{
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            this.imageUrl = '';
          }).catch(function(err){
            that.$message({
              message: '修改失败',
              type: 'error'
            });
            this.imageUrl = '';
          })
        }else{
          this.inputstatus = index;
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
        const that = this
        const obj = {
          page: val,
          category_name: this.searchInputCategory,
          shop_name: this.searchInputShop
        }
        spus_list(obj).then((res) => {
          that.tableData = res.result;
        })
      },
      // 店铺搜索
      handleIconClick() {
        const that = this
        const obj = {
          shop_name: this.searchInputShop,
          category_name: this.searchInputCategory
        }
        spus_list(obj).then((res) => {
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
    padding: 20px;
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
  }
</style>

