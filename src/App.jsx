import { useState } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PageColumn } from "./components/StyledComponents";
import UploadStepper from "./components/UploadStepper";
import RotationUploadInput from "./components/upload-inputs/RotationUploadInput";
import AllRotationsDataGrid from "./components/tables/AllRotationsDataGrid";
import GroupedResidentsDataGrid from "./components/tables/GroupedResidentsDataGrid";

const TableSection = styled("div")({
    marginTop: "2rem",
    width: "100%",
});

function App() {
    const [rotations, setRotations] = useState([]);
    const [juniorRotations, setJuniorRotations] = useState([]);
    const [seniorRotations, setSeniorRotations] = useState([]);
    const [juniorAndSeniorRotations, setJuniorAndSeniorRotations] = useState([]);

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

    const onRotationsDataLoaded = (data) => {
        setRotations(data);
        const uniqueRotations = groupByUniqueRotations(data);
        setJuniorRotations(filterOnlyJuniors(uniqueRotations));
        setSeniorRotations(filterOnlySeniors(uniqueRotations));
        setJuniorAndSeniorRotations(filterOnlyJuniorsAndSeniors(uniqueRotations));
    };
    return (
        <PageColumn>
            <UploadStepper />
            <RotationUploadInput onRotationsDataLoaded={onRotationsDataLoaded} />
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
                <AllRotationsDataGrid rotationsData={rotations} />
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
                <GroupedResidentsDataGrid rotationsData={juniorRotations} />
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
                <GroupedResidentsDataGrid rotationsData={seniorRotations} />
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
                <GroupedResidentsDataGrid rotationsData={juniorAndSeniorRotations} />
            </TableSection>
        </PageColumn>
    );
}

export default App;
