<template>
    <div class="app-container">
      <div class="addForm">
        <el-form label-width="80px" :model="addForm" ref="addForm" >
          <el-form-item label="业务帐号" prop="shop_id">
            <el-select v-model="shopDefault" filterable placeholder="请选择" @change="selectChange" class="select_shop_id">
              <el-option v-if="item.role == 4" v-for="item in userOptions" :key="item.id" :label="item.account" :value="item.id"></el-option>
            </el-select>
            <span style="color: red">此大帐号下的业务账号</span>
          </el-form-item>
          <el-checkbox-group v-model="checkUserList" @change="userCheckedCitiesChange" class="modules_list">
            <div class="modules">选择帐号</div>
            <template v-for="item in checkUserDate">
              <!-- 只显示大帐号中的业务模块 -->
              <el-checkbox :label="item.id" v-if="item.role != 4">{{item.account}}</el-checkbox>
            </template>
            <span style="color: red;font-size: 14px;">此大帐号下的假帐号，大卖家</span>
          </el-checkbox-group>
          <el-checkbox-group v-model="checkList" @change="moduleCheckedCitiesChange" class="modules_list">
            <div class="modules">选择模块</div>
            <template v-for="item in checkDate">
              <!-- 只显示大帐号中的业务模块 -->
              <el-checkbox :label="item.id" v-if="item.privilege != 2 && item.privilege != 4 && item.privilege != 8">{{item.name}}</el-checkbox>
            </template>
          </el-checkbox-group>
          <el-form-item class="el-btn">
            <el-button type="primary" @click="updatePrivilege">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import { users_list, modules_list, user_privilege } from '@/api/business';
  export default {
    name: 'module_privilege',
    data() {
      return {
        userOptions: null,
        shopDefault: null,
        checkList: [],
        checkDate: [],
        checkUserList: [],
        checkUserDate: [],
        addForm: {
          users: [],
          modules: [],
          owners: []
        }
      }
    },
    created() {
      // 获取管理当前大帐号的帐号列表
      this.getUsersList();
      // 获取模块列表
      this.getModuleList();
    },
    methods: {
      updatePrivilege() {
        const that = this;
        if(this.addForm.users.length && this.addForm.modules.length && this.addForm.owners.length){
          user_privilege(this.addForm).then((res) => {
            this.$message({
              message: '关联成功',
              type: 'success'
            });
            this.shopDefault = [];
            this.checkList = [];
            this.checkUserList = [];
            this.addForm.modules = [];
            this.addForm.users = [];
            this.addForm.owners = [];
          })
        }else{
          this.$message({
            message: '请选择用户以及模块',
            type: 'error'
          });
        }
      },
      selectChange(val) {
        let arr = [];
        arr.push(val);
        this.addForm.users = arr;
      },
      userCheckedCitiesChange(value) {
        let arr = [];
        value.forEach(function(item){
          arr.push(item);
        })
        this.addForm.owners = arr;
      },
      moduleCheckedCitiesChange(value) {
        let arr = [];
        value.forEach(function(item){
          arr.push(item);
        })
        this.addForm.modules = arr;
      },
      getUsersList() {
        const that = this;
        const obj = {
          parent_id: this.$store.getters.id
        }
        users_list(obj).then((res) => {
          that.userOptions = res.results;
          that.checkUserDate = res.results;
        })
      },
      getModuleList() {
        const that = this
        modules_list().then((res) => {
          that.checkDate = res;
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .addForm{
    padding: 20px;
    .el-btn{
      margin-top: 20px;
    }
    .modules{
      width: 80px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #48576a;
      line-height: 1;
      padding: 11px 12px 11px 0;
      box-sizing: border-box;
    }
    .modules_list{
      line-height: 36px;
    }
  }
</style>
