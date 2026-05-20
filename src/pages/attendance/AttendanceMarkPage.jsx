import { useState } from "react"
import { Check, X, Stethoscope, FileText, Clock } from "lucide-react"
import {
  Card, Select, Badge, PageHeader, Avatar, Button
} from "../../components/ui"
import { ATTENDANCE_TYPES } from "../../constants"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 9"  },
  { value: "2", label: "Grade 10" },
]

const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}

const MOCK_PERIODS = {
  "1-a": [
    { id: "p1", name: "Period 1", subject: "Mathematics", teacher: "Unais Hudawi"  },
    { id: "p2", name: "Period 2", subject: "English",     teacher: "Sara Mathew"   },
    { id: "p3", name: "Period 3", subject: "Physics",     teacher: "Ahmed Khan"    },
    { id: "p4", name: "Period 4", subject: "Chemistry",   teacher: "Riya Nair"     },
    { id: "p5", name: "Period 5", subject: "Biology",     teacher: "Meera Pillai"  },
  ],
  "1-b": [
    { id: "p6",  name: "Period 1", subject: "Mathematics", teacher: "Rahul Sharma"  },
    { id: "p7",  name: "Period 2", subject: "English",     teacher: "Fatima Zahra"  },
    { id: "p8",  name: "Period 3", subject: "Social",      teacher: "Anoop Krishnan"},
  ],
  "2-a": [
    { id: "p9",  name: "Period 1", subject: "Mathematics", teacher: "Unais Hudawi"  },
    { id: "p10", name: "Period 2", subject: "Physics",     teacher: "Ahmed Khan"    },
  ],
  "2-b": [
    { id: "p11", name: "Period 1", subject: "English",     teacher: "Sara Mathew"   },
    { id: "p12", name: "Period 2", subject: "Chemistry",   teacher: "Riya Nair"     },
  ],
}

const MOCK_STUDENTS = {
  "1-a": [
    { id: "1", name: "Mohammed Ajmal", rollNumber: "01", admissionNumber: "ADM001" },
    { id: "2", name: "Sara Mathew",    rollNumber: "02", admissionNumber: "ADM002" },
    { id: "3", name: "Riya Nair",      rollNumber: "03", admissionNumber: "ADM003" },
    { id: "4", name: "Anoop P",        rollNumber: "04", admissionNumber: "ADM004" },
    { id: "5", name: "Fatima Zahra",   rollNumber: "05", admissionNumber: "ADM005" },
  ],
  "1-b": [
    { id: "6", name: "Rahul Sharma",   rollNumber: "01", admissionNumber: "ADM006" },
    { id: "7", name: "Meera Pillai",   rollNumber: "02", admissionNumber: "ADM007" },
    { id: "8", name: "Ahmed Hassan",   rollNumber: "03", admissionNumber: "ADM008" },
  ],
  "2-a": [
    { id: "9",  name: "Priya Menon",   rollNumber: "01", admissionNumber: "ADM009" },
    { id: "10", name: "Zaid Rahman",   rollNumber: "02", admissionNumber: "ADM010" },
  ],
  "2-b": [
    { id: "11", name: "Aakhil K",      rollNumber: "01", admissionNumber: "ADM011" },
    { id: "12", name: "Noor Fathima",  rollNumber: "02", admissionNumber: "ADM012" },
  ],
}

