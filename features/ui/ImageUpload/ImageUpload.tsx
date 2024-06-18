import { Controller, Path, useFormContext } from 'react-hook-form';
import { Avatar, Card, CardActions, CardHeader, CardMedia, CircularProgress } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '@mui/material/Button';
import { VisuallyHiddenInput } from '@/features/ui/ImageUpload/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLazyGetUploadUrlQuery, useUploadMutation } from '@/entities/file/api/fileApi';
import React from 'react';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export type ImageUploadProps = {
  name: Path<ServiceRequestDto>;
  title: string;
  placeholder: string;
};

export function ImageUpload(props: ImageUploadProps) {
  const { name, title, placeholder } = props;
  const {
    control,
    getFieldState,
    formState: { errors },
  } = useFormContext<ServiceRequestDto>();
  const [getUploadUrl, { isLoading: isUrlLoading }] = useLazyGetUploadUrlQuery();
  const [upload, { isLoading }] = useUploadMutation();
  const { error } = getFieldState(name);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    if (event.target.files?.length) {
      onChange('');
      const file = event.target.files[0];
      const { url, key } = await getUploadUrl({ name: file.name, mimetype: file.type }).unwrap();
      await upload({ url, file }).unwrap();
      onChange(key);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: { value: true, message: 'Upload required images' } }}
      render={({ field }) => (
        <Card sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          <CardHeader
            avatar={
              <Avatar
                sx={(theme) => ({
                  bgcolor: field.value ? 'green' : 'lightgray',
                  border: Boolean(error) ? '4px solid ' + theme.palette.error.main : 'none',
                })}
              >
                <CheckOutlinedIcon />
              </Avatar>
            }
            title={title}
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardMedia component="img" width="100%" image={field.value ? `https://tiretoad-data-bucket.s3.amazonaws.com/${field.value}` : placeholder} />
          <CardActions>
            <Button component="label" variant="contained" fullWidth startIcon={isLoading ? <CircularProgress size="1rem" color="inherit" /> : <CloudUploadIcon />}>
              Upload
              <VisuallyHiddenInput type="file" onChange={(e) => handleFileChange(e, field.onChange)} />
            </Button>
          </CardActions>
        </Card>
      )}
    />
  );
}
