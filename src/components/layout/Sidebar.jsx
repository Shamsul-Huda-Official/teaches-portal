import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  GraduationCap,
  BookOpen,
  School,
  Clock,
  HandCoins,
  ChevronDown,
  LogOut,
  Building2,
  X
} from "lucide-react"
import { useAuth } from "../../store/AuthContext"
import { getInitials } from "../../utils"

const NAV_ITEMS = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        to: "/dashboard"
    },
    {
        label: "Mark Attendance",
        icon: ClipboardCheck,
        to: "/attendance"
    },
    {
        label: "Teachers", 
        icon: Users,
        children: [
            { label: "All Teachers", to: "/teachers" },
            { label: "Add Teacher",  to: "/teachers/create" },
            { label: "Bulk Upload",  to: "/teachers/bulk" },
        ]
    },
    {
    label: "Students",
    icon: GraduationCap,
    children: [
      { label: "All Students", to: "/students" },
      { label: "Add Student",  to: "/students/create" },
      { label: "Bulk Upload",  to: "/students/bulk" },
    ],
  },
  {
    label: "Classes",
    icon: School,
    children: [
      { label: "All Classes", to: "/classes" },
      { label: "Add Class",   to: "/classes/create" },
    ],
  },
  {
    label: "Subjects",
    icon: BookOpen,
    children: [
      { label: "All Subjects", to: "/subjects" },
      { label: "Add Subject",  to: "/subjects/create" },
      // { label: "Bulk Upload",  to: "/subjects/bulk" },
    ],
  },
  {
    label: "Periods",
    icon: Clock,
    children: [
      { label: "All Periods", to: "/periods" },
      { label: "Add Period",  to: "/periods/create" },
      { label: "Assign Period", to: "/periods/:id/assign"}
    ],
  },
  // {
  //   label: "Donation",
  //   icon: HandCoins,
  //   children: [
  //     { label: "All Donations", to: "/donation" },
  //     { label: "Add Donation",  to: "/donation/create" },
  //   ],
  // },
]

function NavItem({ item, onNavigate }) {
    const [ open, setOpen ] = useState(false);
    if(!item.children) {
        return (
          <NavLink 
          to={item.to}
          end
          onClick={onNavigate}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
            ${isActive
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/8"
            }`
          }>
            <item.icon size={18} strokeWidth={1.5} />
            {item.label}
          </NavLink>
        )
    }

    return (
      <div>
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-scale-100 hover:bg-white/8 transition-all duration-150"
        >
          <item.icon size={18} strokeWidth={1.75} />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 opacity-60 ${open ? "rotate-180": ""}`}
          />
        </button>

        {open && (
          <div 
            className="ml-7 mt-0.5 mb-1 flex flex-col border-l border-white/8 pl-3"
          >
            {item.children.map((child) =>(
              <NavLink 
                key={child.to}
                to={child.to}
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  `py-2 px-2 rounded-lg text-xs transition-all duration-150
                  ${ isActive
                    ? "text-blue-400 font-semibold"
                    : "text-slate-500 hover:text-slate-200"
                  }
                ` 
                }
                >
                  {child.label}
                </NavLink>
            ))}
          </div>
        )}
      </div>
    )

}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
          onClick={onClose}
        />
      )}
      <aside className={
        `fixed left-0 top-0 z-50 h-screen w-64 flex flex-col bg-slate-900/95 backdrop-blur-xl border-r border-white/6 transition-transform duration-300 ease-in-out ${ open ? "translate-x-0" : "-translate-x-full" } md:translate-x-0`
      }>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 shadow-lg rounded-xl shadow-blue-600/30">
              <Building2 size={15} className="text-white" />
            </div>
            <span  className="text-base font-bold tracking-tight text-white">Attendance SaaS </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-all"
          >
            <X size={15} className="font-bold text-white" />
          </button>
        </div>
       
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="px-6 py-6 border-t border-white/6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-bold text-blue-400 border rounded-full bg-blue-600/15 border-blue-500/20">
              {getInitials(user?.name || "U")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-slate-200">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs truncate text-slate-500">
                {user?.role || "admin"}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

      </aside>
    </>
  )
}