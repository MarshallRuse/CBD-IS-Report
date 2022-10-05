import React, { useState } from "react";
import { IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Info } from "@mui/icons-material";
import { motion } from "framer-motion";
import UploadCSVReader from "./csv-readers/UploadCSVReader";
import UploadStatusMessage from "../UploadStatusMessage";
import { InputContainer, InfoPanel } from "../StyledComponents";
import ExampleTable from "../tables/ExampleTable";
import type { UploadHeaderTransformation } from "../../lib/interfaces/UploadValueMaps";
import type { TableFilter } from "../../lib/interfaces/TableFilters";
import type { UploadMessage } from "../../lib/interfaces/UploadMessage";
import type { IGenericObject } from "../../lib/interfaces/IGenericObject";
import { UploadMetaData } from "../../lib/interfaces/UploadMetaData";

type UploadInputProps = {
    onDataLoaded: (dataRows: any[], missedHeaders: string[], filters: TableFilter[]) => void;
    onMetaDataChanged: (uploadMessage: UploadMessage) => void;
    onDataRemoved: () => void;
    uploadMetaData: UploadMetaData; // <======= RESUME HERE
    uploadTitle: string;
    headerValues: UploadHeaderTransformation[];
    exampleBodyValues: any[];
    filterNulls?: boolean;
    inputBackgroundColor?: string | null;
    filters?: TableFilter[];
    additionalInfo?: string[];
};

