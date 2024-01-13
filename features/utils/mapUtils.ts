import { Loader } from '@googlemaps/js-api-loader';
import { PlaceDto } from '@/entities/vendors/api/dto/placeDto';

export const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry'],
});

export async function createMap(initialLocation: google.maps.LatLng) {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  return new Map(document.getElementById('map') as HTMLElement, {
    center: initialLocation,
    zoom: 11,
    mapTypeControl: false,
  });
}

export function drawMarkers(places: PlaceDto[] | undefined, initialLocation: google.maps.LatLng, map: google.maps.Map) {
  let placesWithinRadius: PlaceDto[] = [];

  if (places) {
    placesWithinRadius = places.filter((place) => {
      const placeLocation = new google.maps.LatLng(place.latitude, place.longitude);
      if (google.maps.geometry.spherical.computeDistanceBetween(initialLocation, placeLocation) < 1609.34 * 30) {
        new google.maps.Marker({
          map,
          position: new google.maps.LatLng(place.latitude, place.longitude),
          optimized: true,
        });
        return true;
      }
      return false;
    });
  }

  return placesWithinRadius;
}

export function getStaticMapImage(location: { latitude: number; longitude: number }, places: PlaceDto[]): string {
  let url = `https://maps.googleapis.com/maps/api/staticmap?maptype=terrain&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${location.latitude},${location.longitude}&zoom=12&size=600x400&scale=2&markers=${location.latitude},${location.longitude}&markers=size:mid%7Clabel:T%7Ccolor:blue`;
  url += places.length ? places.map((place) => `%7C${place.latitude},${place.longitude}`).join('') : '';
  return url;
}

export function handleError(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log('User denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      console.log('Location information is unavailable.');
      break;
    case error.TIMEOUT:
      console.log('The request to get user location timed out.');
      break;
    default:
      console.log('An unknown error occurred.');
      break;
  }
}
