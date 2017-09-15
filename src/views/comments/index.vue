<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">评论列表</el-menu-item>
    </el-menu>
    <div class="comment_list">
      <div class="search">
        <el-select v-model="selectInput" placeholder="请选择" class="searchInput" @change="selectChange">
          <el-option label="全部评论" value=""></el-option>
          <el-option label="正常评论" value="1"></el-option>
          <el-option label="购买评论" value="2"></el-option>
          <el-option label="打赏评论" value="3"></el-option>
          <el-option label="删除评论" value="14"></el-option>
          <el-option label="图片评论" value="4"></el-option>
        </el-select>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="post_title" label="文章">
        </el-table-column>
        <el-table-column label="发送人" prop="from_nickname">
        </el-table-column>
        <el-table-column label="内容">
          <template scope="scope">
            <span v-if="scope.row.type == 1">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 2" style="color:red">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 3" style="color:blue">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 14" style="color: #aaa">{{scope.row.content}} // 已删除</span>
            <span v-if="scope.row.type == 4">
              <img class="content_img" :src="scope.row.content">
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="to_nickname" label="接收人">
        </el-table-column>
        <el-table-column prop="created_at" label="时间">
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template scope="scope">
            <el-button type="text" @click="openDialog(scope.row.id)">会话记录</el-button>
            <!-- <el-button type="text" @click="deleteComment(scope.row.id,scope.$index)">删除消息</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="会话记录" :visible.sync="dialogStatus" top="5%" @close="dialogClose">
      <!-- 增加过渡效果 -->
      <el-collapse-transition>
        <div class="replyBox" v-show="replyBoxStatus">
          <el-select v-model="replyInput" placeholder="请选择" class="searchInput" @change="replyInputChange">
            <el-option :label="'文字回复  '+replyUserName" value="1"></el-option>
            <el-option :label="'图片回复  '+replyUserName" value="2"></el-option>
          </el-select>
          <el-input  class="textarea" type="textarea" :rows="2" placeholder="请输入内容" v-model="replytextarea"></el-input>
          <el-button type="primary" @click="replyUser()">回复</el-button>
        </div>
      </el-collapse-transition>
      <el-table :data="comment_list" style="width: 100%" border>
        <el-table-column prop="from_nickname" label="发送者" width="180"></el-table-column>
        <el-table-column prop="content" label="内容">
          <template scope="scope">
            <span v-if="scope.row.type != 4">{{scope.row.content}}</span>
            <span v-if="scope.row.type == 4">
              <img class="content_img" :src="scope.row.content">
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="to_nickname" label="接收者" width="180"></el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="text" @click="addReplyUser(scope.row.from_nickname,scope.row.id)">回复发送者</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { comment_list, history_comment, reply_comment, delete_comment } from '@/api/comment';

  export default {
    data() {
      return {
        activeIndex: '1',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        },
        tableData: [],
        totalPages: 0,
        selectInput: '',               // 默认全部评论
        dialogStatus: false,
        comment_list: [],
        replyInput: '1',
        replyBoxStatus: false,
        replyUserName: '',
        replytextarea: '',
        replyid: ''
      }
    },
    created() {
      // 获取当前用户评论列表
      this.initCommentList();
    },
    methods: {
      initCommentList(obj) {
        const that = this;
        // 初始化用户每页20
        const params = {
          size: 20,
          receiver: this.query.id
        }
        if(obj){
          $.extend(params, obj)
        }
        comment_list(params).then((res) => {
          that.tableData = res.result;
          that.totalPages = res.totalPages*10;
        })
      },
      //分页
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        if(this.selectInput){
          obj.types = [this.selectInput]
        }
        this.initCommentList(obj);
      },
      // 评论类型选择器发生变化
      selectChange() {
        const obj = {};
        if(this.selectInput){
          obj.types = [this.selectInput]
        }
        this.initCommentList(obj);
      },
      // 回复评论类型选择器发生变化
      replyInputChange() {

      },
      // 打开模态框显示某个用户的历史会话
      openDialog(id) {
        const that = this;
        this.dialogStatus = true;
        history_comment(id).then((res) => {
          that.comment_list = res;
        })
      },
      // 展开回复
      addReplyUser(from_nickname, id) {
        this.replyBoxStatus = true;
        this.replyUserName = from_nickname;
        this.replyid = id;
      },
      // 回复
      replyUser(){
        const that = this
        if(that.replytextarea){
          const obj = {
            content: that.replytextarea
          }
          reply_comment(that.replyid, obj).then((res) => {
            that.$message({
              message: '回复成功',
              type: 'success'
            });
            that.replytextarea = "";
          })
        }else{
          that.$message({
            message: '请输入回复内容',
            type: 'error'
          });
        }
      },
      // 关闭模态框回调
      dialogClose() {
        console.log(3443)
        //重置状态
        this.replyBoxStatus = false;
      },
      // 删除评论
      // deleteComment(id, index) {
      //   const that = this;
      //   this.$confirm('是否删除该评论, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     delete_comment(id).then((res) => {
      //       that.$message({
      //         message: '删除成功',
      //         type: 'success'
      //       });
      //       that.tableData[index]['type'] = 14;
      //     })
      //   }).catch(() => {});
      // }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .comment_list{
    padding: 20px;
    .search{
      text-align: center;
      .searchInput{
        width: 240px;
        padding: 0 0 20px ;
      }
    }
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
  }
  .replyBox{
    padding: 20px 0;
    text-align: right;
    .searchInput{
      width: 100%;
    }
    .textarea{
      margin: 10px 0;
    }
  }
  .content_img{
    max-width: 120px;
  }
</style>
