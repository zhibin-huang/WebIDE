import React from 'react';
import { inject } from 'mobx-react';
import PaneAxis from './PaneAxis';

const PrimaryPaneAxis = inject((state) => {
  const { rootPane } = state.PaneState;
  return { pane: rootPane };
})(PaneAxis);

const PanesContainer = () => <PrimaryPaneAxis id="primary-pane-axis" />;

export default PanesContainer;
