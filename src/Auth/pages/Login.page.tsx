import React from "react";
import { Box, Button, TextField, Typography, Container, Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import { loginSchema } from "../validations/login.schema";
import { joiResolver } from "@hookform/resolvers/joi";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { loginFormDefault } from "../forms/loginFormDefault";
import AbsTopIcons from "../../Common/components/layout/AbsTopIcons";
import FormValidationMessage from "../../Common/components/form/FormValidationMessage";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: loginFormDefault,
    resolver: joiResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: Record<string, unknown>) => {
    await login(data);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AbsTopIcons />
      <Container
        maxWidth="md"
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "background.paper",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
          Please enter your credentials.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            {...register("email")}
            variant="outlined"
            fullWidth
            error={!!errors?.email}
            required
            helperText={errors?.email?.message as string}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            {...register("password")}
            variant="outlined"
            fullWidth
            type="password"
            required
            error={!!errors?.password}
            helperText={errors?.password?.message as string}
            sx={{ mb: 3 }}
          />

          <FormValidationMessage isValid={isValid} />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ fontSize: "1.2rem", py: 1, px: 2, width: "auto" }}
            disabled={!isValid}
          >
            Login
          </Button>
        </form>

        <Divider sx={{ my: 3, mb: 2 }} />

        <Typography variant="body1">Don't have an account?</Typography>
        <Link to={"/auth/signup"} style={{ textDecoration: "none" }}>
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
            Sign Up
          </Button>
        </Link>
      </Container>
    </Box>
  );
};

export default LoginPage;
