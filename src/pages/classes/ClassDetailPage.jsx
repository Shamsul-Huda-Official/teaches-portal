import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Check, X } from "lucide-react"
import {
  Card, Badge, Tabs, Avatar, Table, PageLoader
} from "../../components/ui"
import toast from "react-hot-toast"
import { getClassById, updateClass } from "../../services/api/class.service"

function EditableField({ label, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || "")

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
        <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{value || "-"}</p>
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

function DivisionsTab({ divisions, onUpdateDivision }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {divisions.map((d, index) => (
        <Card key={d.id || index} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10">
                <span className="text-sm font-bold text-blue-400">{d.name}</span>
              </div>
              <div className="flex-1">
                <EditableField
                  label="Division"
                  value={d.name}
                  onSave={(value) => onUpdateDivision(index, "name")(value)}
                />
                <p className="text-xs dark:text-slate-500 text-slate-400">
                  {d.students} students
                </p>
              </div>
            </div>
            <Badge color="blue">{d.students}</Badge>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t dark:border-slate-800 border-slate-100">
            <span className="text-xs dark:text-slate-500 text-slate-400">
              Class Teacher:
            </span>
            {(d.classTeacher || d.classTeacherName) ? (
              <span className="text-xs font-medium dark:text-slate-200 text-slate-700">
                {d.classTeacher || d.classTeacherName}
              </span>
            ) : (
              <Badge color="amber">Not Assigned</Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

function StudentTab({ students }) {
    const navigate = useNavigate()
    const [division, setDivision] = useState("")

    const getDivisionName = (value) =>
      typeof value === "string"
        ? value
        : value?.name || value?.id || ""

    const filtered = division
        ? students.filter((s) => getDivisionName(s.divisionName) === division)
        : students
    
    const divisions = [ ...new Set(students.map((s) => getDivisionName(s.divisionName)))]

    const columns = [
        {
            key: "name", 
            label: "Student", 
            render: (v, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={v} size="sm" />
                    <div>
                        <p className="text-sm dark:text-slate-500 text-slate-400">
                            {row.admissionNumber}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "rollNumber", label: "Roll"
        },
        {
            key: "divisionName",
            label: "Division",
            render: (v) => {
                const divisionName = typeof v === "string" ? v : v?.name || v?.id || ""
                return <Badge color="purple">{divisionName}</Badge>
            }
        },
        {
            key: "phone", label: "Phone"
        },
        {
            key: "isActive",
            label: "Status",
            render: (v) => (
                <Badge color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Badge>
            )
        }
    ]
    
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setDivision("")} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${!division
                            ? "bg-blue-600 text-white"
                            : "dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500 dark:hover:bg-slate-700 hover:bg-slate-200"
                        }
                        `}
                >
                    All
                </button>
                {divisions.map((d) => (
                    <button
                        key={d}
                        onClick={() => setDivision(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${division === d
                            ? "bg-blue-600 text-white"
                            : "dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500 dark:hover:bg-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        Division {d}
                    </button>
                    ))}
                    <span className="self-center ml-auto text-xs dark:text-slate-500 text-slate-400">
                        {filtered.length} students
                    </span>
            </div>
            <Table
                columns={columns}
                data={filtered}
                onRowClick={(row) => navigate(`/students/${row.id}`)} 
            />
        </div>
    )
}

export default function ClassDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ tab, setTab ] = useState("division")
    const [cls, setCls] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchClass = async () => {
        try {
          setLoading(true)
          const data = await getClassById(id)
          setCls(data)
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to fetch class")
        } finally {
          setLoading(false)
        }
      }

      fetchClass()
    }, [id])

    const preparePayload = (classData) => ({
      name: classData.name,
      divisions: classData.divisions?.map((division) => ({
        id: division.id,
        name: division.name,
        classTeacherId: division.classTeacherId,
      })) || [],
    })

    const handleUpdate = async (updatedClass) => {
      try {
        await updateClass(id, preparePayload(updatedClass))
        setCls(updatedClass)
        toast.success("Class updated")
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update class")
      }
    }

    const updateField = (key) => async (value) => {
      if (!cls) return
      const updated = { ...cls, [key]: value }
      await handleUpdate(updated)
    }

    const updateDivisionField = (index, key) => async (value) => {
      if (!cls) return
      const updatedDivisions = (cls.divisions || []).map((division, idx) =>
        idx === index ? { ...division, [key]: value } : division
      )
      const updated = { ...cls, divisions: updatedDivisions }
      await handleUpdate(updated)
    }

    const students = cls?.students || []
    const totalStudents = (cls?.divisions || []).reduce((total, division) => total + (division.students || 0), 0)

    if (loading || !cls) {
      return <PageLoader text="Class details loading..." />
    }

    return (
        <div>
            <button
                onClick={() => navigate("/classes")}
                className="flex items-center gap-2 mb-5 text-sm transition-all dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
            >
                <ArrowLeft size={15} /> Back to Classes
            </button>
            <Card className="p-6 mb-5">
                <div className="flex-items-center-justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10">
                            <span className="text-lg font-bold text-blue-400">
                                {cls.name.split(" ")[1] || cls.name[0]}
                            </span>
                        </div>
                        <div className="flex-1">
                            <EditableField
                                label="Class Name"
                                value={cls.name}
                                onSave={updateField("name")}
                            />
                            <p className="mt-0.5 text-xs dark:text-slate-400 text-slate-500">
                                {cls.divisions.length} divisions . {totalStudents} students
                            </p>
                        </div>
                    </div>
                    <Badge
                        color={cls.isActive ? "green" : "red"}
                    >
                        {cls.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5 md:grid-cols-3" >
                    {[
                        { label: "Total Divisions", value: cls.divisions.length },
                        { label: "Total Students", value: totalStudents },
                        {
                            label: "Class Teacher",
                            value: cls.divisions.filter((d) => d.classTeacher || d.classTeacherName || d.classTeacherId).length,
                        },
                    ].map((s) => (
                        <div
                            key={s.label} 
                            className="px-3 rounded-xl dark:bg-slate-800 bg-slate-50 py-2.5 text-center">
                                <p className="text-lg font-bold dark:text-slate-100 text-slate-800">
                                    {s.value}
                                </p>
                                <p className="text-sm dark:text-slate-500 text-slate-400 mt-0.5">
                                    {s.label}
                                </p>
                            </div>
                    ))}
                </div>
            </Card>
            <div className="mb-4">
                <Tabs  
                    tabs={[
                        { label: "Students", value: "students" },
                        { label: "Divisions", value: "divisions" },
                    ]} 
                    active={tab}
                    onChange={setTab}
                />
            </div>
            
            {tab === "students" && <StudentTab students={students}  />}
            {tab === "divisions" && <DivisionsTab divisions={cls.divisions} onUpdateDivision={updateDivisionField} />}
        </div>
    )
}