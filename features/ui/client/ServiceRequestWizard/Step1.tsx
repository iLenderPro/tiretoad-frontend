import Typography from '@mui/material/Typography';
import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { MutableRefObject, useEffect, useState } from 'react';
import { useGetPlacesQuery } from '@/entities/vendors/api/vendorApi';
import { useGetLocationQuery } from '@/entities/geo/api/geoApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocation } from '@/entities/geo/geoSlice';
import { createMap, drawMarkers, handleError, loader } from '@/features/utils/mapUtils';
import { Controller, useForm } from 'react-hook-form';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { selectPlacesWithinRadius, setPlacesWithinRadius } from '@/entities/vendors/vendorSlice';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { showSnackbar } from '@/shared/ui/Snackbar/model/snackbarSlice';
import Image from 'next/image';
import { TireRepairRequest } from '@/entities/serviceRequest/api/dto/TireRepairRequest';

export type StepProps = { formRef?: MutableRefObject<HTMLFormElement | null>; goToNextStep: (index?: number) => void };

export function Step1(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const [isMapsApiLoading, setMapsApiLoading] = useState(true);
  const { isFetching: isLocationFetching } = useGetLocationQuery();
  const { data: places } = useGetPlacesQuery();
  const location = useSelector(selectLocation);
  const serviceRequest = useSelector(selectServiceRequest) as TireRepairRequest;
  const placesWithinRadius = useSelector(selectPlacesWithinRadius);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<TireRepairRequest, 'tires'>>({
    values: serviceRequest,
  });

  const handleStepSubmit = (data: Pick<TireRepairRequest, 'tires'>) => {
    dispatch(setServiceRequest(data));
    goToNextStep();
  };

  const handleStepErrors = (errors: FieldErrors<Pick<TireRepairRequest, 'tires'>>) => {
    if (errors.tires?.[0]?.side) {
      dispatch(showSnackbar({ type: 'error', content: errors.tires?.[0]?.side.message }));
    }
  };

  let map: google.maps.Map;

  useEffect(() => {
    !map &&
      loader.load().then(() => {
        setMapsApiLoading(false);
      });
  }, []);

  useEffect(() => {
    const renderMap = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            console.log('Using device location');
            const initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map = await createMap(initialLocation);
            const placesWithinRadius = drawMarkers(places, initialLocation, map);
            dispatch(setPlacesWithinRadius(placesWithinRadius));
          },
          async (positionError) => {
            console.log('Using IP location');
            handleError(positionError);
            const initialLocation = location?.latitude ? new google.maps.LatLng(location.latitude, location.longitude) : new google.maps.LatLng(25.761681, -80.191788);
            map = await createMap(initialLocation);
            const placesWithinRadius = drawMarkers(places, initialLocation, map);
            dispatch(setPlacesWithinRadius(placesWithinRadius));
          },
        );
      }
    };

    !isMapsApiLoading && !map && !isLocationFetching && places && renderMap().catch(console.error);
  }, [isMapsApiLoading, isLocationFetching, places]);

  return (
    <form onSubmit={handleSubmit(handleStepSubmit, handleStepErrors)} ref={formRef}>
      <Stack alignItems="center" gap={5}>
        <Box position="relative" width="100%" height="100px">
          <Image src="/images/tiretoad_logo_min.png" alt="TireToad - Mobile Tire Repair Shops" fill={true} style={{ objectFit: 'contain' }} />
        </Box>
        <Typography variant="body1">Instantly Connect with a Mobile Tire Repair Service for Free</Typography>
        <Typography variant="h2">We have {placesWithinRadius.length} mobile tire repair shops near you</Typography>
        <Box component="div" id="map" width={1} height="300px"></Box>
        <Typography variant="h3">What repair do you need?</Typography>
        <Controller
          rules={{ required: true }}
          control={control}
          name="tires.0.damage"
          defaultValue="FLAT"
          render={({ field }) => (
            <RadioGroup row {...field}>
              <Stack alignItems="center">
                <img src="/icons/icon_flat_tire.svg" width={150} height={150} alt="Flat tire repair" />
                <FormControlLabel value="FLAT" control={<Radio />} label="My Tire is Flat" />
              </Stack>
            </RadioGroup>
          )}
        />
        <Typography variant="h3">Which tire is it?</Typography>
        <Controller
          rules={{ required: { value: true, message: 'Select your tire side' } }}
          control={control}
          name="tires.0.side"
          defaultValue=""
          render={({ field }) => (
            <RadioGroup row {...field}>
              <Stack direction="row" flex={1}>
                <Stack flex={1} minWidth="145px">
                  <img src="/icons/icon_left_front_tire.svg" alt="Driver Side Front Tire" />
                  <FormControlLabel value="LF" control={<Radio />} label={<Typography align="left">Driver Side Front</Typography>} />
                </Stack>
                <Stack flex={1} minWidth="145px">
                  <img src="/icons/icon_left_rear_tire.svg" alt="Driver Side Rear Tire" />
                  <FormControlLabel value="LR" control={<Radio />} label={<Typography align="left">Driver Side Rear</Typography>} />
                </Stack>
              </Stack>
              <Stack direction="row" flex={1}>
                <Stack flex={1} minWidth="145px">
                  <img src="/icons/icon_right_rear_tire.svg" alt="Passenger Side Rear Tire" />
                  <FormControlLabel value="RR" control={<Radio />} label={<Typography align="left">Passenger Side Rear</Typography>} />
                </Stack>
                <Stack flex={1} minWidth="145px">
                  <img src="/icons/icon_right_front_tire.svg" alt="Passenger Side Front Tire" />
                  <FormControlLabel value="RF" control={<Radio />} label={<Typography align="left">Passenger Side Front</Typography>} />
                </Stack>
              </Stack>
            </RadioGroup>
          )}
        />
      </Stack>
    </form>
  );
}
