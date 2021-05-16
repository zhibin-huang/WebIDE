import React, { Component } from 'react';
import getPaletteItems from './getPaletteItems';
import cx from 'classnames';

import dispatchCommand from '../dispatchCommand';

class CommandPalette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getPaletteItems(),
      selectedItemIndex: 0,
    };
  }

  render() {
    return (
      <div className="modal-content">
        <input
          type="text"
          className="command-palette-input"
          autoFocus
          onChange={(e) => this.setState({ items: getPaletteItems(e.target.value) })}
          onKeyDown={this._onKeyDown}
        />
        <ul className="command-palette-items">
          {this.state.items.map((item, itemIdx) => (
            <li
              className={cx({ selected: itemIdx == this.state.selectedItemIndex })}
              onClick={(e) => this._dispatchCommand(itemIdx)}
              key={itemIdx}
            >
              { this.renderItem(item, itemIdx) }
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderItem(item, itemIdx) {
    if (!item.em) return <i>{item.name}</i>;
    const itemElements = item.name.split('').map((char, idx) => (item.em.indexOf(idx) > -1
      ? <em key={idx}>{char}</em>
      : <i key={idx}>{char}</i>));
    return itemElements;
  }

  _dispatchCommand(itemIdx) {
    const idx = itemIdx || this.state.selectedItemIndex;
    dispatchCommand(this.state.items[idx].command);
  }

  _onKeyDown = (e) => {
    let idx = this.state.selectedItemIndex;
    const len = this.state.items.length;

    switch (e.keyCode) {
      case 13: /* enter */
        this._dispatchCommand();
        break;
      case 40: /* down */
        if (++idx == len) idx = len - 1;
        this.setState({ selectedItemIndex: idx });
        break;
      case 38: /* up */
        if (--idx < 0) idx = 0;
        this.setState({ selectedItemIndex: idx });
        break;
    }
  }
}

export default CommandPalette;
