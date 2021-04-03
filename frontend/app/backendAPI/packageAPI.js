import axios from 'axios'
import { request } from '../utils'
// import { PluginRegistry } from 'utils/plugins'
import { fetchPackage } from '../components/Plugins/actions'
import config from '../config'

const { packageServer, packageDev } = config


const io = require('socket.io-client/dist/socket.io.min.js')

export const fetchPackageList = (type) => {
  if (packageDev) {
    return request.get(`${packageServer}/packages/`)
  }
  if (config.isPlatform) {
    const requirement = type ? `?requirement=${type}` : ''
    return request.get(`/packages${requirement}`)
  }
  return request.get('/packages')
}

export const fetchPackageInfo = (pkgName, pkgVersion, target) =>
  axios.get(`${target || packageServer}/packages/${pkgName}/${pkgVersion}/manifest.json`).then(res => res.data)

export const fetchPackageScript = (props) => {
  if (Array.isArray(props)) {
    const concatedUrl = props.reduce((p, v, i) => `${p}${v.pkgName}/${v.pkgVersion}/index.js${i !== props.length - 1 ? ',' : ''}`, '??')
    return axios.get(`${packageServer}/packages/${concatedUrl}`).then(res => res.data)
  }
  return axios.get(`${props.target || packageServer}/packages/${props.pkgName}/${props.pkgVersion}/index.js`).then(res => res.data)
}

export const enablePackageHotReload = (target) => {
  const socket = io.connect(target || packageServer, {
    reconnection: true,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 5,
    transports: ['websocket']
  })
  socket.on('change', (data) => {
    if (!data) return
    if (target) {
      console.log(`plugin is reloading from ${target}`, data)
      data.codingIdePackage.TARGET = target
    }
    fetchPackage(data.codingIdePackage, 'reload')
  })
}
