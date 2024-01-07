import Typography from '@mui/material/Typography';
import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import Image from 'next/image';
import { Loader } from '@googlemaps/js-api-loader';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useGetPlacesQuery } from '@/entities/vendors/api/vendorApi';

const loader = new Loader({
  apiKey: 'AIzaSyCKhSAyYFPO5A1ADMys0uiNkIUS1763JyI',
  version: 'weekly',
  libraries: ['places'],
});

export function Step1() {
  const [isMapsApiLoading, setMapsApiLoading] = useState(true);
  const { data: places, isFetching } = useGetPlacesQuery();
  let map: google.maps.Map;

  useEffect(() => {
    loader.load().then(() => {
      setMapsApiLoading(false);
    });
  }, []);

  useEffect(() => {
    const renderMap = async () => {
      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map = new Map(document.getElementById('map') as HTMLElement, {
              center: initialLocation,
              zoom: 12,
              mapTypeControl: false,
            });
            
            if (places) {
              for (const place of places) {
                new google.maps.Marker({
                  map,
                  position: new google.maps.LatLng(place.latitude, place.longitude),
                });
              }
            }
          },
          (e) => {
            map = new Map(document.getElementById('map') as HTMLElement, {
              center: { lat: 40.749933, lng: -73.98633 },
              zoom: 12,
              mapTypeControl: false,
            });

            if (places) {
              for (const place of places) {
                new google.maps.Marker({
                  map,
                  position: new google.maps.LatLng(place.latitude, place.longitude),
                });
              }
            }
          },
        );
      }
    };
    if (!isMapsApiLoading && !map) {
      renderMap().catch(console.error);
    }
  }, [isMapsApiLoading, places]);

  return (
    <Stack alignItems="center" gap={5}>
      <Typography variant="h4">We have 17 mobile tire repair shops near you</Typography>
      <Box component="div" id="map" width={1} height="300px"></Box>
      <Typography variant="h4">What repair do you need?</Typography>
      <RadioGroup row name="tire-damage">
        <Stack alignItems="center">
          <Image src="/images/flat-tire.png" width={100} height={100} alt="Flat tire repair" />
          <FormControlLabel value="FLAT" control={<Radio />} label="My Tire is Flat" />
        </Stack>
      </RadioGroup>
      <Typography variant="h4">Which tire is it?</Typography>
      <RadioGroup row name="tire-side">
        <Stack alignItems="center">
          <Image src="/images/wheel-front-left.png" width={100} height={100} alt="Driver Side Front Tire" />
          <FormControlLabel value="LF" control={<Radio />} label="Driver Side Front (LF)" />
        </Stack>
        <Stack alignItems="center">
          <Image src="/images/wheel-rear-left.png" width={100} height={100} alt="Driver Side Rear Tire" />
          <FormControlLabel value="LR" control={<Radio />} label="Driver Side Rear (LR)" />
        </Stack>
        <Stack alignItems="center">
          <Image src="/images/wheel-front-right.png" width={100} height={100} alt="Passenger Side Front Tire" />
          <FormControlLabel value="RF" control={<Radio />} label="Passenger Side Front (RF)" />
        </Stack>
        <Stack alignItems="center">
          <Image src="/images/wheel-rear-right.png" width={100} height={100} alt="Passenger Side Rear Tire" />
          <FormControlLabel value="RR" control={<Radio />} label="Passenger Side Rear (RR)" />
        </Stack>
      </RadioGroup>
    </Stack>
  );
}
