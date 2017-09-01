import Vue from 'vue';
import Router from 'vue-router';
import { getPrivileges, getUserId } from '@/api/login';


// 通过dev build 返回不同的页面路径
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* error page */
const Err404 = _import('404');

/* 管理配置 -- 用户管理 */
const user = _import('admin/index');
const Users = _import('admin/users');
const AddUser = _import('admin/add_user');
const ModulePrivilege = _import('admin/module_privilege');

/* 管理配置 -- 模块列表 */
const Modules = _import('admin/modules');
const AddModule = _import('admin/add_module');

/* 业务管理 -- 帐号管理 */
const BusinessUsers = _import('business/users');
const BusinessAddUser = _import('business/add_user');

/* 业务管理 -- 权限配置 */
const BusinessModules = _import('business/module_privilege');

/* 商品库 -- 商品分类 */
const Spus = _import('goods/spus');
const AddCategories = _import('goods/add_categories');
const AddSpus = _import('goods/add_spus');
const AddShops = _import('goods/add_shops');
const Skus = _import('goods/skus');
const AddSkus = _import('goods/add_skus');
const Batches = _import('goods/batches');
const AddBatches = _import('goods/add_batches');

/* 我的商品 */
const Articles = _import('articles/index');

/* 我的评论 */
const Comments = _import('comments/index');

/* 我的订单 */
const Orders = _import('orders/index');

/* 我的账户 */
const Account = _import('account/index');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
  // 用户公用权限
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/user',
    name: '用户中心',
    hidden: true,
    children: [{ path: 'user', component: user }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
  // 用户需要配置的权限
  // 0:管理员，1:大账号，2:虚拟账号，3:微信登录账号
export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    redirect: 'noredirect',
    name: '管理配置',
    meta: { role: [1] },
    children: [
      { path: 'users', component: Users, name: '用户列表' },
      { path: 'add_user', component: AddUser, name: '创建用户', hidden: true },
      { path: 'module_privilege', component: ModulePrivilege, name: '权限配置', hidden: true },
      { path: 'modules', component: Modules, name: '模块列表' },
      { path: 'add_module', component: AddModule, name: '创建模块', hidden: true }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: 'noredirect',
    name: '业务管理',
    meta: { role: [2] },
    children: [
      { path: 'users', component: BusinessUsers, name: '帐号管理' },
      { path: 'add_user', component: BusinessAddUser, name: '创建帐号', hidden: true },
      { path: 'module_privilege', component: BusinessModules, name: '权限配置' }
    ]
  },
  // 商品编辑
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    name: '商品编辑',
    meta: { role: [4] },
    children: [
      { path: 'spus', component: Spus, name: 'SPU列表' },
      { path: 'add_spus', component: AddSpus, name: '创建SPU', hidden: true },
      { path: 'add_shops', component: AddShops, name: '创建店铺', hidden: true },
      { path: 'add_categories', component: AddCategories, name: '创建分类', hidden: true },
      { path: 'skus', component: Skus, name: 'SKU列表' },
      { path: 'add_skus', component: AddSkus, name: '创建SKU', hidden: true },
      { path: 'batches', component: Batches, name: '批次列表' },
      { path: 'add_batches', component: AddBatches, name: '创建批次', hidden: true }
    ]
  },
  // 库房管理
  {
    path: '/warehouse',
    component: Layout,
    redirect: 'noredirect',
    name: '库房管理',
    meta: { role: [8] },
    children: [
      { path: 'spus', component: Spus, name: 'SPU列表' },
      { path: 'add_spus', component: AddSpus, name: '创建SPU', hidden: true },
      { path: 'add_shops', component: AddShops, name: '创建店铺', hidden: true },
      { path: 'add_categories', component: AddCategories, name: '创建分类', hidden: true }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

export function modulesConfig(userIds) {
  // 我的商品
  const articles = {
    path: '/articles',
    component: Layout,
    redirect: 'noredirect',
    name: '我的商品',
    meta: { role: [16] },
    children: []
  }
  // 我的评论
  const comments = {
    path: '/comments',
    component: Layout,
    redirect: 'noredirect',
    name: '我的评论',
    meta: { role: [32] },
    children: []
  }
  // 我的订单
  const orders = {
    path: '/orders',
    component: Layout,
    redirect: 'noredirect',
    name: '我的订单',
    meta: { role: [64] },
    children: []
  }
  // 我的帐户
  const account = {
    path: '/account',
    component: Layout,
    redirect: 'noredirect',
    name: '我的帐户',
    meta: { role: [128] },
    children: []
  }
  for (let x = 0; x < userIds.length; x++) {
    const articlesTemplate = { path: 'articles/' + userIds[x].userName, component: Articles, name: '', id: 0 };
    const commentsTemplate = { path: 'comments/' + userIds[x].userName, component: Comments, name: '', id: 0 };
    const ordersTemplate = { path: 'orders/' + userIds[x].userName, component: Orders, name: '', id: 0 };
    const accountTemplate = { path: 'account/' + userIds[x].userName, component: Account, name: '', id: 0 };
    articlesTemplate.id = commentsTemplate.id = ordersTemplate.id = accountTemplate.id = userIds[x].userId;
    articlesTemplate.name = commentsTemplate.name = ordersTemplate.name = accountTemplate.name = userIds[x].userName;
    articles.children.push(articlesTemplate);
    comments.children.push(commentsTemplate);
    orders.children.push(ordersTemplate);
    account.children.push(accountTemplate);
  }
  const businessaRouterMap = [];
  businessaRouterMap.push(articles);
  businessaRouterMap.push(comments);
  businessaRouterMap.push(orders);
  businessaRouterMap.push(account);
  return businessaRouterMap;
}
/**
 * 获取业务帐号绑定的大卖家，假帐号id，动态配置路由
 * 0 表示大帐号， 1 业务帐号， 2 第三方帐号
 *
 */
// export function businessaAccounts(userId, status) {
//   switch (status) {
//     case 0:
//       const obj = {
//         parent_id: userId
//       }
//       getUserId(obj).then((res) => {
//         // 获取假帐号，大帐号id生成数组
//         const data = res.results;
//         const arr = []
//         for (const i in data) {
//           if (data[i].role !== 4) {
//             arr.push(data[i].id)
//           }
//         }
//         modulesConfig(arr)
//         // console.log(modulesConfig(arr));
//         // return modulesConfig(arr);
//       })
//       break;
//     case 1:
//       getPrivileges(userId).then((res) => {
//         for (const i in res) {
//           modulesConfig(res[i].owners)
//         }
//       })
//       break;
//     case 2:
//       console.log(asyncRouterMap[6])
//       break;
//     case '我的帐户':
//       console.log(asyncRouterMap[7])
//       break;
//   }
// }


