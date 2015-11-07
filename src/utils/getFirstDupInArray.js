export default function getFirstDupInArray(arr) {
  let map = {};
  let size;
  for (let i = 0, size = arr.length; i < size; i++){
    if (map[arr[i]]){
      return arr[i];
    }
    map[arr[i]] = true;
  }
  return false;
}
