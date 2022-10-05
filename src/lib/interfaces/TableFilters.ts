export type TableFilter = {
    field: string;
    options: (string | number | boolean)[];
    selectedExclusions: (string | number | boolean)[];
};
