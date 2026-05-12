import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/shared/ProtectedRoute';
import PublicRoute from "./components/shared/PublicRoute"
import DashboardLayout from "./components/layout/DashboardLayout"

import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import TeachersListPage from "./pages/teachers/TeachersListPage"
import TeacherCreatePage from "./pages/teachers/TeacherCreatePage"
import TeacherDetailPage from "./pages/teachers/TeacherDetailPage"
import TeacherBulkPage from "./pages/teachers/TeacherBulkPage"
import StudentsListPage from "./pages/students/StudentsListPage"
import StudentCreatePage from "./pages/students/StudentCreatePage"
import StudentDetailPage from "./pages/students/StudentDetailPage"
import StudentBulkPage from "./pages/students/StudentBulkPage"
import ClassesListPage from "./pages/classes/ClassesListPage"
import ClassCreatePage from "./pages/classes/ClassCreatePage"
import ClassDetailPage from "./pages/classes/ClassDetailPage"
import SubjectsListPage from "./pages/subjects/SubjectsListPage"
import SubjectCreatePage from "./pages/subjects/SubjectCreatePage"
import SubjectBulkPage from "./pages/subjects/SubjectBulkPage"
import PeriodsListPage from "./pages/periods/PeriodsListPage"
import PeriodCreatePage from "./pages/periods/PeriodCreatePage"
import PeriodAssignPage from "./pages/periods/PeriodAssignPage"
import AttendanceMarkPage from "./pages/attendance/AttendanceMarkPage"
import AttendanceViewPage from "./pages/attendance/AttendanceViewPage"
import AttendanceStudentPage from "./pages/attendance/AttendanceStudentPage"
import DonationListPage from "./pages/donation/DonationListPage"
import DonationCreatePage from "./pages/donation/DonationCreatePage"


export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

         <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"                         element={<DashboardPage />} />
            <Route path="/teachers"                          element={<TeachersListPage />} />
            <Route path="/teachers/create"                   element={<TeacherCreatePage />} />
            <Route path="/teachers/bulk"                     element={<TeacherBulkPage />} />
            <Route path="/teachers/:id"                      element={<TeacherDetailPage />} />
            <Route path="/students"                          element={<StudentsListPage />} />
            <Route path="/students/create"                   element={<StudentCreatePage />} />
            <Route path="/students/bulk"                     element={<StudentBulkPage />} />
            <Route path="/students/:id"                      element={<StudentDetailPage />} />
            <Route path="/classes"                           element={<ClassesListPage />} />
            <Route path="/classes/create"                    element={<ClassCreatePage />} />
            <Route path="/classes/:id"                       element={<ClassDetailPage />} />
            <Route path="/subjects"                          element={<SubjectsListPage />} />
            <Route path="/subjects/create"                   element={<SubjectCreatePage />} />
            <Route path="/subjects/bulk"                     element={<SubjectBulkPage />} />
            <Route path="/periods"                           element={<PeriodsListPage />} />
            <Route path="/periods/create"                    element={<PeriodCreatePage />} />
            <Route path="/periods/:id/assign"                element={<PeriodAssignPage />} />
            <Route path="/attendance"                        element={<AttendanceMarkPage />} />
            <Route path="/attendance/view"                   element={<AttendanceViewPage />} />
            <Route path="/attendance/student/:studentId"     element={<AttendanceStudentPage />} />
            <Route path="/donation"                          element={<DonationListPage />} />
            <Route path="/donation/create"                   element={<DonationCreatePage />} />
          </Route>
        </Route>

        <Route path="/"   element={<Navigate to="/dashboard" replace />} />
        <Route path="*"   element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

