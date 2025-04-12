import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import RouteGuard from "./RouteGuard";
import AddBalanceEntry from "../../Actions/forms/AddBalanceEntry";
import AddVacation from "../../Actions/forms/AddVacation";
import AddWorkplace from "../../Actions/forms/AddWorkplace";
import useAuth from "../../Auth/hooks/useAuth";
import LoginPage from "../../Auth/pages/Login.page";
import SignUpPage from "../../Auth/pages/SignUp.page";
import SalariesPage from "../../Actions/pages/Salaries.page";
import WorkplacesPage from "../../Actions/pages/Workplaces.page";
import PageHolder from "../../Common/components/PageHolder";
import HomePage from "../../Common/pages/Home.page";
import AddSalary from "../../Actions/forms/AddSalary";
import BalanceEntriesPage from "../../Actions/pages/BalanceEntries.page";
import ToDoPage from "../../Actions/pages/ToDo.page";
import AddToDo from "../../Actions/forms/AddToDo";
import NoteAutomationPage from "../../Notes/pages/NoteAutomation.page";
import NotesPage from "../../Notes/pages/Notes.page";
import NotesBoard from "../../Notes/pages/NotesBoard.page";

const AppRouter = () => {
  const { loginByToken } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loginByToken(token);
    }
  }, [loginByToken]);

  return (
    <Routes>
      <Route path="/" element={<PageHolder />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<></>} />
        <Route path="contact" element={<></>} />
      </Route>

      <Route path="/auth" element={<RouteGuard isLoggedIn={false} />}>
        <Route index element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>

      <Route path="/data" element={<RouteGuard isLoggedIn />}>
        <Route path="salaries" index element={<SalariesPage />} />
        <Route path="balance-entries" element={<BalanceEntriesPage />} />
        <Route path="workplaces" element={<WorkplacesPage />} />
        <Route path="todos" element={<ToDoPage />} />
      </Route>

      <Route path="/actions" element={<RouteGuard isLoggedIn />}>
        <Route path="add-salary" index element={<AddSalary />} />
        <Route path="add-balance-entry" element={<AddBalanceEntry />} />
        <Route path="add-vacation" element={<AddVacation />} />
        <Route path="add-workplace" index element={<AddWorkplace />} />
        <Route path="add-todo" index element={<AddToDo />} />
      </Route>

      <Route path="/notes" element={<RouteGuard isLoggedIn />}>
        <Route index element={<NotesPage />} />
        <Route path="note-automations" element={<NoteAutomationPage />} />
        <Route path="board" element={<NotesBoard />} />
      </Route>
    </Routes>
  );
};
export default AppRouter;
