import { CircularProgress, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { MakeDto, ModelDto, TrimDto } from '@/entities/tires/api/dto';
import { useGetMakesQuery, useGetModelsQuery, useGetTiresQuery, useGetTrimsQuery } from '@/entities/tires/api/tiresApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useLazyDecodeQuery } from '@/entities/vin/api/vinApi';
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

export function Step2() {
  const [year, setYear] = useState<{
    id: string;
    name: number;
  }>({ id: currentYear.toString(), name: currentYear });
  const [make, setMake] = useState<MakeDto>();
  const [model, setModel] = useState<ModelDto>();
  const [trim, setTrim] = useState<TrimDto>();
  const [vin, setVin] = useState<string>();
  const [decode, { data: vehicle, isLoading: isVehicleDecoding, error }] = useLazyDecodeQuery();
  const { data: makes, isFetching: isMakesFetching } = useGetMakesQuery();
  const { data: models, isFetching: isModelsFetching } = useGetModelsQuery(year && make ? { yearId: year.name, makeId: make.name } : skipToken, { skip: !year || !make });
  const { data: trims, isFetching: isTrimsFetching } = useGetTrimsQuery(year && make && model ? { yearId: year.name, makeId: make.name, modelId: model.name } : skipToken, {
    skip: !year || !make || !model,
  });
  const { data: tires, isFetching: isTiresFetching } = useGetTiresQuery(
    year && make && model && trim ? { yearId: year.name, makeId: make.name, modelId: model.name, trimId: trim.name } : skipToken,
    {
      skip: !year || !make || !model || !trim,
    },
  );

  const handleDecode = () => {
    vin && decode(vin);
  };

  const handleChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
    setYear(years?.find((year) => year.id.toString() === e.target.value) || { id: currentYear.toString(), name: currentYear });
    setModel(undefined);
    setTrim(undefined);
  };

  const handleChangeMake = async (e: ChangeEvent<HTMLInputElement>) => {
    makes && setMake(makes?.find((make) => make.id === e.target.value));
    setModel(undefined);
    setTrim(undefined);
    // trims && (await dispatch(tiresApi.util.upsertQueryData('getTrims', undefined, null)));
  };
  const handleChangeModel = (e: ChangeEvent<HTMLInputElement>) => {
    models && setModel(models?.find((model) => model.id === e.target.value));
  };

  const handleChangeTrim = (e: ChangeEvent<HTMLInputElement>) => {
    setTrim(trims?.find((trim) => trim.id === e.target.value));
  };

  const isLoading = isVehicleDecoding || isMakesFetching || isModelsFetching || isTrimsFetching || isTiresFetching;

  useEffect(() => {
    if (vehicle && !isVehicleDecoding) {
      vehicle.year && setYear({ id: vehicle.year.toString(), name: vehicle.year });
      makes && vehicle.make && setMake(makes.find((make) => make.name === vehicle.make) || ({} as MakeDto));
    }
  }, [isVehicleDecoding, vehicle]);

  useEffect(() => {
    if (vehicle && !isVehicleDecoding) {
      models && vehicle?.model && setModel(models.find((model) => model.name === vehicle.model) || ({} as ModelDto));
    }
  }, [make, models]);

  useEffect(() => {
    if (vehicle && !isVehicleDecoding) {
      trims && vehicle?.trim && setModel(trims.find((trim) => trim.name === vehicle.trim) || ({} as TrimDto));
    }
  }, [trim, trims]);

  return (
    <Stack alignItems="center" gap={5}>
      <Typography variant="h4">Enter VIN or Select Year, Make, Model and Trim to Find Your Tire</Typography>
      <Stack direction="row" width={1} gap={3}>
        <TextField placeholder="Enter VIN" fullWidth onChange={(e) => setVin(e.target.value)} />
        <Button variant="contained" size="large" onClick={handleDecode} disabled={isLoading} endIcon={isLoading ? <CircularProgress size="1.5rem" /> : null}>
          Decode
        </Button>
      </Stack>
      <Stack direction="row" gap={3} width={1}>
        <TextField label="Year" select fullWidth disabled={isLoading} value={year?.id} onChange={handleChangeYear}>
          {years &&
            years.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
        </TextField>
        <TextField label="Make" select fullWidth disabled={isLoading} value={make?.id || ''} onChange={handleChangeMake}>
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
        <TextField label="Model" select fullWidth disabled={isLoading} value={model?.id || ''} onChange={handleChangeModel}>
          {make && models ? (
            models.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))
          ) : (
            <MenuItem>{isModelsFetching ? 'Loading...' : 'Select Model'}</MenuItem>
          )}
        </TextField>
        <TextField label="Trim" select fullWidth disabled={isLoading} value={trim?.id || ''} onChange={handleChangeTrim}>
          {model && trims ? (
            trims.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))
          ) : (
            <MenuItem>Select Trim</MenuItem>
          )}
        </TextField>
      </Stack>
      {tires && (
        <Stack gap={3}>
          <RadioGroup row name="tire-size">
            <Box width={1}>
              <Typography variant="h5">Please select the tires you have</Typography>
              {tires.map((tire) => (
                <FormControlLabel key={tire.id} value={tire.id} control={<Radio />} label={tire.name} />
              ))}
            </Box>
          </RadioGroup>

          <RadioGroup row name="tire-type">
            <Box width={1}>
              <Typography variant="h5">Select tire type</Typography>
              <FormControlLabel key="RUNFLAT" value="RUNFLAT" control={<Radio />} label="Runflat" />
              <FormControlLabel key="STANDARD" value="STANDARD" control={<Radio />} label="Standard" />
            </Box>
          </RadioGroup>
        </Stack>
      )}
    </Stack>
  );
}
