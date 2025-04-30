'use client';
import { Badge, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { TireRepairRequest } from '@/entities/serviceRequest/api/dto/TireRepairRequest';
import { ServiceRequestStatusColorMap } from '@/features/ui/client/ServiceRequestWizard/types/ServiceRequestStatus';

const createData = (id: string, client: string, vin: string, vehicle: string, tires: string, damage: string, createdAt: string) => ({
  id,
  client,
  vin,
  vehicle,
  tires,
  damage,
  createdAt,
});

const rows = [
  createData(
    '7dd710ae-a481-4cbc-8b8e-544efe38499f',
    'Nick Zakonov',
    '3MW39FS00P8C96038',
    '2023 BMW 330e xDrive Sedan M Sport',
    '225/40R19 (Standard)',
    'Flat',
    '2024-01-30 23:59:59',
  ),
];

export type ServiceRequestResponseTableProps = {
  serviceRequests: ServiceRequestDto[];
};
export default function ServiceRequestResponseTable(props: ServiceRequestResponseTableProps) {
  const { serviceRequests } = props;
  const router = useRouter();

  return (
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
          {(serviceRequests as TireRepairRequest[]).map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.client.fullName}
              </TableCell>
              <TableCell>{row.vehicle?.vin}</TableCell>
              <TableCell>{`${row.vehicle.year} ${row.vehicle.model} ${row.vehicle.trim}`}</TableCell>
              <TableCell align="center">
                <Badge badgeContent={row.status} color={ServiceRequestStatusColorMap[row.status]} />
              </TableCell>
              <TableCell>{new Date(row?.createdAt || '').toLocaleString()}</TableCell>
              <TableCell>
                <Button color="success" variant="contained" onClick={() => router.push(`/requests/${row.id}/chat`)}>
                  Chat
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
