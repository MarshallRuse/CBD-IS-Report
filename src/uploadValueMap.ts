import dayjs from "dayjs";
import { EPAsMapping, siteMapping, blockMapping } from "./mappings";
import type { UploadHeaderTransformation } from "./lib/interfaces/UploadValueMaps";

// uploadKey is the header value as it appears in the uploaded CSV
// outputKey is the header value as it appears in the final output tables

export const elentraHeaderValues: UploadHeaderTransformation[] = [
    {
        uploadKey: "Assessment ID",
        transformationFunction: (data) => {
            return data["Assessment ID"];
        },
        outputKey: "id",
    }, // Needed for the MUI DataGrid
    { uploadKey: "Assessment ID", outputKey: "AssessmentID" },
    { uploadKey: "Assessment Form Code", outputKey: "AssessmentFormCode" },
    {
        uploadKey: "Assessment Form Code",
        transformationFunction: (data) => {
            return EPAsMapping.find((epa) => epa.formID === parseInt(data["Assessment Form Code"]))?.EPACode;
        },
        outputKey: "EPACode",
    },
    {
        uploadKey: "Assessment Form Code",
        transformationFunction: (data) => {
            return EPAsMapping.find((epa) => epa.formID === parseInt(data["Assessment Form Code"]))?.EPADescription;
        },
        outputKey: "EPADescription",
    },
    { uploadKey: "Assessor CPSO", outputKey: "AssessorCPSO" },
    { uploadKey: "Assessee CPSO", outputKey: "AssesseeCPSO" },
    { uploadKey: "Assessee User ID", outputKey: "ElentraID" },
    { uploadKey: "Date of encounter", outputKey: "DateOfEncounter" },
    { uploadKey: "Date of Assessment Form Submission", outputKey: "DateOfAssessmentFormSubmission" },
    {
        uploadKey: "Assessment Form Code",
        transformationFunction: (data) => {
            if (
                EPAsMapping.find((epa) => epa.formID === parseInt(data["Assessment Form Code"]))?.EPACode === "COD-05B"
            ) {
                return "N/A";
            } else if (
                data["Entrustment / Overall Category"] === "Competent" ||
                data["Entrustment / Overall Category"] === "Proficient"
            ) {
                return "Yes";
            } else {
                return "No";
            }
        },
        outputKey: "Entrusted",
    },
    {
        uploadKeys: ["Assessor Lastname", "Assessor Firstname"],
        transformationFunction: (data) => {
            return `${data["Assessor Lastname"]}, ${data["Assessor Firstname"]}`;
        },
        outputKey: "AssessorFullname",
    },
    {
        uploadKeys: ["Assessee Lastname", "Assessee Firstname"],
        transformationFunction: (data) => {
            return `${data["Assessee Lastname"]}, ${data["Assessee Firstname"]}`;
        },
        outputKey: "Resident",
    },
    {
        uploadKey: "Date of encounter",
        transformationFunction: (data) => {
            const DOE = dayjs(data["Date of encounter"]);
            // if month > 6 (July, months are 0-indexed), start of academic year is current year, else start is last year
            const academicStartYear = DOE.month() >= 6 ? DOE.year() : DOE.year() - 1;
            const yearStartDate = dayjs().year(academicStartYear).month(6).date(1);
            return DOE.diff(yearStartDate, "week");
        },
        outputKey: "WeekOfYear",
    },
    {
        uploadKey: "Date of encounter",
        transformationFunction: (data) => {
            const DOE = dayjs(data["Date of encounter"], "YYYY-MM-DD");
            // if month > 6 (July, months are 0-indexed), start of academic year is current year, else start is last year
            const academicStartYear = DOE.month() >= 6 ? DOE.year() : DOE.year() - 1;
            return `${academicStartYear}-${(academicStartYear + 1).toString().slice(2)}`;
        },
        outputKey: "AcademicYear",
    },
    {
        uploadKey: "Date of Assessment Form Submission",
        transformationFunction: (data) => {
            const val = data["Date of Assessment Form Submission"];
            return val === "" || val === "N/A" ? "Incomplete" : "Complete";
        },
        outputKey: "CompletionStatus",
    },
    {
        uploadKeys: ["Assessor CPSO", "Assessee CPSO"],
        transformationFunction: (data) => {
            return data["Assessor CPSO"] === data["Assessee CPSO"];
        },
        outputKey: "SelfAssessment",
    },
    {
        uploadKeys: ["2 - 3 Strengths", "2 - 3 Actions or areas for improvement"],
        transformationFunction: (data) => {
            const strengthCommentLength = data["2 - 3 Strengths"].length;
            const weaknessCommentLength = data["2 - 3 Actions or areas for improvement"].length;
            return strengthCommentLength > 0 || weaknessCommentLength > 0 ? "Yes" : "No";
        },
        outputKey: "Comments",
    },
    {
        uploadKeys: ["2 - 3 Strengths", "2 - 3 Actions or areas for improvement"],
        transformationFunction: (data) => {
            const strengthCommentLength = data["2 - 3 Strengths"].length;
            const weaknessCommentLength = data["2 - 3 Actions or areas for improvement"].length;
            return strengthCommentLength > 0 || weaknessCommentLength > 0
                ? strengthCommentLength + weaknessCommentLength
                : "";
        },
        outputKey: "CommentsLength",
    },
    {
        uploadKey: "Assessment Form Delivery Method",
        transformationFunction: (data) => {
            switch (data["Assessment Form Delivery Method"]) {
                case "complete_now":
                    return "In The Moment";
                case "faculty_triggered_assessment":
                    return "Faculty Initiated";
                case "send_blank_form":
                    return "Blank Form";
                case "complete_and_confirm_by_email":
                    return "Email";
                default:
                    return "Other";
            }
        },
        outputKey: "DeliveryMethod",
    },
    {
        uploadKeys: ["CV ID 9533 : Site", "Site"],
        transformationFunction: (data) => {
            let siteToMap = "";
            if (data["CV ID 9533 : Site"] !== "") {
                siteToMap = data["CV ID 9533 : Site"];
            } else if (data["Site"] !== "") {
                siteToMap = data["Site"];
            }
            return siteToMap === "" ? "Unidentified" : siteMapping.find((site) => site.siteKey === siteToMap)?.siteCode;
        },
        outputKey: "Site",
    },
];

