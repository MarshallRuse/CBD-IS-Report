import { useState, useRef, useEffect } from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GitHub } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Footer, Header, PageColumn, TablesList, TableSection } from "./components/StyledComponents";
import UploadStepper from "./components/UploadStepper";
import TableFilters from "./components/TableFilters";
import UploadInput from "./components/upload-inputs/UploadInput";
import AllRotationsDataGrid from "./components/tables/AllRotationsDataGrid";
import GroupedResidentsDataGrid from "./components/tables/GroupedResidentsDataGrid";
import {
    rotationHeaderValues,
    rotationExampleBodyValues,
    rotationCoordinatorHeaderValues,
    rotationCoordinatorExampleBodyValues,
    EPAsHeaderValues,
    EPAsExampleBodyValues,
} from "./uploadValueMap.js";

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

function App() {
    // Upload button refs
    const rotationsUploadButtonRef = useRef(null);
    const rotationCoordinatorsUploadButtonRef = useRef(null);
    const EPAsUploadButtonRef = useRef(null);

    const theme = useTheme();

    // stepper state
    const [[step, direction], setStep] = useState([0, 0]);
    const [canProceed, setCanProceed] = useState(false);
    // filters state
    const [blockFilter, setBlockFilter] = useState("");
    const [programFilter, setProgramFilter] = useState("");
    const [excludedRotations, setExcludedRotations] = useState([]);
    // uploads state
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

    // Filter controls
    const handleBlockFilterChange = (blk) => setBlockFilter(String(blk));

    const handleProgramFilterChange = (prog) => setProgramFilter(prog);

    const handleExcludedRotationsFilterChange = (rots) => setExcludedRotations(rots);

    const rotationFilterScreening = (rot) => {
        return (
            (!blockFilter ? true : rot.Block === blockFilter) &&
            (!programFilter ? true : rot.TraineeProgram === programFilter) &&
            !excludedRotations.includes(rot.Rotation)
        );
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
                TraineeProgram: row.TraineeProgram,
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
            if (row.Team !== "" && !row.Resident?.includes(row.Team)) {
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
    const onRotationsDataLoaded = (data, missingHeaders = []) => {
        setRotations(data);
        const uniqueRotations = groupByUniqueRotations(data);
        setJuniorRotations(filterOnlyJuniors(uniqueRotations));
        setSeniorRotations(filterOnlySeniors(uniqueRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(uniqueRotations));
        // Move on to next step - uploading Rotation Coordinator Data
        if (missingHeaders.length === 0) {
            setCanProceed(true);
        }
    };

    const reportRotationsFileName = (name) => {
        setRotationsFileName(name);
    };

    const onRotationsDataRemoved = () => {
        setRotations([]);
        setRotationsFileName("");
        setBlockFilter("");
        setProgramFilter("");
        setExcludedRotations([]);
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
    const onRotationCoordinatorDataLoaded = (data, missingHeaders = []) => {
        setRotationCoordinators(data);
        const RCAugmentedRotations = augmentRotationsWithRCData(rotations, data);
        setRotations(RCAugmentedRotations);

        const groupedRCAugmentedRotations = groupByUniqueRotations(RCAugmentedRotations);
        setJuniorRotations(filterOnlyJuniors(groupedRCAugmentedRotations));
        setSeniorRotations(filterOnlySeniors(groupedRCAugmentedRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(groupedRCAugmentedRotations));
        // Move on to next step - uploading EPA Data
        if (missingHeaders.length === 0) {
            setCanProceed(true);
        }
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
            let juniorStage = rot.Block > 4 ? "FOD" : "TTD";
            if (juniorStage === "FOD" && rot.Rotation === "GIM - CTU - Junior Experience") {
                juniorStage += rot.Block > 8 ? " (Late)" : " (Early)";
            }
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
    const onEPADataLoaded = (data, missingHeaders = []) => {
        setEPAs(data);
        const EPAAugmentedRotations = augmentRotationsWithEPAData(rotations, data);
        setRotations(EPAAugmentedRotations);

        const groupedEPAAugmentedRotations = groupByUniqueRotations(EPAAugmentedRotations);
        setJuniorRotations(filterOnlyJuniors(groupedEPAAugmentedRotations));
        setSeniorRotations(filterOnlySeniors(groupedEPAAugmentedRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(groupedEPAAugmentedRotations));

        if (missingHeaders.length === 0) {
            setCanProceed(true);
        }
    };

    const reportEPAsFileName = (name) => {
        setEPAsFileName(name);
    };

    const onEPAsDataRemoved = () => {
        setEPAs([]);
        setEPAsFileName("");
        setCanProceed(false);
    };

    const resetUploads = () => {
        setRotations([]);
        setRotationsFileName("");
        setBlockFilter("");
        setProgramFilter("");
        setExcludedRotations([]);
        setRotationCoordinators([]);
        setRotationCoordinatorsFileName("");
        setEPAs([]);
        setEPAsFileName("");
        setCanProceed(false);
        setStep([0, -1]);
    };

    return (
        <>
            <Header>
                <Typography variant='h1'>Rotation Coordinator Report Formatter</Typography>
            </Header>
            <PageColumn>
                <UploadStepper
                    activeStep={step}
                    changeActiveStep={changeActiveStep}
                    canProceed={canProceed}
                    canReset={rotations.length > 0}
                    resetUploads={resetUploads}
                />
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
                            <UploadInput
                                ref={rotationsUploadButtonRef}
                                onDataLoaded={onRotationsDataLoaded}
                                onDataRemoved={onRotationsDataRemoved}
                                reportFileName={reportRotationsFileName}
                                fileName={rotationsFileName}
                                uploadTitle={"Rotations"}
                                headerValues={rotationHeaderValues}
                                exampleBodyValues={rotationExampleBodyValues}
                            />
                        )}
                        {step === 1 && (
                            <UploadInput
                                ref={rotationCoordinatorsUploadButtonRef}
                                onDataLoaded={onRotationCoordinatorDataLoaded}
                                onDataRemoved={onRotationCoordinatorsDataRemoved}
                                reportFileName={reportRotationCoordinatorsFileName}
                                fileName={rotationCoordinatorsFileName}
                                uploadTitle={"Rotation Coordinators"}
                                headerValues={rotationCoordinatorHeaderValues}
                                exampleBodyValues={rotationCoordinatorExampleBodyValues}
                                inputBackgroundColor={theme.palette.RCData.primary}
                            />
                        )}
                        {step === 2 && (
                            <UploadInput
                                ref={EPAsUploadButtonRef}
                                onDataLoaded={onEPADataLoaded}
                                onDataRemoved={onEPAsDataRemoved}
                                reportFileName={reportEPAsFileName}
                                fileName={EPAsFileName}
                                uploadTitle={"EPAs"}
                                headerValues={EPAsHeaderValues}
                                exampleBodyValues={EPAsExampleBodyValues}
                                inputBackgroundColor={theme.palette.EPAData.primary}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                    {rotations.length > 0 && (
                        <TablesList
                            key='tables'
                            initial='collapsed'
                            animate='open'
                            exit='collapsed'
                            variants={{
                                open: { opacity: 1, height: "auto" },
                                collapsed: { opacity: 0, height: 0 },
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <TableFilters
                                blockValues={rotations
                                    ?.map((rot) => rot.Block)
                                    .filter((block, index, self) => self.indexOf(block) === index)
                                    .sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")))}
                                blockSelected={blockFilter}
                                handleBlockFilterChange={handleBlockFilterChange}
                                programValues={rotations
                                    ?.map((rot) => rot.TraineeProgram)
                                    .filter((program, index, self) => self.indexOf(program) === index)
                                    .sort()}
                                programSelected={programFilter}
                                handleProgramFilterChange={handleProgramFilterChange}
                                excludedRotationValues={rotations
                                    ?.map((rot) => rot.Rotation)
                                    .filter((rot, index, self) => self.indexOf(rot) === index)
                                    .sort()}
                                excludedRotations={excludedRotations}
                                handleExcludedRotationsFilterChange={handleExcludedRotationsFilterChange}
                            />
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
                                    rotationsData={rotations?.filter((rot) => rotationFilterScreening(rot))}
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
                                    rotationsData={juniorRotations?.filter((rot) => rotationFilterScreening(rot))}
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
                                    rotationsData={seniorRotations?.filter((rot) => rotationFilterScreening(rot))}
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
                                    rotationsData={juniorAndSeniorRotations?.filter((rot) =>
                                        rotationFilterScreening(rot)
                                    )}
                                    rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
                                    EPADataAvailable={EPAs.length > 0}
                                    groupType='Juniors and Seniors'
                                />
                            </TableSection>
                        </TablesList>
                    )}
                </AnimatePresence>
                <Footer>
                    <div>
                        Notice an issue?{" "}
                        <a href='mailto:ruse.marshall@gmail.com; marshall.ruse@utoronto.ca?subject=Issue Report: Rotation Coordinator Report Formatter'>
                            Contact me.
                        </a>
                    </div>
                    <div className='source'>
                        <a href='https://github.com/MarshallRuse/rotation-coordinator-data-formatter' target='_blank'>
                            <GitHub />
                            Source
                        </a>
                    </div>
                </Footer>
            </PageColumn>
        </>
    );
}

export default App;
