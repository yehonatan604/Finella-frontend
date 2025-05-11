import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

const Calculator = () => {
  const [expression, setExpression] = useState("");

  const handleClick = (value: string) => {
    if (value === "C") {
      setExpression("");
    } else if (value === "DEL") {
      setExpression(expression.slice(0, -1));
    } else if (value === "=") {
      try {
        const result = eval(expression.replace(/%/g, "/100"));
        setExpression(result.toString());
      } catch {
        setExpression("Error");
      }
    } else {
      setExpression(expression + value);
    }
  };

  const buttons = [
    "C",
    "DEL",
    "=",
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "%",
    "+",
  ];

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          width: 320,
          borderRadius: 0,
          borderEndEndRadius: 2,
          borderEndStartRadius: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "103%",
            height: 60,
            borderRadius: 2,
            mb: 2,
            padding: 1,
            boxShadow: 2,
            border: "1px solid #ccc",
            "&:hover": {
              boxShadow: 4,
              border: "1px solid #bbb",
            },
          }}
        >
          <Typography
            variant="h4"
            align="right"
            sx={{
              wordWrap: "break-word",
              color: "#222",
            }}
          >
            {expression || "0"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
          }}
        >
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant="contained"
              color={
                ["C", "DEL"].includes(btn) ? "error" : btn === "=" ? "success" : "primary"
              }
              sx={{
                py: 2,
                fontSize: 18,
                gridColumn: btn === "=" ? "span 2" : "span 1",
              }}
              onClick={() => handleClick(btn)}
            >
              {btn === "DEL" ? "⌫" : btn}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Calculator;
