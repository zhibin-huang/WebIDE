import MenuScope from 'commons/Menu/state';
import { autorun, observable } from 'mobx';

import menuBarItems from './menuBarItems';

const { state, MenuItem } = MenuScope(menuBarItems);

autorun(() => {
  state.items = observable.shallowArray(menuBarItems.map((opts) => new MenuItem(opts)));
});

export default state;
