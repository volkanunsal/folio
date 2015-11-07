export default function getFirstDupInArray(arr) {
  let map = {};
  let size = arr.length;
  for (let i = 0; i < size; i++) {
    if (map[arr[i]]) {
      return arr[i];
    }
    map[arr[i]] = true;
  }
  return false;
}
