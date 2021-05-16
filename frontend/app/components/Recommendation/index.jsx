import React, { Component } from 'react';
import { getRecommendation } from 'backendAPI/codeRecommendationAPI';
import cx from 'classnames';
import { inject } from 'mobx-react';
import path from 'utils/path';
import config from 'config';

@inject(({ EditorTabState }) => {
  const { activeTab } = EditorTabState;
  if (!activeTab || !activeTab.editor) return { filePath: '', line: '' };
  return {
    filePath: activeTab.editor.filePath,
    title: activeTab.title,
    line: activeTab.editor.cursorPosition.ln,
  };
})

class Recommendation extends Component {
  constructor(props) {
    super(props);
    const { title, filePath, line } = this.props;
    this.state = {
      results: [], loading: false, title, filePath, line, first: true,
    };
    this.handleClick = this.onButnClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { filePath, line, title } = this.state;
    if (filePath !== newProps.filePath) {
      this.setState({ filePath: newProps.filePath });
    }
    if (line !== newProps.line) {
      this.setState({ line: newProps.line });
    }
    if (title !== newProps.title) {
      this.setState({ title: newProps.title });
    }
  }

  onButnClick() {
    const { filePath, line } = this.state;
    if (filePath && filePath.length > 0) {
      this.setState({ loading: true, first: false });
      const rootUri = `/${config.baseDIR}/${config.spaceKey}/working-dir`;
      const completePath = path.join(rootUri, filePath);
      getRecommendation(completePath, line).then(
        (response) => {
          this.setState({ loading: false, results: response.recommendation });
        },
      );
    }
  }

  render() {
    const {
      results, title, line, loading, first,
    } = this.state;
    const resultsView = results.length > 0 ? results.map((result, index) => (
      <div className="panel panel-info">
        <div className="panel-heading">
          <h4 className="panel-title">
            <a
              data-toggle="collapse"
              data-parent="#accordion"
              href={`#collapse${index}`}
            >
              {`推荐结果${index + 1}`}
            </a>
          </h4>
        </div>
        <div id={`collapse${index}`} className="panel-collapse collapse in">
          <div className="panel-body">
            <pre style={{ overflowY: 'hidden' }}>{result}</pre>
          </div>
        </div>
        <br />
      </div>
    )) : (
      <div className="panel panel-info">
        <div className="panel-body">
          当前方法未得到推荐结果。
        </div>
      </div>
    );
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <span>
          <br />
          当前文件:
          {' '}
          {title}
          , &nbsp; 当前行:
          {line}
        </span>
        <br />
        <br />
        <button
          type="submit"
          className={cx('btn btn-primary', { disabled: loading })}
          style={{ marginLeft: '4px' }}
          onClick={this.handleClick}
        >
          {loading ? '分析中...' : '执行分析'}
        </button>
        <br />
        <br />
        {
          !loading && !first
            ? (
              <div className="panel-group" id="accordion">
                {resultsView}
              </div>
            ) : ''
        }
      </div>
    );
  }
}

export default Recommendation;
