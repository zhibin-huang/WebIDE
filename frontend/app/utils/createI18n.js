import React, { Component } from 'react'
import settings from 'settings'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
import { autorun } from 'mobx'

const separator = ':='
// const transferredMeaning = '\\'
const languageToCode = {
  English: 'en_US',
  Chinese: 'zh_CN'
}
const languageDicPool = require('../i18n/index.json').reduce((p, v) => {
  p[v] = require(`../i18n/${v}/index`).default
  return p
}, {})

// setting moment global language
autorun(() => {
  const languageSetting = settings.general.language
  const language = languageToCode[languageSetting.value]
  moment.locale(language)
})

// support shape
const mapStateToProps = () => {
  const languageSetting = settings.general.language
  const language = languageToCode[languageSetting.value]
  return ({ language })
}

@inject(mapStateToProps) @observer
class Translate extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const { id, language, template, values, translate } = this.props
    return (
      <span id={id}>{this.translate({ language, template, values, translate })}</span>
    )
  }
  translate ({ language, template, values, translate }) {
    if (values.length === 0) {
      return template.reduce((p, v) => `${p}${translate(v, language, {})}`, '')
    }
    return template.reduce((p, v, i) => {
      if (i < values.length) {
        return `${p}${translate(v, language, values[i] || {})}`
      }
      return p
    }, '')
  }
}

export class CreateI18n {
  constructor ({ customLanguagePool = null }) {
    this.languageDicPool = customLanguagePool || languageDicPool
    this.i18nComponent = this.i18nComponent.bind(this)
    this.translate = this.translate.bind(this)
    this.replaceVariable = this.replaceVariable.bind(this)
    this.getCache = this.getCache.bind(this)
  }
  translate (origin = '', language, variableObj) {
    const dic = this.languageDicPool[language]
    const key = origin.split(separator)[0]
    if (!origin) {
      return origin
    }
    // 当字典里找不到先看是否是开发模式下的:=，如果是就先暂时显示它，不是则原样返回
    if (!_.get(dic, key)) {
      return this.replaceVariable(origin.split(separator)[1] || '', variableObj) || origin
    }
    return this.replaceVariable(_.get(dic, key) || '', variableObj)
  }
  replaceVariable (translated, variables, formatFunc) {
    return translated.replace(/{(.+?)}/g, (variable) => {
      const transfer = variables[variable.slice(1, -1)]
      if (transfer) {
        return formatFunc ? formatFunc(transfer) : transfer
      }
      return variable.slice(1, -1)
    })
  }
  i18nComponent (template = [], ...values) {
    const translate = (language) => template.reduce(
      (p, v, i) => `${p}${this.translate(v, language, values[i] || {})}`
    , '')

    const TranslateComponent = inject(mapStateToProps)(({ language }) => (
      <span id={template[0]}>{translate(language)}</span>
      // <Translate id={template[0]}>{translate(language)}</Translate>
    ))

    const toString = () => translate(mapStateToProps().language)
    // return React.createElement(TranslateComponent, { toString })
    return <Translate id={template[0]} language={mapStateToProps().language} template={template} values={values} translate={this.translate} />
  }
  getCache (key, value) {
    const language = languageToCode[settings.general.language.value]
    return this.translate(key, language, value)
  }
  get language () {
    return mapStateToProps().language
  }
}


const defaultInstance = new CreateI18n({})
const i18n = defaultInstance.i18nComponent
i18n.get = defaultInstance.getCache
export default i18n
