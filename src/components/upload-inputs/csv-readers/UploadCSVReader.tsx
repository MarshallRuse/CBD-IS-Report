import React, { useRef } from "react";
import Papa from "papaparse";
import { CircularProgress } from "@mui/material";

type UploadCSVInputProps = {
    fileName: string;
    stepFunction: any;
    processingDone: boolean;
    completeFunction: any;
    onError: any;
    onFileLoaded: any;
    onRemoveFile: any;
    inputBackgroundColor: string | null;
};

const UploadCSVInput = ({
    fileName,
    stepFunction,
    processingDone,
    completeFunction,
    onError,
    onFileLoaded,
    onRemoveFile,
    inputBackgroundColor,
}: UploadCSVInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event) => {
        const fileObj = event.target.files?.[0];
        if (!fileObj) {
            return;
        }
        console.log("fileObj: ", fileObj);
        onFileLoaded(fileObj.name);

        event.target.value = null;

        Papa.parse(fileObj, {
            header: true,
            skipEmptyLines: true,
            step: stepFunction,
            complete: completeFunction,
        });
    };

    const simulateInputClick = () => fileInputRef.current?.click();

    const removeFile = (event) => {
        event.target.value = null;
        onRemoveFile();
    };

    return (
        <>
            <input ref={fileInputRef} type='file' accept='.csv' onChange={handleFileChange} className='hidden' />
            <div className='flex w-full justify-center gap-4'>
                <div className={`border-2 border-zinc-200 rounded-md flex items-center justify-end p-4 flex-grow`}>
                    {fileName}
                </div>
                <button
                    onClick={fileName === "" ? simulateInputClick : removeFile}
                    className='bg-teal-500 text-white p-4 rounded-sm w-24'
                >
                    {fileName === "" ? (
                        "Upload"
                    ) : processingDone ? (
                        "Remove"
                    ) : (
                        <CircularProgress size={20} color='warning' />
                    )}
                </button>
            </div>
        </>
    );
};

export default UploadCSVInput;
