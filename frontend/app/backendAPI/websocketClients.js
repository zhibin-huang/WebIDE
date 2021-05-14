import { Stomp } from 'stompjs/lib/stomp'
import SockJS from 'sockjs-client'
import getBackoff from 'utils/getBackoff'
import emitter, * as E from 'utils/emitter'
import config from 'config'
import { runInAction } from 'mobx'
import { notify, NOTIFY_TYPE } from '../components/Notification/actions'

const log = console.log || (x => x)
const warn = console.warn || (x => x)

class FsSocketClient {
  constructor() {
    if (FsSocketClient.$$singleton) return FsSocketClient.$$singleton
    const url = `${config.baseURL}/sockjs/`
    // SockJS auto connects at initiation
    this.sockJSConfigs = [url, {}, { server: `${config.spaceKey}`, transports: 'websocket' }]
    this.backoff = getBackoff({
      delayMin: 50,
      delayMax: 5000,
    })
    this.maxAttempts = 7
    FsSocketClient.$$singleton = this
    emitter.on(E.SOCKET_RETRY, this.reconnect.bind(this))
    this.errorCallback = undefined
    this.successCallback = undefined
  }

  connect() {
    if (!this.socket || !this.stompClient) {
      this.socket = new SockJS(...this.sockJSConfigs)
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.debug = false // stop logging PING/PONG
    }
    const success = () => {
      runInAction(() => config.fsSocketConnected = true)
      this.backoff.reset()
      this.successCallback(this.stompClient)
    }
    const error = (frame) => {
      log('fsSocket error', this.socket)
      switch (this.socket.readyState) {
        case SockJS.CLOSING:
        case SockJS.CLOSED:
          runInAction(() => config.fsSocketConnected = false)
          this.reconnect()
          break
        case SockJS.OPEN:
          log('FRAME ERROR', frame)
          break
        default:
      }
      this.errorCallback(frame)
    }

    this.stompClient.connect({}, success, error)
  }

  reconnect() {
    if (config.fsSocketConnected) return
    log(`try reconnect fsSocket ${this.backoff.attempts}`)
    // unset this.socket
    this.socket = undefined
    if (this.backoff.attempts <= this.maxAttempts) {
      const retryDelay = this.backoff.duration()
      log(`Retry after ${retryDelay}ms`)
    } else {
      emitter.emit(E.SOCKET_TRIED_FAILED)
      notify({ message: i18n`global.onSocketError`, notifyType: NOTIFY_TYPE.ERROR })
      this.backoff.reset()
      warn('Sock connected failed, something may be broken, reload page and try again')
    }
  }

  close() {
    const self = this
    if (config.fsSocketConnected) {
      self.socket.close(1000, 123)
      runInAction(() => config.fsSocketConnected = false)
    }
  }
}


export {FsSocketClient}
