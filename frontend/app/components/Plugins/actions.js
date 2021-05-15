import { registerAction } from 'utils/actions';
import { PluginRegistry } from 'utils/plugins';
import { observable } from 'mobx';
import store from './store';

export const PLUGIN_REGISTER_VIEW = 'PLUGIN_REGISTER_VIEW';

export const pluginRegister = registerAction(PLUGIN_REGISTER_VIEW,
  (children, callback = '') => ({ children, callback }),
  ({ children, callback }) => {
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach((child) => {
    // children 的 shape
      const {
        position, key, label, view, instanceId, status,
      } = child;
      const generateViewId = `${position}.${key}${instanceId ? `.${instanceId}` : ''}`;

      store.plugins.set(generateViewId, observable({
      // 可修改位置
        viewId: generateViewId,
        position,
        key,
        label,
        status: status || observable.map({}),
        actions: observable.ref(label.actions || {}),
      }));
      store.views[generateViewId] = view;
      if (callback) {
        // you can do other mapping such as status initialize in this callback
        callback(store.plugins.get(generateViewId), child, store);
      }
    });
  });

export const injectComponent = (position, label, getComponent, callback) => {
  const { key } = label;
  const extension = PluginRegistry.get(label.key);
  const view = label.key && getComponent(extension || {}, PluginRegistry, store); // ge your package conteng get all package install cache, get the store

  return pluginRegister({
    position,
    key,
    label,
    view,
  }, callback);
};
