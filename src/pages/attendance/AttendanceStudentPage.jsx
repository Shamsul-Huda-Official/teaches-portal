import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Card, Badge, PageHeader, Pagination } from "../../components/ui"
import { useState } from "react"
 
const MOCK_STUDENT = {
  name:            "Mohammed Ajmal",
  admissionNumber: "ADM001",
  className:       "Grade 9",
  divisionName:    "A",
}
 
const MOCK_RECORDS = [
  { id: "1",  subject: "Mathematics", period: "Period 1", date: "19/05/2026", type: "PERIOD",    status: "PRESENT" },
  { id: "2",  subject: "English",     period: "Period 2", date: "19/05/2026", type: "PERIOD",    status: "ABSENT"  },
  { id: "3",  subject: "Physics",     period: "Period 3", date: "19/05/2026", type: "PERIOD",    status: "PRESENT" },
  { id: "4",  subject: null,          period: null,       date: "19/05/2026", type: "MORNING",   status: "PRESENT" },
  { id: "5",  subject: "Mathematics", period: "Period 1", date: "18/05/2026", type: "PERIOD",    status: "ABSENT"  },
  { id: "6",  subject: "English",     period: "Period 2", date: "18/05/2026", type: "PERIOD",    status: "MEDICAL" },
  { id: "7",  subject: null,          period: null,       date: "18/05/2026", type: "MORNING",   status: "ABSENT"  },
  { id: "8",  subject: "Physics",     period: "Period 3", date: "17/05/2026", type: "PERIOD",    status: "EXCUSED" },
  { id: "9",  subject: null,          period: null,       date: "17/05/2026", type: "AFTERNOON", status: "PRESENT" },
  { id: "10", subject: "Mathematics", period: "Period 1", date: "16/05/2026", type: "PERIOD",    status: "PRESENT" },
]
 
const STATUS_COLORS = {
  PRESENT:  "green",
  ABSENT:   "red",
  MEDICAL:  "blue",
  EXCUSED:  "amber",
  RECOVERED:"purple",
}
 
const TYPE_LABELS = {
  PERIOD:    "Period",
  MORNING:   "Morning",
  AFTERNOON: "Afternoon",
}
 
const PAGE_SIZE = 7

export default function AttendanceStudentPage() {
    const { studentId } = useParams()
    const navigate = useNavigate()
    const [page, setPage] = useState("")
    
    const student = MOCK_STUDENT
    const records = MOCK_RECORDS
    
    const totalPages = Math.ceil(records.length / PAGE_SIZE)
    const paginated = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const absentCount = records.filter((r) =>
        r.status === "ABSENT" || 
        r.status === "MEDICAL" ||
        r.status === "EXCUSED"
    ).length

    const presentCount = records.filter((r) => 
        r.status === "PRESENT"
    ).length

    const total = records.length
    
    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700 mb-5 transition-all"
            >
                <ArrowLeft size={15} /> Back
            </button>
        
            <PageHeader
                title="Attendance History"
                subtitle={`${student.name} · ${student.className} · Division ${student.divisionName}`}
            />
        
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                { label: "Total",   value: total,        color: "dark:bg-slate-800 bg-slate-50 dark:text-slate-100 text-slate-800" },
                { label: "Present", value: presentCount,  color: "bg-emerald-500/10 text-emerald-500" },
                { label: "Absent",  value: absentCount,   color: "bg-red-500/10 text-red-500"         },
                ].map((s) => (
                <div key={s.label} className={`rounded-xl px-4 py-3 ${s.color}`}>
                    <p className="text-xs opacity-70">{s.label}</p>
                    <p className="text-lg font-bold mt-0.5">{s.value}</p>
                </div>
                ))}
            </div>
        
            <Card className="divide-y dark:divide-slate-800 divide-slate-100">
                {paginated.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium dark:text-slate-100 text-slate-800">
                        {r.subject ?? TYPE_LABELS[r.type]}
                        </p>
                        <Badge color={r.type === "PERIOD" ? "purple" : "cyan"}>
                        {r.period ?? TYPE_LABELS[r.type]}
                        </Badge>
                    </div>
                    <p className="text-xs dark:text-slate-500 text-slate-400">{r.date}</p>
                    </div>
                    <Badge color={STATUS_COLORS[r.status]}>{r.status}</Badge>
                </div>
                ))}
            </Card>
        
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
    )
}