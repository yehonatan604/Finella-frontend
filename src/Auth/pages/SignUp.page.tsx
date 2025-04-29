import React from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import useAuth from "../hooks/useAuth";
import { signupSchema } from "../validations/signup.schema";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signupFormDefault } from "../forms/signupFormDefault";
import useTheme from "../../Common/hooks/useTheme";
import AbsTopIcons from "../../Common/components/AbsTopIcons";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: signupFormDefault,
    resolver: joiResolver(signupSchema),
  });

  const { signup } = useAuth();
  const { mode } = useTheme();
  const nav = useNavigate();

  const onSubmit = async (data: Record<string, unknown>) => {
    delete data.confirmPassword;
    await signup(data);
    nav("/auth");
  };

  useEffect(() => {
    if (watch("password") !== watch("confirmPassword")) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [clearErrors, setError, watch]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AbsTopIcons />
      <Container
        maxWidth="xs"
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom color="warning">
          Sign Up
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }} color="info">
          Enter your credentials to create an account and start your adventure.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            {...register("email")}
            variant="outlined"
            fullWidth
            error={!!errors?.email}
            helperText={errors?.email?.message as string}
            sx={{ mb: 2 }}
          />
          <TextField
            label="First Name"
            {...register("name.first")}
            variant="outlined"
            fullWidth
            error={!!errors?.name?.first}
            helperText={errors?.name?.first?.message as string}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Last Name"
            {...register("name.last")}
            variant="outlined"
            fullWidth
            error={!!errors?.name?.last}
            helperText={errors?.name?.last?.message as string}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Date of Birth"
            {...register("dob")}
            className={mode === "dark" ? "dark" : ""}
            variant="outlined"
            fullWidth
            type="date"
            error={!!errors?.dob}
            helperText={errors?.dob?.message as string}
            sx={{ mb: 3 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Password"
            {...register("password")}
            variant="outlined"
            fullWidth
            type="password"
            error={!!errors?.password}
            helperText={errors?.password?.message as string}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Confirm Password"
            {...register("confirmPassword")}
            variant="outlined"
            fullWidth
            type="password"
            error={!!errors?.confirmPassword}
            helperText={errors?.confirmPassword?.message as string}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={Object.keys(errors).length > 0}
            sx={{ fontSize: "1.2rem", py: 1 }}
          >
            Sign Up
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default SignUpPage;
