import debounce from 'lodash/debounce';
import state from './state';

export default {
  key: 'java_mixin',
  getEventListeners() {
    return {
      change: debounce((cm) => {
      }, 1200),
    };
  },
  componentWillMount() {},
  componentDidMount() {},
};
