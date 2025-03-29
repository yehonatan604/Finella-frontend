import { TextField, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { TWorkplace } from "../types/TWorkplace";

type ActionFiltersProps = {
  setFromYear?: (year: number) => void;
  setToYear?: (year: number) => void;
  setMonths?: (months: number[]) => void;
  setPickedType?: (type: string) => void;
  setPickedWorkplaces?: (workplaces: string[]) => void;
  setPickedSalaries?: (salaries: string[]) => void;
  types?: string[];
  workplaces?: TWorkplace[];
  setPickedStatus?: (status: string) => void;
  statusTypes?: string[];
};

const ActionFilters = (props: ActionFiltersProps) => {
  const {
    setFromYear,
    setToYear,
    setMonths,
    setPickedType,
    setPickedWorkplaces,
    types,
    workplaces,
    statusTypes,
    setPickedStatus,
  } = props;
  return (
    <Box
      sx={{
        width: "60%",
        display: "flex",
        gap: "1rem",
        margin: 2,
      }}
    >
      {setFromYear && (
        // add a from-year filter
        <TextField
          label="From Year"
          fullWidth
          sx={{ mb: 2 }}
          type="number"
          slotProps={{ htmlInput: { min: 1982, max: 2100 } }}
          defaultValue={new Date().getFullYear()}
          onChange={(e) => setFromYear(Number(e.target.value))}
        />
      )}

      {setToYear && (
        // add a to-year filter
        <TextField
          label="To Year"
          fullWidth
          sx={{ mb: 2 }}
          type="number"
          slotProps={{ htmlInput: { min: 1982, max: 2100 } }}
          defaultValue={new Date().getFullYear()}
          onChange={(e) => setToYear(Number(e.target.value))}
        />
      )}

      {setMonths && (
        // add a month filter
        <TextField
          label="Months"
          fullWidth
          sx={{ mb: 2 }}
          select
          slotProps={{ select: { multiple: true } }}
          defaultValue={["all"]}
          onChange={(e) => {
            const value = e.target.value as unknown as string[];
            setMonths(
              value.includes("all")
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                : value.map(Number)
            );
          }}
        >
          <MenuItem value={"all"}>All Months</MenuItem>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </TextField>
      )}

      {setPickedType && (
        // add a type filter
        <TextField
          label="type"
          fullWidth
          sx={{ mb: 2 }}
          select
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          defaultValue={["all"]}
          onChange={(e) => {
            setPickedType(e.target.value);
          }}
        >
          <MenuItem value={"all"}>All</MenuItem>
          {types?.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      )}

      {setPickedWorkplaces && (
        // add a workplace filter
        <TextField
          label="workPlaces"
          fullWidth
          sx={{ mb: 2 }}
          select
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            select: { multiple: true },
          }}
          defaultValue={["all"]}
          onChange={(e) => {
            const value = e.target.value as unknown as string[];
            setPickedWorkplaces(
              value.includes("all")
                ? workplaces
                    ?.map((workplace) => workplace._id)
                    .filter((id): id is string => id !== undefined) || []
                : value
            );
          }}
        >
          <MenuItem value={"all"}>All Workplaces</MenuItem>
          {workplaces?.map((workplace) => (
            <MenuItem key={workplace._id} value={workplace._id}>
              {workplace.name}
            </MenuItem>
          )) || []}
        </TextField>
      )}
      {setPickedStatus && (
        // add a status filter
        <TextField
          label="Status"
          fullWidth
          sx={{ mb: 2 }}
          select
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          defaultValue={["all"]}
          onChange={(e) => {
            setPickedStatus(e.target.value);
          }}
        >
          <MenuItem value={"all"}>All</MenuItem>
          {statusTypes?.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
};

export default ActionFilters;
