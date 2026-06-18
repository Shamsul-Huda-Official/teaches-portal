import { useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button, Select, Card, Avatar } from "../../components/ui"
import { DAYS_OF_WEEK } from "../../constants"
import toast from "react-hot-toast"
import {getClasses, getPeriods, getSubjects, getTeachers, assignSubject} from "../../services"


function groupByDay(periods) {
  return periods.reduce((acc, p) => {
    const day = p.dayOfWeek
    if (!acc[day]) acc[day] = []
    acc[day].push(p)
    return acc
  }, {})
}

export default function PeriodAssignPage() {
  const navigate = useNavigate()
  const [ searchParams] = useSearchParams()
  const classId = searchParams.get("classId")
  const divisionId = searchParams.get("division")
  
  const [classes, setClasses] = useState([])
  const [periods, setPeriods] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false) 
  const [assignments, setAssignments] = useState({})
  
  useEffect(() => {
    if (!classId || !divisionId) return
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [cls, per, sub, tea] = await  Promise.all([
          getClasses(),
          getPeriods({ classId, divisionId}),
          getSubjects({ classId, divisionId}),
          getTeachers(),
        ])
        setClasses(cls || [])
        setPeriods(per || [])
        setSubjects(sub || [])
        setTeachers(tea || [])
        
        const init = {}
        per?.forEach((p) => {
          init[p.id] = {
            subjectId: p.subjectId ?? "",
            teacherId: p.teacherId ?? "",
          }
        })
        setAssignments(init)
      } catch (err) {
        toast.error("Failed to load data.")
      } finally { 
        setLoading(false)
      }
    }
    fetchAll()
  }, [classId, divisionId])
  
  const selectedClass = classes.find((c) => c.id === classId)
  const selectedDivision = selectedClass?.divisions?.find((d) => d.id === divisionId)
  
  const getAssignment = (period) => ({
    subjectId: assignments[period.id]?.subjectId ?? "",
    teacherId: assignments[period.id]?.teacherId ?? "",
  })
  
  const setField = (periodId, field, val ) => 
    setAssignments((prev) => ({
      ...prev,
      [periodId]: { ...prev[periodId], [field]: val}
    })
  

  // const [assignments, setAssignments] = useState(
  //   Object.fromEntries(
  //     MOCK_PERIODS.map((p) => [
  //       p.id,
  //       { subjectId: p.subjectId, teacherId: p.teacherId },
  //     ])
  //   )
  // )
  const [loading, setLoading] = useState(false)

  const setField = (periodId, field, val) =>
    setAssignments((prev) => ({
      ...prev,
      [periodId]: { ...prev[periodId], [field]: val },
    }))

  const handleSave = () => {
    setLoading(true)
    console.log("Save assignments:", assignments)
    setTimeout(() => {
      setLoading(false)
      navigate("/periods")
    }, 800)
  }

  const grouped = groupByDay(MOCK_PERIODS)

  return (
    <div>

      <button
        onClick={() => navigate("/periods")}
        className="flex items-center gap-2 mb-5 text-sm transition-all dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Back to Periods
      </button>

      <Card className="flex items-center justify-between px-5 py-4 mb-5">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs dark:text-slate-500 text-slate-400">Class</p>
            <p className="text-sm font-semibold dark:text-slate-100 text-slate-800">
              {MOCK_CLASS.name}
            </p>
          </div>
          <div className="w-px h-8 dark:bg-slate-700 bg-slate-200" />
          <div>
            <p className="text-xs dark:text-slate-500 text-slate-400">Division</p>
            <p className="text-sm font-semibold dark:text-slate-100 text-slate-800">
              {MOCK_DIVISION.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar name={MOCK_TEACHER.name} src={MOCK_TEACHER.profileImageUrl} size="sm" />
          <span className="hidden text-sm font-medium dark:text-slate-200 text-slate-700 sm:block">
            {MOCK_TEACHER.name}
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([day, periods]) => (
          <div key={day}>
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase dark:text-slate-400 text-slate-500">
              {DAYS_OF_WEEK.find((d) => d.value === Number(day))?.label}
            </p>

            <Card className="divide-y dark:divide-slate-800 divide-slate-100">
              {periods.map((period, i) => (
                <div
                  key={period.id}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg dark:bg-slate-800 bg-slate-100">
                    <span className="text-xs font-bold dark:text-slate-400 text-slate-500">
                      {i + 1}
                    </span>
                  </div>

                  <div className="flex-shrink-0 w-20">
                    <p className="text-sm font-medium dark:text-slate-100 text-slate-800">
                      {period.name}
                    </p>
                    <p className="text-xs dark:text-slate-500 text-slate-400">
                      {period.length} min
                    </p>
                  </div>

                  <div className="flex-1">
                    <select
                      value={assignments[period.id]?.subjectId || ""}
                      onChange={(e) => setField(period.id, "subjectId", e.target.value)}
                      className="w-full px-3 py-2 text-sm transition-all border rounded-xl dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 dark:text-slate-100 text-slate-800 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20"
                    >
                      <option value="">— Select Subject —</option>
                      {MOCK_SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 hidden sm:block">
                    <select
                      value={assignments[period.id]?.teacherId || ""}
                      onChange={(e) => setField(period.id, "teacherId", e.target.value)}
                      className="w-full px-3 py-2 text-sm transition-all border rounded-xl dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 dark:text-slate-100 text-slate-800 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20"
                    >
                      <option value="">— Select Teacher —</option>
                      {MOCK_TEACHERS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} loading={loading} size="lg">
          Save & Assign
        </Button>
      </div>

    </div>
  )
}