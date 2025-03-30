import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import { loginSchema } from "../validations/login.schema";
import { joiResolver } from "@hookform/resolvers/joi";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { loginFormDefault } from "../forms/loginFormDefault";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container
        maxWidth="xs"
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
            helperText={errors?.email?.message as string}
            sx={{ mb: 2 }}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontSize: "1.2rem", py: 1 }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body1" sx={{ mt: 3 }}>
          Don't have an account?
        </Typography>
        <Link to={"/auth/signup"} style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 2,
              borderColor: "white",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
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
