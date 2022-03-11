import React, { useState, useEffect, createRef } from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CSVReader } from "react-papaparse";

const rotationCoordinatorUploadButtonRef = createRef();

export default function RotationCoordinatorCSVReader(props) {
    const { reportFileName, currentFileLoadedName, onRemoveFile } = props;
    const theme = useTheme();

    const handleOpenDialog = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (rotationCoordinatorUploadButtonRef.current) {
            rotationCoordinatorUploadButtonRef.current.open(e);
        }
    };

    const handleOnFileLoad = (data) => {
        let file;
        if (
            rotationCoordinatorUploadButtonRef.current &&
            rotationCoordinatorUploadButtonRef.current.inputFileRef.current.files.length > 0
        ) {
            file = rotationCoordinatorUploadButtonRef.current.inputFileRef.current.files[0];
        }

        props.onFileLoad(data, file);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleRemoveFile = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (rotationCoordinatorUploadButtonRef.current) {
            rotationCoordinatorUploadButtonRef.current.removeFile();
        }
        onRemoveFile();
    };

    useEffect(() => {
        const fileLoaded = rotationCoordinatorUploadButtonRef.current.inputFileRef?.current?.files?.[0];
        if (fileLoaded) {
            reportFileName(fileLoaded.name);
        }
    }, [
        rotationCoordinatorUploadButtonRef.current,
        rotationCoordinatorUploadButtonRef.current?.inputFileRef.current.files.length,
    ]);

    return (
        <CSVReader
            ref={rotationCoordinatorUploadButtonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            noProgressBar
            config={{
                skipEmptyLines: true,
                header: true,
                //worker: true,
                step: props.stepFunction,
                complete: props.completeFunction,
                beforeFirstChunk: function () {
                    console.log("FIRST!");
                },
            }}
        >
            {({ file }) => (
                <aside
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 10,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: theme.palette.RCData.primary,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "#ccc",
                            borderRadius: "4px",
                            color: "#808080",
                            flex: 1,
                            height: 45,
                            lineHeight: 2.5,
                            margin: "5px",
                            paddingLeft: 13,
                            paddingTop: 3,
                        }}
                    >
                        {file ? file.name : currentFileLoadedName ? currentFileLoadedName : ""}
                    </div>
                    {!file && !currentFileLoadedName && (
                        <Button onClick={handleOpenDialog} variant='contained'>
                            Browse file
                        </Button>
                    )}
                    {(file || currentFileLoadedName) && (
                        <Button onClick={handleRemoveFile} variant='outlined' color='secondary'>
                            Remove
                        </Button>
                    )}
                </aside>
            )}
        </CSVReader>
    );
}
