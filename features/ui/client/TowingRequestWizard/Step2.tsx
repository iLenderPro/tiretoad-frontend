import { CircularProgress, FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';
import { useLazyDecodeQuery, useLazyGetMakesQuery, useLazyGetModelsQuery } from '@/entities/vin/api/vinApi';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, FormProvider, useController, useForm } from 'react-hook-form';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { StepProps } from '@/features/ui/client/ServiceRequestWizard/Step1';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import Typography from '@mui/material/Typography';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import Button from '@mui/material/Button';

const minYear = new Date('1980').getFullYear();
const currentYear = new Date().getFullYear();
const years: {
  id: string;
  name: number;
}[] = [];

for (let i = currentYear; i >= minYear; i--) {
  years.push({ id: i.toString(), name: i });
}

export function Step2(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const [ymm, setYmm] = useState<YmmHierarchy>({ id: 'root', name: 'root' });
  const [isDecodingFlow, toggleDecodingFlow] = useState<boolean>(false);
  const [isInitFlow, toggleInitFlow] = useState<boolean>(false);
  const serviceRequest = useSelector(selectServiceRequest) as TowingRequest;
  const dispatch = useDispatch();
  const methods = useForm<Pick<TowingRequest, 'vehicle' | 'canGoNeutral' | 'tiresInflated' | 'location'>>({
    values: {
      vehicle: { vin: serviceRequest.vehicle?.vin } as ServiceRequestDto['vehicle'],
      canGoNeutral: serviceRequest.canGoNeutral,
      tiresInflated: serviceRequest.tiresInflated,
      location: serviceRequest.location,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const vehicle = watch('vehicle');
  const [decode, { data: decodedData, isLoading: isVehicleDecoding }] = useLazyDecodeQuery();
  const [getMakes, { isFetching: isMakesFetching }] = useLazyGetMakesQuery();
  const [getModels, { isFetching: isModelsFetching }] = useLazyGetModelsQuery();

  const { field: year } = useController({
    name: 'vehicle.year',
    control,
    rules: { required: { value: true, message: 'Year is required' } },
  });
  const { field: make } = useController({
    name: 'vehicle.make',
    control,
    rules: { required: { value: true, message: 'Make is required' } },
  });
  const { field: model } = useController({
    name: 'vehicle.model',
    control,
    rules: { required: { value: true, message: 'Model is required' } },
  });
  const { field: trim } = useController({
    name: 'vehicle.trim',
    control,
    rules: { required: { value: true, message: 'Trim is required' } },
  });

  const handleStepSubmit = (data: Pick<TowingRequest, 'vehicle' | 'canGoNeutral' | 'tiresInflated' | 'location'>) => {
    dispatch(
      setServiceRequest({
        ...data,
        vehicle: {
          ...data.vehicle,
          make: ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.name || '',
          model: ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.name || '',
        },
      }),
    );
    goToNextStep();
  };

  const handleStepErrors = (errors: FieldErrors<Pick<TowingRequest, 'vehicle'>>) => {
    if (!errors.vehicle) {
    }
  };

  const loadMakes = async (yearId: string) => {
    const { data } = await getMakes();
    setYmm((prevState) => ({
      ...prevState,
      children: {
        ...prevState.children,
        [yearId]: {
          id: yearId,
          name: yearId,
          children: data?.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.name.toLowerCase()]: { id: cur.id, name: cur.name },
            }),
            {} as YmmHierarchy['children'],
          ),
        },
      },
    }));
  };

  const loadModels = async (yearId: string, makeId: string) => {
    const { data } = await getModels({ yearId, makeId });
    setYmm((prevState) => ({
      ...prevState,
      children: {
        ...prevState.children,
        [yearId]: {
          id: yearId,
          name: yearId,
          children: {
            ...prevState?.children?.[yearId]?.children,
            [makeId.toLowerCase()]: {
              id: makeId,
              name: makeId,
              children: data?.reduce(
                (acc, cur) => ({
                  ...acc,
                  [cur.name.toLowerCase()]: { id: cur.id, name: cur.name },
                }),
                {} as YmmHierarchy['children'],
              ),
            },
          },
        },
      },
    }));
  };

  const loadTrims = async (yearId: string, makeId: string, modelId: string) => {
    if (decodedData?.trim) {
      setYmm((prevState) => ({
        ...prevState,
        children: {
          ...prevState.children,
          [yearId]: {
            id: yearId,
            name: yearId,
            children: {
              ...prevState?.children?.[yearId]?.children,
              [makeId.toLowerCase()]: {
                id: makeId,
                name: makeId,
                children: {
                  ...prevState?.children?.[yearId]?.children?.[makeId.toLowerCase()]?.children,
                  [modelId.toLowerCase()]: {
                    id: modelId,
                    name: modelId,
                    children: decodedData?.trim ? { [decodedData.trim.toLowerCase()]: { id: decodedData.trim, name: decodedData.trim } } : undefined,
                  },
                },
              },
            },
          },
        },
      }));
    }
  };

  const handleYearChange = async (value: string) => {
    make.onChange('');
    model.onChange('');
    trim.onChange('');
    year.onChange(value);
    await loadMakes(value);
  };
  const handleMakeChange = async (value: string) => {
    model.onChange('');
    trim.onChange('');
    make.onChange(value);
    await loadModels(year.value, value);
  };
  const handleModelChange = async (value: string) => {
    trim.onChange('');
    model.onChange(value);
    await loadTrims(year.value, make.value, value);
  };
  const handleTrimChange = async (value: string) => {
    trim.onChange(value || '');
  };

  const handleDecode = async () => {
    if (vehicle.vin) {
      toggleDecodingFlow(true);
      await decode(vehicle.vin);
    }
  };

  useEffect(() => {
    if (isDecodingFlow && decodedData && !isVehicleDecoding) {
      decodedData.year && handleYearChange(decodedData.year.toString());
      !decodedData.make && toggleDecodingFlow(false);
    }
  }, [isVehicleDecoding, decodedData]);

  useEffect(() => {
    if (isInitFlow && serviceRequest.vehicle) {
      serviceRequest.vehicle.year && handleYearChange(serviceRequest.vehicle.year);
    }
  }, [isInitFlow]);

  useEffect(() => {
    if (isDecodingFlow && !isMakesFetching && decodedData?.make && ymm?.children?.[year.value.toString()]?.children?.[decodedData.make.toLowerCase()]) {
      handleMakeChange(ymm?.children?.[year.value.toString()]?.children?.[decodedData.make.toLowerCase()]?.name || '');
      !decodedData.model && toggleDecodingFlow(false);
    }

    if (isInitFlow && !isMakesFetching && serviceRequest.vehicle.make && ymm?.children?.[year.value.toString()]?.children?.[serviceRequest.vehicle.make.toLowerCase()]) {
      handleMakeChange(ymm?.children?.[year.value.toString()]?.children?.[serviceRequest.vehicle.make.toLowerCase()]?.name || '');
    }
  }, [isMakesFetching]);

  useEffect(() => {
    if (
      isDecodingFlow &&
      !isModelsFetching &&
      decodedData?.model &&
      ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[decodedData.model.toLowerCase()]
    ) {
      handleModelChange(ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[decodedData.model.toLowerCase()]?.name || '');
      !decodedData?.trim && toggleDecodingFlow(false);
    }

    if (
      isInitFlow &&
      !isModelsFetching &&
      serviceRequest.vehicle.model &&
      ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[serviceRequest.vehicle.model.toLowerCase()]
    ) {
      handleModelChange(ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[serviceRequest.vehicle.model.toLowerCase()]?.name || '');
      !serviceRequest.vehicle.trim && toggleInitFlow(false);
    }
  }, [isModelsFetching]);

  useEffect(() => {
    console.log('entered');
    console.log(isDecodingFlow);
    console.log(decodedData?.trim);
    console.log(ymm);
    if (
      isDecodingFlow &&
      decodedData?.trim &&
      ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[decodedData.trim.toLowerCase()]
    ) {
      handleTrimChange(
        ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[decodedData.trim.toLowerCase()]?.name || '',
      );
      toggleDecodingFlow(false);
    }

    if (
      isInitFlow &&
      serviceRequest.vehicle.trim &&
      ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[serviceRequest.vehicle.trim.toLowerCase()]
    ) {
      handleTrimChange(
        ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[serviceRequest.vehicle.trim.toLowerCase()]?.name || '',
      );
    }
  }, [model.value]);

  useEffect(() => {
    if (serviceRequest.vehicle) {
      toggleInitFlow(true);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(handleStepSubmit, handleStepErrors)} ref={formRef}>
      <Stack justifyContent="start" alignItems="center" gap={2} width={1}>
        <TowingRequestSummary serviceRequest={serviceRequest} />
        <StyledPaper>
          <FormProvider {...methods}>
            <Stack alignItems="center" gap={3} p={2}>
              <Stack direction="row" width={1} gap={2}>
                <TextField {...register('vehicle.vin')} placeholder="Enter VIN to find your tire size" fullWidth />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleDecode}
                  disabled={isVehicleDecoding}
                  endIcon={isVehicleDecoding ? <CircularProgress size="1.5rem" color="inherit" /> : null}
                >
                  Decode
                </Button>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={3} width={1}>
                <TextField
                  label="Year"
                  select
                  fullWidth
                  style={{ flex: 1, minWidth: '250px' }}
                  value={year.value || ''}
                  onChange={(e) => handleYearChange(e.target.value)}
                  error={Boolean(errors.vehicle?.year)}
                  helperText={errors.vehicle?.year?.message}
                >
                  {years &&
                    years.map(({ name }) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  label="Make"
                  select
                  fullWidth
                  style={{ flex: 1, minWidth: '250px' }}
                  value={make.value || ''}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  error={Boolean(errors.vehicle?.make)}
                  helperText={errors.vehicle?.make?.message}
                >
                  {ymm?.children?.[year.value]?.children ? (
                    Object.keys(ymm?.children?.[year.value.toString()]?.children || {}).map((key) => (
                      <MenuItem key={key} value={ymm?.children?.[year.value.toString()]?.children?.[key]?.name}>
                        {ymm?.children?.[year.value.toString()]?.children?.[key]?.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{isMakesFetching ? 'Loading...' : 'Select Year to see all makes'}</MenuItem>
                  )}
                </TextField>
                <TextField
                  label="Model"
                  select
                  fullWidth
                  style={{ flex: 1, minWidth: '250px' }}
                  value={model.value || ''}
                  onChange={(e) => handleModelChange(e.target.value)}
                  error={Boolean(errors.vehicle?.model)}
                  helperText={errors.vehicle?.model?.message}
                >
                  {ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children ? (
                    Object.keys(ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children || {}).map((key) => (
                      <MenuItem key={key} value={ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[key]?.name}>
                        {ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[key]?.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{isModelsFetching ? 'Loading...' : 'Select Make to see all models'}</MenuItem>
                  )}
                </TextField>
                <TextField
                  label="Trim"
                  select
                  fullWidth
                  style={{ flex: 1, minWidth: '250px' }}
                  value={trim?.value || ''}
                  onChange={(e) => handleTrimChange(e.target.value)}
                  error={Boolean(errors.vehicle?.trim)}
                  helperText={errors.vehicle?.trim?.message}
                >
                  {ymm?.children?.[year.value]?.children?.[make.value.toString().toLowerCase()]?.children?.[model.value.toString().toLowerCase()]?.children ? (
                    Object.keys(ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children || {}).map((key) => (
                      <MenuItem
                        key={key}
                        value={
                          ymm?.children?.[year?.value]?.children?.[make.value.toString().toLowerCase()]?.children?.[model.value.toString().toLowerCase()]?.children?.[key]?.name
                        }
                      >
                        {ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[key]?.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{'Select Model to see all trims'}</MenuItem>
                  )}
                </TextField>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={2} width={1}>
                <Controller
                  control={control}
                  name="canGoNeutral"
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      control={<Switch color="primary" />}
                      label={<Typography variant="body2">Can the vehicle go into neutral? Yes</Typography>}
                      labelPlacement="start"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="tiresInflated"
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      control={<Switch color="primary" />}
                      label={<Typography variant="body2">Are all four tires inflated? Yes</Typography>}
                      labelPlacement="start"
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1} width={1}>
                <TextField {...register('location.comment')} fullWidth label="Add your notes"></TextField>
              </Stack>
            </Stack>
          </FormProvider>
        </StyledPaper>
      </Stack>
    </form>
  );
}

export type YmmHierarchy = {
  id: string;
  name: string;
  children?: { [k: string]: YmmHierarchy | undefined };
};
