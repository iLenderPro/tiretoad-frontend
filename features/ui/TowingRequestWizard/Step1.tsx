import { Grid, Paper, Stack, TextField } from '@mui/material';
import React, { MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { Loader } from '@googlemaps/js-api-loader';
import Box from '@mui/material/Box';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export type StepProps = { formRef?: MutableRefObject<HTMLFormElement | null>; goToNextStep: (index?: number) => void };

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker'],
});

export function Step1(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const dispatch = useDispatch();
  const serviceRequest = useSelector(selectServiceRequest);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pick<TowingRequest, 'location' | 'locationDropOff'>>({ values: serviceRequest });
  const handleStepSubmit = (data: Pick<TowingRequest, 'location' | 'locationDropOff'>) => {
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

      const input = document.getElementById('pac-input') as HTMLInputElement;
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });

      autocomplete.addListener('place_changed', () => {
        marker.setVisible(false);

        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        setValue('location.latitude', place.geometry.location.lat().toString());
        setValue('location.longitude', place.geometry.location.lng().toString());

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    });
  }

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <Stack alignItems="center" gap={3} width={1}>
        <Paper sx={{ width: '100%', padding: (theme) => theme.spacing(2) }}>
          <Grid container spacing={3} width={1} rowSpacing={3}>
            <Grid item zeroMinWidth xs={3}>
              <Stack alignItems="start" gap={1}>
                <Typography noWrap>Pickup:</Typography>
                <Typography noWrap>Drop-off:</Typography>
              </Stack>
            </Grid>
            <Grid item xs={7}>
              <Stack alignItems="start" gap={1}>
                <Typography fontWeight="500">500 Three Islands...</Typography>
                <Typography fontWeight="500">5323 SW 32nd Te...</Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack alignItems="start" gap={1}>
                <Typography fontWeight="500">3.5 Mile</Typography>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack alignItems="start" gap={1}>
                <Typography>VIN:</Typography>
                <Typography>Model:</Typography>
              </Stack>
            </Grid>
            <Grid item xs={7}>
              <Stack alignItems="start" gap={1}>
                <Typography fontWeight="500"></Typography>
                <Typography fontWeight="500">2022 Honda Pilot</Typography>
              </Stack>
            </Grid>
            <Grid item zeroMinWidth xs={2}>
              <Stack gap={1}>
                <Stack gap={1} direction="row">
                  <CheckCircleOutlineIcon color="success" />
                  <Typography noWrap>Goes Neutral</Typography>
                </Stack>
                <Stack gap={1} direction="row">
                  <CancelOutlinedIcon color="error" />
                  <Typography noWrap>Tires Inflated</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack alignItems="start" gap={1}>
                <div>Note:</div>
              </Stack>
            </Grid>
            <Grid item>
              <Stack alignItems="start">
                <div></div>
              </Stack>
            </Grid>
            <Grid item>
              <Stack>
                <div></div>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
        <TextField
          {...register('location.address', { required: { value: true, message: 'Pick-up location is required' } })}
          id="pac-input"
          fullWidth
          label="Pick-up"
          placeholder="Start typing your address"
          error={Boolean(errors.location?.address)}
          helperText={errors.location?.address?.message}
        ></TextField>
        <TextField
          {...register('locationDropOff.address', { required: { value: true, message: 'Drop-off location is required' } })}
          fullWidth
          label="Drop-off"
          placeholder="Start typing destination address"
          error={Boolean(errors.locationDropOff?.address)}
          helperText={errors.locationDropOff?.address?.message}
        ></TextField>
        <Box component="div" id="map" width={1} height="300px"></Box>
      </Stack>
    </form>
  );
}
