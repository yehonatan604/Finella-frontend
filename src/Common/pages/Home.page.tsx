import React from "react";
import { Box, Button, Typography, Container, Stack, Fade } from "@mui/material";
import { Task, Paid, NotificationsActive, Lock } from "@mui/icons-material";
import useAuth from "../../Auth/hooks/useAuth";
import { Link } from "react-router-dom";
import logoWhite from "../../Assets/images/logo-big-white.png";
import logoBlue from "../../Assets/images/logo-big-navy.png";
import FeatureBox from "../components/FeatureBox";
import useTheme from "../hooks/useTheme";
import UserHomeSummary from "../components/UserSummary";
import SummaryCharts from "../components/SummaryCharts";
import AbsTopIcons from "../components/layout/AbsTopIcons";

const HomePage = () => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const logoImg = mode === "light" ? logoBlue : logoWhite;

  return !user ? (
    <>
      <AbsTopIcons hideHome />
      <Fade in timeout={1000}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            color: "text.primary",
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <img
              src={logoImg}
              alt="Finella Logo"
              style={{
                width: "15rem",
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
              Your personal management platform for organizing tasks, automating notes,
              and tracking your financial growth.
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <Link to="/auth" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ px: 5, py: 1.5, fontSize: "1.1rem", boxShadow: 3 }}
                >
                  Login
                </Button>
              </Link>
              <Link to="/auth/signup" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ px: 5, py: 1.5, fontSize: "1.1rem", boxShadow: 3 }}
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          </Container>
        </Box>
      </Fade>
    </>
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

      <UserHomeSummary />
      <SummaryCharts />
    </Box>
  );
};

export default HomePage;
