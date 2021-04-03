import * as fileAPI from './fileAPI'
import * as gitAPI from './gitAPI'
import * as workspaceAPI from './workspaceAPI'
import * as websocketClients from './websocketClients'

export default {
  ...fileAPI,
  ...gitAPI,
  ...workspaceAPI
}

export { websocketClients }
