export type ResidentData = {
    TraineeID: number;
    Trainee: string;
    POWERID: number;
    Program: string;
    TrainingLevels: {
        Level: string;
        Base: string;
        TermStartDate: string;
        TermEndDate: string;
    }[];
};

export type ResidentsData = {
    [ElentraID: number]: ResidentData;
};
