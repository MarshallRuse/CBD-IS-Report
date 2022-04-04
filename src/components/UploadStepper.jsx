import React, { useState, useEffect } from "react";
import { Button, Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import DoneUploadingDialog from "./DoneUploadingDialog";

const Container = styled(Box)({
    backgroundColor: "#FAFAFA",
    margin: "1rem",
    padding: "2rem",
    width: "100%",
});

const DoneButton = styled(motion.button)(({ theme }) => ({
    backgroundColor: theme.palette.official.main,
    borderRadius: "4px",
    color: "#fff",
    padding: "6px 8px",
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
        backgroundColor: theme.palette.primary.main,
    },
    "&:focus": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

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
    const { activeStep, changeActiveStep, canProceed = false, canReset = false, resetUploads } = props;
    const theme = useTheme();

    const [doneUploadingDialogOpen, setDoneUploadingDialogOpen] = useState(false);

    const handleNext = () => {
        changeActiveStep(1);
    };

    const handleBack = () => {
        changeActiveStep(-1);
    };

    const handleReset = () => {
        resetUploads();
    };

    const handleCloseDialog = () => {
        setDoneUploadingDialogOpen(false);
    };

    useEffect(() => {
        if (activeStep === steps.length - 1 && canProceed) {
            setDoneUploadingDialogOpen(true);
        }
    }, [activeStep, canProceed]);

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
                    {canReset && (
                        <Button
                            color='secondary'
                            variant='outlined'
                            disabled={!canReset}
                            onClick={handleReset}
                            sx={{ mr: 1, opacity: canReset ? 1 : 0 }}
                        >
                            Reset
                        </Button>
                    )}
                    <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                    </Button>
                    {activeStep !== steps.length - 1 && (
                        <Button disabled={!canProceed} variant={canProceed ? "contained" : "text"} onClick={handleNext}>
                            Next
                        </Button>
                    )}
                    {activeStep === steps.length - 1 && (
                        <DoneButton
                            variants={finishedLabelVariants}
                            initial='hidden'
                            animate={canProceed ? "visible" : "hidden"}
                            onClick={() => setDoneUploadingDialogOpen(true)}
                        >
                            Done
                        </DoneButton>
                    )}
                    <DoneUploadingDialog open={doneUploadingDialogOpen} closeDialog={handleCloseDialog} />
                </Box>
            )}
        </Container>
    );
}
