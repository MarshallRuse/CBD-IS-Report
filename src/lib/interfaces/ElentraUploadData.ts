export interface IElentraUploadData {
    id: number;
    AssessmentID: number;
    AssessmentFormCode: number;
    EPACode: string;
    EPADescription: string;
    AssessorCPSO: number;
    AssesseeCPSO: number;
    ElentraID: number;
    DateOfEncounter: string;
    DateOfAssessmentFormSubmission: string;
    Entrusted: string;
    AssessorFullname: string;
    Resident: string;
    WeekOfYear: number;
    AcademicYear: string;
    CompletionStatus: "COMPLETE" | "INCOMPLETE";
    SelfAssessment: boolean;
    Comments: string;
    CommentsLength: number;
    DeliveryMethod: string;
    Site: string;
}

export type ElentraAugmentedUploadData = IElentraUploadData & {
    TrainingLevelDateOfEncounter?: string;
    TrainingLevelCurrentYear?: string;
};

export type ElentraUploadMetaData = {
    fileName: string;
    dateUploaded: string | null;
};
