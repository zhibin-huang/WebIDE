import { extendObservable } from 'mobx'
import qs from 'qs'
import mobxStore from 'mobxStore'
import { createAction, handleActions, registerAction } from 'utils/actions'
import state, { Tab, TabGroup } from './state'
import { openFile } from '../../commands/commandBindings/file'
import dispatchCommand from 'commands/dispatchCommand'

export const TAB_CREATE = 'TAB_CREATE'
export const TAB_STORE_HYDRATE = 'TAB_STORE_HYDRATE'

const openUrlFile = (files) => {
  // open file depends on url
  let fileArr = [];
  if (files) {
    fileArr = files.split(',');
     const baseOpen = (i) => {
      if (i < fileArr.length) {
        let path = fileArr[i]
        if (!path.startsWith('/')) {
          path = `/${path}`;
        }
        openFile({
          path
        }, () => {
          i++
          baseOpen(i)
        });
      }
    }
     baseOpen(0);
  }
}

export const hydrate = registerAction(TAB_STORE_HYDRATE, (json) => {
  Object.values(json.tabGroups).forEach((tabGroupsValue) => {
    createGroup(tabGroupsValue.id)
  })
  const tabs = Object.values(json.tabs)
  if (tabs.length === 0) {
    dispatchCommand('file:open_welcome')
  }
  const openTabs = tabs.map((tabValue) => {
    const { path, editor, ...others } = tabValue
    const option = { path, editor, others }
    return openFile(option)
  })

  const files = qs.parse(window.location.search.slice(1)).open;
  if (tabs.map.length) {
    Promise.all(openTabs).then(() => {
      Object.values(json.tabGroups).forEach((tabGroupsValue) => {
        const activeTabId = tabGroupsValue.activeTabId;
        if (activeTabId) {
          const index = tabs.findIndex(tab => tab.id === activeTabId);
          if (index >= 0) {
            const { path, contentType } = tabs[index];
            openFile({
              path,
              contentType
            }, () => {
              if (files) {
                openUrlFile(files);
              }
            });
          }
        }
      })
    })
  } else {
    if (files) {
      openUrlFile(files);
    }
  }
})

export const createTab = registerAction(TAB_CREATE,
  (tabProps) => {
    const tab = new Tab(tabProps)
  },
)

export const removeTab = registerAction('tab:remove', (tabId) => {
  const tab = state.tabs.get(tabId)
  tab.destroy()
})

export const removeOtherTab = registerAction('tab:remove_other', (tabId) => {
  const tab = state.tabs.get(tabId)
  tab.activate()
  tab.tabGroup.tabs.forEach((eachTab) => {
    if (eachTab !== tab) eachTab.destroy()
  })
})

export const removeAllTab = registerAction('tab:remove_all', (tabId) => {
  const tab = state.tabs.get(tabId)
  tab.tabGroup.tabs.forEach(tab => tab.destroy())
})


export const activateTab = registerAction('tab:activate', (tabId) => {
  const tab = state.tabs.get(tabId)
  if (tab && tab.activate) {
    tab.activate()
  }
})

export const createGroup = registerAction('tab:create_tab_group',
  (groupId) => {
    new TabGroup({ id: groupId })
  }
)

export const removeGroup = registerAction('tab:remove_tab_group',
  (groupId) => {
    const tab = state.tabs.get(groupId)
  }
)

export const updateTab = registerAction('tab:update',
  (tabProps = {}) => {
    const tabId = tabProps.id
    const tab = state.tabs.get(tabId)
    if (tab) tab.update(tabProps)
  }
)

export const TAB_UPDATE_BY_PATH = 'TAB_UPDATE_BY_PATH'
export const updateTabByPath = registerAction(TAB_UPDATE_BY_PATH, (tabProps = {}) => tabProps)

export const TAB_UPDATE_FLAGS = 'TAB_UPDATE_FLAGS'
export const updateTabFlags = registerAction('tab:update_flags', (tabId, flag, value = true) => {
  let flags
  if (typeof flag === 'string') {
    flags = { [flag]: value }
  } else if (typeof flag === 'object') {
    flags = flag
  }
  return { tabId, flags }
},
  ({ tabId, flags }) => {
    const tab = state.tabs.get(tabId)
    if (!tab || !flags) return
    tab.flags = flags
  }
)

export const moveTabToGroup = registerAction('tab:move_to_tab_group',
  (tabId, groupId) => ({ tabId, groupId }),
  ({ tabId, groupId }) => {
    const tab = state.tabs.get(tabId)
    const tabGroup = state.tabGroups.get(groupId)
    if (!tab || !tabGroup) return
    tabGroup.addTab(tab)
  }
)

export const TAB_INSERT_AT = 'TAB_INSERT_AT'
export const insertTabBefore = registerAction(TAB_INSERT_AT,
  (tabId, beforeTabId) => ({ tabId, beforeTabId }),
  ({ tabId, beforeTabId }) => {
    const tab = state.tabs.get(tabId)
    const anchorTab = state.tabs.get(beforeTabId)
    const prev = anchorTab.prev
    const insertIndex = (prev) ? (anchorTab.index + prev.index) / 2 : -1
    anchorTab.tabGroup.addTab(tab, insertIndex)
  }
)

export const TAB_CONTEXT_MENU_OPEN = 'TAB_CONTEXT_MENU_OPEN'
export const openContextMenu = registerAction(TAB_CONTEXT_MENU_OPEN, (e, node, tabGroupId) => {
  e.stopPropagation()
  e.preventDefault()

  return {
    isActive: true,
    pos: { x: e.clientX, y: e.clientY },
    contextNode: node,
    tabGroupId
  }
})

export const TAB_CONTEXT_MENU_CLOSE = 'TAB_CONTEXT_MENU_CLOSE'
export const closeContextMenu = createAction(TAB_CONTEXT_MENU_CLOSE)


export const TAB_MOVE_TO_PANE = 'TAB_MOVE_TO_PANE'
export const moveTabToPane = registerAction(TAB_MOVE_TO_PANE,
  (tabId, paneId) => ({ tabId, paneId }),
  ({ tabId, paneId }) => {
    const pane = mobxStore.PaneState.panes.get(paneId)
    const tab = mobxStore.EditorTabState.tabs.get(tabId)
    tab.tabGroup.removeTab(tab)
    pane.tabGroup.addTab(tab)
    return mobxStore
  }
)
