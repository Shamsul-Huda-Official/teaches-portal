import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera } from "lucide-react"
import {
  Button, Card, Badge, Tabs, Avatar, SectionHeader
} from "../../components/ui"
import { ATTENDANCE_STATUS} from "../../constants"
 
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

function AttendanceTab({ stats }) {
  const statItems = [
    { label: "Total Attendance", value: stats.total, color:"slate" },
    { label: "Total Present", value: stats.present, color:"green" },
    { label: "Total Absent", value: stats.absent, color:"red" },
    { label: "Total Official Leave", value: stats.total, color:"blue" },
    { label: "Total Medical Leave", value: stats.total, color:"purple" },
    {
      label: "Recovery Status",
      value: "Pending",
      color: "amber",
    }
  ]
  
  const colorMap = {
    slate: "dark:bg-slate-800 bg-slate-50 dark:text-slate-100 text-slate-800",
    red: "bg-red-500/10 text-red-500",
    blue: "bg-purple-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    amber: "bg-amber-500/10 text-amber-500",
  }
  
  return (
    <div>
      <h1>Attendance Tab</h1>
    </div>
  )
}

function RecoveryTab({ records, onSave }) {
  const [ statuses, setStatuses ] = useState(
    Object.fromEntries(records.map((r) => [r.id, r.status]))
  )
  const setStatus = (id, val) =>
    setStatuses((p) => ({ ...p, [id]: val}))
  
  const handleRecoverAll = () => {
    const all = Object.fromEntries(records.map((r) => [r.id, "RECOVERED"]))
    setStatuses(all)
  }
  
  return (
    <h1>Revovert AL </h1>
  )
}

export default function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState("attendance")
  const student = MOCK_STUDENT
  const stats = MOCK_ATTENDANCE_STATS
  const records = MOCK_ABSENT_RECORDS
  
  const handleSave = () => {
    console.log("Save recovery status");
  }
  return (
      <div>
        <button
          onClick={() => navigate("/students")} 
          className="flex items-center gap-2 mb-5 text-sm transition-all dark:text-slate-400 text-slate-500 hover:dark:text-slate-200 hover:text-slate-700"
        >
          <ArrowLeft size={15} /> Back to Students
        </button>
        <Card className="p-6 mb-5">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* avatar  */}
            <div className="flex flex-col items-center flex-shrink-0 gap-2">
              <div className="relative">
                <Avatar
                  name={student.name}
                  src={student.profileImageUrl}
                  size="xl" 
                />
              </div>
              <Badge color={student.isActive ? "green": "red"}>
                {student.isActive ? "Active": "Inactive"}
              </Badge>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3">
              {[
                { label: "Name",            value: student.name            },
                { label: "Phone",           value: student.phone           },
                { label: "Class",           value: student.className       },
                { label: "Division",        value: student.divisionName    },
                { label: "Roll No.",        value: student.rollNumber      },
                { label: "Admission No.",   value: student.admissionNumber },
                { label: "Parent",          value: student.parentName      },
                { label: "Email",           value: student.email || "—"   },
              ].map(({ label, value }) => (
                <div
                  key={label} 
                  className="gap-2 p-2 px-3 dark:bg-slate-800/50 bg-slate-50 rounded-xl">
                  <p className="text-xs dark:text-slate-500 text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium dark:text-slate-100 text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
        </Card>
        <div className="mb-4">
          <Tabs
            tabs={[
              {label: "Attendance", value: "attendance"},
              {label: "Recovery Status", value: "recovery"}
            ]} 
            active={tab}
            onChange={setTab}
          />
        </div>
        {tab === "attendance" && <AttendanceTab stats={stats} />}
        {tab === "recovery" && <RecoveryTab records={records} onSave={handleSave} />}
      </div>
  )
}