// *ExampleBodyValues are dummy values for the InfoPanel explaining each upload,
// to give an example of what the data to be uploaded looks like

type ExampleUploadValue = {
    value: string | number | boolean;
};
export const rotationExampleBodyValues: ExampleUploadValue[][] = [
    [
        { value: 2077001 },
        { value: 10 },
        { value: "Doe" },
        { value: "John" },
        { value: "John.Doe@example.com" },
        { value: "PGY1" },
        { value: "Core Medicine" },
        { value: "UHN-TGH" },
        { value: "SMH" },
        { value: "Infectious Diseases" },
        { value: "null" },
        { value: "2022-03-14" },
    ],
    [
        { value: 2077002 },
        { value: 10 },
        { value: "Stag" },
        { value: "Jane" },
        { value: "Jane.MaleUngulate@example.com" },
        { value: "PGY2" },
        { value: "Core Medicine" },
        { value: "SHSC" },
        { value: "WCH" },
        { value: "Ambulatory Medicine" },
        { value: "null" },
        { value: "2022-03-14" },
    ],
];

// uploadKey is the header value as it appears in the uploaded CSV
// outputKey is the header value as it appears in the final output tables
export const residentHeaderValues: UploadHeaderTransformation[] = [
    { uploadKey: "Elentra ID", outputKey: "ElentraID" },
    { uploadKey: "TraineeID", outputKey: "TraineeID" },
    { uploadKey: "Trainee", outputKey: "Trainee" },
    { uploadKey: "PowerID", outputKey: "POWERID" },
    { uploadKey: "Program", outputKey: "Program" },
    { uploadKey: "Level", outputKey: "Level" },
    { uploadKey: "Base", outputKey: "Base" },
    { uploadKey: "Term Start Date", outputKey: "TermStartDate" },
    { uploadKey: "Term End Date", outputKey: "TermEndDate" },
];

// *ExampleBodyValues are dummy values for the InfoPanel explaining each upload,
// to give an example of what the data to be uploaded looks like
export const rotationCoordinatorExampleBodyValues: ExampleUploadValue[][] = [
    [
        { value: "202201" },
        { value: "012022" },
        { value: "Resident, Fake" },
        { value: "123456" },
        { value: "Core Medicine" },
        { value: "PGY2" },
        { value: "MSH" },
        { value: "2022-07-01" },
        { value: "2023-06-30" },
    ],
    [
        { value: "202202" },
        { value: "022022" },
        { value: "Simpson, Homer" },
        { value: "123457" },
        { value: "Core Medicine" },
        { value: "PGY1" },
        { value: "SHSC" },
        { value: "2019-07-01" },
        { value: "2023-06-30" },
    ],
];
