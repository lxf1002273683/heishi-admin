<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link to="/goods/skus">
        <el-menu-item index="1">SKU列表</el-menu-item>
      </router-link>
      <el-menu-item index="2">创建SKU</el-menu-item>
    </el-menu>
    <div class="goodsAddForm">
      <el-form label-width="80px" :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="SPU" prop="spu_id">
          <el-input v-model="addForm.spu_id" class="spu_id"></el-input>
          <el-select v-model="spuOptions" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading"  @change="selectChange" class="select_spu_id">
            <el-option v-for="item in spuItems" :key="item.value" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="款式名称" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model.number="addForm.stock"></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createSpu">立即创建</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { spus_list, add_skus } from "@/api/goods";
  export default {
    data() {
      return {
        activeIndex: '2',
        addForm: {
          spu_id: '',
          type: '',
          desc: '',
          price: null,
          stock: null
        },
        rules: {
          spu_id: { required: true, message: '请输入spu名称', trigger: 'blur' },
          type: { required: true, message: '请输入款式类型', trigger: 'blur' },
          desc: { required: true, message: '请输入描述', trigger: 'blur' },
          price: [{ required: true, message: '请输入价格'},{ type: 'number', message: '必须为数字值'}],
          stock: [{ required: true, message: '请输入库存'},{ type: 'number', message: '必须为数字值'}]
        },
        // spu远程获取列表
        spuOptions: '',
        spuItems: [],
        loading: false
      }
    },
    methods: {
      createSpu() {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            add_skus(that.addForm).then(() => {
              that.$message({
                message: '创建成功',
                type: 'success'
              });
              that.$refs.addForm.resetFields();
              that.spuOptions = '';
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
      remoteMethod(query) {
        const that = this;
        const obj = {
          name: query
        }
        spus_list(obj).then((res) => {
          that.spuItems = res.result;
        })
      },
      selectChange(value) {
        if(value){
          this.addForm.spu_id = value.toString();
        }else{
          this.addForm.spu_id = '';
        }
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
    .spu_id{
      display: none;
    }
    .select_spu_id{
      position: absolute;
      left: 0;
      width: 240px;
    }
  }
</style>
