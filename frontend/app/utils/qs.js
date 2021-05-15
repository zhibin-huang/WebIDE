import qs from 'qs';

const _stringify = qs.stringify.bind(qs);
qs.stringify = function (queryObject) {
  // https://github.com/ljharb/qs#stringifying
  return _stringify(queryObject, { arrayFormat: 'brackets' });
};

export default qs;
