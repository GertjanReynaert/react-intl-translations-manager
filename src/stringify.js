import stableStringify from 'json-stable-stringify';
import compareByKey from './compareByKey';

export default function stringify(value, {
  replacer = null,
  space = 2,
  sortKeys = false,
}) {
  return (
    sortKeys
      ? stableStringify(value, {replacer, space, cmp: compareByKey})
      : JSON.stringify(value, replacer, space)
  );
}