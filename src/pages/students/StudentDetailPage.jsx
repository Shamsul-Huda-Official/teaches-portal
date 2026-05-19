import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera } from "lucide-react"
import {
  Button, Card, Badge, Tabs, Avatar, SectionHeader
} from "../../components/ui"
import { ATTENDANCE_STATUS, STATUS_COLORS } from "../../constants"
 
const MOCK_STUDENT = {
  id:              "1",
  name:            "Aakhil",
  admissionNumber: "ADM001",
  rollNumber:      "10",
  phone:           "9745804605",
  email:           "ajmal@mail.com",
  parentName:      "Jaleel",
  className:       "Grade 9",
  divisionName:    "A",
  profileImageUrl: null,
  isActive:        true,
}
 
const MOCK_ATTENDANCE_STATS = {
  total:         125,
  present:        80,
  absent:         20,
  officialLeave:  10,
  medicalLeave:   15,
}
 
const MOCK_ABSENT_RECORDS = [
  { id: "1", subject: "English",        period: 3, date: "23/02/2026", purpose: "Absent",         status: "RECOVERED" },
  { id: "2", subject: "Social",         period: 4, date: "23/02/2026", purpose: "Medical",        status: "RECOVERED" },
  { id: "3", subject: "Historiography", period: 1, date: "24/02/2026", purpose: "Official Leave", status: "PENDING"   },
  { id: "4", subject: "Mathematics",    period: 2, date: "25/02/2026", purpose: "Absent",         status: "PENDING"   },
  { id: "5", subject: "Physics",        period: 5, date: "25/02/2026", purpose: "Medical",        status: "PENDING"   },
]
 
function DonutChart({ stats }) { // Donut Chart
  const total    = stats.total || 1
  const segments = [
    { label: "Present",       value: stats.present,      color: "#10b981" },
    { label: "Absent",        value: stats.absent,       color: "#ef4444" },
    { label: "Official Leave",value: stats.officialLeave, color: "#3b82f6" },
    { label: "Medical Leave", value: stats.medicalLeave,  color: "#a855f7" },
  ]
 
  const cx = 80, cy = 80, r = 60, stroke = 24
  const circumference = 2 * Math.PI * r
  let offset = 0
 
  const slices = segments.map((seg) => {
    const pct  = seg.value / total
    const dash = pct * circumference
    const slice = { ...seg, pct, dash, offset }
    offset += dash
    return slice
  })

  return (
    <div className="flex flex-col items-center gap-3">
        <div className="relative">
            <svg width="160" height="160" className="-rotate-90" >
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="dark:text-slate-800 text-slate-100"
                />
                {slices.map((s, i) =>(
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={stroke}
                        strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                        strokeDashoffset={-s.offset} 
                    />
                ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold dark:text-slate-100 text-slate-800">
                    {Math.round((stats.present / total) * 100)}%
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-500">
                    Present
                </p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {segments.map((s) => (
            <div className="flex items-center gap-2">
              <div 
                className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                style={{ background: s.color }}
              >
                <span className="text-xs dark:text-slate-400 text-slate-500">
                  {s.label}
                </span>
                <span className="ml-auto text-xs font-medium dark:text-slate-200 text-slate-700">
                  {Math.round((s.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default function StudentDetailPage() {
    return (
        <div>
            <h1>Student Detail</h1>
        </div>
    )
}