'use client';
import { Badge, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import { ServiceRequestStatus } from '@/features/ui/ServiceRequestWizard/types/ServiceRequestStatus';
import { useGetVendorResponsesQuery } from '@/entities/vendorResponse/api/vendorResponseApi';
import Typography from '@mui/material/Typography';

export default function ServiceRequestTableVendor() {
  const router = useRouter();
  const { data: vendorResponses, isFetching } = useGetVendorResponsesQuery();

  return (
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
                  <Badge badgeContent={ServiceRequestStatus.NEW} color="primary" />
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
  );
}
