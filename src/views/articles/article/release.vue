 <!-- 发布商品 -->
<template>
  <div class="app-container">
    <el-button size="small" @click="retreat" :plain="true" type="warning" class="retreat">后退</el-button>
    <!-- status 0 需要用户选择 1 直接填写 2 spu获取 -->
    <transition name="el-fade-in">
    <div v-show="status == 0" class="select_add_type">
      <span @click="status=1" v-if="!spuSelect">直接填写</span>
      <span @click="next"  v-if="!spuSelect">商品库选择</span>
      <el-select v-model="spuOptions" filterable clearable remote placeholder="请输入SPU名称" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_sku_id" v-if="spuSelect">
        <el-option v-for="item in spuItems" :label="item.name" :key="item.value" :value="item.id"></el-option>
      </el-select>
    </div>
    </transition>
    <transition name="el-fade-in">
    <div class="add_article" v-show="status != 0">
      <el-form label-width="120px" :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 24}" placeholder="请输入内容" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="cover">
          <el-input v-model="addForm.cover" class="cover_box"></el-input>
          <el-upload class="cover upload" :headers="header" :action="action" list-type="picture-card" :on-success="coverSuccess" :show-file-list="false" :on-error="uploadError">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="款式列表" prop="sku_ids">
          <div class="add_types" v-if="status == 1">
            款式：<el-input placeholder="请输入款式" size="small" v-model="add_types.type"></el-input>
            &nbsp;库存：<el-input placeholder="请输入库存" size="small" v-model="add_types.quantity"></el-input>
            &nbsp;价格：<el-input placeholder="请输入价格" size="small" v-model="add_types.price"></el-input>
            <el-button size="small" type="primary" @click="addTypes">添加</el-button>
          </div>
          <div class="sku_list">
            <el-table :data="skuList" stripe style="width: 60%;" border>
              <el-table-column prop="type" label="款式">
                <template scope="scope">
                  <el-input placeholder="请输入款式" size="mini" v-model="scope.row.type"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="库存">
                <template scope="scope">
                  <el-input placeholder="请输入库存" size="mini" v-model="scope.row.quantity"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template scope="scope">
                  <el-input placeholder="请输入价格" size="mini" v-model="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template scope="scope">
                  <el-button size="small" @click.stop="deleteSku(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="图片列表" prop="images">
          <el-input v-model="addForm.images" class="images_box"></el-input>
          <el-upload class="images" :headers="header" :action="action" list-type="picture" :file-list="imagesList" :multiple="true" :on-success="imagesSuccess" :on-remove="imagesRemove" :on-error="uploadError">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="邮费" prop="postage">
          <el-input v-model.number="addForm.postage"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createArticle">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    </transition>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth';
  import { spus_list, skus_list } from '@/api/goods';
  import { add_article } from '@/api/article';
  import axios from 'axios';
  import { numberInt } from '@/utils/index';

  export default {
    props: ['user_name', 'user_id'],
    data() {
      return {
        status: 0,
        // 查询spu
        spuOptions: '',
        loading: false,
        spuSelect: false,
        spuItems: [],
        // 表单数据
        addForm: {
          title: '',
          content: '',
          cover: '',
          images: null,
          sku_ids: null,
          postage: ''
        },
        rules: {
          title: { required: true, message: '请输入文章标题', trigger: 'blur' },
          content: { required: true, message: '请输入内容', trigger: 'blur' },
          cover: { required: true, message: '请上传图片', trigger: 'blur' },
          images: { required: true, message: '请上传图片', trigger: 'blur' },
          sku_ids: { required: true, message: '请添加商品', trigger: 'focus' },
          postage: [{ required: true, message: '请添加邮费'},{ type: 'number', message: '必须为数字值'}]
        },
        // 图片上传action
        action: this.$store.getters.hosts + '/warehouse/api/v1/images',
        // 图片上传headers设置
        header: {
          Authorization: getToken()
        },
        imageUrl: '',
        // file-list
        imagesList: [],
        // 存储上传图片列表
        uploadImageList: [],
        // sku详情列表
        skuList: [],
        // 手动添加款式
        add_types: {
          type: '',
          quantity: '',
          price: ''
        }
      }
    },
    created() {
      // 获取现有的分类
    },
    methods: {
      createArticle() {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if(that.addForm.title.length > 40){
              return that.$message({
                message: '标题长度不能超过40',
                type: 'error'
              });
            }
            // 数据整理
            const formData = new FormData();
            formData.append('user_id', this.user_id);
            formData.append('title', that.addForm.title);
            formData.append('content', that.addForm.content);
            formData.append('images[]', that.addForm.cover);
            that.uploadImageList.forEach((item, index) =>{
              formData.append('images[]', item.response.uri);
            })
            // sku处理
            const skus = [];
            const type_status = false;
            that.skuList.forEach((item, index) =>{
              // 检测款式长度
              if(item.type.length > 6){
                that.$message({
                  message: '款式长度不能超过6',
                  type: 'error'
                });
                type_status = true;
                return false;
              }
              // 检测库存 价格 数据类型
              if( numberInt(item.price) || numberInt(item.quantity) || numberInt(that.addForm.postage)){
                that.$message({
                  message: '请正确填写价格，库存格式(不能有小数)',
                  type: 'error'
                });
                type_status = true;
                return false;
              }
              // 将数据添加到skus 如果是通过商品选择的，增加sku_id
              const sku_obj = {
                name: item.type,
                price: item.price,
                stock: item.quantity,
                postage: that.addForm.postage
              }
              if(that.status == 2){
                sku_obj.sku_id = item.id;
              }
              skus.push(sku_obj);
            })
            if(type_status){
              return false;
            }
            // 设置请求头
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: getToken()
              }
            }
            formData.append('skus', JSON.stringify(skus));
            axios.post( that.$store.getters.hosts + '/warehouse/api/v1/posts', formData, config).then( (res) => {
              that.$message({
                message: '创建成功',
                type: 'success'
              });
              clearStatus(this);
            }).catch((error) => {
              that.$message({
                message: error.message,
                type: 'error'
              });
            });
          } else {
            return false;
          }
        });
      },
      // 上传图片成功回调
      coverSuccess(res, file) {
        this.addForm.cover = res.uri;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 图片列表 上传成功
      imagesSuccess(res, file) {
        this.uploadImageList.push(file);
        imagesStatus(this);
      },
      // 图片列表 删除图片
      imagesRemove(file, fileList) {
        // 删除图片时，返回现有图片列表fileList
        // 直接引用是指向了fileList再次添加会导致重复添加
        // 使用遍历添加到 uploadImageList
        const that = this;
        that.uploadImageList = [];
        fileList.forEach((item, index) =>{
          that.uploadImageList.push(item);
        })
        imagesStatus(this);
      },
      // 上传图片错误
      uploadError(error) {
        this.$message({
          message: '上传失败,请重新登录尝试',
          type: 'error'
        });
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
          that.addForm.title = res.result[0]['spu_name'];
          res.result.forEach((item, index) => {
            that.skuList.push(item);
          })
          // 进入填写步骤
          that.status = 2;
          skuStatus(that);
        })
      },
      // 删除已添加的款式（sku）
      deleteSku(index) {
        this.skuList.splice(index, 1);
        skuStatus(this);
      },
      // 手动添加款式
      addTypes() {
        const obj = {};
        if(!this.add_types.type || !this.add_types.quantity || !this.add_types.price){
          return this.$message({
            message: '请填写完整',
            type: 'error'
          });
        }
        Object.assign(obj, this.add_types);
        this.skuList.push(obj);
        skuStatus(this);
      },
      // 后退
      retreat() {
        if(this.status == 1){
          this.status = 0;
          clearStatus(this);
        }else if(this.status == 2){
          this.status = 0;
          clearStatus(this);
        }else if((this.status == 0) && (this.spuSelect == true)){
          this.spuSelect = false;
          // 重置spu搜索
        }
      },
      next() {
        this.spuSelect = true;
      }
    }
  };
  // 切换 sku_ids images 是否填写状态
  function skuStatus(that) {
    if(that.skuList.length){
      that.addForm.sku_ids = 'placeholder';
    }else{
      that.addForm.sku_ids = null;
    }
  }
  function imagesStatus(that) {
    if(that.uploadImageList.length){
      that.addForm.images = 'placeholder';
    }else{
      that.addForm.images = null;
    }
  }
  // 重置输入框
  function clearStatus(that) {
    that.$refs.addForm.resetFields();
    that.imageUrl = null;
    that.imagesList = [];
    that.uploadImageList = [];
    that.skuList = [];
    that.spuOptions = '';
    that.spuItems = [];
    that.status = 0;
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container{
    position: relative;
  }
  .select_add_type{
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 200px;
    width: 500px;
    margin: 250px auto;
    span{
      background-color: #50bfff;
      color: white;
      width: 200px;
      height: 200px;
      border-radius: 20px;
      text-align: center;
      line-height: 200px;
      font-size: 24px;
      cursor: pointer;
    }
    .select_sku_id{
      width: 100%;
    }
  }
  .add_article{
    .el-input,
    .el-textarea{
      width: 60%;
      min-width: 560px;
    }
    .cover_box,
    .images_box{
      display: none;
    }
    .avatar{
      width: 100%;
    }
    .cover{
      img{
        display: block;
      }
    }
    .images{
      width: 60%;
      min-width: 560px;
    }
    .sku_list{
      padding: 10px 0;
      .el-input{
        width: 80px !important;
        min-width: 0;
      }
    }
    .add_types{
      .el-input{
        width: 120px;
        min-width: 0;
      }
    }
  }
  .retreat{
    position: absolute;
    top: -10px;
    left: -10px;
  }
</style>
