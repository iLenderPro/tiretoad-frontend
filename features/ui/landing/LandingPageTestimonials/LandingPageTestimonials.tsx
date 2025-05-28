import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import React, { useState } from 'react';
import { Avatar, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

const testimonials: { name: string; location: string; text: string; photo: string }[] = [
  {
    name: 'John Martinez',
    location: 'Miami, FL',
    text: 'I was stranded on I-95 at midnight when I found this towing dispatch service online. In under a minute I submitted my request, connected with a live dispatcher, and had a flatbed tow truck on its way. The free 24/7 dispatch is a lifesaver—fast, friendly, and fair rates!',
    photo: '/images/testimonial-John-Martinez.png',
  },
  {
    name: 'Sarah Thompson',
    location: 'Fort Lauderdale, FL',
    text: 'Amazing towing experience! I entered my pickup and drop-off points, and within seconds was chatting with a real person who booked the nearest tow truck. Their roadside assistance and dispatch team got me back on the road in no time, just paid for the tow.',
    photo: '/images/testimonial-Sarah-Thompson.png',
  },
  {
    name: 'David Nguyen',
    location: 'Boca Raton, FL',
    text: 'I’ve used plenty of tow services, but none match this platform. The instant connection to a dispatcher, transparent pricing, and rapid tow truck dispatch blew me away. Best free 24/7 towing dispatch I’ve ever seen!',
    photo: '/images/testimonial-David-Nguyen.png',
  },
  {
    name: 'Dennis Hamilton',
    location: 'West Palm Beach, FL',
    text: 'From start to finish, the towing process was seamless. I just input my locations and vehicle info, then a live agent arranged my tow in about 2 minutes. The nearest tow truck arrived quickly, and the entire dispatch service was completely free—highly recommend!',
    photo: '/images/testimonial-Maria-Rodriguez.png',
  },
];

export default function LandingPageTestimonials() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Stack gap={3}>
      <Stack alignItems="center" gap={3}>
        <Avatar src={testimonials[activeStep].photo} alt={testimonials[activeStep].name} sx={{ width: 89, height: 89 }} />
        <Typography variant="body2">{testimonials[activeStep].text}</Typography>
        <Stack>
          <Typography variant="h6" gutterBottom>
            {testimonials[activeStep].name}
          </Typography>
          <Typography variant="body2">{testimonials[activeStep].location}</Typography>
        </Stack>
      </Stack>
      <MobileStepper
        variant="dots"
        steps={4}
        position="static"
        activeStep={activeStep}
        sx={{ flexGrow: 1, backgroundColor: 'transparent' }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 3}>
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </Button>
        }
      />
    </Stack>
  );
}
