import * as fileAPI from './fileAPI'
import * as gitAPI from './gitAPI'
import * as workspaceAPI from './workspaceAPI'
import * as websocketClients from './websocketClients'
import * as codeRecommendationAPI from './codeRecommendationAPI'

export default {
  ...fileAPI,
  ...gitAPI,
  ...workspaceAPI,
  ...codeRecommendationAPI
}

export { websocketClients }
