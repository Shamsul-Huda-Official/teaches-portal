import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Check, X } from "lucide-react"
import { Card, Badge, Tabs, PageLoader } from "../../components/ui"
import toast from "react-hot-toast"
import { getSubjectById, updateSubject } from "../../services/api/subject.service"
import { getClasses } from "../../services/api/class.service"
import { getTeachers } from "../../services/api/teacher.service"

function EditableField({ label, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value || "")
  }, [value])

  const handleSave = async () => {
    await onSave(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value || "")
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
        <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{value || "—"}</p>
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
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

export default function SubjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("details")

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [subjectData, classData, teacherData] = await Promise.all([
          getSubjectById(id),
          getClasses(),
          getTeachers(),
        ])
        setSubject(subjectData)
        setClasses(classData)
        setTeachers(teacherData)
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load subject")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const getClassName = () => {
    if (!subject) return "—"
    const classId = String(subject.classId || subject.class?.id || "")
    const cls = classes.find((c) => String(c.id) === classId)
    return cls?.name || subject.className || "—"
  }

  const getDivisionName = () => {
    if (!subject) return "—"
    const division =
      typeof subject.divisionId === "string"
        ? subject.divisionId
        : subject.divisionId?.id || subject.divisionId?.name || subject.divisionId
    return division || "—"
  }

  const getTeacherName = () => {
    if (!subject) return "—"
    const teacherId = String(subject.teacherId || subject.teacher?.id || "")
    const teacher = teachers.find((t) => String(t.id) === teacherId)
    return teacher?.name || subject.teacher?.name || subject.teacherName || "—"
  }

  const updateField = (key) => async (value) => {
    if (!subject) return

    try {
      await updateSubject(id, { [key]: value })
      setSubject((prev) => ({ ...prev, [key]: value }))
      toast.success("Subject updated")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update subject")
    }
  }

  if (loading) {
    return <PageLoader text="Loading subject..." />
  }

  if (!subject) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm dark:text-slate-400 text-slate-500">Subject not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/subjects")}
        className="flex items-center gap-2 mb-5 text-sm transition-all dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Back to Subjects
      </button>

      <Card className="p-6 mb-5">
        <div className="grid gap-6 md:grid-cols-[minmax(240px,_280px)_1fr]">
          <div className="space-y-4">
            <p className="text-xs dark:text-slate-500 text-slate-400">Subject</p>
            <EditableField
              label="Name"
              value={subject.name || "—"}
              onSave={updateField("name")}
            />
            <Badge color={subject.isActive ? "green" : "red"}>
              {subject.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="dark:bg-slate-800/50 bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-xs dark:text-slate-500 text-slate-400">Class</p>
              <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{getClassName()}</p>
            </div>
            <div className="dark:bg-slate-800/50 bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-xs dark:text-slate-500 text-slate-400">Division</p>
              <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{getDivisionName()}</p>
            </div>
            <div className="col-span-2 dark:bg-slate-800/50 bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-xs dark:text-slate-500 text-slate-400">Assigned Teacher</p>
              <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{getTeacherName()}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <Tabs
          tabs={[{ label: "Details", value: "details" }]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "details" && (
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs dark:text-slate-500 text-slate-400">Subject ID</p>
              <p className="font-medium dark:text-slate-100 text-slate-800">{subject.id}</p>
            </div>
            <div>
              <p className="text-xs dark:text-slate-500 text-slate-400">Class ID</p>
              <p className="font-medium dark:text-slate-100 text-slate-800">{subject.classId || subject.class?.id || "—"}</p>
            </div>
            <div>
              <p className="text-xs dark:text-slate-500 text-slate-400">Division</p>
              <p className="font-medium dark:text-slate-100 text-slate-800">{getDivisionName()}</p>
            </div>
            <div>
              <p className="text-xs dark:text-slate-500 text-slate-400">Teacher ID</p>
              <p className="font-medium dark:text-slate-100 text-slate-800">{subject.teacherId || subject.teacher?.id || "—"}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
