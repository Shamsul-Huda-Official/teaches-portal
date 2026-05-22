import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Pencil, Check, X } from "lucide-react"
import {
  Card, Badge, Tabs, Avatar, Table,
  PageLoader
} from "../../components/ui"

import toast from "react-hot-toast"
import { getTeacherById, updateTeacher } from "../../services/api/teacher.service"

function EditableField({ label, value, onSave }) {
  const [editing,  setEditing]  = useState(false)
  const [draft,    setDraft]    = useState(value)
  
  useEffect(() => {
    setDraft(value || "")
  }, [value])

  const handleSave = async () => {
    await onSave(draft)
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
        <p className="text-sm font-medium dark:text-slate-100 text-slate-800">
          {value || "-"}
        </p>
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

function StudentsTab({ teacher, students }) {
  const navigate = useNavigate()

  if (!teacher.isClassTeacher) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100">
          <span className="text-2xl">👤</span>
        </div>
        <p className="text-sm font-medium dark:text-slate-300 text-slate-600">
          Not Assigned As A Teacher
        </p>
        <p className="text-xs dark:text-slate-500 text-slate-400">
          This teacher has no class assigned
        </p>
      </div>
    )
  }

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} size="sm" />
          <div>
            <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{v}</p>
            <p className="text-xs dark:text-slate-500 text-slate-400">{row.admissionNumber}</p>
          </div>
        </div>
      ),
    },
    { key: "rollNumber", label: "Roll" },
    { key: "phone",      label: "Phone" },
    {
      key: "isActive",
      label: "Status",
      render: (v) => (
        <Badge color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Badge>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm dark:text-slate-400 text-slate-500">
          Class Teacher of{" "}
          <span className="font-medium dark:text-slate-200 text-slate-700">
            {teacher.className} — Division {teacher.divisionName}
          </span>
        </p>
        <Badge color="blue">{students.length} students</Badge>
      </div>
      <Table
        columns={columns}
        data={students}
        onRowClick={(row) => navigate(`/students/${row.id}`)}
      />
    </div>
  )
}

export default function TeacherDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [tab, setTab] = useState("students")

  const [teacher, setTeacher] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeacher();
  }, [id])
  
  const fetchTeacher = async () => {
    try {
      setLoading(true)
      const data = await getTeacherById(id)
      setTeacher(data)
      setStudents(data.students || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch teacher"
      )
    } finally {
      setLoading(false)
    }
  }
  
  const updateField = (key) => async (val) => {
    try {
      await updateTeacher(id, {
        [key]: val,
      });
      
      setTeacher((prev) => ({
        ...prev,
        [key]: val,
      }))
      toast.success("Teacher updated")
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Updating teachers fields failed"
      )
    } 
  }
  
  if(loading || !teacher) {
    return <PageLoader text="Teacher Detail Loading..." />
  }

  return (
    <div>

      <button
        onClick={() => navigate("/teachers")}
        className="flex items-center gap-2 mb-5 text-sm transition-all dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Back to Teachers
      </button>

      <Card className="p-6 mb-5">
        <div className="flex flex-col items-center gap-4 mb-6">

          <div className="relative">
            <Avatar
              name={teacher.name}
              src={teacher.profileImageUrl}
              size="xl"
            />
            <button className="absolute bottom-0 right-0 flex items-center justify-center text-white transition-all bg-blue-600 rounded-full shadow-lg w-7 h-7 hover:bg-blue-500">
              <Camera size={13} />
            </button>
          </div>

          <div className="text-center">
            <p className="font-semibold dark:text-slate-100 text-slate-800">
              {teacher.name}
            </p>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
              {teacher.user?.role}
            </p>
          </div>

          <Badge color={teacher.isActive ? "green" : "red"}>
            {teacher.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <EditableField
            label="Name"
            value={teacher.name}
            onSave={updateField("name")}
          />
          <EditableField
            label="Role"
            value={teacher.user?.role}
          />
          <EditableField
            label="Phone"
            value={teacher.phone}
            onSave={updateField("phone")}
          />
          <EditableField
            label="Email"
            value={teacher.email}
            onSave={updateField("email")}
          />
        </div>
      </Card>

      <div className="mb-4">
        <Tabs
          tabs={[
            { label: "Students", value: "students" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "students" && (
        <StudentsTab teacher={teacher} students={students} />
      )}
    </div>
  )
}