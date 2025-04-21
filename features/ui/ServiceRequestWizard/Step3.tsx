import Typography from '@mui/material/Typography';
import { FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { Controller, useForm } from 'react-hook-form';
import { TireRepairRequest } from '@/entities/serviceRequest/api/dto/TireRepairRequest';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker', 'routes'],
});

export function Step3(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const dispatch = useDispatch();
  const serviceRequest = useSelector(selectServiceRequest) as TireRepairRequest;
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pick<TireRepairRequest, 'location' | 'urgency'>>({ values: serviceRequest });
  const handleStepSubmit = (data: Pick<TireRepairRequest, 'location' | 'urgency'>) => {
    dispatch(setServiceRequest(data));
    goToNextStep();
  };

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

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <Stack alignItems="center" gap={3}>
        <Typography variant="h3">How soon do you need the repair?</Typography>
        <Controller
          rules={{ required: true }}
          control={control}
          name="urgency"
          defaultValue="IMMEDIATELY"
          render={({ field }) => (
            <RadioGroup row {...field}>
              <Stack alignItems="center">
                <FormControlLabel value="IMMEDIATELY" control={<Radio />} label="Immediately" />
              </Stack>
            </RadioGroup>
          )}
        />
        <Typography variant="h3">What is your location?</Typography>
        <TextField
          {...register('location.address', { required: { value: true, message: 'Location is required' } })}
          id="pac-input"
          fullWidth
          label="Enter your exact location"
          placeholder="Start typing your address"
          error={Boolean(errors.location?.address)}
          helperText={errors.location?.address?.message}
        ></TextField>
        <Box component="div" id="map" width={1} height="300px"></Box>
        <TextField {...register('location.comment')} fullWidth label="Describe the place your car located at" placeholder="In the sumepmaket parking lot"></TextField>
      </Stack>
    </form>
  );
}
