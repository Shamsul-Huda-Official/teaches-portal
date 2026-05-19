import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import {
  Card, Badge, Tabs, Avatar, Table, PageLoader, SectionHeader
} from "../../components/ui"
 
const MOCK_CLASS = {
  id:       "1",
  name:     "Grade 9",
  isActive: true,
  divisions: [
    { id: "a", name: "A", classTeacher: "Unais Hudawi",  students: 30 },
    { id: "b", name: "B", classTeacher: "Sara Mathew",   students: 28 },
    { id: "c", name: "C", classTeacher: null,             students: 25 },
  ],
}
 
const MOCK_STUDENTS = [
  { id: "1",  name: "Mohammed Ajmal", admissionNumber: "ADM001", rollNumber: "01", phone: "9745804605", divisionName: "A", isActive: true  },
  { id: "2",  name: "Sara Mathew",    admissionNumber: "ADM002", rollNumber: "02", phone: "9123456780", divisionName: "A", isActive: true  },
  { id: "3",  name: "Riya Nair",      admissionNumber: "ADM003", rollNumber: "03", phone: "9000011112", divisionName: "A", isActive: false },
  { id: "4",  name: "Anoop P",        admissionNumber: "ADM004", rollNumber: "04", phone: "9888877776", divisionName: "B", isActive: true  },
  { id: "5",  name: "Fatima Zahra",   admissionNumber: "ADM005", rollNumber: "05", phone: "9777766665", divisionName: "B", isActive: true  },
  { id: "6",  name: "Rahul Sharma",   admissionNumber: "ADM006", rollNumber: "06", phone: "9666655554", divisionName: "B", isActive: true  },
  { id: "7",  name: "Meera Pillai",   admissionNumber: "ADM007", rollNumber: "07", phone: "9555544443", divisionName: "C", isActive: true  },
  { id: "8",  name: "Ahmed Hassan",   admissionNumber: "ADM008", rollNumber: "08", phone: "9444433332", divisionName: "C", isActive: false },
]

function DivisionsTab({ divisions }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {divisions.map((d) => (
        <Card key={d.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10">
                <span className="text-sm font-bold text-blue-400">{d.name}</span>
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-slate-100 text-slate-800">
                  Division {d.name}
                </p>
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
            {d.classTeacher ? (
              <span className="text-xs font-medium dark:text-slate-200 text-slate-700">
                {d.classTeacher}
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

    const filtered = division
        ? students.filter((s) => s.divisionName === division)
        : students
    
    const divisions = [ ...new Set(students.map((s) => s.divisionName))]

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
            render: (v) => <Badge color="purple">{v}</Badge>
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
    const cls = MOCK_CLASS
    const students = MOCK_STUDENTS
    
    const totalStudents = cls.divisions.reduce((a, d) => a + d.students, 0)
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
                        <div>
                            <h2 className="text-lg font-bold dark:text-slate-100 text-slate-800">
                                {cls.name}
                            </h2>
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
                            value: cls.divisions.filter((d) => d.classTeacher).length,
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
            {tab === "divisions" && <DivisionsTab divisions={cls.divisions} />}
        </div>
    )
}