import React, { useState, useEffect, createRef } from "react";
import { Button } from "@mui/material";
import { CSVReader } from "react-papaparse";

const EPAUploadButtonRef = createRef();

export default function EPACSVReader(props) {
    const handleOpenDialog = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (EPAUploadButtonRef.current) {
            EPAUploadButtonRef.current.open(e);
        }
    };

    const handleOnFileLoad = (data) => {
        let file;
        if (EPAUploadButtonRef.current && EPAUploadButtonRef.current.inputFileRef.current.files.length > 0) {
            file = EPAUploadButtonRef.current.inputFileRef.current.files[0];
        }

        props.onFileLoad(data, file);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleRemoveFile = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (EPAUploadButtonRef.current) {
            EPAUploadButtonRef.current.removeFile();
        }
        props.onRemoveFile();
    };

    return (
        <CSVReader
            ref={EPAUploadButtonRef}
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
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "#ccc",
                            borderRadius: "4px",
                            flex: 1,
                            height: 45,
                            lineHeight: 2.5,
                            margin: "5px",
                            paddingLeft: 13,
                            paddingTop: 3,
                        }}
                    >
                        {file ? file.name : props.currentFileLoadedName ? props.currentFileLoadedName : ""}
                    </div>
                    {!file && !props.currentFileLoadedName && (
                        <Button onClick={handleOpenDialog} variant='contained'>
                            Browse file
                        </Button>
                    )}
                    {(file || props.currentFileLoadedName) && (
                        <Button onClick={handleRemoveFile} variant='outlined' color='secondary'>
                            Remove
                        </Button>
                    )}
                </aside>
            )}
        </CSVReader>
    );
}
