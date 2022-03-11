import EPACSVReader from "./csv-readers/EPACSVReader";
import { InputContainer, InputLabel } from "../StyledComponents";

export default function EPAUploadInput(props) {
    const { onEPADataLoaded, onEPAsDataRemoved, reportFileName, EPAsFileName } = props;

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
        onEPAsDataRemoved();
    };

    return (
        <InputContainer>
            <InputLabel component='h2' variant='h4' align='left'>
                EPA Data
            </InputLabel>

            <EPACSVReader
                stepFunction={processEPADataRow}
                completeFunction={allEPADataRowsProcessed}
                onError={handleOnError}
                onRemoveFile={handleOnRemoveEPADataFile}
                reportFileName={reportFileName}
                currentFileLoadedName={EPAsFileName}
            />
        </InputContainer>
    );
}
