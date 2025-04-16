import { Box, Button, Typography, Container, Stack, Fade } from "@mui/material";
import { Task, Paid, NotificationsActive, Lock } from "@mui/icons-material";
import useAuth from "../../Auth/hooks/useAuth";
import { Link } from "react-router-dom";
import logo from "../../Assets/images/logo.png";

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
          px: 3,
          pb: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <img
            src={logo}
            alt="Finella Logo"
            style={{
              width: "300px",
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
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
            <Feature
              icon={<Task fontSize="large" />}
              label="Task Management"
              description="Stay on top of your daily work with smart task tracking."
            />
            <Feature
              icon={<Paid fontSize="large" />}
              label="Financial Tracking"
              description="Monitor income, salaries, and balance effortlessly."
            />
            <Feature
              icon={<NotificationsActive fontSize="large" />}
              label="Note Automations"
              description="Automated note reminders, just when you need them."
            />
            <Feature
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

// Small reusable feature box
const Feature = ({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) => (
  <Box
    sx={{
      textAlign: "center",
      maxWidth: 200,
      px: 2,
      py: 1,
      transition: "all 0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        color: "primary.main",
      },
    }}
  >
    <Box color="primary.main" mb={1}>
      {icon}
    </Box>
    <Typography variant="subtitle1" fontWeight={600}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

export default HomePage;
