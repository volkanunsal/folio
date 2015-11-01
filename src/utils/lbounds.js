/*globals L*/

const {L} = window;

export default function lbounds(u) {
  return new L.LatLngBounds([[u[1], u[0]], [u[3], u[2]]]);
}
