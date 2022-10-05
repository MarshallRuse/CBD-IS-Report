import React, { useState, useEffect } from "react";
import { Button, Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import DoneUploadingDialog from "./DoneUploadingDialog";

const finishedLabelVariants = {
    visible: {
        scale: 1.1,
    },
    hidden: {
        scale: 0,
    },
};

const steps = ["Elentra Data", "Resident Data"];

type Props = {
    activeStep: number;
    changeActiveStep: (step: number) => void;
    canProceed: boolean;
    canReset: boolean;
    resetUploads: () => void;
};

export default function UploadStepper({
    activeStep,
    changeActiveStep,
    canProceed = false,
    canReset = false,
    resetUploads,
}: Props) {
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
        <div className='bg-gray-100 m-4 p-8 w-full'>
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
                        <motion.button
                            className='bg-official-500 rounded-md text-white py-2 px-1 transition hover:bg-official-400 focus:bg-official-400'
                            variants={finishedLabelVariants}
                            initial='hidden'
                            animate={canProceed ? "visible" : "hidden"}
                            onClick={() => setDoneUploadingDialogOpen(true)}
                        >
                            Done
                        </motion.button>
                    )}
                    <DoneUploadingDialog open={doneUploadingDialogOpen} closeDialog={handleCloseDialog} />
                </Box>
            )}
        </div>
    );
}
