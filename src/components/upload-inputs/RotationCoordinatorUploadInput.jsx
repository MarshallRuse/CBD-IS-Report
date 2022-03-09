import React, { useState } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import RotationCoordinatorCSVReader from "./csv-readers/RotationCoordinatorCSVReader";

const InputContainer = styled("div")({
    width: "100%",
});

const InputLabel = styled(Typography)({
    alignSelf: "flex-start",
});

export default function RotationCoordinatorUploadInput(props) {
    const { onRotationCoordinatorDataLoaded } = props;

    const [rotationCoordinatorDataFileName, setRotationCoordinatorDataFileName] = useState(undefined);

    const rotationCoordinators = [];

    const processRotationCoordinatorDataRow = (results, parser) => {
        const { data } = results;

        const relevantData = {
            id: `${data["Rotation"]}-${data["Site"]}`,
            Rotation: data["Rotation"],
            Site: data["Site"],
            RotationCoordinator: data["Rotation Coordinator"],
            FirstName: data["First Name"],
            RotationCoordinatorEmail: data["Rotation Coordinator Email"],
            Assistant: data["Assistant"],
            AssistantEmail: data["Assistant Email"],
        };
        rotationCoordinators.push(relevantData);
    };

    const allRotationCoordinatorDataRowsProcessed = (_, file) => {
        onRotationCoordinatorDataLoaded(rotationCoordinators);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveRotationCoordinatorDataFile = (data) => {
        setRotationCoordinatorDataFileName(undefined);
    };

    return (
        <>
            <InputLabel component='h2' variant='h4' align='left'>
                Rotation Coordinators Data
            </InputLabel>
            <InputContainer>
                <RotationCoordinatorCSVReader
                    stepFunction={processRotationCoordinatorDataRow}
                    completeFunction={allRotationCoordinatorDataRowsProcessed}
                    onError={handleOnError}
                    onRemoveFile={handleOnRemoveRotationCoordinatorDataFile}
                    currentFileLoadedName={rotationCoordinatorDataFileName}
                />
            </InputContainer>
        </>
    );
}
