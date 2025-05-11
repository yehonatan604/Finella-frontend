import { Button } from "@mui/material";

type FormButtonsProps = {
  isValid: boolean;
  onReset: () => void;
};

const FormButtons = (props: FormButtonsProps) => {
  const { isValid, onReset } = props;
  return (
    <>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ fontSize: "1.2rem" }}
        disabled={!isValid}
      >
        Add
      </Button>

      <Button
        type="reset"
        variant="contained"
        color="error"
        fullWidth
        sx={{ fontSize: "1.2rem" }}
        onClick={onReset}
      >
        Reset
      </Button>
    </>
  );
};

export default FormButtons;
