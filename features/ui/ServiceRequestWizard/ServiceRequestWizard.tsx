'use client';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import React, { useRef, useState } from 'react';
import { Step1, Step2, Step3, Step4 } from '@/features/ui/ServiceRequestWizard/index';
import { CircularProgress, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { isServiceRequestUpdating, selectServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import Box from '@mui/material/Box';

const steps = [Step1, Step2, Step3, Step4];

export default function ServiceRequestWizard() {
  const serviceRequest = useSelector(selectServiceRequest);
  const isUpdating = useSelector(isServiceRequestUpdating);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  const CurrentStep = steps[activeStep];

  const formRef = useRef<HTMLFormElement | null>(null);

  const goToNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleNext = () => {
    formRef.current && formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Stack sx={{ textAlign: 'center' }} flexGrow={1} justifyContent="space-between" minHeight="100%">
      <CurrentStep goToNextStep={goToNextStep} formRef={formRef} />
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="large"
            type="submit"
            onClick={handleNext}
            disabled={isUpdating}
            variant={activeStep === 3 && serviceRequest?.client?.active ? 'contained' : 'text'}
            color={activeStep === 3 && serviceRequest?.client?.active ? 'success' : 'primary'}
          >
            {activeStep === 3 ? 'Submit' : 'Next'}
            {isUpdating ? (
              <Box ml={1}>
                <CircularProgress color="inherit" size="0.8rem" />
              </Box>
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="large" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
        style={{ marginTop: '20px' }}
      />
    </Stack>
  );
}
