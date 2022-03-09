import React, { useState } from "react";
import { Button, Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ClampedWidthBox = styled(Box)({
    width: "clamp(350px, 700px, 100%)",
});

const steps = ["Rotation Data", "Rotation Coordinator Data", "EPA Data"];

export default function UploadStepper(props) {
    const { activeStep, changeActiveStep, canProceed = false } = props;

    const handleNext = () => {
        changeActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleReset = () => {
        changeActiveStep(0);
    };

    return (
        <ClampedWidthBox>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => {
                    return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", gap: "2em", pt: 3 }}>
                    <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                    </Button>
                    <Button disabled={!canProceed} onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                </Box>
            )}
        </ClampedWidthBox>
    );
}
