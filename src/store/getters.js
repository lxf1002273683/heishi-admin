// 配置全局变量
const getters = {
  sidebar: state => state.app.sidebar, // 侧边栏
  hosts: state => state.app.hosts,		 // 域名
  token: state => state.user.token,		// token
  token_time: state => state.user.token_time,		// token
  id: state => state.user.id,	// 用户头像
  avatar: state => state.user.avatar,	// 用户头像
  name: state => state.user.name,		// 用户名称
  roles: state => state.user.roles,		// 角色列表--管理权限
  permission_routers: state => state.permission.routers, // 用户可用的路由，用来配置侧边栏
  addRouters: state => state.permission.addRouters		 // 通过权限过滤后的路由，在main中配置
};
export default getters
