import React, { useState } from "react";
import { Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Footer, Header, LinkTag, PageColumn, TablesList, TableSection } from "./components/StyledComponents";
import ExplanationPanel from "./components/ExplanationPanel";
import UploadStepper from "./components/UploadStepper";
import TableFilters from "./components/TableFilters";
import UploadInput from "./components/upload-inputs/UploadInput";
import AllEPAsDataGrid from "./components/tables/AllEPAsDataGrid";
import {
    elentraHeaderValues,
    rotationExampleBodyValues,
    residentHeaderValues,
    rotationCoordinatorExampleBodyValues,
} from "./uploadValueMap.js";
import getAcademicYear from "./lib/utils/getAcademicYear";
import type { ElentraAugmentedUploadData, IElentraUploadData } from "./lib/interfaces/ElentraUploadData";
import type { ResidentUploadData } from "./lib/interfaces/ResidentUploadData";
import type { TableFilter } from "./lib/interfaces/TableFilters";
import { UploadMetaData } from "./lib/interfaces/UploadMetaData";
import { ResidentData, ResidentsData } from "./lib/interfaces/ResidentData";

dayjs.extend(isBetween);

const variants = {
    enter: (direction: number) => {
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
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
};

const defaultMetaDataObject: UploadMetaData = {
    displayMessaging: false,
    fileName: "",
    uploadMessageText: "",
    uploadMessageType: "",
};

function App() {
    // stepper state
    const [[step, direction], setStep] = useState([0, 0]);
    const [canProceed, setCanProceed] = useState(false);
    // filters state
    const [elentraFilters, setElentraFilters] = useState<TableFilter[]>([
        {
            field: "AssessorFullname",
            options: [],
            selectedExclusions: [],
        },
    ]);

    // uploads state
    const [elentraData, setElentraData] = useState<IElentraUploadData[]>([]);
    const [elentraUploadMetaData, setElentraUploadMetaData] = useState({ ...defaultMetaDataObject });
    const [residents, setResidents] = useState<ResidentsData>({});
    const [residentUploadMetaData, setResidentUploadMetaData] = useState({
        ...defaultMetaDataObject,
    });

    // Stepper Controls
    const changeActiveStep = (direction: number) => {
        const newStep = step + direction;
        setStep([step + direction, direction]);
        if (newStep === 0 && elentraData.length > 0) {
            setCanProceed(true);
        } else if (newStep === 0 && elentraData.length === 0) {
            setCanProceed(false);
        } else if (newStep === 1 && residents && Object.keys(residents).length > 0) {
            setCanProceed(true);
        } else if (newStep === 1 && residents && Object.keys(residents).length === 0) {
            setCanProceed(false);
        }
    };

    // Filter controls
    const handleExcludedAssessorsFilterChange = (asses) => {
        const elentraFiltersCopy = [...elentraFilters];
        const assessorsFilter = elentraFiltersCopy.find((filter) => filter.field === "AssessorFullname");
        if (assessorsFilter) {
            assessorsFilter.selectedExclusions = asses;
            setElentraFilters(elentraFiltersCopy);
        }
    };

    // Elentra Upload handler
    const onElentraDataLoaded = (
        data: IElentraUploadData[],
        missingHeaders: string[] = [],
        filterValues: TableFilter[] = []
    ) => {
        setElentraData(data);
        setElentraFilters(filterValues);
        // Move on to next step - uploading Rotation Coordinator Data
        if (missingHeaders.length === 0) {
            setCanProceed(true);
        }
    };

    const onElentraFileMetaDataChanged = (metadata) => {
        setElentraUploadMetaData((prevMetaData) => ({ ...prevMetaData, ...metadata }));
    };

    const onElentraDataRemoved = () => {
        setElentraData([]);
        setElentraUploadMetaData({ ...defaultMetaDataObject });
        setResidents({});
        setResidentUploadMetaData({ ...defaultMetaDataObject });
    };

    const getTrainingLevelDateOfEncounter = (resident: ResidentData, DOE: string): string => {
        const academicYear = getAcademicYear(DOE, "DD-MMM-YY");
        const dayjsDOE = dayjs(DOE, "DD-MMM-YY");
        const residentLevelAtDOE = resident.TrainingLevels.find((residentYear) =>
            dayjsDOE.isBetween(residentYear.TermStartDate, residentYear.TermEndDate)
        )?.Level;
        if (residentLevelAtDOE !== undefined) {
            return `${residentLevelAtDOE} (${academicYear})`;
        } else {
            return `Unknown ${academicYear}`;
        }
    };

    const getTrainingLevelCurrentYear = (resident: ResidentData): string => {
        const currentDate = dayjs();
        const residentLevelCurrent = resident.TrainingLevels.find((residentYear) =>
            currentDate.isBetween(residentYear.TermStartDate, residentYear.TermEndDate)
        )?.Level;
        if (residentLevelCurrent !== undefined) {
            return residentLevelCurrent;
        } else {
            // if current date after resident training period
            let lastYear: string | null = null;
            let timeSince = Infinity;
            resident.TrainingLevels.forEach((residentTrainingYear) => {
                if (lastYear === null) {
                    lastYear = residentTrainingYear.Level;
                }
                const timeSinceTrainingYear = currentDate.diff(dayjs(residentTrainingYear.TermEndDate), "days");

                if (timeSinceTrainingYear < timeSince) {
                    timeSince = timeSinceTrainingYear;
                    lastYear = residentTrainingYear.Level;
                }
            });

            if (lastYear !== null) {
                return lastYear;
            } else {
                return "Unknown";
            }
        }
    };

    const augmentElentraWithResidents = (
        elentraDataToAugment: IElentraUploadData[],
        residents: ResidentsData
    ): ElentraAugmentedUploadData[] => {
        const epas = elentraDataToAugment.map((row) => {
            const thisEPAsResidentData = residents[row.ElentraID];
            return {
                ...row,
                TrainingLevelDateOfEncounter: thisEPAsResidentData
                    ? getTrainingLevelDateOfEncounter(thisEPAsResidentData, row.DateOfEncounter)
                    : "",
                TrainingLevelCurrentYear: thisEPAsResidentData ? getTrainingLevelCurrentYear(thisEPAsResidentData) : "",
            };
        });
        return epas;
    };

    const processResidentData = (data: ResidentUploadData[]): ResidentsData => {
        const resData: ResidentsData = {};
        data.forEach((residentRow) => {
            if (!resData[residentRow.ElentraID]) {
                resData[residentRow.ElentraID] = {
                    TraineeID: residentRow.TraineeID,
                    Trainee: residentRow.Trainee,
                    POWERID: residentRow.POWERID,
                    Program: residentRow.Program,
                    TrainingLevels: [
                        {
                            Level: residentRow.Level,
                            Base: residentRow.Base,
                            TermStartDate: residentRow.TermStartDate,
                            TermEndDate: residentRow.TermEndDate,
                        },
                    ],
                };
            } else {
                resData[residentRow.ElentraID].TrainingLevels.push({
                    Level: residentRow.Level,
                    Base: residentRow.Base,
                    TermStartDate: residentRow.TermStartDate,
                    TermEndDate: residentRow.TermEndDate,
                });
            }
        });
        return resData;
    };

    // Rotation Coordinator Uplaod Handler
    const setResidentDataLoaded = (data: ResidentUploadData[], missingHeaders: string[] = []) => {
        const processedResidents = processResidentData(data);
        setResidents(processedResidents);
        const residentAugmentedElentraData = augmentElentraWithResidents(elentraData, processedResidents);
        setElentraData(residentAugmentedElentraData);

        // Move on to next step - uploading EPA Data
        if (missingHeaders.length === 0) {
            setCanProceed(true);
        }
    };

    const onResidentFileMetaDataChanged = (metadata) => {
        setResidentUploadMetaData((prevMetaData) => ({ ...prevMetaData, ...metadata }));
    };

    const onResidentDataRemoved = () => {
        setResidents({});
        setCanProceed(false);
    };

    const resetUploads = () => {
        setElentraData([]);
        setElentraUploadMetaData({ ...defaultMetaDataObject });
        setResidents({});
        setResidentUploadMetaData({ ...defaultMetaDataObject });
        setCanProceed(false);
        setStep([0, -1]);
    };

    return (
        <>
            <Header>
                <Typography variant='h1'>CBD Implementation Subcommittee Report</Typography>
            </Header>
            <PageColumn>
                <UploadStepper
                    activeStep={step}
                    changeActiveStep={changeActiveStep}
                    canProceed={canProceed}
                    canReset={elentraData.length > 0}
                    resetUploads={resetUploads}
                />
                <ExplanationPanel />
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
                                onDataLoaded={onElentraDataLoaded}
                                onDataRemoved={onElentraDataRemoved}
                                onMetaDataChanged={onElentraFileMetaDataChanged}
                                uploadMetaData={elentraUploadMetaData}
                                uploadTitle={"Elentra Data"}
                                headerValues={elentraHeaderValues}
                                exampleBodyValues={rotationExampleBodyValues}
                                filters={elentraFilters}
                            />
                        )}
                        {step === 1 && (
                            <UploadInput
                                onDataLoaded={setResidentDataLoaded}
                                onDataRemoved={onResidentDataRemoved}
                                onMetaDataChanged={onResidentFileMetaDataChanged}
                                uploadMetaData={residentUploadMetaData}
                                uploadTitle={"Residents"}
                                headerValues={residentHeaderValues}
                                exampleBodyValues={rotationCoordinatorExampleBodyValues}
                                inputBackgroundColor={"bg-cyan-100"}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                    {elentraData.length > 0 && (
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
                                excludedAssessorValues={elentraFilters
                                    .find((filter) => filter.field === "AssessorFullname")
                                    ?.options.sort()}
                                excludedAssessors={
                                    elentraFilters.find((filter) => filter.field === "AssessorFullname")
                                        ?.selectedExclusions
                                }
                                handleExcludedAssessorsFilterChange={handleExcludedAssessorsFilterChange}
                            />
                            <TableSection>
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    color='primary'
                                    style={{ paddingBottom: "2rem" }}
                                >
                                    Processed Elentra Data
                                </Typography>
                                <AllEPAsDataGrid
                                    elentraData={elentraData.filter((row) => {
                                        let passesFilter = true;
                                        for (const filter of elentraFilters) {
                                            if (filter.selectedExclusions.includes(row[filter.field])) {
                                                passesFilter = false;
                                                break;
                                            }
                                        }
                                        return passesFilter;
                                    })}
                                    residentDataAvailable={residents && Object.keys(residents).length > 0}
                                    filters={elentraFilters}
                                />
                            </TableSection>
                        </TablesList>
                    )}
                </AnimatePresence>
                <Footer>
                    <div>
                        Notice an issue?{" "}
                        <LinkTag href='mailto:ruse.marshall@gmail.com; marshall.ruse@utoronto.ca?subject=Issue Report: Rotation Coordinator Report Formatter'>
                            Contact me.
                        </LinkTag>
                    </div>
                    <div className='source'>
                        <LinkTag
                            href='https://github.com/MarshallRuse/rotation-coordinator-data-formatter'
                            target='_blank'
                        >
                            <GitHub />
                            Source
                        </LinkTag>
                    </div>
                </Footer>
            </PageColumn>
        </>
    );
}

export default App;
