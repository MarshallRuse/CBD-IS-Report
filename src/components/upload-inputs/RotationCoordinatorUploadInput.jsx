import { useState } from "react";
import { motion } from "framer-motion";
import RotationCoordinatorCSVReader from "./csv-readers/RotationCoordinatorCSVReader";
import { InputContainer, InputLabel } from "../StyledComponents";

export default function RotationCoordinatorUploadInput(props) {
    const {
        onRotationCoordinatorDataLoaded,
        onRotationCoordinatorsDataRemoved,
        reportFileName,
        rotationCoordinatorsFileName,
    } = props;

    const [infoPanelOpen, setInfoPanelOpen] = useState(false);

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
        onRotationCoordinatorsDataRemoved();
    };

    return (
        <>
            <InputContainer>
                <InputLabel component='h2' variant='h4' align='left'>
                    Rotation Coordinators Data
                </InputLabel>
                <RotationCoordinatorCSVReader
                    stepFunction={processRotationCoordinatorDataRow}
                    completeFunction={allRotationCoordinatorDataRowsProcessed}
                    onError={handleOnError}
                    onRemoveFile={handleOnRemoveRotationCoordinatorDataFile}
                    reportFileName={reportFileName}
                    currentFileLoadedName={rotationCoordinatorsFileName}
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
            ></motion.section>
        </>
    );
}
