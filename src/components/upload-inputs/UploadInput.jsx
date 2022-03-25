import { useState, forwardRef } from "react";
import { IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Info } from "@mui/icons-material";
import UploadCSVReader from "./csv-readers/UploadCSVReader";
import UploadStatusMessage from "../UploadStatusMessage";
import { InputContainer, InputLabel, InfoPanel } from "../StyledComponents";
import ExampleTable from "../tables/ExampleTable";

const HeaderListItem = styled("li")((props) => ({
    backgroundColor: props.missingValue ? props.theme.palette.secondary.main : "none",
    borderRadius: "4px",
    color: props.missingValue ? "#fff" : "inherit",
    padding: "0.25em 0.5em",
    width: "calc(100% - 30px)",
    "&::marker": {
        color: props.theme.palette.text.primary,
    },
}));

const UploadInput = forwardRef((props, ref) => {
    const {
        onDataLoaded,
        onDataRemoved,
        reportFileName,
        fileName,
        uploadTitle,
        headerValues,
        exampleBodyValues,
        filterNulls = true,
        inputBackgroundColor = "none",
    } = props;
    const [infoPanelOpen, setInfoPanelOpen] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [missingHeaders, setMissingHeaders] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    const dataRows = [];
    let headersEstablished = false;
    let missedHeaders;

    const filterNullValues = (obj) => {
        const newObj = { ...obj };
        for (const property in newObj) {
            if (newObj[property] === "null") {
                newObj[property] = "";
            }
        }
        return newObj;
    };

    const processDataRow = (results, parser) => {
        let { data } = results;

        // only need to establish headers once
        if (!headersEstablished) {
            missedHeaders = headerValues
                .filter((headerVal) => headerVal.uploadKey && !results.meta.fields.includes(headerVal.uploadKey))
                .map((val) => val.uploadKey);
            headersEstablished = true;
        }

        if (filterNulls) {
            data = filterNullValues(data);
        }
        const relevantData = {};

        // relevantData properties are drawn from array of header value mappings supplied as props.
        // Header value mappings are defined in uploadValueMap.js
        // the headerValues array will either have an "uploadKey" property if the data exists in the uploaded file,
        // or "transformationFunction" to return some value if its a transformation of some other values
        headerValues.forEach((hvObj) => {
            relevantData[hvObj.outputKey] = hvObj.uploadKey
                ? data[hvObj.uploadKey]
                : hvObj.transformationFunction(data);
        });

        dataRows.push(relevantData);
    };

    const allDataRowsProcessed = (_, file) => {
        onDataLoaded(dataRows, missedHeaders);
        setMissingHeaders(missedHeaders);
        if (missedHeaders.length > 0) {
            setAlertMessage("Upload Error: Missing Headers");
            setAlertType("error");
            setInfoPanelOpen(true);
        } else {
            setAlertMessage(`${uploadTitle} uploaded!`);
            setAlertType("success");
        }
        setUploaded(true);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveDataFile = (data) => {
        onDataRemoved();
        setUploaded(false);
        setMissingHeaders([]);
        setAlertMessage("");
        setAlertType("");
    };

    return (
        <>
            <InputContainer>
                <InputLabel component='h2' variant='h4' align='left'>
                    {uploadTitle}
                    <IconButton size='large' onClick={() => setInfoPanelOpen(!infoPanelOpen)}>
                        <Info color={infoPanelOpen ? "primary" : "default"} />
                    </IconButton>
                    <UploadStatusMessage message={alertMessage} display={uploaded} alertType={alertType} />
                </InputLabel>

                <UploadCSVReader
                    ref={ref}
                    stepFunction={processDataRow}
                    completeFunction={allDataRowsProcessed}
                    onError={handleOnError}
                    onRemoveFile={handleOnRemoveDataFile}
                    reportFileName={reportFileName}
                    currentFileLoadedName={fileName}
                    inputBackgroundColor={inputBackgroundColor}
                />
            </InputContainer>
            <InfoPanel
                key={`${uploadTitle.replace(" ", "-")}-Info-Section`}
                animate={infoPanelOpen ? "open" : "collapsed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                }}
                initial='collapsed'
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
                <Typography variant='h5' component='h3' color='primary' sx={{ marginBottom: "1em" }}>
                    <strong>{uploadTitle}</strong> Upload Instructions
                </Typography>
                <Typography>The file uploaded must be a CSV file (i.e. ".csv" file extension)</Typography>
                <Typography>The data must have the following headers:</Typography>
                <ul style={{ columnCount: Math.ceil(headerValues.filter((hv) => hv.uploadKey).length / 4) }}>
                    {headerValues
                        .filter((hv) => hv.uploadKey)
                        .map((hv) => (
                            <HeaderListItem
                                key={`headers-required-${hv.uploadKey}`}
                                missingValue={missingHeaders.includes(hv.uploadKey)}
                            >
                                {hv.uploadKey}
                            </HeaderListItem>
                        ))}
                </ul>
                <Typography>Together with values it will look something like this:</Typography>
                <ExampleTable headerValues={headerValues} bodyValues={exampleBodyValues} />
            </InfoPanel>
        </>
    );
});

UploadInput.displayName = "UploadInput";

export default UploadInput;
