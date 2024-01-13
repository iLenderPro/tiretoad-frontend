import { CircularProgress, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useGetMakesQuery, useGetModelsQuery, useGetTiresQuery, useGetTrimsQuery } from '@/entities/tires/api/tiresApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { useLazyDecodeQuery } from '@/entities/vin/api/vinApi';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { ImageUpload } from '@/features/ui/ImageUpload/ImageUpload';

const minYear = new Date('1980').getFullYear();
const currentYear = new Date().getFullYear();
const years: {
  id: string;
  name: number;
}[] = [];

for (let i = minYear; i <= currentYear; i++) {
  years.push({ id: i.toString(), name: i });
}

export function Step2(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const [decode, { data: decoded, isLoading: isVehicleDecoding }] = useLazyDecodeQuery();

  const serviceRequest = useSelector(selectServiceRequest);
  const dispatch = useDispatch();
  const methods = useForm<Pick<ServiceRequestDto, 'tires' | 'vehicle'>>({
    values: serviceRequest,
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const vehicle = watch('vehicle');

  const { data: makes, isFetching: isMakesFetching } = useGetMakesQuery();
  const { data: models, isFetching: isModelsFetching } = useGetModelsQuery(
    vehicle && vehicle?.year && vehicle?.make
      ? {
        yearId: vehicle?.year,
        makeId: makes?.find((make) => make.id === vehicle?.make)?.name || '',
      }
      : skipToken,
    { skip: !vehicle || !vehicle?.year || !vehicle?.make },
  );
  const { data: trims, isFetching: isTrimsFetching } = useGetTrimsQuery(
    vehicle && vehicle?.year && vehicle?.make && vehicle?.model
      ? {
        yearId: vehicle?.year,
        makeId: makes?.find((make) => make.id === vehicle?.make)?.name || '',
        modelId: models?.find((model) => model.id === vehicle?.model)?.name || '',
      }
      : skipToken,
    {
      skip: !vehicle || !vehicle?.year || !vehicle?.make || !vehicle?.model,
    },
  );
  const { data: tires, isFetching: isTiresFetching } = useGetTiresQuery(
    vehicle && vehicle?.year && vehicle?.make && vehicle?.model && vehicle?.trim
      ? {
        yearId: vehicle?.year,
        makeId: makes?.find((make) => make.id === vehicle?.make)?.name || '',
        modelId: models?.find((model) => model.id === vehicle?.model)?.name || '',
        trimId: trims?.find((trim) => trim.id === vehicle?.trim)?.name || '',
      }
      : skipToken,
    {
      skip: !vehicle || !vehicle?.year || !vehicle?.make || !vehicle?.model || !vehicle?.trim,
    },
  );

  const handleStepSubmit = (data: Pick<ServiceRequestDto, 'tires' | 'vehicle'>) => {
    dispatch(
      setServiceRequest({
        ...data,
        tires: data.tires.map((tire) => ({ ...tire, size: tires?.find((size) => size.id === tire.size)?.name || '' })),
        vehicle: {
          ...data.vehicle,
          make: makes?.find((make) => make.id === vehicle?.make)?.name || '',
          model: models?.find((model) => model.id === vehicle?.model)?.name || '',
          trim: trims?.find((trim) => trim.id === vehicle?.trim)?.name || '',
        },
      }),
    );
    goToNextStep();
  };

  const handleDecode = () => {
    vehicle.vin && decode(vehicle.vin);
  };

  const isLoading = isVehicleDecoding || isMakesFetching || isModelsFetching || isTrimsFetching || isTiresFetching;

  useEffect(() => {
    if (decoded && !isVehicleDecoding) {
      decoded.year && setValue('vehicle.year', decoded.year);
      makes && decoded.make && setValue('vehicle.make', makes?.find((make) => make.name === decoded.make)?.id || '');
    }
  }, [isVehicleDecoding, decoded]);

  useEffect(() => {
    if (decoded && !isVehicleDecoding) {
      models && decoded?.model && setValue('vehicle.model', models.find((model) => model.name === decoded.model)?.id || '');
    }
  }, [vehicle?.make, models]);

  useEffect(() => {
    if (decoded && !isVehicleDecoding) {
      trims && decoded?.trim && setValue('vehicle.trim', trims.find((trim) => trim.name === decoded.trim)?.id || '');
    }
  }, [vehicle?.trim, trims]);

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <FormProvider {...methods}>
        <Stack alignItems='center' gap={4}>
          <Typography variant='h4'>Enter VIN</Typography>
          <Stack direction='row' width={1} gap={2}>
            <TextField {...register('vehicle.vin')} placeholder='Enter VIN' fullWidth />
            <Button variant='contained' size='large' onClick={handleDecode} disabled={isLoading}
                    endIcon={isLoading ? <CircularProgress size='1.5rem' color='inherit' /> : null}>
              Decode
            </Button>
          </Stack>
          <Typography variant='h5'>Or Select Year, Make, Model and Trim</Typography>
          <Stack direction='row' flexWrap='wrap' gap={2} width={1}>
            <Controller
              control={control}
              name='vehicle.year'
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Year'
                  select
                  fullWidth
                  disabled={isLoading}
                  value={field.value || ''}
                  onChange={(e) => {
                    setValue('vehicle.model', '');
                    setValue('vehicle.trim', '');
                    field.onChange(e.target.value);
                  }}
                  style={{ flex: 1, minWidth: '250px' }}
                >
                  {years &&
                    years.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name='vehicle.make'
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Make'
                  select
                  fullWidth
                  disabled={isLoading}
                  value={field.value || ''}
                  onChange={(e) => {
                    setValue('vehicle.model', '');
                    setValue('vehicle.trim', '');
                    field.onChange(e.target.value);
                  }}
                  style={{ flex: 1, minWidth: '250px' }}
                >
                  {makes ? (
                    makes.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>Select Make</MenuItem>
                  )}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name='vehicle.model'
              render={({ field }) => (
                <TextField
                  label='Model'
                  select
                  fullWidth
                  disabled={isLoading}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{ flex: 1, minWidth: '250px' }}
                >
                  {vehicle?.make && models ? (
                    models.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{isModelsFetching ? 'Loading...' : 'Select Model'}</MenuItem>
                  )}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name='vehicle.trim'
              render={({ field }) => (
                <TextField
                  label='Trim'
                  select
                  fullWidth
                  disabled={isLoading}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{ flex: 1, minWidth: '250px' }}
                >
                  {vehicle?.model && trims ? (
                    trims.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>Select Trim</MenuItem>
                  )}
                </TextField>
              )}
            />
          </Stack>
          <Typography variant='h5'>Add image of damage to tire and image of tire wall that shows tire size</Typography>
          <Stack direction='row' maxWidth='566px' gap={2}>
            <ImageUpload name='tires.0.imageOfDamage' title='Damage'
                         placeholder='/images/tire-flat-placeholder-1.png' />
            <ImageUpload name='tires.0.imageOfTireWall' title='Tire wall'
                         placeholder='/images/tire-flat-placeholder-2.png' />
          </Stack>
          {tires && (
            <Stack gap={2}>
              <Controller
                rules={{ required: true }}
                control={control}
                name='tires.0.size'
                defaultValue={tires[0].id}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <Box width={1}>
                      <Typography variant='h5'>Please select the tires you have</Typography>
                      {tires.map((tire) => (
                        <FormControlLabel key={tire.id} value={tire.id} control={<Radio />} label={tire.name} />
                      ))}
                    </Box>
                  </RadioGroup>
                )}
              />
              <Controller
                rules={{ required: true }}
                control={control}
                name='tires.0.type'
                defaultValue='STANDARD'
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <Box width={1}>
                      <Typography variant='h5'>Select tire type</Typography>
                      <FormControlLabel key='RUNFLAT' value='RUNFLAT' control={<Radio />} label='Runflat' />
                      <FormControlLabel key='STANDARD' value='STANDARD' control={<Radio />} label='Standard' />
                    </Box>
                  </RadioGroup>
                )}
              />
            </Stack>
          )}
        </Stack>
      </FormProvider>
    </form>
  );
}
