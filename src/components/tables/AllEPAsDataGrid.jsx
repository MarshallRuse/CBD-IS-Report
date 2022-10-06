import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { formatAsWrappingCell } from "../StyledComponents.jsx";

const defaultMinColWidth = 200;
const columns = [
    {
        field: "AssessmentID",
        headerName: "Assessment ID",
        minWidth: 120,
        flex: 1,
    },
    {
        field: "AssessmentFormCode",
        headerName: "Assessment Form Code",
        minWidth: defaultMinColWidth,
        flex: 1,
    },
    { field: "EPACode", headerName: "EPA Code", minWidth: 100, flex: 1 },
    {
        field: "EPADescription",
        headerName: "EPA Description",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    { field: "AssessorCPSO", headerName: "Assessor CPSO", minWidth: 120, flex: 1 },
    { field: "AssesseeCPSO", headerName: "Assessee CPSO", minWidth: 120, flex: 1 },
    { field: "ElentraID", headerName: "Elentra ID", minWidth: 120, flex: 1 },
    { field: "DateOfEncounter", headerName: "Date Of Encounter", minWidth: 150, flex: 1 },
    {
        field: "DateOfAssessmentFormSubmission",
        headerName: "Date Of Assessment Form Submission",
        minWidth: 270,
        flex: 1,
    },
    { field: "Entrusted", headerName: "Entrusted", minWidth: defaultMinColWidth, flex: 1 },
    { field: "AssessorFullname", headerName: "Assessor Fullname", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Resident", headerName: "Resident", minWidth: defaultMinColWidth, flex: 1 },
    {
        field: "TrainingLevelDateOfEncounter",
        headerName: "Training Level (Date of Encounter)",
        minWidth: defaultMinColWidth,
        flex: 1,
    },
    {
        field: "TrainingLevelCurrentYear",
        headerName: "Training Level (Current Year)",
        minWidth: defaultMinColWidth,
        flex: 1,
    },
    { field: "WeekOfYear", headerName: "Week Of Year", type: "number", minWidth: 100, flex: 1 },
    { field: "AcademicYear", headerName: "Academic Year", minWidth: 120, flex: 1 },
    { field: "CompletionStatus", headerName: "Completion Status", minWidth: 150, flex: 1 },
    { field: "Comments", headerName: "Comments", minWidth: 100, flex: 1 },
    { field: "CommentsLength", headerName: "Comments Length", type: "number", minWidth: 150, flex: 1 },
    { field: "Site", headerName: "Site (Formatted)", minWidth: 120, flex: 1 },
];

export default function AllEPAsDataGrid(props) {
    const { elentraData = [], residentDataAvailable = false } = props;

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        TrainingLevelDateOfEncounter: false,
        TrainingLevelCurrentYear: false,
    });

    const CustomToolbar = () => {
        let firstDate;
        let lastDate;
        if (elentraData.length > 0) {
            const datesOfEncounter = elentraData.map((e) => dayjs(e.DateOfEncounter, "YYYY-MM-DD"));
            firstDate = dayjs(Math.min(...datesOfEncounter)).format("YYYY-MM-DD");
            lastDate = dayjs(Math.max(...datesOfEncounter)).format("YYYY-MM-DD");
        }
        return (
            <GridToolbarContainer sx={{ justifyContent: "flex-end", padding: "0.5em" }}>
                <GridToolbarExport
                    csvOptions={{
                        fileName: `Formatted Elentra Extract - ${firstDate} - ${lastDate}`,
                    }}
                />
            </GridToolbarContainer>
        );
    };

    useEffect(() => {
        setColumnVisibilityModel({
            TrainingLevelDateOfEncounter: residentDataAvailable,
            TrainingLevelCurrentYear: residentDataAvailable,
        });
    }, [residentDataAvailable]);

    // useEffect(() => {
    //     const filterObjects = [];
    //     filters.forEach((filter) => {
    //         const filterValues = filter.selectedExclusions.map((exclusion) => ({
    //             columnField: filter.field,
    //             operatorValue: "!=",
    //             value: exclusion,
    //         }));
    //         filterObjects.push(...filterValues);
    //     });
    //     setFilterModel({ items: filterObjects });
    // }, [filters]);

    return (
        <>
            {elentraData.length > 0 && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={elentraData}
                        columns={columns}
                        columnVisibilityModel={columnVisibilityModel}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        sx={{
                            "& .rc-data": {
                                backgroundColor: "RCData.primary",
                            },
                            "& .epa-data": {
                                backgroundColor: "EPAData.primary",
                            },
                        }}
                        disableSelectionOnClick
                    />
                </div>
            )}
        </>
    );
}
