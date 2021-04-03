// 不可用的快捷键:
// http://stackoverflow.com/questions/7295508/javascript-capture-browser-shortcuts-ctrlt-n-w
import { normalizeKeys, keyEventToKeyCombination } from './helpers'

/*
定义两个术语:
Key Combination: 键位组合，指的是一个快捷键组合，e.g. `ctrl+c`
Key Composition: 复合快捷键，指的是连续按几个快捷键组合，e.g. `ctrl+K,ctrl+F`
*/

class Keymapper {
  static defaults = {
    dispatchCommand: console.log || (f => f),
    combinator: '+',
    delimiter: ',',
    wait: 500,
  };

  constructor (opts) {
    const options = { ...Keymapper.defaults, ...opts }
    const { dispatchCommand, combinator, delimiter, wait } = options
    this.dispatchCommand = dispatchCommand
    this.combinator = combinator
    this.delimiter = delimiter
    this.wait = wait

    this.keymaps = {}
    this.keysRegistered = {}
    this.lastTimeoutId = false
    this.buffer = {
      keys: [],
      getDelimiter: () => this.delimiter,
      reset () {
        this.keys.length = 0
      },
      push (keyCombination) {
        this.keys.push(keyCombination)
      },
      read () {
        return this.keys.join(this.getDelimiter())
      }
    }

    window.addEventListener('keydown', this.handleKeyEvent)
    Object.defineProperty(Keymapper, '$$singleton', { value: this })
  }


  handleKeyEvent = (e) => {
    const isComboPending = Boolean(this.lastTimeoutId)
    // ignore if only modifier is pressed
    if (['Meta', 'OS', 'Control', 'Shift', 'Alt'].indexOf(e.key) > -1) return
    const keyCombination = keyEventToKeyCombination(e, this.combinator)
    const keyCombinationState = this.keysRegistered[keyCombination]
    if (keyCombinationState === undefined && !isComboPending) return

    this.buffer.push(keyCombination)

    if (this.lastTimeoutId) {
      clearTimeout(this.lastTimeoutId)
      this.lastTimeoutId = false
    }

    if (keyCombinationState == 1) {
      // hotkey should stop propagate
      e.preventDefault(); e.stopPropagation()
      this.consumeBuffer()
    }

    if (keyCombinationState > 1 || isComboPending) {
      e.preventDefault(); e.stopPropagation()
      this.lastTimeoutId = setTimeout(() => this.consumeBuffer(), this.wait)
    }
  }

  consumeBuffer () {
    this.lastTimeoutId = false
    const keys = this.buffer.read()
    if (keys) this.dispatchCommand(this.keymaps[keys])
    this.buffer.reset()
  }

  map (keys, command) {
    if (typeof keys !== 'string' || typeof command !== 'string') return
    const normalizedKeys = normalizeKeys(keys, this.combinator, this.delimiter)
    this.registerKeys(normalizedKeys)
    this.registerKeymaps(normalizedKeys, command)
  }

  registerKeys (keys) {
    const keyComps = keys.split(this.delimiter)
    this.keysRegistered[keyComps[0]] = keyComps.length
  }

  unregisterKeys (keys) {
    const keyComps = keys.split(this.delimiter)
    delete this.keysRegistered[keyComps[0]]
  }

  registerKeymaps (keys, command) {
    this.keymaps[keys] = command
  }

  loadKeymaps (keymaps) {
    if (typeof keymaps === 'string') {
      try { keymaps = JSON.parse(keymaps) } catch (e) { throw Error('Keymapper: Invalid keymaps description. Fail to parse JSON to object.') }
    }
    if (!keymaps || typeof keymaps !== 'object') return

    Object.keys(keymaps).forEach((keys) => {
      if (typeof keymaps[keys] === 'string') {
        this.map(keys, keymaps[keys])
      } else {
        throw Error('Keymapper: Invalid keymaps description.')
      }
    })
  }
}

export default Keymapper
