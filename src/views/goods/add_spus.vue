<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link to="/goods/spus">
        <el-menu-item index="1">SPU列表</el-menu-item>
      </router-link>
      <el-menu-item index="2">创建SPU</el-menu-item>
      <router-link to="/goods/add_shops">
        <el-menu-item index="3">创建店铺</el-menu-item>
      </router-link>
      <router-link to="/goods/add_categories">
        <el-menu-item index="4">创建分类</el-menu-item>
      </router-link>
    </el-menu>
    <div class="goodsAddForm">
      <el-form label-width="80px" :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="商品分类" prop="category_id">
          <el-input v-model="addForm.category_id" class="category_id"></el-input>
          <el-cascader v-model="selectedOptions" expand-trigger="hover" :options="categoryOptions" @change="handleChange" class="category_category_id">
          </el-cascader>
        </el-form-item>
        <el-form-item label="店铺名称" prop="shop_id">
          <el-input v-model="addForm.shop_id" class="shop_id"></el-input>
          <el-select v-model="shopDefault" filterable placeholder="请选择" @change="selectChange" class="select_shop_id">
            <el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="short_name">
          <el-input v-model="addForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input v-model="addForm.brand_name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-input v-model="addForm.image" class="image_box"></el-input>
          <el-upload :headers="header" :action="action" list-type="picture-card" :on-success="handleSuccess" :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="addForm.memo"></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createSpu">立即创建</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { spus_list, add_spus, categories_list, shops_list, classify_cascader } from "@/api/goods";
  import { getToken } from '@/utils/auth';
  export default {
    data() {
      return {
        activeIndex: '2',
        addForm: {
          category_id: '',
          shop_id: '',
          name: '',
          short_name: '',
          brand_name: '',
          image: '',
          desc: '',
          memo: ''
        },
        rules: {
          category_id: { required: true, message: '请选择商品分类', trigger: 'blur' },
          shop_id: { required: true, message: '请输入店铺名称', trigger: 'blur' },
          name: { required: true, message: '请输入商品名称', trigger: 'blur' },
          short_name: { required: true, message: '请输入商品简称', trigger: 'blur' },
          brand_name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
          image: { required: true, message: '请上传图片', trigger: 'blur' },
          desc: { required: true, message: '请输入描述', trigger: 'blur' },
          memo: { required: true, message: '请输入备注', trigger: 'blur' },
        },
        // 商品分类列表
        categoryOptions: [],
        // 默认商品分类为空
        selectedOptions: [],
        // 店铺列表
        shopOptions: [],
        // 店铺默认空
        shopDefault: '',
        // 图片上传action
        action: this.$store.getters.hosts + '/warehouse/api/v1/images',
        // 图片上传headers设置
        header: {
          Authorization: getToken()
        },
        // 图片是否可以上传 false可上传 true禁止上传
        imageUrl: ''
      }
    },
    created(){
      const that = this;
      // 初始化分类选择器
      categories_list().then((res) => {
        that.categoryOptions = classify_cascader(res);
      })
      // 初始化店铺列表
      shops_list().then((res) => {
        that.shopOptions = res.result;
      })
    },
    methods: {
      // 创建spu
      createSpu() {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            add_spus(that.addForm).then(() => {
              that.$message({
                message: '创建成功',
                type: 'success'
              });
              that.$refs.addForm.resetFields();
              that.shopDefault = '';
              that.selectedOptions = [];
              that.imageUrl = '';
            },() => {
              that.$message({
                message: '创建失败',
                type: 'error'
              });
            })
          } else {
            return false;
          }
        });
      },
      // 级联选择器回调
      handleChange(value) {
        if(value.length == 3){
          this.addForm.category_id = value[2].toString();
        }else{
          this.addForm.category_id = '';
        }
      },
      // 选择器变化回调
      selectChange(value) {
        if(value){
          this.addForm.shop_id = value.toString();
        }else{
          this.addForm.shop_id = '';
        }
      },
      // 上传图片成功回调
      handleSuccess(res, file) {
        this.addForm.image = res.uri;
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .goodsAddForm{
    padding: 20px;
    .el-input{
      width: 240px;
    }
    .shop_id,
    .image_box,
    .category_id{
      /*opacity: 0;*/
      display: none;
    }
    .select_shop_id,
    .category_category_id{
      width: 240px;
    }
    .avatar{
      width: 100%;
      height: 100%;
    }
  }
</style>
