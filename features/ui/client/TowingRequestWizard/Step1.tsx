import { Stack, TextField } from '@mui/material';
import React, { MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { Loader } from '@googlemaps/js-api-loader';
import Box from '@mui/material/Box';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { StyledPaper } from '@/features/ui/Paper/Paper';

export type StepProps = { formRef?: MutableRefObject<HTMLFormElement | null>; goToNextStep: (index?: number) => void };

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker', 'routes'],
});

export function Step1(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const dispatch = useDispatch();
  const serviceRequest = useSelector(selectServiceRequest) as TowingRequest;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Pick<TowingRequest, 'location' | 'locationDropOff' | 'distance'>>({ values: serviceRequest });
  const handleStepSubmit = (data: Pick<TowingRequest, 'location' | 'locationDropOff' | 'distance'>) => {
    dispatch(setServiceRequest(data));
    goToNextStep();
  };

  if (typeof window !== 'undefined') {
    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
      const map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 25.761681, lng: -80.191788 },
        zoom: 11,
        mapTypeControl: false,
      });

      const drawRoute = () => {
        const pickupLocation = getValues('location');
        const dropoffLocation = getValues('locationDropOff');
        const pickupLat = pickupLocation?.latitude;
        const pickupLng = pickupLocation?.longitude;
        const dropoffLat = dropoffLocation?.latitude;
        const dropoffLng = dropoffLocation?.longitude;

        if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
          directionsRenderer.setMap(map);

          const request = {
            origin: { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) },
            destination: { lat: parseFloat(dropoffLat), lng: parseFloat(dropoffLng) },
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result);

              // Calculate and store the distance
              if (result.routes[0].legs[0].distance) {
                const meters = result.routes[0].legs[0].distance.value;
                const distanceText = result.routes[0].legs[0].distance.text;
                setValue('distance', meters);

                // Get the midpoint of the route to place the distance label
                const route = result.routes[0].overview_path;
                const midpoint = route[Math.floor(route.length / 2)];

                // Create a marker at the midpoint with the distance as a label
                const infoWindow = new google.maps.InfoWindow({
                  content: `<strong>${distanceText}</strong>`,
                  position: midpoint,
                  headerDisabled: true,
                });
                infoWindow.open(map);
              }
            }
          });
        }
      };

      // Pickup autocomplete
      const pickupInput = document.getElementById('pickup-input') as HTMLInputElement;
      const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput);
      pickupAutocomplete.bindTo('bounds', map);

      // Dropoff autocomplete - Add this section
      const dropoffInput = document.getElementById('dropoff-input') as HTMLInputElement;
      const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput);
      dropoffAutocomplete.bindTo('bounds', map);

      const pickupMarker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });

      // Create a second marker for dropoff location
      const dropoffMarker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });

      pickupAutocomplete.addListener('place_changed', () => {
        pickupMarker.setVisible(false);
        const place = pickupAutocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        setValue('location.latitude', place.geometry.location.lat().toString());
        setValue('location.longitude', place.geometry.location.lng().toString());

        pickupMarker.setPosition(place.geometry.location);
        pickupMarker.setVisible(true);
        drawRoute();
      });

      dropoffAutocomplete.addListener('place_changed', () => {
        dropoffMarker.setVisible(false);
        const place = dropoffAutocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        setValue('locationDropOff.latitude', place.geometry.location.lat().toString());
        setValue('locationDropOff.longitude', place.geometry.location.lng().toString());

        dropoffMarker.setPosition(place.geometry.location);
        dropoffMarker.setVisible(true);
        drawRoute();
      });
    });
  }

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <Stack justifyContent="start" alignItems="center" gap={2} width={1}>
        <StyledPaper>
          <Stack justifyContent="start" alignItems="flex-start" gap={2} width={1} p={2}>
            <TextField
              {...register('location.address', { required: { value: true, message: 'Pick-up location is required' } })}
              id="pickup-input"
              label="Pick-up"
              fullWidth
              placeholder="Start typing your address"
              error={Boolean(errors.location?.address)}
              helperText={errors.location?.address?.message}
            ></TextField>
            <TextField
              {...register('locationDropOff.address', { required: { value: true, message: 'Drop-off location is required' } })}
              id="dropoff-input"
              label="Drop-off"
              fullWidth
              placeholder="Start typing destination address"
              error={Boolean(errors.locationDropOff?.address)}
              helperText={errors.locationDropOff?.address?.message}
            ></TextField>
            <Box component="div" id="map" width={1} height="300px"></Box>
          </Stack>
        </StyledPaper>
      </Stack>
    </form>
  );
}
