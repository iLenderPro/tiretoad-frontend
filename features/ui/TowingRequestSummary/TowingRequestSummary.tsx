import { Divider, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import React from 'react';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import IconButton from '@mui/material/IconButton';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import { StickyNote2Outlined } from '@mui/icons-material';

export type TowingRequestSummaryProps = {
  serviceRequest: TowingRequest;
};

export default function TowingRequestSummary(props: TowingRequestSummaryProps) {
  const { serviceRequest } = props;
  return (
    <StyledPaper elevation={0} sx={{ padding: (theme) => theme.spacing(2) }}>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" gap={2} width={1}>
          <PlaceOutlinedIcon />
          <Stack flexBasis="70px" gap={1}>
            <Typography variant="body2" fontWeight="600" align="left" noWrap>
              Pickup:
            </Typography>
            <Typography variant="body2" fontWeight="600" align="left" noWrap>
              Drop-off:
            </Typography>
          </Stack>
          <Stack
            flexGrow={8}
            gap={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Typography
              align="left"
              variant="body2"
              fontWeight="500"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '33vw',
              }}
            >
              {serviceRequest?.location?.address}
            </Typography>
            <Typography
              align="left"
              variant="body2"
              fontWeight="500"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '33vw',
              }}
            >
              {serviceRequest?.locationDropOff?.address}
            </Typography>
          </Stack>
          <Stack flexBasis="130px" gap={1} direction="row" justifyContent="start" alignItems="center">
            {serviceRequest?.locationDropOff?.address && (
              <Stack direction="row" alignItems="center">
                <IconButton size="small" color="info" onClick={() => ({})}>
                  <RouteOutlinedIcon />
                </IconButton>
                <Typography variant="body2" fontWeight="500" noWrap>
                  3.5 Mile
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Divider variant="middle" />
        <Stack direction="row" alignItems="center" gap={2} width={1}>
          <DirectionsCarOutlinedIcon />
          <Stack flexBasis="70px" alignItems="start" gap={1}>
            <Typography variant="body2" fontWeight="600">
              VIN:
            </Typography>
            <Typography variant="body2" fontWeight="600">
              Model:
            </Typography>
          </Stack>
          <Stack
            flexGrow={8}
            gap={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Stack alignItems="start" gap={1}>
              <Typography
                fontWeight="500"
                variant="body2"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '33vw',
                }}
              >
                {serviceRequest.vehicle?.vin || '\u00A0'}
              </Typography>
              <Typography
                fontWeight="500"
                variant="body2"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '33vw',
                }}
              >
                {serviceRequest.vehicle?.year} {serviceRequest.vehicle?.make} {serviceRequest.vehicle?.model}
              </Typography>
            </Stack>
          </Stack>
          <Stack flexBasis="130px" gap={1} direction="row" alignItems="center">
            <Stack gap={1}>
              {serviceRequest.canGoNeutral !== undefined && serviceRequest.canGoNeutral && (
                <Stack gap={1} direction="row" flexWrap="nowrap">
                  <CheckCircleOutlineIcon color="success" fontSize="small" />
                  <Typography variant="body2" noWrap textOverflow="ellipsis">
                    Goes Neutral
                  </Typography>
                </Stack>
              )}
              {serviceRequest.canGoNeutral !== undefined && !serviceRequest.canGoNeutral && (
                <Stack gap={1} direction="row">
                  <CancelOutlinedIcon color="error" fontSize="small" />
                  <Typography variant="body2" noWrap>
                    Goes Neutral
                  </Typography>
                </Stack>
              )}
              {serviceRequest.canGoNeutral !== undefined && serviceRequest.tiresInflated && (
                <Stack gap={1} direction="row">
                  <CheckCircleOutlineIcon color="success" fontSize="small" />
                  <Typography variant="body2" noWrap>
                    Tires Inflated
                  </Typography>
                </Stack>
              )}
              {serviceRequest.canGoNeutral !== undefined && !serviceRequest.tiresInflated && (
                <Stack gap={1} direction="row">
                  <CancelOutlinedIcon color="error" fontSize="small" />
                  <Typography variant="body2" noWrap>
                    Tires Inflated
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Divider variant="middle" />
        <Stack direction="row" alignItems="center" gap={2} width={1}>
          <StickyNote2Outlined />
          <Stack flexBasis="70px" alignItems="start" gap={1}>
            <Typography variant="body2" fontWeight="600">
              Note:
            </Typography>
          </Stack>
          <Stack
            flexGrow={1}
            gap={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Typography
              variant="body2"
              align="left"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '50vw',
              }}
            >
              {serviceRequest.location?.comment}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </StyledPaper>
  );
}
