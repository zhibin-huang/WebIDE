import { observable } from 'mobx';

const store = {
  views: {},
  plugins: observable.map({}),
};

export default store;
