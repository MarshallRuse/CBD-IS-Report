import React, { useState } from "react";
import { Button, Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

const Container = styled(Box)({
    backgroundColor: "#FAFAFA",
    margin: "1rem",
    padding: "2rem",
    width: "100%",
});

const finishedLabelVariants = {
    visible: {
        scale: 1.1,
    },
    hidden: {
        scale: 0,
    },
};

const steps = ["Rotation Data", "Rotation Coordinator Data", "EPA Data"];

export default function UploadStepper(props) {
    const { activeStep, changeActiveStep, canProceed = false } = props;
    const theme = useTheme();

    const handleNext = () => {
        changeActiveStep(1);
    };

    const handleBack = () => {
        changeActiveStep(-1);
    };

    const handleReset = () => {
        changeActiveStep(0);
    };

    return (
        <Container>
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
                    {activeStep !== steps.length - 1 && (
                        <Button disabled={!canProceed} variant={canProceed ? "contained" : "text"} onClick={handleNext}>
                            Next
                        </Button>
                    )}
                    {activeStep === steps.length - 1 && (
                        <motion.div
                            variants={finishedLabelVariants}
                            animate={canProceed ? "visible" : "hidden"}
                            style={{
                                backgroundColor: theme.palette.official.main,
                                borderRadius: "4px",
                                color: "#fff",
                                padding: "6px 8px",
                            }}
                        >
                            Finished!
                        </motion.div>
                    )}
                </Box>
            )}
        </Container>
    );
}
