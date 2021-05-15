import {
  extendObservable, autorun, createTransformer, toJS as mobxToJS,
} from 'mobx';
import PanelState from './components/Panel/state';
import PaneState from './components/Pane/state';
import EditorTabState from './components/Tab/state';
import FileTreeState from './components/FileTree/state';
import SettingState from './components/Setting/state';
import FileState from './commons/File/state';
import persistStore from './persist';

const store = {
  PanelState,
  PaneState,
  EditorTabState,
  FileTreeState,
  SettingState,
  FileState,
};

const toJS = (store) => {
  if (store.toJS) {
    return store.toJS();
  }
  return mobxToJS(store);
};

extendObservable(store, {
  debug: false,
});

export const transform = createTransformer((store) => ({
  PanelState: toJS(store.PanelState),
  PaneState: toJS(store.PaneState),
  EditorTabState: toJS(store.EditorTabState),
  FileTreeState: toJS(store.FileTreeState),
  FileState: toJS(store.FileState),
  SettingState: toJS(store.SettingState),
}));

export const persistTask = () => persistStore(store, transform);

autorun(() => {
  if (store.debug) {
    console.log('[mobx store] ', transform(store));
  }
});

export default store;
