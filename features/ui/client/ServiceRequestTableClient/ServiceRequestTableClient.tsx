'use client';
import { Badge, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import { ServiceRequestStatus } from '@/features/ui/ServiceRequestWizard/types/ServiceRequestStatus';
import { useGetServiceRequestsQuery } from '@/entities/serviceRequest/api/serviceRequestApi';

export default function ServiceRequestTableClient() {
  const router = useRouter();

  const { data: serviceRequests, isFetching } = useGetServiceRequestsQuery();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>VIN</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Tires</TableCell>
            <TableCell>Damage</TableCell>
            <TableCell>Status</TableCell>
            <TableCell colSpan={2}>Date & Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceRequests &&
            serviceRequests?.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.vehicle?.vin}</TableCell>
                <TableCell>{`${row.vehicle.year} ${row.vehicle.model} ${row.vehicle.trim}`}</TableCell>
                <TableCell>{`${row.tires[0].size} (${TireType[row.tires[0].type as keyof typeof TireType]})`}</TableCell>
                <TableCell>{TireDamage[row.tires[0].damage as keyof typeof TireDamage]}</TableCell>
                <TableCell align="center">
                  <Badge badgeContent={ServiceRequestStatus.NEW} color="primary" />
                </TableCell>
                <TableCell>{new Date(row?.createdAt || '').toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Button color="primary" variant="contained" onClick={() => router.push(`/requests/${row.id}/view`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
