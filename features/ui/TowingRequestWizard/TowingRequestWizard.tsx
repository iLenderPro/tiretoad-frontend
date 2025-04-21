'use client';

import React, { useRef, useState } from 'react';
import { Step1, Step2, Step3, Step4 } from './';
import { CircularProgress, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { isServiceRequestUpdating, selectServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { StepButtons } from '@/features/ui/StepButtons/StepButtons';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const steps = [Step1, Step2, Step3, Step4];

export default function TowingRequestWizard() {
  const serviceRequest = useSelector(selectServiceRequest) as TowingRequest;
  const isUpdating = useSelector(isServiceRequestUpdating);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  const CurrentStep = steps[activeStep];

  const formRef = useRef<HTMLFormElement | null>(null);

  const goToNextStep = (index = 1) => {
    setActiveStep((prevActiveStep) => prevActiveStep + index);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    formRef.current && formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo(0, 0);
  };

  return (
    <Stack sx={{ textAlign: 'center' }} flexGrow={1} gap={2} justifyContent="space-between" minHeight="100%">
      <Stack gap={2}>
        <StepButtons step={activeStep} />
        <CurrentStep goToNextStep={goToNextStep} formRef={formRef} />
      </Stack>
      <Button variant="contained" size="large" type="submit" onClick={handleNext} disabled={isUpdating}>
        {activeStep === 0 && 'Confirm'}
        {activeStep === 1 && 'Continue'}
        {activeStep === 2 && 'Submit'}
        {activeStep === 3 && 'Verify'}
        {isUpdating && (
          <Box ml={1}>
            <CircularProgress color="inherit" size="0.8rem" />
          </Box>
        )}
      </Button>
    </Stack>
  );
}
