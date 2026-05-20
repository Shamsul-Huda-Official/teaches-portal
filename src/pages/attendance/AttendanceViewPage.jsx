import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card, Select, PageHeader, Table, Badge, Pagination
} from "../../components/ui"
import { DAYS_OF_WEEK } from "../../constants"
 
const MOCK_CLASSES = [
  { value: "1", label: "Grade 9"  },
  { value: "2", label: "Grade 10" },
]
 
const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}
 
const MOCK_RECORDS = [
  { id: "1",  studentName: "Mohammed Ajmal", subject: "Mathematics", period: "Period 1", date: "19/05/2026", type: "PERIOD",    status: "PRESENT" },
  { id: "2",  studentName: "Mohammed Ajmal", subject: "English",     period: "Period 2", date: "19/05/2026", type: "PERIOD",    status: "ABSENT"  },
  { id: "3",  studentName: "Sara Mathew",    subject: "Mathematics", period: "Period 1", date: "19/05/2026", type: "PERIOD",    status: "PRESENT" },
  { id: "4",  studentName: "Sara Mathew",    subject: "English",     period: "Period 2", date: "19/05/2026", type: "PERIOD",    status: "MEDICAL" },
  { id: "5",  studentName: "Riya Nair",      subject: "Mathematics", period: "Period 1", date: "19/05/2026", type: "PERIOD",    status: "PRESENT" },
  { id: "6",  studentName: "Riya Nair",      subject: "English",     period: "Period 2", date: "19/05/2026", type: "PERIOD",    status: "EXCUSED" },
  { id: "7",  studentName: "Anoop P",        subject: null,          period: null,       date: "19/05/2026", type: "MORNING",   status: "ABSENT"  },
  { id: "8",  studentName: "Fatima Zahra",   subject: null,          period: null,       date: "19/05/2026", type: "AFTERNOON", status: "PRESENT" },
  { id: "9",  studentName: "Mohammed Ajmal", subject: "Physics",     period: "Period 3", date: "18/05/2026", type: "PERIOD",    status: "ABSENT"  },
  { id: "10", studentName: "Sara Mathew",    subject: "Physics",     period: "Period 3", date: "18/05/2026", type: "PERIOD",    status: "PRESENT" },
]

const STATUS_COLORS = {
  PRESENT: "green",
  ABSENT:  "red",
  MEDICAL: "blue",
  EXCUSED: "amber",
}
 
const TYPE_COLORS = {
  PERIOD:    "purple",
  MORNING:   "cyan",
  AFTERNOON: "amber",
}

const PAGE_SIZE = 7

const today = new Date().toISOString().split("T")[0]

export default function AttendanceViewPage() {
    const navigate = useNavigate()
    const [classId, setClassId] = useState("")
    const [divisionId, setDivisionId] = useState("")
    const [date, setDate] = useState(today)
    const [typeFilter, setTypeFilter] = useState("")
    const [page, setPage] = useState(1)

    const division = classId ? (MOCK_DIVISIONS[classId] || []) : []
    const isReady = classId && divisionId

    const filtered = isReady 
        ? MOCK_RECORDS.filter((r) => {
            const matchType = typeFilter ? r.type === typeFilter : true
            return matchType
        })
        : []

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleClass = (e) => {
        setClassId(e.target.value)
        setDivisionId("")
        setPage(1)
    }

    const columns = [
        {
            key: "studentName",
            label: "Student",
            render: (v) => (
                <span className="font-medium dark:text-slate-100 text-slate-800">
                    {v}
                </span>
            )
        },
        {
        key: "type",
        label: "Type",
        render: (v) => (
            <Badge color={TYPE_COLORS[v]}>{v}</Badge>
        ),
        },
        {
        key: "period",
        label: "Period",
        render: (v) => (
            <span className="dark:text-slate-300 text-slate-600">{v ?? "—"}</span>
        ),
        },
        {
        key: "subject",
        label: "Subject",
        render: (v) => (
            <span className="hidden sm:block dark:text-slate-300 text-slate-600">{v ?? "—"}</span>
        ),
        },
        {
        key: "date",
        label: "Date",
        render: (v) => (
            <span className="dark:text-slate-300 text-slate-600">{v}</span>
        ),
        },
        {
        key: "status",
        label: "Status",
        render: (v) => (
            <Badge color={STATUS_COLORS[v]}>{v}</Badge>
        ),
        },
    ]
    return (
        <div>
            <PageHeader title="View Attendance" />
        
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
                <Select
                placeholder="— Select Class —"
                options={MOCK_CLASSES}
                value={classId}
                onChange={handleClass}
                />
                <Select
                placeholder="— Select Division —"
                options={division}
                value={divisionId}
                onChange={(e) => { setDivisionId(e.target.value); setPage(1) }}
                disabled={!classId}
                />
                {isReady && (
                <>
                    <Select
                    placeholder="— All Types —"
                    options={[
                        { value: "PERIOD",    label: "Period Wise"  },
                        { value: "MORNING",   label: "Morning"      },
                        { value: "AFTERNOON", label: "Afternoon"    },
                    ]}
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
                    />
                    <input
                    type="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setPage(1) }}
                    className="
                        px-3 py-2.5 rounded-xl text-sm
                        dark:bg-slate-800/60 bg-white
                        dark:border-slate-700 border-slate-200 border
                        dark:text-slate-100 text-slate-800
                        focus:outline-none focus:ring-2
                        dark:focus:ring-blue-500/30 focus:ring-blue-500/20
                    "
                    />
                </>
                )}
            </div>
        
            {!classId && (
                <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🏫</span>
                </div>
                <p className="dark:text-slate-300 text-slate-600 font-medium text-sm">Select a Class</p>
                <p className="dark:text-slate-500 text-slate-400 text-xs mt-1">Choose a class to view attendance</p>
                </div>
            )}
        
            {classId && !divisionId && (
                <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">📋</span>
                </div>
                <p className="dark:text-slate-300 text-slate-600 font-medium text-sm">Select a Division</p>
                <p className="dark:text-slate-500 text-slate-400 text-xs mt-1">Choose a division to view attendance</p>
                </div>
            )}
        
            {isReady && paginated.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                <span className="text-2xl mb-3">📭</span>
                <p className="dark:text-slate-300 text-slate-600 font-medium text-sm">No records found</p>
                <p className="dark:text-slate-500 text-slate-400 text-xs mt-1">Try a different date or filter</p>
                </div>
            )}
        
            {isReady && paginated.length > 0 && (
                <>
                <p className="text-xs dark:text-slate-500 text-slate-400 mb-3">
                    {filtered.length} {filtered.length !== 1 ? "records" : "record"} found
                </p>
                <Table
                    columns={columns}
                    data={paginated}
                    onRowClick={(row) => navigate(`/attendance/student/${row.id}`)}
                />
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </>
            )}
            </div>
    )
}