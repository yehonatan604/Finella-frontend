import { Box, Button, Typography, Container } from "@mui/material";
import useAuth from "../../Auth/hooks/useAuth";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();

  return !user ? (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "parimary.main",
        p: 4,
      }}
    >
      <Container>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          My Self Management App
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: "600px", mx: "auto", opacity: 0.9 }}>
          A personal management app that helps you keep track of your tasks & financials.
        </Typography>
        <Link to="/auth" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4, fontSize: "1.2rem", px: 4, py: 1 }}
          >
            Start Now
          </Button>
        </Link>
      </Container>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Welcome back, {user.name.first} {user.name.last}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        What would you like to do today?
      </Typography>
    </Box>
  );
};

export default HomePage;
