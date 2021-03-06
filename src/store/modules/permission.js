import { asyncRouterMap, constantRouterMap, modulesConfig, warehouseModule } from '@/router/index';
import { getUserId, getPrivileges, warehouse_list } from '@/api/login';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route, status) {
  if (route.meta && route.meta.authority === 'admin') {
    if (status === 1 && roles.length === 0) {
      return true
    } else {
      return roles.some(role => route.meta.role.indexOf(role) >= 0)
    }
  } else if (route.meta && route.meta.authority === 'users') {
    if (status === 2 && roles.length === 0) {
      return true
    } else {
      return roles.some(role => route.meta.role.indexOf(role) >= 0)
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 需要配置的路由
 * @param roles 用户权限
 */
function filterAsyncRouter(asyncRouterMap, roles, status) {
  const accessedRouters = asyncRouterMap.filter(route => {
    // 在router index中关于权限的路由要配置meta信息
    if (hasPermission(roles, route, status)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

// 在admin user 权限时，获取可配置的权限
function permissionStatus(asyncRouterMap, param) {
  const arr = []
  asyncRouterMap.forEach(route => {
    if (route.meta && route.meta.authority === param && route.meta.status) {
      arr.push(route.meta.role[0])
    }
  })
  return arr
}

// 递归处理用户权限
function formatPrivilege(mm) {
  const arr = [];
  let configNum = mm;
  function privilege(m) {
    const num = m & (m - 1);
    if (configNum !== 0) {
      if (num === 0) {
        arr.push(m);
        configNum = configNum - m;
        return privilege(configNum);
      } else {
        const n = m - 1;
        return privilege(n);
      }
    }
  }
  privilege(mm);
  return arr;
}

const permission = {
  state: {
    routers: constantRouterMap,     // 先配置默认权限
    addRouters: [],
    modules: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MODULES: (state, modules) => {
      state.modules = modules
    }
  },
  actions: {
    // 在用户登录后，根据用户权限分配路由
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let accessedRouters;
        // 设置用户可使用的路由
        function commitResolve(permissionArr) {
          commit('SET_ROUTERS', accessedRouters);
          commit('SET_MODULES', permissionArr);
          resolve();
        }
        // 如果role是0  用户是admin
        // 如果是1大帐号 5第三方帐号
        // 如果是2假帐号 3大卖家 无法登录，不需要进行配置
        // 如果是4业务帐号 需要通过module_privilege进行权限配置才能使用

        // 库房管理需要进行路由配置
        if (data.role === 0) {
          // 管理员 模块--管理配置 商品编辑 库房管理 财务管理
          warehouse_list().then(res => {
            const warehouses = res.data;
            for (const i in warehouses) {
              warehouseModule(warehouses[i].id, warehouses[i].name)
            }
            accessedRouters = filterAsyncRouter(asyncRouterMap, [], 1)
            // 获取admin 可给业务帐号配置的模块
            const permissionArr = permissionStatus(asyncRouterMap, 'admin')
            commitResolve(permissionArr)
          })
        }
        if (data.role === 1 || data.role === 5) { // 大帐号
          // 大帐号 模块--业务管理 我的商品 我的评论 我的订单 我的帐户[2, 16, 32, 64, 128]
          // 获取管理的大卖家，假帐号
          const obj = {
            parent_id: data.id
          }
          getUserId(obj).then(res => {
            const users = res.results;
            const arr = []
            for (const i in users) {
              if (users[i].role !== 4) {
                const obj = {
                  userId: users[i].id,
                  userName: users[i].account
                }
                arr.push(obj)
              }
            }
            // 将动态生成的路由模块与固定的模块合并
            // 动态的路由是关联的用户
            const businessaModules = modulesConfig(arr);
            const newAsyncRouterMap = asyncRouterMap.concat(businessaModules)
            accessedRouters = filterAsyncRouter(newAsyncRouterMap, [], 2)
            // 获取USER 可给业务帐号配置的模块
            const permissionArr = permissionStatus(newAsyncRouterMap, 'users')
            console.log(permissionArr)
            commitResolve(permissionArr);
          })
        }
        if (data.role === 4) {
          // 业务帐号 需要通过module_privilege进行权限配置才能使用
          if (data.module_privilege !== 0) {
            // 判断是不是大帐号创建的业务帐号 有parent_id是 没有则是管理员创建
            if (data.parent_id) {
              const module_privilege = formatPrivilege(data.module_privilege);
              const userId = data.id;
              getPrivileges(userId).then(res => {
                const users = res[0].owners;
                const arr = [];
                for (const i in users) {
                  const obj = {
                    userId: users[i].id,
                    userName: users[i].account
                  }
                  arr.push(obj)
                }
                const businessaModules = modulesConfig(arr);
                const newAsyncRouterMap = asyncRouterMap.concat(businessaModules);
                accessedRouters = filterAsyncRouter(newAsyncRouterMap, module_privilege, 2)
                commitResolve();
              })
            }
            // 管理员创建的业务帐号
            if (!data.parent_id) {
              // 获取所有仓库进行路由分配
              warehouse_list().then(res => {
                const warehouses = res.data;
                for (const i in warehouses) {
                  warehouseModule(warehouses[i].id, warehouses[i].name)
                }
                const module_privilege = formatPrivilege(data.module_privilege);
                accessedRouters = filterAsyncRouter(asyncRouterMap, module_privilege, 1);
                commitResolve();
              })
            }
          }
          // module_privilege为0时，表示当前业务帐号未进行配置
          if (data.module_privilege === 0) {
            accessedRouters = [];
            commitResolve();
          }
        }
      })
    }
  }
};

export default permission;
