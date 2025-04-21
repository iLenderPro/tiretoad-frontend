import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import Box from '@mui/material/Box';
import { Loader } from '@googlemaps/js-api-loader';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker', 'routes'],
});

export default function MapDialog({ open, toggleDialog, location }: { open: boolean; toggleDialog: () => void; location: ServiceRequestDto['location'] }) {
  loader.load().then(async () => {
    if (location) {
      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
      const map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
        zoom: 11,
        mapTypeControl: false,
        mapId: '8a12ccb58590c858',
      });

      const pin = new google.maps.marker.PinElement();

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: new google.maps.LatLng(parseFloat(location.latitude), parseFloat(location.longitude)),
        content: pin.element,
      });

      // @ts-ignore
      const infoWindow = new google.maps.InfoWindow({ headerContent: location.address });

      infoWindow.open({ anchor: marker, map });
    }
  });

  return (
    <Dialog onClose={toggleDialog} open={open} fullScreen>
      <DialogTitle>Car location</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={toggleDialog}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box component="div" id="map" width={1} height="300px"></Box>
      </DialogContent>
    </Dialog>
  );
}
