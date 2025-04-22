import { Box, Button, Typography, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const milliseconds = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
};

const Timer = () => {
  const [, forceUpdate] = useState(0);
  const displayRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const isRunningRef = useRef(false);
  const frameRef = useRef<number>(null);

  const [mode, setMode] = useState<"stopper" | "timer">("stopper");
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [targetMilliseconds, setTargetMilliseconds] = useState(0);
  const targetTimeRef = useRef(0);

  const tick = useCallback(() => {
    if (isRunningRef.current && startTimeRef.current !== null) {
      const now = Date.now();
      displayRef.current = now - startTimeRef.current + elapsedRef.current;

      // Check if timer mode is active and time exceeded
      if (
        mode === "timer" &&
        targetTimeRef.current > 0 &&
        displayRef.current >= targetTimeRef.current
      ) {
        pause();
        alert("Time's up!");
      }

      forceUpdate(displayRef.current);
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [mode]);

  const start = () => {
    if (isRunningRef.current) return;
    if (mode === "timer") {
      targetTimeRef.current =
        targetMinutes * 60000 + targetSeconds * 1000 + targetMilliseconds * 10;
    }
    startTimeRef.current = Date.now();
    isRunningRef.current = true;
    tick();
  };

  const pause = () => {
    if (!isRunningRef.current) return;
    isRunningRef.current = false;
    elapsedRef.current = displayRef.current;
  };

  const reset = () => {
    isRunningRef.current = false;
    displayRef.current = 0;
    elapsedRef.current = 0;
    startTimeRef.current = null;
    forceUpdate(0);
  };

  useEffect(() => {
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [tick]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
      <Box display="flex" gap={1} mt={2}>
        <Button
          variant={mode === "stopper" ? "contained" : "outlined"}
          onClick={() => setMode("stopper")}
        >
          Stopper
        </Button>
        <Button
          variant={mode === "timer" ? "contained" : "outlined"}
          onClick={() => setMode("timer")}
        >
          Timer
        </Button>
      </Box>

      <Typography variant="h4" fontFamily="monospace">
        {formatTime(displayRef.current)}
      </Typography>

      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          onClick={() => (isRunningRef.current ? pause() : start())}
        >
          {isRunningRef.current ? "Pause" : "Start"}
        </Button>
        <Button variant="outlined" onClick={reset} color="secondary">
          Reset
        </Button>
      </Box>

      {mode === "timer" && (
        <Box display="flex" gap={1} mt={2}>
          <TextField
            type="number"
            label="Min"
            size="small"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(Number(e.target.value))}
            sx={{ width: 70 }}
          />
          <TextField
            type="number"
            label="Sec"
            size="small"
            value={targetSeconds}
            onChange={(e) => setTargetSeconds(Number(e.target.value))}
            sx={{ width: 70 }}
          />
          <TextField
            type="number"
            label="Ms"
            size="small"
            value={targetMilliseconds}
            onChange={(e) => setTargetMilliseconds(Number(e.target.value))}
            sx={{ width: 70 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Timer;