const STATUS_CONFIG = {
  PRESENT:  { label: "P",       color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", activeColor: "bg-emerald-500 text-white border-emerald-500", icon: Check       },
  ABSENT:   { label: "A",       color: "bg-red-500/10 text-red-400 border-red-500/20",             activeColor: "bg-red-500 text-white border-red-500",         icon: X          },
  MEDICAL:  { label: "M",       color: "bg-blue-500/10 text-blue-400 border-blue-500/20",          activeColor: "bg-blue-500 text-white border-blue-500",       icon: Stethoscope },
  EXCUSED:  { label: "E",       color: "bg-amber-500/10 text-amber-400 border-amber-500/20",       activeColor: "bg-amber-500 text-white border-amber-500",     icon: FileText    },
}

const today = new Date().toISOString().split("T")[0]

function PeriodAttendance({ period, students, attendance, onStatusChange }) {
  const [collapsed, setCollapsed] = useState(false)

  const absentCount = students.filter(
    (s) => 
        attendance[`${s.id}-${period.id}`] === "ABSENT" ||
        attendance[`${s.id}-${period.id}`] === "MEDICAL" ||
        attendance[`${s.id}-${period.id}`] === "EXCUSED"
  ).length

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 dark:hover:bg-slate-800/50 hover:bg-slate-50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Clock size={14} className="text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold dark:text-slate-100 text-slate-800">
              {period.name}
            </p>
            <p className="text-xs dark:text-slate-500 text-slate-400">
              {period.subject} · {period.teacher}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {absentCount > 0 && (
            <Badge color="red">{absentCount} absent</Badge>
          )}
          <span className="text-xs dark:text-slate-500 text-slate-400">
            {collapsed ? "▶" : "▼"}
          </span>
        </div>
      </button>

      {!collapsed && (
        <div className="divide-y dark:divide-slate-800 divide-slate-100">
          {students.map((student) => {
            const key    = `${student.id}-${period.id}`
            const status = attendance[key] || "PRESENT"

            return (
              <div
                key={student.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium dark:text-slate-100 text-slate-800">
                      {student.name}
                    </p>
                    <p className="text-xs dark:text-slate-500 text-slate-400">
                      Roll {student.rollNumber}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(student.id, period.id, s)}
                      className={`
                        w-8 h-8 rounded-lg border text-xs font-bold
                        transition-all duration-150 flex items-center justify-center
                        ${status === s ? cfg.activeColor : cfg.color}
                      `}
                      title={s}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

function RegularAttendance({ students, attendance, onStatusChange, type }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b dark:border-slate-800 border-slate-100">
        <p className="text-sm font-semibold dark:text-slate-100 text-slate-800">
          {type === "MORNING" ? "🌅 Morning Attendance" : "🌇 Afternoon Attendance"}
        </p>
      </div>
      <div className="divide-y dark:divide-slate-800 divide-slate-100">
        {students.map((student) => {
          const key    = `${student.id}-${type}`
          const status = attendance[key] || "PRESENT"

          return (
            <div
              key={student.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size="sm" />
                <div>
                  <p className="text-sm font-medium dark:text-slate-100 text-slate-800">
                    {student.name}
                  </p>
                  <p className="text-xs dark:text-slate-500 text-slate-400">
                    Roll {student.rollNumber}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(student.id, type, s)}
                    className={`
                      w-8 h-8 rounded-lg border text-xs font-bold
                      transition-all duration-150 flex items-center justify-center
                      ${status === s ? cfg.activeColor : cfg.color}
                    `}
                    title={s}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function AttendanceMarkPage() {
  const [classId,    setClassId]    = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [type,       setType]       = useState("PERIOD")
  const [date,       setDate]       = useState(today)
  const [attendance, setAttendance] = useState({})
  const [loading,    setLoading]    = useState(false)
  const [saved,      setSaved]      = useState(false)

  const key      = classId && divisionId ? `${classId}-${divisionId}` : null
  const students = key ? (MOCK_STUDENTS[key] || []) : []
  const periods  = key ? (MOCK_PERIODS[key]   || []) : []
  const isReady  = classId && divisionId

  const divisions = classId ? (MOCK_DIVISIONS[classId] || []) : []

  const handleClass = (e) => {
    setClassId(e.target.value)
    setDivisionId("")
    setAttendance({})
    setSaved(false)
  }

  const handleDivision = (e) => {
    setDivisionId(e.target.value)
    setAttendance({})
    setSaved(false)
  }

  const handleStatusChange = (studentId, periodOrType, status) => {
    const k = `${studentId}-${periodOrType}`
    setAttendance((prev) => ({ ...prev, [k]: status }))
    setSaved(false)
  }

  const markAllPresent = () => {
    setAttendance({})
    setSaved(false)
  }

  const handleSubmit = () => {
    setLoading(true)

    const payload = []

    if (type === "PERIOD") {
      periods.forEach((period) => {
        students.forEach((student) => {
          const k      = `${student.id}-${period.id}`
          const status = attendance[k] || "PRESENT"
          payload.push({
            studentId:  student.id,
            periodId:   period.id,
            date,
            type:       "PERIOD",
            status,
          })
        })
      })
    } else {
      students.forEach((student) => {
        const k      = `${student.id}-${type}`
        const status = attendance[k] || "PRESENT"
        payload.push({
          studentId: student.id,
          date,
          type,
          status,
        })
      })
    }

    console.log("Attendance payload:", payload)

    setTimeout(() => {
      setLoading(false)
      setSaved(true)
    }, 800)
  }

  const totalAbsent = students.reduce((count, student) => {
    if (type === "PERIOD") {
      const hasAbsent = periods.some(
        (p) => attendance[`${student.id}-${p.id}`] === "ABSENT"
      )
      return hasAbsent ? count + 1 : count
    }
    return attendance[`${student.id}-${type}`] === "ABSENT"
      ? count + 1
      : count
  }, 0)

  return (
    <div className="max-w-3xl">
      <PageHeader title="Mark Attendance" />

      <Card className="p-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <Select
            placeholder="— Select Class —"
            options={MOCK_CLASSES}
            value={classId}
            onChange={handleClass}
          />
          <Select
            placeholder="— Select Division —"
            options={divisions}
            value={divisionId}
            onChange={handleDivision}
            disabled={!classId}
          />
          <Select
            label=""
            options={[
              { value: "PERIOD",    label: "Period Wise"  },
              { value: "MORNING",   label: "Morning"      },
              { value: "AFTERNOON", label: "Afternoon"    },
            ]}
            value={type}
            onChange={(e) => { setType(e.target.value); setAttendance({}); setSaved(false) }}
          />
          <div className="flex flex-col gap-1.5">
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full px-3 py-2.5 rounded-xl text-sm
                dark:bg-slate-800/60 bg-white
                dark:border-slate-700 border-slate-200 border
                dark:text-slate-100 text-slate-800
                focus:outline-none focus:ring-2
                dark:focus:ring-blue-500/30 focus:ring-blue-500/20
              "
            />
          </div>
        </div>
      </Card>

      {!classId && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <p className="dark:text-slate-300 text-slate-600 font-medium text-sm">Select a Class</p>
          <p className="dark:text-slate-500 text-slate-400 text-xs mt-1">Choose a class to continue</p>
        </div>
      )}

      {classId && !divisionId && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="dark:text-slate-300 text-slate-600 font-medium text-sm">Select a Division</p>
          <p className="dark:text-slate-500 text-slate-400 text-xs mt-1">Choose a division to mark attendance</p>
        </div>
      )}

      {isReady && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-sm dark:text-slate-300 text-slate-600">
                <span className="font-semibold dark:text-slate-100 text-slate-800">{students.length}</span> students
              </p>
              {totalAbsent > 0 && (
                <Badge color="red">{totalAbsent} absent</Badge>
              )}
              {saved && (
                <Badge color="green">✓ Saved</Badge>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={markAllPresent}>
              Mark All Present
            </Button>
          </div>

          <div className="flex gap-3 mb-4 flex-wrap">
            {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-md border text-xs font-bold flex items-center justify-center ${cfg.activeColor}`}>
                  {cfg.label}
                </div>
                <span className="text-xs dark:text-slate-400 text-slate-500 capitalize">
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>

          {type === "PERIOD" && (
            <div className="flex flex-col gap-3">
              {periods.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="text-2xl mb-3">📭</span>
                  <p className="dark:text-slate-300 text-slate-600 text-sm font-medium">No periods found</p>
                  <p className="dark:text-slate-500 text-slate-400 text-xs mt-1">Add periods for this class division first</p>
                </div>
              ) : (
                periods.map((period) => (
                  <PeriodAttendance
                    key={period.id}
                    period={period}
                    students={students}
                    attendance={attendance}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          )}

          {(type === "MORNING" || type === "AFTERNOON") && (
            <RegularAttendance
              students={students}
              attendance={attendance}
              onStatusChange={handleStatusChange}
              type={type}
            />
          )}

          {students.length > 0 && (
            <div className="flex justify-end mt-5 gap-3">
              <Button
                variant="secondary"
                onClick={markAllPresent}
              >
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                loading={loading}
                size="lg"
              >
                Save Attendance
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}