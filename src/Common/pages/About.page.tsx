import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import useAuth from "../../Auth/hooks/useAuth";
import AbsTopIcons from "../components/layout/AbsTopIcons";

const AboutPage = () => {
  const { user } = useAuth();
  return (
    <Box
      sx={{
        mb: 10,
        color: "text.primary",
        overflow: "auto",
        maxHeight: "100vh",
        width: user ? "85vw" : "100vw",
        px: 20,
        py: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {!user && <AbsTopIcons />}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          About Finella
        </Typography>
        <Typography sx={{ mb: 4, width: "35vw" }} variant="h6" color="text.secondary">
          Finella is your personal productivity assistant — combining task management,
          note automation, financial tracking, and real-time alerts into one clean
          interface.
        </Typography>
      </Box>

      <Box sx={{ width: "22vw" }}>
        <Section title="📝 Notes">
          <ul>
            <li>Create free-form notes for thoughts, ideas, or reminders.</li>
            <li>Sticky notes appear pinned at the top and are visually highlighted.</li>
            <li>
              Notes can be edited at any time, deleted and undeleted, and toggled as
              sticky.
            </li>
          </ul>
        </Section>

        <Section title="⏰ Note Automations">
          <ul>
            <li>
              Automatically generate notes at specific times using scheduling rules.
            </li>
            <li>
              When a note is triggered, a live alert appears and the note is set as
              sticky.
            </li>
            <li>
              Automation is based on UTC time but always displayed in your local timezone.
            </li>
          </ul>
        </Section>

        <Section title="✅ ToDos">
          <ul>
            <li>
              Create grouped ToDo items with separate tasks, start date, and end date.
            </li>
            <li>Each task can be marked complete or deleted individually.</li>
            <li>
              If a ToDo expires without being completed, it's marked as FAILED and
              triggers a note and alert.
            </li>
          </ul>
        </Section>

        <Section title="💼 Workplaces">
          <ul>
            <li>Workplaces represent job locations or roles used for salary tracking.</li>
            <li>To track salaries, you must first create at least one workplace.</li>
            <li>
              Each salary is attached to a specific workplace and tracked over time.
            </li>
          </ul>
        </Section>

        <Section title="💰 Balance Entries">
          <ul>
            <li>Add income or expense records with optional VAT and notes.</li>
            <li>
              Workplace is optional — use it when relevant to track against a job or role.
            </li>
            <li>
              Entries are grouped monthly and displayed in dashboard charts and reports.
            </li>
          </ul>
        </Section>

        <Section title="📊 Dashboards & Charts">
          <ul>
            <li>
              The home dashboard displays your unread notes, active todos, and monthly
              balance.
            </li>
            <li>
              Additional financial charts are available under the Balance section — by
              name and by date.
            </li>
            <li>
              All data tables in Finella (Notes, ToDos, Salaries, Balance Entries) are
              exportable to Excel or PDF with one click.
            </li>
          </ul>
        </Section>

        <Section title="🛠️ Tools">
          <ul>
            <li>
              Floating draggable tools like Timer let you stay productive while
              multitasking.
            </li>
            <li>
              Timer supports both Stopwatch (open-ended) and Countdown (set duration with
              alert).
            </li>
            <li>
              Dialogs can be minimized to the bottom left and will preserve their state
              when reopened.
            </li>
          </ul>
        </Section>

        <Section title="📡 Real-Time">
          <ul>
            <li>Finella uses WebSocket to push live alerts — no refresh needed.</li>
            <li>
              When a ToDo fails or a Note Automation is triggered, you'll be instantly
              notified.
            </li>
            <li>
              Everything is synced live between client and server — giving you a seamless
              experience.
            </li>
          </ul>
        </Section>

        <Section title="🔐 Account Security & Signup">
          <ul>
            <li>
              Finella requires email verification when signing up to prevent spam and
              ensure privacy.
            </li>
            <li>
              Your account and personal data are protected. When you sign up, we make sure
              your password stays safe and never store it directly. You’ll stay securely
              logged in with an access token.
            </li>
            <li>
              The login and signup flows support basic validation and feedback for user
              clarity.
            </li>
          </ul>
        </Section>
      </Box>
    </Box>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Box component="div" sx={{ pl: 2 }}>
      {children}
    </Box>
  </Box>
);

export default AboutPage;
