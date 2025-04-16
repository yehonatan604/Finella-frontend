import { Box, Button, Typography, Container, Stack, Fade } from "@mui/material";
import { Task, Paid, NotificationsActive, Lock } from "@mui/icons-material";
import useAuth from "../../Auth/hooks/useAuth";
import { Link } from "react-router-dom";
import logo from "../../Assets/images/logo-big.png";
import FeatureBox from "../components/FeatureBox";

const HomePage = () => {
  const { user } = useAuth();

  return !user ? (
    <Fade in timeout={1000}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "start",
          justifyContent: "start",
          color: "text.primary",
          py: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <img
            src={logo}
            alt="Finella Logo"
            style={{
              width: "20vw",
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
              marginBottom: "6vh",
            }}
          />

          <Typography variant="h3" fontWeight={700} gutterBottom>
            Welcome to Finella
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
          >
            Your personal management platform for organizing tasks, automating notes, and
            tracking your financial growth.
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            useFlexGap
            flexWrap="wrap"
            mb={5}
          >
            <FeatureBox
              icon={<Task fontSize="large" />}
              label="Task Management"
              description="Stay on top of your daily work with smart task tracking."
            />
            <FeatureBox
              icon={<Paid fontSize="large" />}
              label="Financial Tracking"
              description="Monitor income, salaries, and balance effortlessly."
            />
            <FeatureBox
              icon={<NotificationsActive fontSize="large" />}
              label="Note Automations"
              description="Automated note reminders, just when you need them."
            />
            <FeatureBox
              icon={<Lock fontSize="large" />}
              label="Secure Access"
              description="Your data stays yours — encrypted and protected."
            />
          </Stack>

          <Link to="/auth" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 5, py: 1.5, fontSize: "1.1rem", boxShadow: 3 }}
            >
              Login
            </Button>
          </Link>
        </Container>
      </Box>
    </Fade>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        mt: 8,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Welcome back, {user.name.first} {user.name.last}
      </Typography>
      <Typography variant="body1">What would you like to do today?</Typography>
    </Box>
  );
};

export default HomePage;
