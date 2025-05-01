import { Badge, Divider, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import React from 'react';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export type TowingRequestSummaryProps = {
  serviceRequest: TowingRequest;
};

export default function TowingRequestSummary(props: TowingRequestSummaryProps) {
  const { serviceRequest } = props;
  return (
    <StyledPaper elevation={0} sx={{ padding: (theme) => theme.spacing(2) }}>
      <Stack width={1} gap={2}>
        {serviceRequest.client && (
          <>
            <Stack direction="row" alignItems="center" gap={1} width={1} justifyContent="space-between">
              <Typography align="left" variant="body2" fontWeight="500" width="1/3">
                {serviceRequest.client.fullName}
              </Typography>
              <Typography align="left" variant="body2" fontWeight="500" width="1/3">
                {serviceRequest.client.email}
              </Typography>
              <Typography align="right" variant="body2" fontWeight="500" width="1/3">
                {serviceRequest.client.phone}
              </Typography>
            </Stack>
            <Divider />
          </>
        )}
        <Stack direction="row" alignItems="center" gap={1} width={1} justifyContent="space-between">
          <Typography align="left" variant="body2" fontWeight="500" width="35%">
            {serviceRequest?.location?.address}
          </Typography>
          <ArrowForwardRoundedIcon fontSize="small" />
          <Typography align="left" variant="body2" fontWeight="500" width="35%">
            {serviceRequest?.locationDropOff?.address}
          </Typography>
          <Typography variant="body1" fontWeight="700">
            &#x2022;
          </Typography>
          {serviceRequest?.locationDropOff?.address && (
            <Stack direction="row" justifyContent="end" alignItems="center">
              <Typography variant="body2" fontWeight="500" noWrap>
                {Math.round((serviceRequest?.distance / 1609.34) * 10) / 10} mi
              </Typography>
            </Stack>
          )}
        </Stack>
        <Divider />
        <Stack direction="row" alignItems="start" gap={2} width={1}>
          <Stack direction="row" alignItems="center" justifyContent="start" width="100%">
            <Typography variant="body2" fontWeight="500" flexGrow={1} align="left">
              VIN: {serviceRequest.vehicle?.vin || '\u00A0'}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="start" width="100%">
            <Typography variant="body2" fontWeight="500" flexGrow={1} align="left">
              Model: {serviceRequest.vehicle?.year} {serviceRequest.vehicle?.make} {serviceRequest.vehicle?.model}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="start" gap={2} width={1}>
          <Stack direction="row" alignItems="center" justifyContent="start" width="100%" gap={3}>
            <Typography variant="body2" fontWeight="500">
              Neutral:
            </Typography>
            {serviceRequest.canGoNeutral !== undefined && serviceRequest.canGoNeutral && <Badge badgeContent="Yes" color="success" />}
            {serviceRequest.canGoNeutral !== undefined && !serviceRequest.canGoNeutral && <Badge badgeContent="No" color="error" />}
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="start" width="100%" gap={3}>
            <Typography component="div" variant="body2" fontWeight="500">
              Tires Inflated:
            </Typography>
            {serviceRequest.canGoNeutral !== undefined && serviceRequest.tiresInflated && <Badge badgeContent="Yes" color="success" />}
            {serviceRequest.canGoNeutral !== undefined && !serviceRequest.tiresInflated && <Badge badgeContent="No" color="error" />}
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" alignItems="center" gap={2} width={1}>
          <Stack flexBasis="70px" alignItems="start" gap={1}>
            <Typography variant="body2" fontWeight="500">
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
