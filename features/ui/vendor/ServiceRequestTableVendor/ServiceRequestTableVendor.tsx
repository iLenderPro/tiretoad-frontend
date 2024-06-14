'use client';
import {
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import { useGetVendorResponsesQuery } from '@/entities/vendorResponse/api/vendorResponseApi';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

enum StatusColor {
  PENDING = 'warning',
  ACCEPTED = 'success',
  DECLINED = 'error',
  DONE = 'primary',
}

export default function ServiceRequestTableVendor() {
  const theme = useTheme();
  const router = useRouter();
  const { data: vendorResponses, isFetching } = useGetVendorResponsesQuery();
  const desktop = useMediaQuery(theme.breakpoints.up('sm'));
  return desktop ? (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>VIN</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Tires</TableCell>
            <TableCell>Damage</TableCell>
            <TableCell>Status</TableCell>
            <TableCell colSpan={2}>Date & Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!vendorResponses?.length ? (
            vendorResponses?.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.serviceRequest.client.fullName}
                </TableCell>
                <TableCell>{row.serviceRequest.vehicle?.vin}</TableCell>
                <TableCell>{`${row.serviceRequest.vehicle.year} ${row.serviceRequest.vehicle.model} ${row.serviceRequest.vehicle.trim}`}</TableCell>
                <TableCell>{`${row.serviceRequest.tires[0].size} (${TireType[row.serviceRequest.tires[0].type as keyof typeof TireType]})`}</TableCell>
                <TableCell>{TireDamage[row.serviceRequest.tires[0].damage as keyof typeof TireDamage]}</TableCell>
                <TableCell align="center">
                  <Badge badgeContent={row.status} color={StatusColor[row.status]} />
                </TableCell>
                <TableCell>{new Date(row?.serviceRequest.createdAt || '').toLocaleString()}</TableCell>
                <TableCell>
                  <Button color="primary" variant="contained" onClick={() => router.push(`/responses/${row.id}/chat`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell colSpan={8} align="center">
                <Typography>No service requests yet</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Stack width="1" gap={2}>
      {!!vendorResponses?.length ? (
        vendorResponses?.map((row) => (
          <Card variant="elevation" elevation={1} key={row.id} sx={{ width: '100%' }}>
            <CardHeader
              style={{ paddingBottom: '8px' }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertOutlinedIcon />
                </IconButton>
              }
              title={
                <Typography gutterBottom variant="h6">
                  {`${row.serviceRequest.vehicle.year} ${row.serviceRequest.vehicle.model} ${row.serviceRequest.vehicle.trim}`}
                </Typography>
              }
              subheader={
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {row.serviceRequest.client.fullName}
                </Typography>
              }
              disableTypography
            />
            <CardContent style={{ paddingTop: '8px', paddingBottom: '8px' }}>
              <Typography variant="body1">Tire: {`${row.serviceRequest.tires[0].size} (${TireType[row.serviceRequest.tires[0].type as keyof typeof TireType]})`}</Typography>
              <Typography variant="body1">Damage: {TireDamage[row.serviceRequest.tires[0].damage as keyof typeof TireDamage]}</Typography>
            </CardContent>
            <Divider variant="middle" light>
              <Badge
                slotProps={{ badge: { style: { position: 'relative', transform: 'translate(0, 0)' } } }}
                component="div"
                color={StatusColor[row.status]}
                badgeContent={row.status}
              />
            </Divider>
            <CardActions sx={{ justifyContent: 'space-between', padding: '8px 16px' }}>
              <Typography variant="subtitle2">{row.serviceRequest.prettyTime}</Typography>
              <Button color="primary" variant="contained" size="small" onClick={() => router.push(`/responses/${row.id}/chat`)}>
                View
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Card variant="elevation" elevation={1} sx={{ width: '100%' }}>
          <CardContent>
            <Typography align="center">No service requests yet</Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
