import { Box, Typography, Paper, Divider, Stack } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import useNote from "../../Notes/hooks/useNote";
import useToDo from "../../Todos/hooks/useToDo";
import { DateTime } from "luxon";
import useBalanceEntry from "../../BalanceEntries/hooks/useBalanceEntry";

const UserHomeSummary = () => {
  const { fetchedNotes } = useNote(true, true);
  const { fetchedToDos } = useToDo(true, true);
  const { fetchedBalanceEntries } = useBalanceEntry();

  const unreadNotes =
    fetchedNotes?.filter((n) => n.noteStatus !== "READ" && n.status !== "inactive")
      .length || 0;
  const activeTodos = fetchedToDos?.filter((t) => t.toDoStatus === "PENDING").length || 0;

  const currentMonth = DateTime.now().month;
  const currentYear = DateTime.now().year;
  const monthlyBalance =
    fetchedBalanceEntries
      ?.filter((e) => {
        const date = DateTime.fromISO(e.date);
        return (
          date.month === currentMonth &&
          date.year === currentYear &&
          e.status !== "inactive"
        );
      })
      .reduce((sum, e) => {
        const isExpense = String(e.type).toLowerCase().trim() === "expense";
        return isExpense ? sum - e.price : sum + e.price;
      }, 0) || 0;

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "background.default",
        maxWidth: 400,
        width: "100%",
        mt: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        🧾 Your Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="column" spacing={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <NotificationsIcon color="warning" />
          <Typography variant="body1">
            Unread Notes: <strong>{unreadNotes}</strong>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <CheckCircleIcon color="success" />
          <Typography variant="body1">
            Active Todos: <strong>{activeTodos}</strong>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography variant="body1">
            Monthly Balance: <strong>{monthlyBalance.toFixed(2)}</strong>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default UserHomeSummary;
