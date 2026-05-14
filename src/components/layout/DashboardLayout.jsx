import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"

export default function DashboardLayout() {
    const [ sidebarOpen, setSidebarOpen ] = useState(false);
  return (
    <div className="min-h-screen dark:bg-[#0a0f1e] bg-slate-100 flex">
        <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
         />
         <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <Outlet />
            </main>
         </div>
    </div>
  )
}