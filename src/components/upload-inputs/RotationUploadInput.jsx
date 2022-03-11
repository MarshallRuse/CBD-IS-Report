import { useState } from "react";
import { Info } from "@mui/icons-material";
import { motion } from "framer-motion";
import RotationCSVReader from "./csv-readers/RotationCSVReader";
import { InputContainer, InputLabel } from "../StyledComponents";
import { IconButton } from "@mui/material";

export default function RotationUploadInput(props) {
    const { onRotationsDataLoaded, onRotationsDataRemoved, reportFileName, rotationsFileName } = props;
    const [infoPanelOpen, setInfoPanelOpen] = useState(false);

    const rotations = [];

    const processRotationDataRow = (results, parser) => {
        const { data } = results;

        const relevantData = {
            id: `${data["Power ID"]}-${data["Period"]}`,
            LastName: data["LastName"],
            FirstName: data["First Name"],
            Resident: `${data["LastName"].toUpperCase()}, ${data["First Name"]}`,
            Email: data["Email"],
            PGY: data["PGY"],
            TraineeProgram: data["Trainee Program"],
            Base: data["Base"],
            Hospital: data["Hospital"],
            Rotation: data["Rotation"],
            Team: data["Team"] === "null" ? "" : data["Team"],
            RotationStartDate: data["Rotation Start Date"],
            Block: data["Period"],
        };
        rotations.push(relevantData);
    };

    const allRotationDataRowsProcessed = () => {
        onRotationsDataLoaded(rotations);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveRotationDataFile = (data) => {
        onRotationsDataRemoved();
    };

    return (
        <>
            <InputContainer>
                <InputLabel component='h2' variant='h4' align='left' color='textPrimary'>
                    Rotations Data
                    <IconButton size='large' onClick={() => setInfoPanelOpen(!infoPanelOpen)}>
                        <Info color='primary' />
                    </IconButton>
                </InputLabel>
                <RotationCSVReader
                    stepFunction={processRotationDataRow}
                    completeFunction={allRotationDataRowsProcessed}
                    onError={handleOnError}
                    onRemoveFile={handleOnRemoveRotationDataFile}
                    reportFileName={reportFileName}
                    currentFileLoadedName={rotationsFileName}
                />
            </InputContainer>
            <motion.section
                key='Rotation-Coordinator-Info-Section'
                animate={infoPanelOpen ? "open" : "collapsed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum incidunt ducimus ipsum rerum recusandae
                non aliquid inventore delectus odio odit, pariatur soluta hic reprehenderit numquam nostrum, repellendus
                iste amet perspiciatis!
            </motion.section>
        </>
    );
}
