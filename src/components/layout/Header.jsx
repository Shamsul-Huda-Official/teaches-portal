import { useLocation } from "react-router-dom"

const PAGE_TITLES = {
    "/dashboard": "Dashboard",
    "/attendance":           "Mark Attendance",
    "/attendance/view":      "View Attendance",
    "/teachers":             "Teachers",
    "/teachers/create":      "Add Teacher",
    "/teachers/bulk":        "Bulk Upload Teachers",
    "/students":             "Students",
    "/students/create":      "Add Student",
    "/students/bulk":        "Bulk Upload Students",
    "/classes":              "Classes",
    "/classes/create":       "Add Class",
    "/subjects":             "Subjects",
    "/subjects/create":      "Add Subject",
    "/subjects/bulk":        "Bulk Upload Subjects",
    "/periods":              "Periods",
    "/periods/create":       "Add Period",
    "/donation":             "Donations",
    "/donation/create":      "Add Donation",
}

function getTitle(pathname) {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.startsWith("/teachers/")) return "Teacher Detail";
    if (pathname.startsWith("/students/")) return "Student Detail";
    if (pathname.startsWith("/classes/")) return "Class Detail";
    if (pathname.startsWith("/periods/")) return "Assign Period";
    if (pathname.startsWith("/attendance/")) return "Student Attendance";
    return "-";
}

export default function Header() {
    const { pathname } = useLocation();
    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    })
    return (
        <header className="flex items-center justify-between px-6 border-b h-14 bg-slate-950 border-slate-800">
            <h1 className="text-base font-medium text-slate-100">
                {getTitle(pathname)}
            </h1>
            <span className="text-sm text-slate-400">{today}</span>
        </header>
    )
}