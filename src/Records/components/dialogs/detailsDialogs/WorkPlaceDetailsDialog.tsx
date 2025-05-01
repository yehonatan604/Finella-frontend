import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Box,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { DeepPartial } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../../Common/helpers/stringHelpers";
import CenterBox from "../../../../Common/components/styled/CenterBox";
import { TWorkplace } from "../../../types/TWorkplace";
import DialogXButton from "../../../../Common/components/dialogs/DialogXButton";
import StyledTitleInput from "../../../../Common/components/styled/StyledTitleInput";
import useTheme from "../../../../Common/hooks/useTheme";

type WorkplaceDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  workplace: TWorkplace;
  onSubmit: (workplace: TWorkplace) => void;
};

const WorkplaceDetailsDialog = ({
  isOpen,
  onClose,
  workplace,
  onSubmit,
}: WorkplaceDetailsDialogProps) => {
  const { mode } = useTheme();
  const [data, setData] = useState<TWorkplace | DeepPartial<TWorkplace>>(workplace);

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const isPhone = name === "main phone" || name === "secondary phone";
    const isAddress =
      name === "street" ||
      name === "streetNumber" ||
      name === "city" ||
      name === "country" ||
      name === "zip";

    setData((prev) => {
      if (isPhone) {
        return {
          ...prev,
          phone: {
            [name]: value,
          },
        };
      }

      if (isAddress) {
        return {
          ...prev,
          address: {
            [name]: value,
          },
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(data as TWorkplace);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg" sx={{ left: "15vw" }}>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: ".5rem",
        }}
      >
        <StyledTitleInput
          type="text"
          name="name"
          value={capitalizeFirstLetter(data.name!)}
          sx={{ width: 705 }}
          onChange={handleChanges}
        />
        <DialogXButton onClose={onClose} />
      </DialogTitle>
      <DialogContent sx={{ p: 3, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            my: 2,
            gap: 2,
          }}
        >
          <CenterBox sx={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
            <TextField
              type="email"
              name="email"
              value={data.email}
              label="Email"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />

            <TextField
              type="date"
              className={mode === "dark" ? "dark" : ""}
              name="startDate"
              label="Start Date"
              value={
                data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : ""
              }
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />

            <TextField
              type="date"
              className={mode === "dark" ? "dark" : ""}
              name="endDate"
              value={
                data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : ""
              }
              label="End Date"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              type="phone"
              name="main phone"
              defaultValue={data.phone?.main}
              label="Main Phone"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />
            <TextField
              type="phone"
              name="secondary phone"
              defaultValue={data.phone?.secondary}
              label="Secondary Phone"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />
          </CenterBox>
          <Divider sx={{ width: "100%", my: 2 }} />

          <CenterBox sx={{ flexDirection: "row", gap: 2, flexWrap: "wrap" }}>
            <TextField
              type="text"
              name="street"
              value={data.address?.street}
              label="Street"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />

            <TextField
              type="text"
              name="streetNumber"
              value={data.address?.houseNumber}
              label="House Number"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />

            <TextField
              type="text"
              name="city"
              value={data.address?.city}
              label="City"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />

            <TextField
              type="text"
              name="country"
              value={data.address?.country}
              label="Country"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />

            <TextField
              type="text"
              name="zip"
              value={data.address?.zip}
              label="Zip Code"
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
            />
          </CenterBox>

          <Divider sx={{ width: "100%", my: 2 }} />

          <CenterBox sx={{ flexDirection: "row", gap: 2 }}>
            <TextField
              type="number"
              name="pricePerHour"
              value={data.pricePerHour}
              label="Price per Hour"
              size="small"
              sx={{ width: 217, color: "#fff" }}
              onChange={handleChanges}
            />
            <TextField
              type="number"
              name="pricePerMonth"
              value={data.pricePerMonth}
              label="Price per Month"
              size="small"
              sx={{ width: 217, color: "#fff" }}
              onChange={handleChanges}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.withVat}
                  color="primary"
                  onChange={(e) => {
                    setData({ ...data, withVat: e.target.checked });
                  }}
                />
              }
              label="With VAT"
            />
          </CenterBox>

          <Divider sx={{ width: "100%", my: 2 }} />

          <TextField
            type="text"
            name="notes"
            value={data.notes}
            label="Notes"
            multiline
            rows={4}
            sx={{ width: "100%" }}
            onChange={handleChanges}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkplaceDetailsDialog;
