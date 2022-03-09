import React, { useState } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import EPACSVReader from "./csv-readers/EPACSVReader";

const InputContainer = styled("div")({
    width: "100%",
});

const InputLabel = styled(Typography)({
    alignSelf: "flex-start",
});

export default function EPAUploadInput(props) {
    const { onEPADataLoaded } = props;

    const [EPADataFileName, setEPADataFileName] = useState(undefined);

    const EPAs = [];

    const processEPADataRow = (results, parser) => {
        const { data } = results;

        const relevantData = {
            id: `${data["Rotation"]}-${data["Stage"]}`,
            Rotation: data["Rotation"],
            Stage: data["Stage"],
            Priority: data["Priority"],
            DoWhenYouCan: data["Do When You Can"],
            Optional: data["Optional"],
            RotationCards: data["Rotation Cards"],
        };
        EPAs.push(relevantData);
    };

    const allEPADataRowsProcessed = (_, file) => {
        onEPADataLoaded(EPAs);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveEPADataFile = (data) => {
        setEPADataFileName(undefined);
    };

    return (
        <>
            <InputLabel component='h2' variant='h4' align='left'>
                EPA Data
            </InputLabel>
            <InputContainer>
                <EPACSVReader
                    stepFunction={processEPADataRow}
                    completeFunction={allEPADataRowsProcessed}
                    onError={handleOnError}
                    onRemoveFile={handleOnRemoveEPADataFile}
                    currentFileLoadedName={EPADataFileName}
                />
            </InputContainer>
        </>
    );
}
