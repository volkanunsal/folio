import utfDecode from './utfDecode';

export default function grid(data) {
  return (x, y) => {
    if (!data) { return ''; }
    let idx = utfDecode(data.grid[y].charCodeAt(x));
    let key = data.keys[idx];
    return data.data[key];
  };
}
