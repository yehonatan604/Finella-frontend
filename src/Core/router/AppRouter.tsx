import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import RouteGuard from "./RouteGuard";
import useAuth from "../../Auth/hooks/useAuth";
import LoginPage from "../../Auth/pages/Login.page";
import SignUpPage from "../../Auth/pages/SignUp.page";
import PageHolder from "../../Common/components/layout/PageHolder";
import HomePage from "../../Common/pages/Home.page";
import ToDoPage from "../../Todos/pages/ToDo.page";
import NoteAutomationPage from "../../Notes/pages/NoteAutomation.page";
import NotesPage from "../../Notes/pages/Notes.page";
import NotesBoard from "../../Notes/pages/NotesBoard.page";
import SalariesPage from "../../Salaries/pages/Salaries.page";
import WorkplacesPage from "../../Workplaces/pages/Workplaces.page";
import TodosBoard from "../../Todos/pages/ToDoBoard.page";
import AboutPage from "../../Common/pages/About.page";
import BalanceEntriesPage from "../../BalanceEntries/pages/BalanceEntries.page";

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
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<></>} />
      </Route>

      <Route path="/auth" element={<RouteGuard isLoggedIn={false} />}>
        <Route index element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>

      <Route path="/records" element={<RouteGuard isLoggedIn />}>
        <Route path="salaries" index element={<SalariesPage />} />
        <Route path="balance-entries" element={<BalanceEntriesPage />} />
        <Route path="workplaces" element={<WorkplacesPage />} />
        <Route path="todos" element={<ToDoPage />} />
      </Route>

      <Route path="/notes" element={<RouteGuard isLoggedIn />}>
        <Route index element={<NotesPage />} />
        <Route path="note-automations" element={<NoteAutomationPage />} />
        <Route path="board" element={<NotesBoard />} />
      </Route>

      <Route path="/todos" element={<RouteGuard isLoggedIn />}>
        <Route index element={<ToDoPage />} />
        <Route path="board" element={<TodosBoard />} />
      </Route>
    </Routes>
  );
};
export default AppRouter;
