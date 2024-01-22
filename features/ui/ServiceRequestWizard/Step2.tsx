import { CircularProgress, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useLazyGetMakesQuery, useLazyGetModelsQuery, useLazyGetTiresQuery, useLazyGetTrimsQuery } from '@/entities/tires/api/tiresApi';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useLazyDecodeQuery } from '@/entities/vin/api/vinApi';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, FormProvider, useController, useForm } from 'react-hook-form';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { ImageUpload } from '@/features/ui/ImageUpload/ImageUpload';
import Box from '@mui/material/Box';

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
  const [ymm, setYmm] = useState<YmmHierarchy>({ id: 'root', name: 'root' });
  const [isDecodingFlow, toggleDecodingFlow] = useState<boolean>(false);
  const serviceRequest = useSelector(selectServiceRequest);
  const dispatch = useDispatch();
  const methods = useForm<Pick<ServiceRequestDto, 'tires' | 'vehicle'>>({
    values: serviceRequest,
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
  const [getTrims, { isFetching: isTrimsFetching }] = useLazyGetTrimsQuery();
  const [getTires, { isFetching: isTiresFetching }] = useLazyGetTiresQuery();

  const { field: year } = useController({ name: 'vehicle.year', control, rules: { required: true } });
  const { field: make } = useController({ name: 'vehicle.make', control, rules: { required: true } });
  const { field: model } = useController({ name: 'vehicle.model', control, rules: { required: true } });
  const { field: trim } = useController({ name: 'vehicle.trim', control, rules: { required: true } });
  const { field: tire } = useController({ name: 'tires.0.size', control, rules: { required: true } });

  const handleStepSubmit = (data: Pick<ServiceRequestDto, 'tires' | 'vehicle'>) => {
    dispatch(
      setServiceRequest({
        ...data,
        tires: data.tires.map((item) => ({
          ...item,
          size: ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[trim.value.toLowerCase()]
            ?.children?.[tire?.value?.toLowerCase() || '']?.name,
        })),
        vehicle: {
          ...data.vehicle,
          make: ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.name || '',
          model: ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.name || '',
          trim:
            ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[trim.value.toLowerCase()]?.name || '',
        },
      }),
    );
    goToNextStep();
  };

  const isLoading = isVehicleDecoding || isMakesFetching || isModelsFetching || isTrimsFetching || isTiresFetching;

  const loadMakes = async (yearId: string) => {
    const { data } = await getMakes({ yearId });
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
    const { data } = await getTrims({ yearId, makeId, modelId });
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
        },
      },
    }));
  };

  const loadTires = async (yearId: string, makeId: string, modelId: string, trimId: string) => {
    const { data } = await getTires({ yearId, makeId, modelId, trimId });
    setYmm((prevState) => ({
      ...prevState,
      children: {
        ...prevState.children,
        [yearId]: {
          id: yearId,
          name: yearId,
          ...prevState?.children?.[yearId],
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
                  children: {
                    ...prevState?.children?.[yearId]?.children?.[makeId.toLowerCase()]?.children?.[modelId.toLowerCase()]?.children,
                    [trimId.toLowerCase()]: {
                      id: trimId,
                      name: trimId,
                      children: data?.reduce(
                        (acc, cur) => ({
                          ...acc,
                          [cur.id.toLowerCase()]: { id: cur.id, name: cur.name },
                        }),
                        {} as YmmHierarchy['children'],
                      ),
                    },
                  },
                },
              },
            },
          },
        },
      },
    }));
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
    await loadTires(year.value, make.value, model.value, value || '');
  };

  const handleDecode = async () => {
    if (vehicle.vin) {
      toggleDecodingFlow(true);
      decode(vehicle.vin);
    }
  };

  useEffect(() => {
    if (isDecodingFlow && decodedData && !isVehicleDecoding) {
      decodedData.year && handleYearChange(decodedData.year.toString());
      !decodedData.make && toggleDecodingFlow(false);
    }
  }, [isVehicleDecoding, decodedData]);

  useEffect(() => {
    if (isDecodingFlow && !isMakesFetching && decodedData?.make && ymm?.children?.[year.value.toString()]?.children?.[decodedData.make.toLowerCase()]) {
      handleMakeChange(ymm?.children?.[year.value.toString()]?.children?.[decodedData.make.toLowerCase()]?.name || '');
      !decodedData.model && toggleDecodingFlow(false);
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
      !decodedData.trim && toggleDecodingFlow(false);
    }
  }, [isModelsFetching]);

  useEffect(() => {
    if (
      !isTrimsFetching &&
      decodedData?.trim &&
      ymm?.children?.[decodedData.year.toString()]?.children?.[decodedData.make.toLowerCase()]?.children?.[decodedData.model.toLowerCase()]?.children?.[
        decodedData.trim.toLowerCase()
      ]
    ) {
      handleTrimChange(
        ymm?.children?.[decodedData.year.toString()]?.children?.[decodedData.make.toLowerCase()]?.children?.[decodedData.model.toLowerCase()]?.children?.[
          decodedData.trim.toLowerCase()
        ]?.name || '',
      );
    }
  }, [isTrimsFetching]);

  useEffect(() => {
    if (!isTiresFetching) {
      tire.onChange(
        Object.keys(
          ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[trim.value.toLowerCase()]?.children || {},
        )?.[0],
      );
    }
  }, [isTiresFetching]);
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <FormProvider {...methods}>
        <Stack alignItems="center" gap={4}>
          <Typography variant="h4">Enter VIN</Typography>
          <Stack direction="row" width={1} gap={2}>
            <TextField {...register('vehicle.vin')} placeholder="Enter VIN" fullWidth />
            <Button variant="contained" size="large" onClick={handleDecode} disabled={isLoading} endIcon={isLoading ? <CircularProgress size="1.5rem" color="inherit" /> : null}>
              Decode
            </Button>
          </Stack>
          <Typography variant="h5">Or Select Year, Make, Model and Trim</Typography>
          <Stack direction="row" flexWrap="wrap" gap={2} width={1}>
            <TextField
              label="Year"
              select
              fullWidth
              disabled={isLoading}
              value={year.value || ''}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{ flex: 1, minWidth: '250px' }}
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
              disabled={isLoading}
              value={make.value || ''}
              onChange={(e) => handleMakeChange(e.target.value)}
              style={{ flex: 1, minWidth: '250px' }}
            >
              {ymm?.children?.[year.value]?.children ? (
                Object.keys(ymm?.children?.[year.value.toString()]?.children || {}).map((key) => (
                  <MenuItem key={key} value={ymm?.children?.[year.value.toString()]?.children?.[key]?.name}>
                    {ymm?.children?.[year.value.toString()]?.children?.[key]?.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>{isMakesFetching ? 'Loading...' : 'Select Year'}</MenuItem>
              )}
            </TextField>
            <TextField
              label="Model"
              select
              fullWidth
              disabled={isLoading}
              value={model.value || ''}
              onChange={(e) => handleModelChange(e.target.value)}
              style={{ flex: 1, minWidth: '250px' }}
            >
              {ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children ? (
                Object.keys(ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children || {}).map((key) => (
                  <MenuItem key={key} value={ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[key]?.name}>
                    {ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[key]?.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>{isModelsFetching ? 'Loading...' : 'Select Make'}</MenuItem>
              )}
            </TextField>
            <TextField
              label="Trim"
              select
              fullWidth
              disabled={isLoading}
              value={!isTrimsFetching ? trim?.value || '' : ''}
              onChange={(e) => handleTrimChange(e.target.value)}
              style={{ flex: 1, minWidth: '250px' }}
            >
              {ymm?.children?.[year.value]?.children?.[make.value.toString().toLowerCase()]?.children?.[model.value.toString().toLowerCase()]?.children ? (
                Object.keys(ymm?.children?.[year.value]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children || {}).map((key) => (
                  <MenuItem
                    key={key}
                    value={ymm?.children?.[year?.value]?.children?.[make.value.toString().toLowerCase()]?.children?.[model.value.toString().toLowerCase()]?.children?.[key]?.name}
                  >
                    {ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[key]?.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>{isTrimsFetching ? 'Loading...' : 'Select Model'}</MenuItem>
              )}
            </TextField>
          </Stack>
          {ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[trim.value.toLowerCase()]?.children && (
            <>
              <Stack gap={2}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="tires.0.size"
                  defaultValue={
                    Object.keys(
                      ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[trim.value.toLowerCase()]
                        ?.children || {},
                    )[0]
                  }
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <Box width={1}>
                        <Typography variant="h5">Please select the tires you have</Typography>
                        {Object.keys(
                          ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[trim.value.toLowerCase()]
                            ?.children || {},
                        ).map((key) => (
                          <FormControlLabel
                            key={key}
                            value={key}
                            control={<Radio />}
                            label={
                              ymm?.children?.[year.value.toString()]?.children?.[make.value.toLowerCase()]?.children?.[model.value.toLowerCase()]?.children?.[
                                trim.value.toLowerCase()
                              ]?.children?.[key]?.name
                            }
                          />
                        ))}
                      </Box>
                    </RadioGroup>
                  )}
                />
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="tires.0.type"
                  defaultValue="STANDARD"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <Box width={1}>
                        <Typography variant="h5">Select tire type</Typography>
                        <FormControlLabel key="RUNFLAT" value="RUNFLAT" control={<Radio />} label="Runflat" />
                        <FormControlLabel key="STANDARD" value="STANDARD" control={<Radio />} label="Standard" />
                      </Box>
                    </RadioGroup>
                  )}
                />
              </Stack>
              <Typography variant="h5">Add image of damage to tire and image of tire wall that shows tire size</Typography>
              <Stack direction="row" maxWidth="566px" gap={2}>
                <ImageUpload name="tires.0.imageOfDamage" title="Damage" placeholder="/images/tire-flat-placeholder-1.png" />
                <ImageUpload name="tires.0.imageOfTireWall" title="Tire wall" placeholder="/images/tire-flat-placeholder-2.png" />
              </Stack>
            </>
          )}
        </Stack>
      </FormProvider>
    </form>
  );
}

export type YmmHierarchy = {
  id: string;
  name: string;
  children?: { [k: string]: YmmHierarchy | undefined };
};