const UploadInput = ({
    onDataLoaded,
    onMetaDataChanged,
    onDataRemoved,
    uploadMetaData,
    uploadTitle,
    headerValues,
    exampleBodyValues,
    filterNulls = true,
    inputBackgroundColor = null,
    filters = [],
    additionalInfo = [],
}: UploadInputProps) => {
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [infoPanelOpen, setInfoPanelOpen] = useState(false);
    const [missingHeaders, setMissingHeaders] = useState<string[]>([]);
    const [processingDone, setProcessingDone] = useState(false);

    const dataRows: IGenericObject[] = [];
    let headersEstablished = false;
    let missedHeaders: string[];
    const filtersCopy = [...filters];

    const filterNullValues = (obj: IGenericObject): IGenericObject => {
        const newObj = { ...obj };
        for (const property in newObj) {
            if (newObj[property] === "null" || newObj[property] === "N/A") {
                newObj[property] = "";
            }
        }
        return newObj;
    };

    const flattenHeaders = (headers: UploadHeaderTransformation[]): string[] => {
        const flatHeaders: string[] = [];
        headers.forEach((h) => {
            if (h.uploadKey) {
                flatHeaders.push(h.uploadKey);
            } else if ("uploadKeys" in h && h.uploadKeys && h.uploadKeys.length > 0) {
                h.uploadKeys.forEach((key) => flatHeaders.push(key));
            }
        });
        return flatHeaders.filter((val, ind, self) => self.indexOf(val) === ind).sort();
    };

    const processDataRow = (results) => {
        let { data } = results;

        // only need to establish headers once
        if (!headersEstablished) {
            missedHeaders = flattenHeaders(headerValues).filter(
                (headerVal) => !results.meta.fields.includes(headerVal)
            );
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
            if (hvObj.uploadKey && hvObj.transformationFunction === undefined) {
                relevantData[hvObj.outputKey] = data[hvObj.uploadKey];
            } else if (hvObj.transformationFunction !== undefined) {
                relevantData[hvObj.outputKey] = hvObj.transformationFunction(data);
            }
        });

        if (filtersCopy.length > 0) {
            for (const filter of filtersCopy) {
                const headerValueObject = headerValues.find((hv) => hv.outputKey === filter.field);
                if (headerValueObject) {
                    let val: string | number | boolean | null = null;
                    if (headerValueObject.transformationFunction !== undefined) {
                        val = headerValueObject.transformationFunction(data);
                    } else if (headerValueObject.uploadKey !== undefined) {
                        val = data[headerValueObject.uploadKey];
                    }

                    if (val !== null && !filter.options.includes(val)) {
                        filter.options.push(val);
                    }
                }
            }
        }

        dataRows.push(relevantData);
    };

    const allDataRowsProcessed = () => {
        onDataLoaded(dataRows, missedHeaders, filtersCopy);
        setProcessingDone(true);
        setMissingHeaders(missedHeaders);
        if (missedHeaders.length === 0) {
            onMetaDataChanged({
                uploadMessageText: `${uploadTitle} uploaded!`,
                uploadMessageType: "success",
                displayMessaging: true,
            });
        } else {
            onMetaDataChanged({
                uploadMessageText: "Upload Error: Missing Headers",
                uploadMessageType: "error",
                displayMessaging: true,
            });
            setInfoPanelOpen(true);
        }
    };

    const handleOnError = (err, file, inputElem, reason) => {
        onMetaDataChanged({
            fileName: "",
            uploadMessageText: "Upload Error - Check Console",
            uploadMessageType: "error",
            displayMessaging: true,
        });
        console.log(err);
    };

    const handleOnLoadDataFile = (fileName: string) => {
        onMetaDataChanged({
            fileName,
        });
    };

    const handleOnRemoveDataFile = (data) => {
        onDataRemoved();
        onMetaDataChanged({
            fileName: "",
            uploadMessageText: "",
            uploadMessageType: "",
            displayMessaging: false,
        });
        setProcessingDone(false);
        setMissingHeaders([]);
    };

    return (
        <>
            <InputContainer>
                <h2 className='text-lg mb-4'>
                    {uploadTitle}
                    <IconButton size='large' onClick={() => setInfoPanelOpen(!infoPanelOpen)}>
                        <Info color={infoPanelOpen ? "primary" : "inherit"} />
                    </IconButton>
                    <UploadStatusMessage
                        message={uploadMetaData.uploadMessageText}
                        display={uploadMetaData.displayMessaging}
                        alertType={uploadMetaData.uploadMessageType}
                    />
                </h2>

                <UploadCSVReader
                    fileName={uploadMetaData.fileName}
                    stepFunction={processDataRow}
                    processingDone={processingDone}
                    completeFunction={allDataRowsProcessed}
                    onError={handleOnError}
                    onFileLoaded={handleOnLoadDataFile}
                    onRemoveFile={handleOnRemoveDataFile}
                    inputBackgroundColor={inputBackgroundColor}
                />
            </InputContainer>
            <motion.section
                key={`${uploadTitle.replace(" ", "-")}-Info-Section`}
                animate={infoPanelOpen ? "open" : "collapsed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0, overflow: "hidden" },
                }}
                initial='collapsed'
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
                <InfoPanel>
                    <Typography variant='h5' component='h3' color='primary' sx={{ marginBottom: "1em" }}>
                        <strong>{uploadTitle}</strong> Upload Instructions
                    </Typography>
                    <Typography>The file uploaded must be a CSV file (i.e. ".csv" file extension)</Typography>
                    <Typography>The data must have the following headers:</Typography>
                    <ul
                        style={{
                            columnCount: Math.ceil(
                                headerValues.filter((hv) => hv.uploadKey).length / (smallScreen ? 8 : 4)
                            ),
                        }}
                    >
                        {flattenHeaders(headerValues).map((hv) => (
                            <li
                                className={`rounded-md py-1 px-2 ${
                                    missingHeaders.includes(hv) ? "bg-red-500 text-white" : "bg-transparent"
                                }`}
                                key={`headers-required-${hv}`}
                            >
                                {hv}
                            </li>
                        ))}
                    </ul>
                    <Typography>Together with values it will look something like this:</Typography>
                    <ExampleTable headerValues={headerValues} bodyValues={exampleBodyValues} />
                    {additionalInfo?.length > 0 && (
                        <>
                            <Typography sx={{ pt: "2rem" }}>
                                <strong>{additionalInfo.length === 1 ? "Note:" : "Notes"}</strong>
                            </Typography>
                            <ul>
                                {additionalInfo.map((info) => (
                                    <li>
                                        <em>{info}</em>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </InfoPanel>
            </motion.section>
        </>
    );
};

export default UploadInput;
