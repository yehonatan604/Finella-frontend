import { useEffect, useState } from "react";
import { TextField, MenuItem, Typography, Box } from "@mui/material";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(Object.keys(data)));
  }, []);

  useEffect(() => {
    const handleConvert = async () => {
      if (from === to) return setResult(amount);
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
      );
      const data = await res.json();
      setResult(data.rates[to]);
    };
    handleConvert();
  }, [amount, from, to]);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} padding={2}>
        <TextField
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          fullWidth
        />
        <Box display="flex" flexDirection="row" gap={2}>
          <TextField
            select
            label="From"
            fullWidth
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {currencies.map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {currencies.map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Typography variant="h6">
          {amount} {from} = {result.toFixed(2)} {to}
        </Typography>
      </Box>
    </>
  );
};

export default CurrencyConverter;
