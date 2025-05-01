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
import { useGetServiceRequestsQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Typography from '@mui/material/Typography';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { ServiceRequestStatusColorMap } from '@/features/ui/client/ServiceRequestWizard/types/ServiceRequestStatus';

enum StatusColor {
  PENDING = 'warning',
  ACCEPTED = 'success',
  DECLINED = 'error',
  DONE = 'primary',
}

export default function ServiceRequestTableAgent() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('sm'));
  const router = useRouter();
  const { data: serviceRequests, isFetching } = useGetServiceRequestsQuery();

  return desktop ? (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>VIN</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Status</TableCell>
            <TableCell colSpan={2}>Date & Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceRequests &&
            (serviceRequests as TowingRequest[])?.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.client.fullName}
                </TableCell>
                <TableCell>{row.vehicle?.vin}</TableCell>
                <TableCell>{`${row.vehicle.year} ${row.vehicle.model} ${row.vehicle.trim}`}</TableCell>
                <TableCell>
                  <Badge badgeContent={row.status} color={ServiceRequestStatusColorMap[row.status]} style={{ marginLeft: '20px' }} />
                </TableCell>
                <TableCell>{new Date(row?.createdAt || '').toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Button color="primary" variant="contained" onClick={() => router.push(`/requests/${row.id}/chat`)}>
                    Visitor Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Stack width="1" gap={2}>
      {!!serviceRequests?.length ? (
        (serviceRequests as TowingRequest[])?.map((row) => (
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
                  {`${row.vehicle.year} ${row.vehicle.model} ${row.vehicle.trim}`}
                </Typography>
              }
              subheader={
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {row.client.fullName}
                </Typography>
              }
              disableTypography
            />
            {/*<CardContent style={{ paddingTop: '8px', paddingBottom: '8px' }}>*/}
            {/*  <Typography variant="body1">Tire: {`${row.tires[0].size} (${TireType[row.tires[0].type as keyof typeof TireType]})`}</Typography>*/}
            {/*  <Typography variant="body1">Damage: {TireDamage[row.tires[0].damage as keyof typeof TireDamage]}</Typography>*/}
            {/*</CardContent>*/}
            <Divider variant="middle" light>
              <Badge
                slotProps={{ badge: { style: { position: 'relative', transform: 'translate(0, 0)' } } }}
                component="div"
                color={ServiceRequestStatusColorMap[row.status]}
                badgeContent={row.status}
              />
            </Divider>
            <CardActions sx={{ justifyContent: 'space-between', padding: '8px 16px' }}>
              <Typography variant="subtitle2">{row.prettyTime}</Typography>
              <Button color="primary" variant="contained" size="small" onClick={() => router.push(`/requests/${row.id}/chat`)}>
                Visitor Chat
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
