import React, { Component } from 'react';
import { connect } from 'react-redux';
import hasVimium from 'utils/hasVimium';
import i18n from 'utils/createI18n';
import { initializeFileTree } from '../components/FileTree/actions';
import PanelsContainer from '../components/Panel';
import Utilities from './Utilities';
import { notify, NOTIFY_TYPE } from '../components/Notification/actions';

class IDE extends Component {
  constructor(props) {
    super(props);
    this.state = { isReady: false };
  }

  componentWillMount() { // initLifecycle_2: IDE specific init
    initializeFileTree(); // @fixme: this is related to the quirk in filetree state
    this.setState({ isReady: true });
  }

  componentDidMount() {
    if (hasVimium()) {
      notify({
        notifyType: NOTIFY_TYPE.ERROR,
        message: i18n`global.hasVimium`,
        dismissAfter: 12000,
      });
    }
  }

  render() {
    if (!this.state.isReady) return null;
    return (
      <div className="ide-container">
        <PanelsContainer />
        <Utilities />
      </div>
    );
  }
}

export default connect()(IDE);
