<template>
    <div class="app-container">
<!-- 管理员给业务帐号配置权限  此业务帐号必须是管理员创建-->
      <div class="privilege">
        <span class="title">配置权限</span>
        <el-form label-width="80px" :model="privilege" ref="privilege" >
          <el-form-item label="业务帐号" prop="shop_id">
            <el-select v-model="shopDefault" filterable placeholder="请选择" @change="selectChange" class="select_shop_id">
              <el-option v-for="item in userOptions" :key="item.id" :label="item.account" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div class="modules">选择模块</div>
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange" class="modules_list">
            <template v-for="item in checkDate">
              <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
            </template>
          </el-checkbox-group>
          <el-form-item class="el-btn">
            <el-button type="primary" @click="updatePrivilege">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
<!-- 管理员给大帐号分配假帐号大卖家-->
      <div class="relevanceUser">
        <span class="title">关联帐号</span>
        <el-form label-width="80px" >
          <el-form-item label="管理帐号" prop="shop_id">
            <el-select v-model="parentsDefault" filterable placeholder="请选择" @change="selectChangeParents" class="select_shop_id">
              <el-option v-for="item in parents" :key="item.id" :label="item.account" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="子帐号" prop="shop_id">
            <el-select v-model="childrenDefault" filterable placeholder="请选择" @change="selectChangeChildren" class="select_shop_id">
              <!-- 过滤已经有父级的帐号 同一个子帐号只能对应一个管理帐号，再次关联时会覆盖上一个 -->
              <el-option v-for="item in children" :key="item.id" :label="item.account" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-btn">
            <el-button type="primary" @click="updateRelevanceUser">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import { users_list, modules_list, user_privilege, relevanceUser_user } from '@/api/admin';
  export default {
    name: 'module_privilege',
    data() {
      return {
        activeIndex: '4',
        userOptions: null,
        shopDefault: null,
        checkList: [],
        checkDate: [],
        privilege: {
          users: [],
          modules: []
        },
        parentsDefault: null,
        childrenDefault: null,
        parents: [],
        children: [],
        relevanceUserId: null,
        relevanceUserParentId: null
      }
    },
    created() {
      // 获取模块列表
      this.getModuleList();
      // 获取业务帐号列表
      this.getUsersList();
      // 获取大帐号列表
      this.getParentsList();
      // 获取子帐号(假帐号，大卖家)列表
      this.getChildrenList();
    },
    methods: {
      updatePrivilege() {
        const that = this;
        if(this.privilege.modules.length && this.privilege.users.length){
          user_privilege(this.privilege).then(() => {
            that.$message({
              message: '配置成功',
              type: 'success'
            });
            this.shopDefault = [];
            this.checkList = [];
            this.privilege.modules = [];
            this.privilege.users = [];
          })
        } else {
          this.$message({
            message: '请选择用户以及模块',
            type: 'error'
          });
        }
      },
      selectChange(val) {
        let arr = [];
        arr.push(val);
        this.privilege.users = arr;
      },
      handleCheckedCitiesChange(value) {
        let arr = [];
        value.forEach(function(item){
          arr.push(item);
        })
        this.privilege.modules = arr;
      },
      getUsersList() {
        // 当前获取100条，后期增加全部参数
        const that = this;
        const obj = {
          role: 4,
          has_parent: 0,
          size: 100
        }
        users_list(obj).then((res) => {
          that.userOptions = res.results;
        })
      },
      getModuleList() {
        const that = this
        // 获取可给业务帐号配置的模块
        const modules = this.$store.getters.modules
        modules_list().then((res) => {
          // 对数组进行过滤
          const arr = res.filter(item => {
            return modules.some(module => module === item.privilege)
          })
          that.checkDate = arr;
        })
      },
      getParentsList() {
        // 当前获取100条，后期增加全部参数
        const that = this;
        const obj = {
          role: 1,
          size: 100
        }
        users_list(obj).then((res) => {
          that.parents = res.results;
        })
      },
      getChildrenList() {
        // 当前获取100条，后期增加全部参数
        const that = this;
        const obj2 = {
          role: 2,
          size: 100
        }
        const obj3 = {
          role: 3,
          size: 100
        }
        users_list(obj2).then((res) => {
          that.children = that.children.concat(res.results);
        })
        users_list(obj3).then((res) => {
          that.children = that.children.concat(res.results);
        })
      },
      selectChangeParents(val) {
        this.relevanceUserParentId = val;
      },
      selectChangeChildren(val) {
        this.relevanceUserId = val;
      },
      updateRelevanceUser() {
        const that = this;
        if(this.relevanceUserParentId && this.relevanceUserId){
          relevanceUser_user(this.relevanceUserId, this.relevanceUserParentId).then((res) => {
            that.$message({
              message: '配置成功',
              type: 'success'
            });
            this.parentsDefault = null;
            this.childrenDefault = null;
            this.relevanceUserParentId = null;
            this.relevanceUserId = null;
          })
        } else {
          this.$message({
            message: '请选择用户',
            type: 'error'
          });
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container{
  max-width: 800px;
  .relevanceUser,
  .privilege{
    float: left;
    margin-right: 50px;
    .title{
      margin: 20px;
      display: block;
      font-size: 14px;
    }
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
      margin-left: 80px;
      line-height: 36px;
    }
  }
  .relevanceUser{
    float: right;
  }
}
</style>
