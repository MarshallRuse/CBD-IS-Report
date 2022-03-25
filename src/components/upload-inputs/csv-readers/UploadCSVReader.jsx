import React, { useEffect, forwardRef } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CSVReader } from "react-papaparse";

const UploadCSVReader = forwardRef((props, ref) => {
    const { reportFileName, currentFileLoadedName, onRemoveFile, inputBackgroundColor } = props;
    const theme = useTheme();

    const handleOpenDialog = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (ref?.current) {
            ref?.current.open(e);
        }
    };

    const handleOnFileLoad = (data) => {
        let file;
        if (ref?.current && ref?.current.inputFileRef.current.files.length > 0) {
            file = ref?.current.inputFileRef.current.files[0];
        }

        props.onFileLoad(data, file);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleRemoveFile = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (ref.current) {
            ref?.current.removeFile();
        }
        onRemoveFile();
    };

    useEffect(() => {
        if (!currentFileLoadedName && ref?.current) {
            ref?.current.removeFile();
        }
    }, [currentFileLoadedName]);

    useEffect(() => {
        const fileLoaded = ref?.current.inputFileRef?.current?.files?.[0];
        if (fileLoaded) {
            reportFileName(fileLoaded.name);
        }
    }, [ref?.current, ref?.current?.inputFileRef.current.files.length]);

    return (
        <CSVReader
            ref={ref}
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
                            backgroundColor: inputBackgroundColor,
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
                        <Button
                            onClick={handleRemoveFile}
                            variant='outlined'
                            color='secondary'
                            sx={{ minWidth: "7em" }}
                        >
                            {!currentFileLoadedName ? <CircularProgress size={30} /> : "Remove"}
                        </Button>
                    )}
                </aside>
            )}
        </CSVReader>
    );
});

UploadCSVReader.displayName = "UploadCSVReader";

export default UploadCSVReader;
