import { registerAction } from 'utils/actions'
import { PluginRegistry } from 'utils/plugins'
import { autorun, observable } from 'mobx'
import config from 'config'
import store from './store'
import api from '../../backendAPI'


export const PLUGIN_REGISTER_VIEW = 'PLUGIN_REGISTER_VIEW'
export const PLUGIN_UNREGISTER_VIEW = 'PLUGIN_UNREGISTER_VIEW'
export const PACKAGE_UPDATE_LIST = 'PACKAGE_UPDATE_LIST'

export const updatePackageList = registerAction(PACKAGE_UPDATE_LIST, () => {
  api.fetchPackageList()
  .then((result) => {
    store.list.replace(result.map(e => {
      const current = store.list.find(obj => obj.name === e.name)
      return ({ enabled: current ? current.enabled || false : false, ...e })
    }))
  })
})


export const PACKAGE_UPDATE_LOCAL = 'PACKAGE_UPDATE_LOCAL'

// 往本地localstoage写一个插件的信息

export const updateLocalPackage = registerAction(PACKAGE_UPDATE_LOCAL, p => p)

export const PACKAGE_TOGGLE = 'PACKAGE_TOGGLE'

export const togglePackage = registerAction(PACKAGE_TOGGLE,
({ pkgId, shouldEnable, info, type, data }, action) => {
  const script = localStorage.getItem(pkgId) // toggle行为从本地读取
  if (!shouldEnable) {
    // plugin will unmount
    // 根据 package Id 把所有此插件组的插件拔掉
    const plugins = PluginRegistry.findAll(pkgId)
    plugins.forEach((plugin) => {
      if (plugin.detaultInstance.pluginWillUnmount) {
        plugin.detaultInstance.pluginWillUnmount()
      }
      PluginRegistry.delete(plugin.key)
    })
  } else {
    // plugin will mount
    // @fixme @hackape consider theme situation
    try {
      window.codingPackageJsonp.current = pkgId
      eval(`${script}`) // <- from inside package, `codingPackageJsonp()` is called to export module
      // codingPackageJsonp 注册的可以是单个插件或者插件组, 每个插件的key必须不同
      const plugin = window.codingPackageJsonp.data // <- then it's access from `codingPackageJsonp.data`
      window.codingPackageJsonp.current = ''
      const pluginArray = Array.isArray(plugin) ? plugin : [plugin]
      pluginArray
      .sort((pgkA, pgkB) => (pgkA.weight || 0) < (pgkB.weight || 0) ? 1 : -1)
      .forEach((plugin) => {
        const { Manager = (() => null), key } = plugin
        const manager = new Manager()
        plugin.detaultInstance = manager
        const getInfo = store.list.get(key || pkgId) || info || {}
        PluginRegistry.set(key || pkgId, { ...plugin, pkgId, info: getInfo, loadType: type })
        if (manager.init) {
          manager.init(data, action)
        }
        if (type === 'reload') {
          manager.pluginWillMount()
        }
        // if (type === 'init') {
        //   if (manager.init) {
        //     manager.init(data, action)
        //   }
        // } else {
        // // mount 生命周期挂载时触发
        //   manager.pluginWillMount(config, data)
        // }
        // 提供 autorun生命周期，插件关注 主项目config 声明周期点变化后自动执行

        // if (manager.autoRun) {
        //   autorun(manager.autoRun)
        // }

        // // render 提供渲染方法，60帧刷新方法，可用来画图
        // if (manager.render) {
        //   setInterval(manager.render, 50 / 3)
        // }
      })
    } catch (err) {
      throw err
    }
  }
  return ({
    id: pkgId,
    shouldEnable,
  })
})

export const FETCH_PACKAGE = 'FETCH_PACKAGE'
export const FETCH_PACKAGE_GROUP = 'FETCH_PACKAGE_GROUP'


export const fetchPackageGroup = registerAction(FETCH_PACKAGE_GROUP,
(groupName, pkgs, type, data) => ({ groupName: `group_${groupName}`, pkgs, type, data }),
({ groupName, pkgs, type, data }) => {
  const scriptArguments = pkgs.map((pkg => ({ pkgName: pkg.name, pkgVersion: pkg.version, target: pkg.TARGET })))
  return api.fetchPackageScript(scriptArguments)
  .then((script) => {
    localStorage.setItem(groupName, script)
    codingPackageJsonp.groups[groupName] = pkgs.map(pkg => pkg.name)
    // Todo: refractor the toggle package model
    return togglePackage({ pkgId: groupName, shouldEnable: !PluginRegistry.find(groupName), type, data })
  })
}
)

