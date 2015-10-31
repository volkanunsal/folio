/*globals L*/
import t from 'tcomb';
export default function getLatLon(coordinates) {
  return t.Array.is(coordinates) ? L.latLng(coordinates) : coordinates;
}
