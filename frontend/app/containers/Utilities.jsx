import React from 'react';
import ModalContainer from 'components/Modal';
import Notification from 'components/Notification';
import DragAndDrop from 'components/DragAndDrop';
import { Tooltips } from 'components/Tooltip';
import { ContextMenuContainer } from 'components/ContextMenu';
import Mask from 'components/Mask';

const Utilities = () => (
  <div className="utilities-container">
    <Tooltips />
    <ModalContainer />
    <Notification />
    <DragAndDrop />
    <ContextMenuContainer />
    <Mask />
  </div>
);

export default Utilities;
