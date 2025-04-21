import { StyledToggleButton, StyledToggleButtonGroup } from '@/features/ui/StepButtons/styles';
import { StyledPaper } from '@/features/ui/Paper/Paper';

export function StepButtons({ step }: { step: number }) {
  const onChange = () => undefined;

  return (
    <StyledPaper>
      <StyledToggleButtonGroup fullWidth size="medium" value={step} exclusive onChange={onChange}>
        <StyledToggleButton value={0} aria-label="route">
          Route
        </StyledToggleButton>
        <StyledToggleButton value={1} aria-label="vehicle">
          Vehicle
        </StyledToggleButton>
        <StyledToggleButton value={2} aria-label="submit">
          Submit
        </StyledToggleButton>
        <StyledToggleButton value={3} aria-label="verify">
          Verify
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </StyledPaper>
  );
}
