import Typography from '@mui/material/Typography';
import { FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import Box from '@mui/material/Box';

const loader = new Loader({
  apiKey: 'AIzaSyCKhSAyYFPO5A1ADMys0uiNkIUS1763JyI',
  version: 'weekly',
  libraries: ['places'],
});

export function Step3() {
  loader.load().then(async () => {
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 40.749933, lng: -73.98633 },
      zoom: 12,
      mapTypeControl: false,
    });

    const input = document.getElementById('pac-input') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener('place_changed', () => {
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });
  });

  return (
    <Stack alignItems="center" gap={3}>
      <Typography variant="h4">How soon do you need the repair?</Typography>
      <RadioGroup row name="repair-time">
        <Stack alignItems="center">
          <FormControlLabel value="IMMEDIATELY" control={<Radio />} label="Immediately" />
        </Stack>
      </RadioGroup>
      <Typography variant="h4">What is your location?</Typography>
      <TextField id="pac-input" fullWidth margin="none"></TextField>
      <Box component="div" id="map" width={1} height="300px"></Box>
    </Stack>
  );
}
