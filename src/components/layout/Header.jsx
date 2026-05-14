import { useLocation } from "react-router-dom"
import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "../../store/ThemeContext";
import { useAuth } from "../../store/AuthContext";
import { getInitials } from "../../utils";

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

export default function Header({ onMenuClick }) {
    const { pathname } = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 transition-colors duration-300 bg-white border-b md:px-6 h-14 dark:border-slate-700 border-slate-200 dark:bg-slate-900 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <button
                 onClick={ onMenuClick }
                 className="p-2 transition-all rounded-lg md:hidden dark:text-slate-400 text-slate-500 dark:hover:text-slate-100 hover:text-slate-500 dark:hover:bg-white/10 hover:bg-black/5"
                >
                    <Menu size={18} />
                </button>
                <h1 className="text-sm font-semibold tracking-wide dark:text-slate-100 text-slate-800">
                    {getTitle(pathname)}
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme} 
                    className="p-2 transition-all rounded-lg dark:text-slate-400 text-slate-500 dark:hover:text-slate-100 hover:text-slate-900 dark:hover:bg-white/10 hover:bg-black/5"
                >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <div className="w-px h-5 bg-black/10 dark:bg-white/10" />
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-400 border rounded-full border-blue-500/30 bg-blue-600/20 w-7 h-7">
                        {getInitials(user?.name || "U")}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-xs font-semibold leading-none dark:text-slate-200 text-slate-700">
                            {user?.name || "Admin"}
                        </p>
                        <p className="text-xs capitalize text-slate-400 dark:text-slate-500">
                            {user?.role?.toLowerCase() || "admin"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}