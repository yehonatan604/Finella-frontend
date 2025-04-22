import {
  Box,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { timerStore } from "../helpers/timerStore";
import { formatTime } from "../../Common/helpers/dateTimeHelpers";

const Timer = () => {
  const [displayTime, setDisplayTime] = useState(timerStore.getDisplayTime());
  const [isRunning, setIsRunning] = useState(timerStore.getIsRunning());
  const [modeTimer, setModeTimer] = useState(timerStore.getModeTimer());
  const [target, setTarget] = useState(() => {
    const total = timerStore.getTargetTime();
    return {
      min: Math.floor(total / 60000),
      sec: Math.floor((total % 60000) / 1000),
      ms: Math.floor((total % 1000) / 10),
    };
  });

  useEffect(() => {
    const unsubscribe = timerStore.subscribe((time, running, mode) => {
      setDisplayTime(time);
      setIsRunning(running);
      setModeTimer(mode);
    });

    timerStore.setOnTimeout(() => alert("⏰ Time's up!"));

    return unsubscribe;
  }, []);

  const handleStartPause = () => {
    if (isRunning) {
      timerStore.pause();
    } else {
      if (modeTimer) {
        const totalMs = target.min * 60000 + target.sec * 1000 + target.ms * 10;
        timerStore.setTargetTime(totalMs);
      }
      timerStore.start();
    }
  };

  const handleReset = () => {
    timerStore.reset();
  };

  const handleToggleMode = (checked: boolean) => {
    timerStore.setModeTimer(checked);
  };

  const handleTargetChange = (key: "min" | "sec" | "ms", value: number) => {
    const updated = { ...target, [key]: value };
    setTarget(updated);
    const total = updated.min * 60000 + updated.sec * 1000 + updated.ms * 10;
    timerStore.setTargetTime(total);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
      <Typography variant="h4" fontFamily="monospace">
        {formatTime(displayTime)}
      </Typography>

      <Box display="flex" gap={1}>
        <Button variant="contained" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outlined" onClick={handleReset} color="secondary">
          Reset
        </Button>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={modeTimer}
            onChange={(e) => handleToggleMode(e.target.checked)}
          />
        }
        label="Timer Mode"
        sx={{ mt: 1 }}
      />

      {modeTimer && (
        <Box display="flex" gap={1}>
          <TextField
            type="number"
            label="Min"
            size="small"
            value={target.min}
            onChange={(e) => handleTargetChange("min", Number(e.target.value))}
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            sx={{ width: 70 }}
          />
          <TextField
            type="number"
            label="Sec"
            size="small"
            value={target.sec}
            onChange={(e) => handleTargetChange("sec", Number(e.target.value))}
            slotProps={{
              htmlInput: {
                min: 0,
                max: 99,
              },
            }}
            sx={{ width: 70 }}
          />
          <TextField
            type="number"
            label="Ms"
            size="small"
            value={target.ms}
            onChange={(e) => handleTargetChange("ms", Number(e.target.value))}
            slotProps={{
              htmlInput: {
                min: 0,
                max: 99,
              },
            }}
            sx={{ width: 70 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Timer;
