import { IGenericObject } from "./IGenericObject";

export interface IElentraUploadData extends IGenericObject {
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
    TrainingLevelDateOfEncounter: string;
    TrainingLevelCurrentYear: string;
};