export const fetchPackage = registerAction(FETCH_PACKAGE,
(pkg, type, data) => ({ pkg, type, data }),
({ pkg, type, data }) => api.fetchPackageScript({ pkgName: pkg.name, pkgVersion: pkg.version, target: pkg.TARGET })
  .then((script) => {
    localStorage.setItem(pkg.name, script)
    return pkg.name
  })
  .then(pkgId => togglePackage({ pkgId, shouldEnable: true, type, data })))


export const PRELOAD_REQUIRED_EXTENSION = 'PRELOAD_REQUIRED_EXTENSION'


// 插件申明加载时机，
export const loadPackagesByType = registerAction(PRELOAD_REQUIRED_EXTENSION,
  // type is the packages type, data is the state data , group is the batch
  (type, data = {}, group) => ({ type, data, group }),
  ({ type, data, group }) => {
    const fetchPackgeListPromise = api.fetchPackageList(type)
    return fetchPackgeListPromise.then(async (list) => {
      if (config.isLib) {
        const filterList = list.filter((item) => {
          return item.name !== 'platform' && item.name !== 'Debugger' && item.name !== 'collaboration'
        })
        store.list.replace(filterList)
      } else {
        store.list.replace(list)
      }
      if (group) {
        return fetchPackageGroup('required', store.list, type, data)
      }
      for (const pkg of filterList) {
        await fetchPackage(pkg, type, data)
      }
    })
  }
)

export const mountPackagesByType = (type) => {
  const plugins = PluginRegistry.findAllByType(type)
  plugins.forEach((plugin) => {
    plugin.detaultInstance.pluginWillMount(plugin)
  })
}

export const mountPackage = (id, unMount) => {
  const plugin = PluginRegistry.find(id)
  if (unMount) {
    plugin.detaultInstance.pluginWillUnmount(plugin)
  } else {
    plugin.detaultInstance.pluginWillMount(plugin)
  }
}

export const hydrate = (requiredList) => {
  requiredList.forEach((element) => {
    fetchPackage(element).then(({ id }) => mountPackage(id))
  })
}

export const loadPlugin = (plugin) => {
  const { Manager = (() => null), key } = plugin
  const manager = new Manager()
  plugin.detaultInstance = manager
  PluginRegistry.set(key, { ...plugin, pkgId: 'inner plugin', info: plugin.info || {} })
  manager.pluginWillMount(config)
}
/**
 * @param  { position label getComponent callback } children // children is the shape of per component

 * @param  {} callback // spec per plugin inject func
 */

export const pluginRegister = registerAction(PLUGIN_REGISTER_VIEW,
(children, callback = '') => ({ children, callback }),
({ children, callback }) => {
  const childrenArray = Array.isArray(children) ? children : [children]
  childrenArray.forEach((child) => {
    // children 的 shape
    const { position, key, label, view, instanceId, status } = child
    const generateViewId = `${position}.${key}${instanceId ? `.${instanceId}` : ''}`

    store.plugins.set(generateViewId, observable({
      // 可修改位置
      viewId: generateViewId,
      position,
      key,
      label,
      status: status || observable.map({}),
      actions: observable.ref(label.actions || {})
    }))
    store.views[generateViewId] = view
    if (callback) {
        // you can do other mapping such as status initialize in this callback
      callback(store.plugins.get(generateViewId), child, store)
    }
  })
})

export const pluginUnRegister = registerAction(PLUGIN_UNREGISTER_VIEW,
(children, callback = '') => ({ children, callback }),
({ children, callback }) => {
  const childrenArray = Array.isArray(children) ? children : [children]
  childrenArray.forEach((child) => {
    const { position, key, instanceId } = child
    const generateViewId = `${position}.${key}${instanceId ? `.${instanceId}` : ''}`
    store.plugins.delete(generateViewId)
    delete store.views[generateViewId]
    if (callback) {
      callback(store.plugins)
    }
  })
}
)

/**
 * @param  {} position // the position is the plugin inject position
 * @param  {} label // per plugin description
 * @param  {} getComponent // get component func
 * @param  {} callback // spec per plugin inject func
 * @return  type injectComponent
 * @param  {} constview=label.key&&getComponent(extension
 * @param  {} returnpluginRegister({position
 * @param  {} key
 * @param  {} label
 * @param  {} view}
 * @param  {} callback
//  */
export const injectComponent = (position, label, getComponent, callback) => {
  const key = label.key
  const extension = PluginRegistry.get(label.key)
  const view = label.key && getComponent(extension || {}, PluginRegistry, store) // ge your package conteng get all package install cache, get the store

  return pluginRegister({
    position,
    key,
    label,
    view
  }, callback)
}
