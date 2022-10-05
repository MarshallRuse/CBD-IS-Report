import { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Checkbox, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { Cancel, CancelOutlined, FilterList, WarningRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import { InfoPanel } from "./StyledComponents";
import VirtualAutocomplete from "./VirtualAutocomplete";

const FilterSection = styled("div")({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
});

const FilterContainer = styled(InfoPanel)({
    boxSizing: "border-box",
    width: "100%",
    "& .MuiSelect-select": {
        backgroundColor: "#fff",
    },
});

const FilterRow = styled("div")(({ theme }) => ({
    display: "flex",
    width: "100%",
    "&.info-text": {
        alignItems: "center",
        color: theme.palette.primary.main,
        fontSize: "0.8em",
        gap: "10px",
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(item, items, theme) {
    return {
        fontWeight: items.indexOf(item) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

export default function TableFilters(props) {
    const theme = useTheme();

    const { excludedAssessorValues = [], excludedAssessors = [], handleExcludedAssessorsFilterChange } = props;

    const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
    const [displayInfoText, setDisplayInfoText] = useState(false);

    useEffect(() => {
        // If assessors with "PGME" included, exclude them, they're duplicate EPAs
        handleExcludedAssessorsFilterChange(
            excludedAssessorValues?.filter((assessor) => assessor?.toLowerCase().includes("pgme"))
        );
        // Have filters open by default if more than 1 block or program uploaded
        if (excludedAssessorValues.length > 1) {
            setFiltersPanelOpen(true);
            setDisplayInfoText(true);
        }
    }, [excludedAssessorValues]);

    return (
        <FilterSection>
            <IconButton aria-label='filter' onClick={() => setFiltersPanelOpen(!filtersPanelOpen)} size='large'>
                <FilterList color={filtersPanelOpen ? "primary" : "default"} />
            </IconButton>
            {displayInfoText && (
                <FilterRow className='info-text'>
                    <WarningRounded />
                    Assessors with "PGME" excluded by default, they are duplicate EPAs.
                </FilterRow>
            )}
            <motion.div
                key='filter-section'
                animate={filtersPanelOpen ? "open" : "collapsed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0, overflowY: "hidden" },
                }}
                initial='collapsed'
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                style={{ width: "100%" }}
            >
                <FilterContainer>
                    <FilterRow>
                        <VirtualAutocomplete
                            label='Excluded Assessors'
                            options={excludedAssessorValues}
                            value={excludedAssessors}
                            onValueChange={(e, values) => handleExcludedAssessorsFilterChange(values)}
                        />
                        {/* <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id='excluded-assessors-filter-label'>Excluded Assessors</InputLabel>
                            <Select
                                labelId='excluded-assessors-filter-label'
                                id='excluded-assessors-filter-select'
                                multiple
                                value={excludedAssessors}
                                onChange={handleExcludedAssessorsSelectedChange}
                                input={<OutlinedInput label='Excluded Assessors' />}
                                renderValue={(selected) => selected.join(", ")}
                                MenuProps={MenuProps}
                            >
                                {excludedAssessorValues?.map((assessor, index) => (
                                    <MenuItem
                                        key={`${assessor}-${index}`}
                                        value={assessor === "" ? "Unlisted" : assessor}
                                        style={getStyles(assessor, excludedAssessorValues, theme)}
                                    >
                                        <Checkbox
                                            checked={excludedAssessors.indexOf(assessor) > -1}
                                            icon={<CancelOutlined />}
                                            checkedIcon={<Cancel />}
                                            color='secondary'
                                        />
                                        {assessor === "" ? <em>Unlisted</em> : assessor}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                    </FilterRow>
                </FilterContainer>
            </motion.div>
        </FilterSection>
    );
}
