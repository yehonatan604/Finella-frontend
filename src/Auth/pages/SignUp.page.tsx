import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import useAuth from "../hooks/useAuth";
import { signupSchema } from "../validations/signup.schema";
import { Link, useNavigate } from "react-router-dom";
import { signupFormDefault } from "../forms/signupFormDefault";
import useTheme from "../../Common/hooks/useTheme";
import AbsTopIcons from "../../Common/components/layout/AbsTopIcons";
import FormValidationMessage from "../../Common/components/form/FormValidationMessage";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: signupFormDefault,
    resolver: joiResolver(signupSchema),
  });

  const { signup, loading } = useAuth();
  const { mode } = useTheme();
  const nav = useNavigate();

  const onSubmit = async (data: Record<string, unknown>) => {
    delete data.confirmPassword;
    await signup(data);
    nav("/auth");
  };

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
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="First Name"
            {...register("name.first")}
            variant="outlined"
            fullWidth
            error={!!errors?.name?.first}
            required
            helperText={errors?.name?.first?.message as string}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Last Name"
            {...register("name.last")}
            variant="outlined"
            fullWidth
            required
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
            required
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
            required
            helperText={errors?.confirmPassword?.message as string}
            sx={{ mb: 3 }}
          />

          <FormValidationMessage isValid={isValid} />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="small"
            disabled={!isValid}
            sx={{ fontSize: "1.2rem", px: 2, width: "auto" }}
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body1" sx={{ mt: 3 }}>
          already have an account?
        </Typography>
        <Link to={"/auth"} style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            sx={{
              mt: 2,
              fontSize: "1.2rem",
              width: "auto",
              px: 2,
            }}
          >
            Login
          </Button>
        </Link>
        {loading && (
          <CircularProgress
            size={48}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Container>
    </Box>
  );
};

export default SignUpPage;
