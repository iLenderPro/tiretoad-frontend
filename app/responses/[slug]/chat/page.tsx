'use client';
import { Container, Stack } from '@mui/material';
import { ResponseChat } from '@/shared/ui/Chat/ResponseChat';
import ServiceRequestPreview from '@/features/ui/client/ServiceRequestPreview/ServiceRequestPreview';
import { useGetVendorResponseQuery, useUpdateVendorResponseMutation } from '@/entities/vendorResponse/api/vendorResponseApi';
import { selectUserSession } from '@/entities/account/authSlice';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { TireRepairRequest } from '@/entities/serviceRequest/api/dto/TireRepairRequest';

export default function ServiceRequestChatPage({ params }: { params: { slug: string } }) {
  const session = useSelector(selectUserSession);
  const { data: vendorResponse } = useGetVendorResponseQuery(params.slug);
  const { data: serviceRequest } = useGetServiceRequestQuery(vendorResponse?.serviceRequest.id || skipToken, { skip: !vendorResponse?.serviceRequest.id });
  const [updateVendorResponse, { isLoading }] = useUpdateVendorResponseMutation();
  //
  // const handleAcceptRequest = async () => {
  //   vendorResponse && (await updateVendorResponse({ id: vendorResponse.id, status: VendorResponseStatus.ACCEPTED }));
  // };
  //
  // const handleDeclineRequest = async () => {
  //   vendorResponse && (await updateVendorResponse({ id: vendorResponse.id, status: VendorResponseStatus.DECLINED }));
  // };

  return (
    <>
      <Container style={{ height: '100%', paddingTop: '24px' }}>
        <Stack alignItems="center" minHeight="100%" gap={3}>
          {vendorResponse && serviceRequest && session?.user && (
            <Stack direction="row" display="flex" flexWrap="wrap" gap={3} width={1}>
              <Stack alignItems="center" minHeight="100%" gap={3} flex={1}>
                <Typography variant="h3">Service Request Summary</Typography>
                {/*{session?.user.role === UserRole.VENDOR && (*/}
                {/*  <Stack direction="row" gap={2}>*/}
                {/*    <Button variant="contained" color="success" disabled={vendorResponse.status === VendorResponseStatus.ACCEPTED} onClick={handleAcceptRequest}>*/}
                {/*      Accept*/}
                {/*    </Button>*/}
                {/*    <Button variant="contained" color="error" disabled={vendorResponse.status === VendorResponseStatus.DECLINED} onClick={handleDeclineRequest}>*/}
                {/*      Decline*/}
                {/*    </Button>*/}
                {/*  </Stack>*/}
                {/*)}*/}
                <ServiceRequestPreview user={session.user} serviceRequest={serviceRequest as TireRepairRequest} />
              </Stack>
              <ResponseChat user={session.user} vendorResponse={vendorResponse} />
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
}
