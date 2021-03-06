import React, { Component } from 'react';
import { observer } from 'mobx-react';
import state from './state';

@observer
class Mask extends Component {
  render() {
    if (state.operating) {
      return (
        <div className="mask-container">
          <div className="progress">
            <i className="fa fa-cog fa-spin" />
            {state.operatingMessage}
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default Mask;
