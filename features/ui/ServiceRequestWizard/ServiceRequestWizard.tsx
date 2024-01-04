'use client';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useState } from 'react';
import { Step1, Step2, Step3, Step4 } from '@/features/ui/ServiceRequestWizard/index';
import { Stack } from '@mui/material';

const steps = [Step1, Step2, Step3, Step4];

export default function ServiceRequestWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  const CurrentStep = steps[activeStep];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Stack sx={{ textAlign: 'center', flexGrow: 1 }} height={1} justifyContent="space-between">
      <CurrentStep />
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Stack>
  );
}
