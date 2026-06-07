import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Pencil, Check, X } from "lucide-react"
import toast from "react-hot-toast"
import {
  Button, Card, Badge, Tabs, SectionHeader
} from "../../components/ui"
import { getStudentById, updateStudent } from "../../services/api/student.service"
import { getClasses } from "../../services/api/class.service"

// ─── MOCK DATA (keeping for UI that doesn't have API integration yet) ───
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

// ─── INLINE EDITABLE FIELD ────────────────────────────────────────────────────
function EditableField({ label, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(value)

  const handleSave = () => {
    onSave(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setEditing(false)
  }

  return (
    <div className="dark:bg-slate-800/50 bg-slate-50 rounded-xl px-3 py-2.5">
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-xs dark:text-slate-500 text-slate-400">{label}</p>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="p-1 transition-all rounded-md dark:text-slate-500 text-slate-400 dark:hover:text-blue-400 hover:text-blue-500 dark:hover:bg-slate-700 hover:bg-slate-200"
          >
            <Pencil size={11} />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="p-1 transition-all rounded-md text-emerald-400 hover:bg-emerald-400/10"
            >
              <Check size={11} /> 
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-400 transition-all rounded-md hover:bg-red-400/10"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>
      {!editing ? (
        <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{value}</p>
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")  handleSave()
            if (e.key === "Escape") handleCancel()
          }}
          className="
            w-full text-sm font-medium bg-transparent
            dark:text-slate-100 text-slate-800
            border-b dark:border-slate-600 border-slate-300
            focus:outline-none focus:dark:border-blue-500 focus:border-blue-400
            pb-0.5 transition-all
          "
        />
      )}
    </div>
  )
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function DonutChart({ stats }) {
  const total    = stats.total || 1
  const segments = [
    { label: "Present",        value: stats.present,       color: "#10b981" },
    { label: "Absent",         value: stats.absent,        color: "#ef4444" },
    { label: "Official Leave", value: stats.officialLeave, color: "#3b82f6" },
    { label: "Medical Leave",  value: stats.medicalLeave,  color: "#a855f7" },
  ]

  const cx = 120, cy = 120, r = 95, stroke = 30
  const circumference = 2 * Math.PI * r
  let offset = 0

  const slices = segments.map((seg) => {
    const dash  = (seg.value / total) * circumference
    const slice = { ...seg, dash, offset }
    offset += dash
    return slice
  })

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Chart */}
      <div className="relative flex justify-center w-full">
        <svg width="240" height="240" className="-rotate-90">
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="dark:text-slate-800 text-slate-100"
          />
          {slices.map((s, i) => (
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
          <p className="text-3xl font-bold dark:text-slate-100 text-slate-800">
            {Math.round((stats.present / total) * 100)}%
          </p>
          <p className="text-xs dark:text-slate-400 text-slate-500">Present</p>
        </div>
      </div>

      {/* Legend — full width 2 cols */}
      <div className="grid w-full grid-cols-2 px-2 gap-x-8 gap-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1 text-xs truncate dark:text-slate-400 text-slate-500">
              {s.label}
            </span>
            <span className="text-xs font-semibold dark:text-slate-200 text-slate-700">
              {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ATTENDANCE TAB ───────────────────────────────────────────────────────────
function AttendanceTab({ stats }) {
  const colorMap = {
    slate:  "dark:bg-slate-800 bg-slate-50 dark:text-slate-100 text-slate-800",
    green:  "bg-emerald-500/10 text-emerald-500",
    red:    "bg-red-500/10 text-red-500",
    blue:   "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    amber:  "bg-amber-500/10 text-amber-500",
  }

  const statItems = [
    { label: "Total Attendance", value: stats.total,         color: "slate"  },
    { label: "Total Present",    value: stats.present,       color: "green"  },
    { label: "Total Absent",     value: stats.absent,        color: "red"    },
    { label: "Official Leave",   value: stats.officialLeave, color: "blue"   },
    { label: "Medical Leave",    value: stats.medicalLeave,  color: "purple" },
    { label: "Recovery Status",  value: "Pending",           color: "amber"  },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Stats 2 col */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((s) => (
          <div key={s.label} className={`rounded-xl px-4 py-3 ${colorMap[s.color]}`}>
            <p className="text-xs opacity-70">{s.label}</p>
            <p className="text-lg font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart full width */}
      <Card className="w-full p-5">
        <SectionHeader title="Period-wise Breakdown" />
        <DonutChart stats={stats} />
      </Card>
    </div>
  )
}

// ─── RECOVERY TAB ─────────────────────────────────────────────────────────────
function RecoveryTab({ records, onSave }) {
  const [statuses, setStatuses] = useState(
    Object.fromEntries(records.map((r) => [r.id, r.status]))
  )

  const handleRecoverAll = () =>
    setStatuses(Object.fromEntries(records.map((r) => [r.id, "RECOVERED"])))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" variant="success" onClick={handleRecoverAll}>
          Recover All
        </Button>
      </div>
      <Card className="divide-y dark:divide-slate-800 divide-slate-100">
        {records.map((r, i) => (
          <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-5 text-xs dark:text-slate-500 text-slate-400">{i + 1}.</span>
            <div className="grid flex-1 grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div>
                <p className="dark:text-slate-500 text-slate-400">Subject</p>
                <p className="font-medium dark:text-slate-200 text-slate-700">{r.subject}</p>
              </div>
              <div>
                <p className="dark:text-slate-500 text-slate-400">Period</p>
                <p className="font-medium dark:text-slate-200 text-slate-700">{r.period}</p>
              </div>
              <div className="hidden sm:block">
                <p className="dark:text-slate-500 text-slate-400">Date</p>
                <p className="font-medium dark:text-slate-200 text-slate-700">{r.date}</p>
              </div>
              <div className="hidden sm:block">
                <p className="dark:text-slate-500 text-slate-400">Purpose</p>
                <p className="font-medium dark:text-slate-200 text-slate-700">{r.purpose}</p>
              </div>
            </div>
            <select
              value={statuses[r.id]}
              onChange={(e) => setStatuses((p) => ({ ...p, [r.id]: e.target.value }))}
              className={`
                text-xs px-3 py-1.5 rounded-lg border font-medium
                focus:outline-none transition-all cursor-pointer shrink-0
                ${statuses[r.id] === "RECOVERED"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600 dark:border-slate-700 border-slate-200"
                }
              `}
            >
              <option value="RECOVERED">Recovered</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        ))}
      </Card>
      <div className="flex justify-end">
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}

export default function StudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState("attendance")
  const [preview, setPreview] = useState(null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [studentData, classesData] = await Promise.all([
          getStudentById(id),
          getClasses()
        ])
        setStudent(studentData)
        setClasses(classesData)
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch student")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const getClassName = () => {
    if (!student?.classId || !classes.length) return student?.className || "—"
    const cls = classes.find((c) => c.id === student.classId)
    return cls?.name || student?.className || "—"
  }

  const getDivisionName = (value) => {
    if (!value) return "—"
    return typeof value === "string" ? value : value?.name || value?.id || "—"
  }

  const updateField = (key) => async (val) => {
    if (!student) return
    const updated = { ...student, [key]: val }
    
    try {
      await updateStudent(id, {
        [key === "className" ? "name" : key]: val
      })
      setStudent(updated)
      toast.success("Student updated")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update student")
    }
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm dark:text-slate-400 text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm dark:text-slate-400 text-slate-500">Student not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">

      {/* Back */}
      <button
        onClick={() => navigate("/students")}
        className="flex items-center gap-2 mb-5 text-sm transition-all dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Back to Students
      </button>

      {/* Profile */}
      <Card className="p-6 mb-5">
        <div className="flex flex-col gap-6 sm:flex-row">

          {/* Profile image — square with rounded corners */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 overflow-hidden border-2 rounded-2xl dark:bg-slate-800 bg-slate-100 dark:border-slate-700 border-slate-200">
                {preview || student.profileImageUrl ? (
                  <img
                    src={preview || student.profileImageUrl}
                    alt={student.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-3xl font-bold dark:text-slate-600 text-slate-300">
                    {student.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute flex items-center justify-center text-white transition-all bg-blue-600 rounded-full shadow-lg cursor-pointer -bottom-1 -right-1 w-7 h-7 hover:bg-blue-500">
                <Camera size={13} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>
            <Badge color={student.isActive ? "green" : "red"}>
              {student.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Editable fields */}
          <div className="grid flex-1 grid-cols-2 gap-3">
            <EditableField label="Name"          value={student.name}            onSave={updateField("name")}            />
            <EditableField label="Phone"         value={student.phone}           onSave={updateField("phone")}           />
            <EditableField label="Class"         value={getClassName()}          onSave={updateField("className")}       />
            <EditableField label="Division"      value={getDivisionName(student.divisionId)}    onSave={updateField("divisionName")}    />
            <EditableField label="Roll No."      value={student.rollNumber}      onSave={updateField("rollNumber")}      />
            <EditableField label="Admission No." value={student.admissionNumber} onSave={updateField("admissionNumber")} />
            <EditableField label="Parent"        value={student.parentName}      onSave={updateField("parentName")}      />
            <EditableField label="Email"         value={student.email || "—"}   onSave={updateField("email")}           />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-4">
        <Tabs
          tabs={[
            { label: "Attendance",       value: "attendance" },
            { label: "Recovery Status",  value: "recovery"   },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "attendance" && <AttendanceTab stats={MOCK_ATTENDANCE_STATS} />}
      {tab === "recovery"   && <RecoveryTab   records={MOCK_ABSENT_RECORDS} onSave={() => console.log("saved")} />}
    </div>
  )
}