import { useState } from "react";
import { Alert, Slide, Snackbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { PageColumn } from "./components/StyledComponents";
import UploadStepper from "./components/UploadStepper";
import RotationUploadInput from "./components/upload-inputs/RotationUploadInput";
import RotationCoordinatorUploadInput from "./components/upload-inputs/RotationCoordinatorUploadInput";
import EPAUploadInput from "./components/upload-inputs/EPAUploadInput";
import AllRotationsDataGrid from "./components/tables/AllRotationsDataGrid";
import GroupedResidentsDataGrid from "./components/tables/GroupedResidentsDataGrid";

const Header = styled("header")({
    alignItems: "center",
    background:
        "linear-gradient(270deg, #005194, rgba(0, 71, 138, 0.7) 20%, rgba(0, 65, 132, 0.7) 50%, #003374 85%, #005194)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    padding: "2.5em",
});

const TableSection = styled("div")({
    marginTop: "2rem",
    width: "100%",
});

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
};

const SnackbarTransition = (props) => <Slide {...props} direction='up ' />;

function App() {
    const [[step, direction], setStep] = useState([0, 0]);
    const [progressUpdateOpen, setProgressUpdateOpen] = useState(false);
    const [progressUpdateMessage, setProgressUpdateMessage] = useState("");
    const [canProceed, setCanProceed] = useState(false);
    const [rotations, setRotations] = useState([]);
    const [rotationsFileName, setRotationsFileName] = useState("");
    const [juniorRotations, setJuniorRotations] = useState([]);
    const [seniorRotations, setSeniorRotations] = useState([]);
    const [juniorAndSeniorRotations, setJuniorAndSeniorRotations] = useState([]);
    const [rotationCoordinators, setRotationCoordinators] = useState([]);
    const [rotationCoordinatorsFileName, setRotationCoordinatorsFileName] = useState("");
    const [EPAs, setEPAs] = useState([]);
    const [EPAsFileName, setEPAsFileName] = useState("");

    // Stepper Controls
    const changeActiveStep = (direction) => {
        const newStep = step + direction;
        setStep([step + direction, direction]);
        if (newStep === 0 && rotations.length > 0) {
            setCanProceed(true);
        } else if (newStep === 0 && rotations.length === 0) {
            setCanProceed(false);
        } else if (newStep === 1 && rotationCoordinators.length > 0) {
            setCanProceed(true);
        } else if (newStep === 1 && rotationCoordinators.length === 0) {
            setCanProceed(false);
        } else if (newStep === 2 && EPAs.length > 0) {
            setCanProceed(true);
        } else if (newStep === 2 && EPAs.length === 0) {
            setCanProceed(false);
        }
    };

    // Progress Update Control
    const handleProgressUpdateClose = () => {
        setProgressUpdateOpen(false);
        setProgressUpdateMessage("");
    };

    // Rotation formatting functions
    const groupByUniqueRotations = (rotationsData) => {
        const uniqueRotations = rotationsData
            .filter((row, ind, self) => {
                return (
                    self.findIndex((el) => `${el.Rotation}-${el.Hospital}` === `${row.Rotation}-${row.Hospital}`) ===
                    ind
                );
            })
            .map((row) => ({
                id: `${row.Rotation}-${row.Hospital}`,
                Block: row.Block,
                Rotation: row.Rotation,
                Hospital: row.Hospital,
                PGY1s: "",
                PGY1Emails: "",
                PGY2s: "",
                PGY2Emails: "",
                PGY3s: "",
                PGY3Emails: "",
                RotationCoordinator: row.RotationCoordinator ? row.RotationCoordinator : "",
                RCFirstName: row.RCFirstName ? row.RCFirstName : "",
                RCEmail: row.RCEmail ? row.RCEmail : "",
                Assistant: row.Assistant ? row.Assistant : "",
                AssistantEmail: row.AssistantEmail ? row.AssistantEmail : "",
                JuniorPriority: row.JuniorPriority ? row.JuniorPriority : "",
                JuniorDoWhenYouCan: row.JuniorDoWhenYouCan ? row.JuniorDoWhenYouCan : "",
                JuniorOptional: row.JuniorOptional ? row.JuniorOptional : "",
                SeniorPriority: row.SeniorPriority ? row.SeniorPriority : "",
                SeniorDoWhenYouCan: row.SeniorDoWhenYouCan ? row.SeniorDoWhenYouCan : "",
                SeniorOptional: row.SeniorOptional ? row.SeniorOptional : "",
                JuniorRotationCards: row.JuniorRotationCards ? row.JuniorRotationCards : "",
                SeniorRotationCards: row.SeniorRotationCards ? row.SeniorRotationCards : "",
            }));

        rotationsData.forEach((row) => {
            const uniqueRotationIndex = uniqueRotations.findIndex(
                (rot) => `${rot.Rotation}-${rot.Hospital}` === `${row.Rotation}-${row.Hospital}`
            );
            if (row.Team !== "" && !row.Resident.includes(row.Team)) {
                row.Resident = `${row.Resident} (${row.Team})`;
            }
            switch (row.PGY) {
                case "PGY1":
                    uniqueRotations[uniqueRotationIndex].PGY1s =
                        uniqueRotations[uniqueRotationIndex].PGY1s === ""
                            ? row.Resident
                            : uniqueRotations[uniqueRotationIndex].PGY1s + "\n" + row.Resident;
                    uniqueRotations[uniqueRotationIndex].PGY1Emails =
                        uniqueRotations[uniqueRotationIndex].PGY1Emails === ""
                            ? row.Email
                            : uniqueRotations[uniqueRotationIndex].PGY1Emails + "\n" + row.Email;
                    break;
                case "PGY2":
                    uniqueRotations[uniqueRotationIndex].PGY2s =
                        uniqueRotations[uniqueRotationIndex].PGY2s === ""
                            ? row.Resident
                            : uniqueRotations[uniqueRotationIndex].PGY2s + "\n" + row.Resident;
                    uniqueRotations[uniqueRotationIndex].PGY2Emails =
                        uniqueRotations[uniqueRotationIndex].PGY2Emails === ""
                            ? row.Email
                            : uniqueRotations[uniqueRotationIndex].PGY2Emails + "\n" + row.Email;
                    break;
                case "PGY3":
                    uniqueRotations[uniqueRotationIndex].PGY3s =
                        uniqueRotations[uniqueRotationIndex].PGY3s === ""
                            ? row.Resident
                            : uniqueRotations[uniqueRotationIndex].PGY3s + "\n" + row.Resident;
                    uniqueRotations[uniqueRotationIndex].PGY3Emails =
                        uniqueRotations[uniqueRotationIndex].PGY3Emails === ""
                            ? row.Email
                            : uniqueRotations[uniqueRotationIndex].PGY3Emails + "\n" + row.Email;
                    break;
            }
        });

        return uniqueRotations;
    };

    const filterOnlyJuniors = (uniqueRotations) => {
        const onlyJuniors = uniqueRotations.filter((rot) => rot.PGY1s !== "" && rot.PGY2s === "" && rot.PGY3s === "");
        return onlyJuniors;
    };

    const filterOnlySeniors = (uniqueRotations) => {
        const onlySeniors = uniqueRotations.filter((rot) => rot.PGY1s === "" && (rot.PGY2s !== "" || rot.PGY3s !== ""));
        return onlySeniors;
    };

    const filterOnlyJuniorsAndSeniors = (uniqueRotations) => {
        const onlyJuniorsAndSeniors = uniqueRotations.filter(
            (rot) => rot.PGY1s !== "" && (rot.PGY2s !== "" || rot.PGY3s !== "")
        );
        return onlyJuniorsAndSeniors;
    };

    // Rotation Upload handler
    const onRotationsDataLoaded = (data) => {
        setRotations(data);
        const uniqueRotations = groupByUniqueRotations(data);
        setJuniorRotations(filterOnlyJuniors(uniqueRotations));
        setSeniorRotations(filterOnlySeniors(uniqueRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(uniqueRotations));
        // Alert User
        setProgressUpdateMessage("Rotations uploaded!");
        setProgressUpdateOpen(true);
        // Move on to next step - uploading Rotation Coordinator Data
        setCanProceed(true);
    };

    const reportRotationsFileName = (name) => {
        setRotationsFileName(name);
    };

    const onRotationsDataRemoved = () => {
        setRotations([]);
        setRotationsFileName("");
        setRotationCoordinators([]);
        setRotationCoordinatorsFileName("");
        setEPAs([]);
        setEPAsFileName("");
        setCanProceed(false);
    };

    const augmentRotationsWithRCData = (rotationsToAugment, rotCoordinators) => {
        const rots = rotationsToAugment.map((rot) => {
            const thisRotationsRCData = rotCoordinators.find(
                (rc) => rc.Rotation === rot.Rotation && rc.Site === rot.Hospital
            );
            return {
                ...rot,
                RotationCoordinator: thisRotationsRCData ? thisRotationsRCData.RotationCoordinator : "",
                RCFirstName: thisRotationsRCData ? thisRotationsRCData.FirstName : "",
                RCEmail: thisRotationsRCData ? thisRotationsRCData.RotationCoordinatorEmail : "",
                Assistant: thisRotationsRCData ? thisRotationsRCData.Assistant : "",
                AssistantEmail: thisRotationsRCData ? thisRotationsRCData.AssistantEmail : "",
            };
        });
        return rots;
    };

    // Rotation Coordinator Uplaod Handler
    const onRotationCoordinatorDataLoaded = (data) => {
        setRotationCoordinators(data);
        const RCAugmentedRotations = augmentRotationsWithRCData(rotations, data);
        setRotations(RCAugmentedRotations);

        const groupedRCAugmentedRotations = groupByUniqueRotations(RCAugmentedRotations);
        setJuniorRotations(filterOnlyJuniors(groupedRCAugmentedRotations));
        setSeniorRotations(filterOnlySeniors(groupedRCAugmentedRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(groupedRCAugmentedRotations));

        // Alert User
        setProgressUpdateMessage("Rotation Coordinators uploaded!");
        setProgressUpdateOpen(true);
        // Move on to next step - uploading EPA Data
        setCanProceed(true);
    };

    const reportRotationCoordinatorsFileName = (name) => {
        setRotationCoordinatorsFileName(name);
    };

    const onRotationCoordinatorsDataRemoved = () => {
        setRotationCoordinators([]);
        setRotationCoordinatorsFileName("");
        setEPAs([]);
        setEPAsFileName("");
        setCanProceed(false);
    };

    const augmentRotationsWithEPAData = (rotationsToAugment, EPAs) => {
        const rots = rotationsToAugment.map((rot) => {
            const juniorStage = rot.Block > 4 ? "FOD" : "TTD";
            const seniorStage = "COD";

            const thisRotationsJuniorEPAData = EPAs.find(
                (epa) => epa.Rotation === rot.Rotation && epa.Stage === juniorStage
            );

            const thisRotationsSeniorEPAData = EPAs.find(
                (epa) => epa.Rotation === rot.Rotation && epa.Stage === seniorStage
            );

            return {
                ...rot,
                JuniorPriority: thisRotationsJuniorEPAData ? thisRotationsJuniorEPAData.Priority : "",
                JuniorDoWhenYouCan: thisRotationsJuniorEPAData ? thisRotationsJuniorEPAData.DoWhenYouCan : "",
                JuniorOptional: thisRotationsJuniorEPAData ? thisRotationsJuniorEPAData.Optional : "",
                SeniorPriority: thisRotationsSeniorEPAData ? thisRotationsSeniorEPAData.Priority : "",
                SeniorDoWhenYouCan: thisRotationsSeniorEPAData ? thisRotationsSeniorEPAData.DoWhenYouCan : "",
                SeniorOptional: thisRotationsSeniorEPAData ? thisRotationsSeniorEPAData.Optional : "",
                JuniorRotationCards: thisRotationsJuniorEPAData ? thisRotationsJuniorEPAData.RotationCards : "",
                SeniorRotationCards: thisRotationsSeniorEPAData ? thisRotationsSeniorEPAData.RotationCards : "",
            };
        });
        return rots;
    };

    // EPA Upload Handler
    const onEPADataLoaded = (data) => {
        setEPAs(data);
        const EPAAugmentedRotations = augmentRotationsWithEPAData(rotations, data);
        setRotations(EPAAugmentedRotations);

        const groupedEPAAugmentedRotations = groupByUniqueRotations(EPAAugmentedRotations);
        setJuniorRotations(filterOnlyJuniors(groupedEPAAugmentedRotations));
        setSeniorRotations(filterOnlySeniors(groupedEPAAugmentedRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(groupedEPAAugmentedRotations));

        // Alert User
        setProgressUpdateMessage("EPA Data uploaded!");
        setProgressUpdateOpen(true);

        setCanProceed(true);
    };

    const reportEPAsFileName = (name) => {
        setEPAsFileName(name);
    };

    const onEPAsDataRemoved = () => {
        setEPAs([]);
        setEPAsFileName("");
        setCanProceed(false);
    };

    return (
        <>
            <Header>
                <Typography variant='h1'>Rotation Coordinator Report Formatter</Typography>
            </Header>
            <PageColumn>
                <UploadStepper activeStep={step} changeActiveStep={changeActiveStep} canProceed={canProceed} />
                <AnimatePresence initial={false} custom={direction} exitBeforeEnter>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        style={{ width: "100%" }}
                    >
                        {step === 0 && (
                            <RotationUploadInput
                                onRotationsDataLoaded={onRotationsDataLoaded}
                                onRotationsDataRemoved={onRotationsDataRemoved}
                                reportFileName={reportRotationsFileName}
                                rotationsFileName={rotationsFileName}
                            />
                        )}
                        {step === 1 && (
                            <RotationCoordinatorUploadInput
                                onRotationCoordinatorDataLoaded={onRotationCoordinatorDataLoaded}
                                onRotationCoordinatorsDataRemoved={onRotationCoordinatorsDataRemoved}
                                reportFileName={reportRotationCoordinatorsFileName}
                                rotationCoordinatorsFileName={rotationCoordinatorsFileName}
                            />
                        )}
                        {step === 2 && (
                            <EPAUploadInput
                                onEPADataLoaded={onEPADataLoaded}
                                onEPAsDataRemoved={onEPAsDataRemoved}
                                reportFileName={reportEPAsFileName}
                                EPAsFileName={EPAsFileName}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                    {rotations.length > 0 && (
                        <motion.section
                            key='tables'
                            initial='collapsed'
                            animate='open'
                            exit='collapsed'
                            variants={{
                                open: { opacity: 1, height: "auto" },
                                collapsed: { opacity: 0, height: 0 },
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
                        >
                            <TableSection>
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    color='primary'
                                    style={{ paddingBottom: "2rem" }}
                                >
                                    All Rotations - By Resident
                                </Typography>
                                <AllRotationsDataGrid
                                    rotationsData={rotations}
                                    rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
                                    EPADataAvailable={EPAs.length > 0}
                                />
                            </TableSection>
                            <TableSection>
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    color='primary'
                                    style={{ paddingBottom: "2rem" }}
                                >
                                    Grouped Rotations - <strong>Juniors</strong> by Block-Rotation-Site
                                </Typography>
                                <GroupedResidentsDataGrid
                                    rotationsData={juniorRotations}
                                    rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
                                    EPADataAvailable={EPAs.length > 0}
                                    groupType='Juniors'
                                />
                            </TableSection>
                            <TableSection>
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    color='primary'
                                    style={{ paddingBottom: "2rem" }}
                                >
                                    Grouped Rotations - <strong>Seniors</strong> by Block-Rotation-Site
                                </Typography>
                                <GroupedResidentsDataGrid
                                    rotationsData={seniorRotations}
                                    rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
                                    EPADataAvailable={EPAs.length > 0}
                                    groupType='Seniors'
                                />
                            </TableSection>
                            <TableSection>
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    color='primary'
                                    style={{ paddingBottom: "2rem" }}
                                >
                                    Grouped Rotations - <strong>Juniors & Seniors</strong> by Block-Rotation-Site
                                </Typography>
                                <GroupedResidentsDataGrid
                                    rotationsData={juniorAndSeniorRotations}
                                    rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
                                    EPADataAvailable={EPAs.length > 0}
                                    groupType='Juniors and Seniors'
                                />
                            </TableSection>
                        </motion.section>
                    )}
                </AnimatePresence>
            </PageColumn>
            <Snackbar
                open={progressUpdateOpen}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={SnackbarTransition}
                onClose={handleProgressUpdateClose}
            >
                <Alert onClose={handleProgressUpdateClose} severity='success' sx={{ width: "100%" }}>
                    {progressUpdateMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default App;
