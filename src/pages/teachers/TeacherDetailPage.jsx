import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Pencil, Check, X } from "lucide-react"
import {
  Button, Card, Badge, Tabs, Avatar, SectionHeader, Table
} from "../../components/ui"

const MOCK_TEACHER = {
  id:             "1",
  name:           "Unais Hudawi",
  phone:          "8606548617",
  email:          "unaisuser@gmail.com",
  role:           "Principal",
  profileImageUrl: null,
  isActive:       true,
  isClassTeacher: true,
  className:      "Grade 9",
  divisionName:   "A",
}

const MOCK_STUDENTS = [
  { id: "1", name: "Mohammed Ajmal", admissionNumber: "ADM001", rollNumber: "01", phone: "9745804605", isActive: true  },
  { id: "2", name: "Sara Mathew",    admissionNumber: "ADM002", rollNumber: "02", phone: "9123456780", isActive: true  },
  { id: "3", name: "Riya Nair",      admissionNumber: "ADM003", rollNumber: "03", phone: "9000011112", isActive: false },
  { id: "4", name: "Anoop P",        admissionNumber: "ADM004", rollNumber: "04", phone: "9888877776", isActive: true  },
  { id: "5", name: "Fatima Zahra",   admissionNumber: "ADM005", rollNumber: "05", phone: "9777766665", isActive: true  },
]

function EditableField({ label, value, onSave }) {
  const [editing,  setEditing]  = useState(false)
  const [draft,    setDraft]    = useState(value)

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
        <p className="text-sm font-medium dark:text-slate-100 text-slate-800">
          {value}
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
  const [tab, setTab] = useState("profile")

  const [teacher, setTeacher] = useState(MOCK_TEACHER)

  const updateField = (key) => (val) => {
    setTeacher((p) => ({ ...p, [key]: val }))
    console.log("Update teacher field:", key, val)
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
              {teacher.role}
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
            value={teacher.role}
            onSave={updateField("role")}
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
        <StudentsTab teacher={teacher} students={MOCK_STUDENTS} />
      )}
    </div>
  )
}