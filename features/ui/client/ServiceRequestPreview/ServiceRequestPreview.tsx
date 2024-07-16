'use client';
import { Card, CardActionArea, CardMedia, List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import Box from '@mui/material/Box';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { TireSide } from '@/features/ui/ServiceRequestWizard/types/TireSide';
import MapDialog from '@/features/ui/MapDialog/MapDialog';
import React, { memo, useState } from 'react';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '@mui/material/Button';

export type ServiceRequestPreviewProps = {
  serviceRequest: ServiceRequestDto;
  user: ClientDto;
};

function ServiceRequestPreview(props: ServiceRequestPreviewProps) {
  const { serviceRequest } = props;
  const [open, setOpen] = useState(false);
  const toggleDialog = () => {
    setOpen((prevState) => !prevState);
  };
  return (
    <>
      {serviceRequest && (
        <>
          <Stack alignItems="start" textAlign="left">
            <List>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight="bold">Name: {serviceRequest.client.fullName}</Typography>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">
                      Vehicle: {serviceRequest.vehicle.year} {serviceRequest.vehicle.model} {serviceRequest.vehicle.trim}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight="bold">VIN #: {serviceRequest.vehicle.vin && ` (${serviceRequest.vehicle.vin})`}</Typography>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight="bold">Tire Side: {TireSide[serviceRequest.tires[0].side as keyof typeof TireSide]}</Typography>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">
                      Tire Size: {serviceRequest.tires[0].size} ({TireType[serviceRequest.tires[0].type as keyof typeof TireType]})
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight="bold">Tire Size: {TireDamage[serviceRequest.tires[0].damage as keyof typeof TireDamage]}</Typography>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography>
                      <strong>Location:</strong>
                      <Tooltip title={serviceRequest.location.address}>
                        <Button
                          variant="text"
                          style={{
                            display: 'inline-block',
                            maxWidth: '14rem',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            verticalAlign: 'middle',
                          }}
                          onClick={toggleDialog}
                        >
                          {serviceRequest.location.address}
                        </Button>
                      </Tooltip>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ minWidth: 32 }}>
                  <CheckOutlinedIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography>
                      <strong>Location Description:</strong> {serviceRequest.location.comment}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>
          <MapDialog open={open} toggleDialog={toggleDialog} location={serviceRequest.location} />
          <Typography variant="h6">Damage tire and tire wall images</Typography>
          <Stack direction="row" maxWidth="566px" gap={3} flexWrap="nowrap" alignItems="center">
            <Box flex={1}>
              <Card>
                <CardActionArea
                  onClick={() =>
                    window.open(`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfDamage}`, '_blank')
                  }
                >
                  <CardMedia
                    width={1}
                    component="img"
                    image={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfDamage}`}
                  />
                </CardActionArea>
              </Card>
            </Box>
            <Box flex={1}>
              <Card>
                <CardActionArea
                  onClick={() =>
                    window.open(`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfTireWall}`, '_blank')
                  }
                >
                  <CardMedia
                    width={1}
                    component="img"
                    image={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfTireWall}`}
                  />
                </CardActionArea>
              </Card>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
}

export default memo(ServiceRequestPreview);
