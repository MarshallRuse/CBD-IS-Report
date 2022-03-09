import { useState } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PageColumn } from "./components/StyledComponents";
import UploadStepper from "./components/UploadStepper";
import RotationUploadInput from "./components/upload-inputs/RotationUploadInput";
import RotationCoordinatorUploadInput from "./components/upload-inputs/RotationCoordinatorUploadInput";
import AllRotationsDataGrid from "./components/tables/AllRotationsDataGrid";
import GroupedResidentsDataGrid from "./components/tables/GroupedResidentsDataGrid";

const TableSection = styled("div")({
    marginTop: "2rem",
    width: "100%",
});

function App() {
    const [step, setStep] = useState(0);
    const [canProceed, setCanProceed] = useState(false);
    const [rotations, setRotations] = useState([]);
    const [juniorRotations, setJuniorRotations] = useState([]);
    const [seniorRotations, setSeniorRotations] = useState([]);
    const [juniorAndSeniorRotations, setJuniorAndSeniorRotations] = useState([]);
    const [rotationCoordinators, setRotationCoordinators] = useState([]);
    const [EPAs, setEPAs] = useState([]);

    // Stepper Controls
    const changeActiveStep = (step) => {
        setStep(step);
        if (step === 0 && rotations.length > 0) {
            setCanProceed(true);
        } else if (step === 0 && rotations.length === 0) {
            setCanProceed(false);
        } else if (step === 1 && rotationCoordinators.length > 0) {
            setCanProceed(true);
        } else if (step === 1 && rotationCoordinators.length === 0) {
            setCanProceed(false);
        } else if (step === 2 && EPAs.length > 0) {
            setCanProceed(true);
        } else if (step === 2 && EPAs.length === 0) {
            setCanProceed(false);
        }
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
            }));

        rotationsData.forEach((row) => {
            const uniqueRotationIndex = uniqueRotations.findIndex(
                (rot) => `${rot.Rotation}-${rot.Hospital}` === `${row.Rotation}-${row.Hospital}`
            );
            if (row.Team !== "") {
                row.Resident += ` (${row.Team})`;
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
        // Move on to next step - uploading Rotation Coordinator Data
        setCanProceed(true);
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
        console.log("rots!: ", rots);
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
        // Move on to next step - uploading EPA Data
        setCanProceed(true);
    };
    return (
        <PageColumn>
            <UploadStepper activeStep={step} changeActiveStep={changeActiveStep} canProceed={canProceed} />
            {step === 0 && <RotationUploadInput onRotationsDataLoaded={onRotationsDataLoaded} />}
            {step === 1 && (
                <RotationCoordinatorUploadInput onRotationCoordinatorDataLoaded={onRotationCoordinatorDataLoaded} />
            )}
            {rotations.length > 0 && (
                <>
                    <TableSection>
                        <Typography
                            variant='h4'
                            component='h2'
                            align='center'
                            color='primary'
                            style={{ paddingBottom: "2rem" }}
                        >
                            All Rotations Uploaded
                        </Typography>
                        <AllRotationsDataGrid
                            rotationsData={rotations}
                            rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
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
                            Junior Rotations
                        </Typography>
                        <GroupedResidentsDataGrid
                            rotationsData={juniorRotations}
                            rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
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
                            Senior Rotations
                        </Typography>
                        <GroupedResidentsDataGrid
                            rotationsData={seniorRotations}
                            rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
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
                            Junior and Senior Rotations
                        </Typography>
                        <GroupedResidentsDataGrid
                            rotationsData={juniorAndSeniorRotations}
                            rotationCoordinatorDataAvailable={rotationCoordinators.length > 0}
                        />
                    </TableSection>
                </>
            )}
        </PageColumn>
    );
}

export default App;
