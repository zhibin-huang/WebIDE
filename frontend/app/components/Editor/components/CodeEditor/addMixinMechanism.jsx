import is from 'utils/is'
import noop from 'lodash/noop'

const LIFECYCLES = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
]

function addEventListeners (self) {
  const eventListeners = self.getEventListeners()
  if (!is.pojo(eventListeners)) {
    throw Error(`Mixin ${self.key} getEventListeners() must return an eventListeners description object`)
  }

  if (!self.cm || !is.function(self.cm.on)) {
    (console.error || console.log)(`Mixin ${self.key} doesn't have access to cm instance`)
    return noop // any reason cm doesn't exist
  }

  const disposers = Object.keys(eventListeners).reduce((acc, eventType) => {
    self.cm.on(eventType, eventListeners[eventType])
    return acc.concat(() => self.cm.off(eventType, eventListeners[eventType]))
  }, [])

  return function cmRemoveEventListeners () {
    disposers.forEach(disposer => disposer())
  }
}

function preprocessMixin (mixin) {
  let newMixin = mixin

  // attach/detach eventListeners
  if (is.function(mixin.getEventListeners)) {
    const oComponentDidMount = mixin.componentDidMount || noop
    const oComponentWillUnmount = mixin.componentWillUnmount || noop

    newMixin = {
      ...mixin,
      componentDidMount () {
        oComponentDidMount.call(this)
        this.cmRemoveEventListeners = addEventListeners(this) || noop
      },
      componentWillUnmount () {
        if (this.cmRemoveEventListeners) {
          this.cmRemoveEventListeners()
        }
        oComponentWillUnmount.call(this)
      },
    }
  }

  return newMixin
}

function setPrototypeOf (self, proto) {
  function MixedInComponent () {}
  MixedInComponent.prototype = proto
  const newSelf = new MixedInComponent()
  return Object.assign(newSelf, self)
}

function attachMixinContexts (self, mixins) {
  if (!self.$mixinContexts) self.$mixinContexts = new Map()
  mixins.forEach((mixin) => {
    const context = setPrototypeOf(mixin, self)
    context.self = self
    if (is.function(mixin.shouldMount)) {
      const shouldMount = mixin.shouldMount.call(context)
      is.boolean(shouldMount) && shouldMount && self.$mixinContexts.set(mixin.key, context)
    } else {
      self.$mixinContexts.set(mixin.key, context)
    }
  })
}

function addMixinMechanism (Class, SuperClass) {
  if (Class.$mixins instanceof Map) return Class
  Class.$mixins = new Map()

  // forEach lifecycle
  for (let i = 0; i < LIFECYCLES.length; i++) {
    const lifecycle = LIFECYCLES[i]

    const oLifecycle = Class.prototype[lifecycle]
    Class.prototype[lifecycle] = function (...args) {
      // a special phrase at componentWillMount
      // to bootstrap $mixinContexts for each `this` instance
      if (lifecycle === 'componentWillMount') {
        attachMixinContexts(this, Class.$mixins)
      }

      const superLifecycle = SuperClass ? SuperClass.prototype[lifecycle] : undefined
      if (is.function(superLifecycle)) {
        superLifecycle.call(this, ...args)
      }
      if (is.function(oLifecycle) && oLifecycle !== superLifecycle) {
        oLifecycle.call(this, ...args)
      }

      Class.$mixins.forEach((mixin) => {
        const context = this.$mixinContexts.get(mixin.key)
        // if a mixin doesn't have a context, that means it's `shouldMount` method returns false.
        if (!context) return
        const mixinLifecycle = mixin[lifecycle]
        if (is.function(mixinLifecycle)) {
          mixinLifecycle.call(context, ...args)
        }
      })
    }
  }

  Class.use = function (mixin, override) {
    if (!mixin.key) throw Error(`Mixin must have a key`)
    if (override || !this.$mixins.has(mixin.key)) {
      this.$mixins.set(mixin.key, preprocessMixin(mixin))
    }
  }

  Class.unuse = function (mixin) {
    const mixinKey = is.string(mixin) ? mixin : mixin.key
    this.$mixins.delete(mixinKey)
  }

  return Class
}

export default addMixinMechanism
