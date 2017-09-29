<!-- 创建仓库 -->
<template>
  <div class="app-container">
    <div class="goodsAddForm">
      <el-form label-width="80px" :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="仓库备注" prop="memo">
          <el-input v-model="addForm.memo"></el-input>
        </el-form-item>
        <el-form-item label="仓库类型">
          <el-radio-group v-model="addForm.type">
            <el-radio label="1">本地</el-radio>
            <el-radio label="0">第三方</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addWarehouse">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { add_warehouse } from "@/api/warehouse";
  export default {
    data() {
      return {
        addForm: {
          name: '',
          memo: '',
          type: '1'
        },
        rules: {
          name: { required: true, message: '请输入商品名称', trigger: 'blur' }
        }
      }
    },
    methods: {
      addWarehouse() {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            console.log(that.addForm)
            add_warehouse(that.addForm).then(() => {
              that.$message({
                message: '创建成功',
                type: 'success'
              });
              that.$refs.addForm.resetFields();
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .goodsAddForm{
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
  }
</style>
