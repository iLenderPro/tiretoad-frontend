import Typography from '@mui/material/Typography';
import { FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { Controller, useForm } from 'react-hook-form';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry'],
});

export function Step3(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const dispatch = useDispatch();
  const serviceRequest = useSelector(selectServiceRequest);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pick<ServiceRequestDto, 'location' | 'urgency'>>({ values: serviceRequest });
  const handleStepSubmit = (data: Pick<ServiceRequestDto, 'location' | 'urgency'>) => {
    dispatch(setServiceRequest(data));
    goToNextStep();
  };

  loader.load().then(async () => {
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 40.749933, lng: -73.98633 },
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
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: \'' + place.name + '\'');
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      setValue('location.latitude', place.geometry.location.lat());
      setValue('location.longitude', place.geometry.location.lng());

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });
  });

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <Stack alignItems='center' gap={3}>
        <Typography variant='h4'>How soon do you need the repair?</Typography>
        <Controller
          rules={{ required: true }}
          control={control}
          name='urgency'
          defaultValue='IMMEDIATELY'
          render={({ field }) => (
            <RadioGroup row {...field}>
              <Stack alignItems='center'>
                <FormControlLabel value='IMMEDIATELY' control={<Radio />} label='Immediately' />
              </Stack>
            </RadioGroup>
          )}
        />
        <Typography variant='h4'>What is your location?</Typography>
        <TextField {...register('location.address')} id='pac-input' fullWidth label='Enter your exact location'
                   placeholder='Start typing your address'></TextField>
        <Box component='div' id='map' width={1} height='300px'></Box>
        <TextField {...register('location.comment')} fullWidth label='Describe any landmarks'
                   placeholder='In the sumepmaket parking lot'></TextField>
      </Stack>
    </form>
  );
}
