import { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Checkbox, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { Cancel, CancelOutlined, FilterList, WarningRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import { InfoPanel } from "./StyledComponents";

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

    const {
        blockValues = [],
        blockSelected = "",
        handleBlockFilterChange,
        programValues = [],
        programSelected = "",
        handleProgramFilterChange,
        excludedRotationValues = [],
        excludedRotations = [],
        handleExcludedRotationsFilterChange,
    } = props;

    const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
    const [displayInfoText, setDisplayInfoText] = useState(false);

    const handleBlockSelectedChange = (e) => {
        handleBlockFilterChange(e.target.value);
    };

    const handleProgramSelectedChange = (e) => {
        handleProgramFilterChange(e.target.value);
    };

    const handleExcludedRotationsSelectedChange = (e) => {
        handleExcludedRotationsFilterChange(e.target.value);
    };

    useEffect(() => {
        // Default values
        // Block: earliest block included
        handleBlockFilterChange(blockValues?.length > 0 ? blockValues[0] : "");
        // If Core Medicine included, default to it
        handleProgramFilterChange(programValues?.includes("Core Medicine") ? "Core Medicine" : "");
        // If leaves or research blocks included, exclude them
        handleExcludedRotationsFilterChange(
            excludedRotationValues?.filter(
                (rot) => rot?.toLowerCase().includes("leave") || rot?.toLowerCase().includes("research")
            )
        );
        // Have filters open by default if more than 1 block or program uploaded
        if (blockValues.length > 1 || programValues.length > 1) {
            setFiltersPanelOpen(true);
            setDisplayInfoText(true);
        }
    }, []);

    return (
        <FilterSection>
            <IconButton aria-label='filter' onClick={() => setFiltersPanelOpen(!filtersPanelOpen)} size='large'>
                <FilterList color={filtersPanelOpen ? "primary" : "default"} />
            </IconButton>
            {displayInfoText && (
                <FilterRow className='info-text'>
                    <WarningRounded />
                    Multiple blocks or programs detected, please select the block and program desired.
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
                        <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id=''>Block</InputLabel>
                            <Select
                                labelId='block-filter-label'
                                id='block-filter-select'
                                value={blockSelected}
                                onChange={handleBlockSelectedChange}
                                input={<OutlinedInput label='Block' />}
                                MenuProps={MenuProps}
                            >
                                {blockValues?.map((block, index) => (
                                    <MenuItem key={`${block}-${index}`} value={block}>
                                        {block}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id='program-filter-label'>Program</InputLabel>
                            <Select
                                labelId='program-filter-label'
                                id='program-filter-select'
                                value={programSelected}
                                onChange={handleProgramSelectedChange}
                                input={<OutlinedInput label='Program' />}
                                MenuProps={MenuProps}
                            >
                                {programValues?.map((program, index) => (
                                    <MenuItem
                                        key={`${program}-${index}`}
                                        value={program === "" ? "Unlisted" : program}
                                        style={getStyles(program, programValues, theme)}
                                    >
                                        {program === "" ? <em>Unlisted</em> : program}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FilterRow>
                    <FilterRow>
                        <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id='excluded-rotations-filter-label'>Excluded Rotations</InputLabel>
                            <Select
                                labelId='excluded-rotations-filter-label'
                                id='excluded-rotations-filter-select'
                                multiple
                                value={excludedRotations}
                                onChange={handleExcludedRotationsSelectedChange}
                                input={<OutlinedInput label='Excluded Rotations' />}
                                renderValue={(selected) => selected.join(", ")}
                                MenuProps={MenuProps}
                            >
                                {excludedRotationValues?.map((rotation, index) => (
                                    <MenuItem
                                        key={`${rotation}-${index}`}
                                        value={rotation === "" ? "Unlisted" : rotation}
                                        style={getStyles(rotation, excludedRotationValues, theme)}
                                    >
                                        <Checkbox
                                            checked={excludedRotations.indexOf(rotation) > -1}
                                            icon={<CancelOutlined />}
                                            checkedIcon={<Cancel />}
                                            color='secondary'
                                        />
                                        {rotation === "" ? <em>Unlisted</em> : rotation}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FilterRow>
                </FilterContainer>
            </motion.div>
        </FilterSection>
    );
}
