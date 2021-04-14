import * as monaco from 'monaco-editor';
import React, { Component } from 'react';
import { getRecommendation } from 'backendAPI/codeRecommendationAPI';
import cx from 'classnames';
import { observer, inject } from 'mobx-react'
import path from 'utils/path'

@inject(({ EditorTabState }) => {
    const activeTab = EditorTabState.activeTab
    if (!activeTab || !activeTab.editor) return { filePath: '', line:'' }
    return { filePath: activeTab.editor.filePath, title: activeTab.title, line: activeTab.editor.cursorPosition.ln }
})

class Recommendation extends Component {
    constructor(props) {
        super(props)
        this.state = { code: '', loading: false, title: this.props.title, filePath: this.props.filePath, line: this.props.line}
        this.htmlDOM = document.createElement('div')
        Object.assign(this.htmlDOM.style, { width: '100%', height: '100%' })
        this.handleClick = this.onButnClick.bind(this);
        this.meditor = monaco.editor.create(this.htmlDOM, {
            readOnly: true,
            language: 'java',
            automaticLayout: true
        })
    }

    componentWillReceiveProps(newProps){
        if (this.state.filePath != newProps.filePath){
            this.setState({filePath: newProps.filePath})
        }
        if(this.state.line != newProps.line){
            this.setState({line : newProps.line})
        }
        if(this.state.title != newProps.title){
            this.setState({title : newProps.title})
        }
    }

    onButnClick() {
        if (this.state.filePath && this.state.filePath.length > 0) {
            this.setState({ loading: true })
            const rootUri = `/${config.baseDIR}/${config.spaceKey}/working-dir`
            const completePath = path.join(rootUri, this.state.filePath)
            const line = this.state.line
            getRecommendation(completePath, line).then(
                response => {
                    this.meditor.setValue(response['recommendation'])
                    this.setState({ loading: false, code: response['recommendation'] })
                    this.dom.appendChild(this.meditor.getContainerDomNode())
                }
            )
        }
    }

    componentWillUnmount() {
        if (this.meditor) {
            if (this.meditor.getModel()) {
                this.meditor.getModel().dispose();
            }
            this.meditor.dispose();
            this.meditor = null;
        }
    }
    render() {
        return (<div ref={r => this.dom = r} style={{ width: '100%', height: '100%' }} >
                <span> <br/>当前文件:{this.state.title}, &nbsp; 当前行:{this.state.line} <br/><br/></span>
                <button className={cx('btn btn-primary', { disabled: this.state.loading })}
                    style={{ marginLeft: '4px' }}
                    onClick={this.handleClick} >
                    {this.state.loading ? '分析中...' : '执行分析'}
                </button>
        </div>)
    }
}

export default Recommendation;