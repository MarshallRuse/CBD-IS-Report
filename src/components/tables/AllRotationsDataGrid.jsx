import { useEffect, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const defaultMinColWidth = 200;
const columns = [
    {
        field: "Block",
        headerName: "Block",
        type: "number",
        minWidth: 75,
        flex: 1,
        renderCell: (params) => {
            return (
                <Tooltip title={params.row.RotationStartDate}>
                    <span>{params.value}</span>
                </Tooltip>
            );
        },
    },
    { field: "Rotation", headerName: "Rotation", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Hospital", headerName: "Hospital", minWidth: 100, flex: 1 },
    { field: "LastName", headerName: "Last Name", minWidth: defaultMinColWidth, flex: 1 },
    { field: "FirstName", headerName: "First Name", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Resident", headerName: "Resident", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Email", headerName: "Email", minWidth: defaultMinColWidth, flex: 1 },
    { field: "PGY", headerName: "PGY", minWidth: 75, flex: 1 },
    { field: "TraineeProgram", headerName: "Trainee Program", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Team", headerName: "Team", minWidth: 100, flex: 1 },
    { field: "RotationCoordinator", headerName: "Rotation Coordinator", minWidth: defaultMinColWidth, flex: 1 },
    { field: "RCFirstName", headerName: "RC First Name", minWidth: 120, flex: 1 },
    { field: "RCEmail", headerName: "RC Email", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Assistant", headerName: "Assistant", minWidth: defaultMinColWidth, flex: 1 },
    { field: "AssistantEmail", headerName: "Assistant Email", minWidth: defaultMinColWidth, flex: 1 },
    { field: "JuniorPriority", headerName: "Junior Priority", minWidth: defaultMinColWidth, flex: 1 },
    { field: "JuniorDoWhenYouCan", headerName: "Junior Do When You Can", minWidth: defaultMinColWidth, flex: 1 },
    { field: "JuniorOptional", headerName: "Senior Optional", minWidth: defaultMinColWidth, flex: 1 },
    { field: "SeniorPriority", headerName: "Senior Priority", minWidth: defaultMinColWidth, flex: 1 },
    { field: "SeniorDoWhenYouCan", headerName: "Senior Do When You Can", minWidth: defaultMinColWidth, flex: 1 },
    { field: "SeniorOptional", headerName: "Senior Optional", minWidth: defaultMinColWidth, flex: 1 },
    { field: "JuniorRotationCards", headerName: "Junior Rotation Cards", minWidth: defaultMinColWidth, flex: 1 },
    { field: "SeniorRotationCards", headerName: "Senior Rotation Cards", minWidth: defaultMinColWidth, flex: 1 },
];

export default function AllRotationsDataGrid(props) {
    const { rotationsData, rotationCoordinatorDataAvailable = false, EPADataAvailable = false } = props;

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        RotationCoordinator: false,
        RCFirstName: false,
        RCEmail: false,
        Assistant: false,
        AssistantEmail: false,
        JuniorPriority: false,
        JuniorDoWhenYouCan: false,
        JuniorOptional: false,
        SeniorPriority: false,
        SeniorDoWhenYouCan: false,
        SeniorOptional: false,
        JuniorRotationCards: false,
        SeniorRotationCards: false,
    });

    useEffect(() => {
        setColumnVisibilityModel({
            RotationCoordinator: rotationCoordinatorDataAvailable,
            RCFirstName: rotationCoordinatorDataAvailable,
            RCEmail: rotationCoordinatorDataAvailable,
            Assistant: rotationCoordinatorDataAvailable,
            AssistantEmail: rotationCoordinatorDataAvailable,
            JuniorPriority: EPADataAvailable,
            JuniorDoWhenYouCan: EPADataAvailable,
            JuniorOptional: EPADataAvailable,
            SeniorPriority: EPADataAvailable,
            SeniorDoWhenYouCan: EPADataAvailable,
            SeniorOptional: EPADataAvailable,
            JuniorRotationCards: EPADataAvailable,
            SeniorRotationCards: EPADataAvailable,
        });
    }, [rotationCoordinatorDataAvailable, EPADataAvailable]);

    return (
        <>
            {rotationsData.length > 0 && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rotationsData}
                        columns={columns}
                        columnVisibilityModel={columnVisibilityModel}
                        disableSelectionOnClick
                    />
                </div>
            )}
        </>
    );
}
