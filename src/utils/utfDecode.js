export default function utfDecode(C) {
  let c = C;
  if (c >= 93) { c--; }
  if (c >= 35) { c--; }
  return c - 32;
}
