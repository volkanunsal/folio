export default function attachEventBindings(obj, element, map) {
  Object.keys(obj).forEach(k => {
    let callback = obj[k];
    // Detach the event binding (if it exists).
    element
      .off(k)
      .on(k, (e) => callback({e, element, map}) );
  });
}
