export default function compareByKey(a, b) {
  var ka = a.key, kb = b.key;
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}
