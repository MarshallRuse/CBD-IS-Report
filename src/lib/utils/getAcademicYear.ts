import dayjs from "dayjs";

const getAcademicYear = (date: string | number | dayjs.Dayjs | Date | null | undefined, dateFormat: string): string => {
    const dayjsDOE = dayjs(date, dateFormat);
    const academicStartYear = dayjsDOE.month() >= 6 ? dayjsDOE.year() : dayjsDOE.year() - 1;
    return `${academicStartYear}-${(academicStartYear + 1).toString().slice(2)}`;
};

export default getAcademicYear;
