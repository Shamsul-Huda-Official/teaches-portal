import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Key, Plus, Upload } from "lucide-react"
import {
    Button, PageHeader, Table, Badge, EmptyState, Pagination, SearchInput, Select, Avatar
} from "../../components/ui"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 9"  },
  { value: "2", label: "Grade 10" },
  { value: "3", label: "Grade 11" },
]
 
const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }, { value: "c", label: "C" }],
  "3": [{ value: "a", label: "A" }],
}
 
const MOCK_STUDENTS = [
  { id: "1",  name: "Mohammed Ajmal", admissionNumber: "ADM001", rollNumber: "01", phone: "9745804605", parentName: "Ajmal K",  classId: "1", divisionId: "a", isActive: true  },
  { id: "2",  name: "Sara Mathew",    admissionNumber: "ADM002", rollNumber: "02", phone: "9123456780", parentName: "John M",   classId: "1", divisionId: "a", isActive: true  },
  { id: "3",  name: "Riya Nair",      admissionNumber: "ADM003", rollNumber: "03", phone: "9000011112", parentName: "Priya N",  classId: "1", divisionId: "a", isActive: false },
  { id: "4",  name: "Anoop P",        admissionNumber: "ADM004", rollNumber: "04", phone: "9888877776", parentName: "Rajesh P", classId: "1", divisionId: "b", isActive: true  },
  { id: "5",  name: "Fatima Zahra",   admissionNumber: "ADM005", rollNumber: "05", phone: "9777766665", parentName: "Zaid A",   classId: "1", divisionId: "b", isActive: true  },
  { id: "6",  name: "Rahul Sharma",   admissionNumber: "ADM006", rollNumber: "06", phone: "9666655554", parentName: "Suresh S", classId: "2", divisionId: "a", isActive: true  },
  { id: "7",  name: "Meera Pillai",   admissionNumber: "ADM007", rollNumber: "07", phone: "9555544443", parentName: "Vijay P",  classId: "2", divisionId: "b", isActive: true  },
  { id: "8",  name: "Ahmed Hassan",   admissionNumber: "ADM008", rollNumber: "08", phone: "9444433332", parentName: "Hassan K", classId: "2", divisionId: "c", isActive: false },
  { id: "9",  name: "Priya Menon",    admissionNumber: "ADM009", rollNumber: "09", phone: "9333322221", parentName: "Suresh M", classId: "3", divisionId: "a", isActive: true  },
  { id: "10", name: "Zaid Rahman",    admissionNumber: "ADM010", rollNumber: "10", phone: "9222211110", parentName: "Rahman A", classId: "3", divisionId: "a", isActive: true  },
]

const PAGE_SIZE = 7
 
export default function StudentsListPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("")
    const [classId, setClassId] = useState("")
    const [divisionId, setDivisionId] = useState("")
    const [page, setPage] = useState(1)

    const divisions = classId ? (MOCK_DIVISIONS[classId] || []) : [];

    const isReady = classId && divisionId

    const q = query.trim().toLowerCase()

    const filtered = isReady
    ? MOCK_STUDENTS.filter((s) => {
        const matchClass    = s.classId    === classId
        const matchDivision = s.divisionId === divisionId
        const matchSearch   = !q
            ? true
            : s.name.toLowerCase().includes(q) ||
            s.admissionNumber.toLowerCase().includes(q) ||
            s.phone.startsWith(q)
        return matchClass && matchDivision && matchSearch
        })
    : []

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)


    const handleClass = (e) => {
        setClassId(e.target.value)
        setDivisionId("")
        setQuery("")
        setPage(1)
    }

    const handleDivision = (e) => {
        setDivisionId(e.target.value)
        setQuery("")
        setPage(1)
    }

    const columns = [
        {
            key: "name",
            label: "Student",
            render: (v, row) => (
            <div className="flex items-center gap-3">
                <Avatar name={v} src={row.profileImageUrl} size="sm" />
                <div>
                <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{v}</p>
                <p className="text-xs dark:text-slate-500 text-slate-400">{row.admissionNumber}</p>
                </div>
            </div>
            ),
        },
        { key: "rollNumber", label: "Roll", },
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
            <PageHeader
                title="Students"
                subtitle={`${MOCK_STUDENTS.length} total`}
                actions={
                    <div className="flex flex-wrap justify-end gap-2">
                        <div className="hidden md:block">
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/students/bulk")} 
                            >
                                <Upload size={14} /> Upload Students
                            </Button>
                        </div>
                        <Button
                            onClick={() => navigate("/students/create")}
                        >
                            <Plus size={14} /> Add Student
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <Select
                    placeholder="Select Class"
                    options={MOCK_CLASSES}
                    value={classId}
                    onChange={handleClass} 
                />
                <Select
                    placeholder="Select Division"
                    options={divisions}
                    value={divisionId} 
                    onChange={handleDivision}
                />
                {isReady && (
                    <SearchInput
                        value={query}
                        onChange={(v) => {setQuery(v); setPage(1)}}
                        placeholder="Search" 
                    />
                )}
            </div>

            {!classId && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100">
                        <span>🏫</span>
                    </div>
                    <p className="text-sm font-medium dark:text-slate-300 text-slate-600">Select a Class</p>
                    <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">Choose a class to continue</p>
                </div>
            )}

            {classId && !divisionId && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100">
                        📋
                    </div>
                    <p className="text-sm font-medium dark:text-slate-300 text-slate-600">Select a Division</p>
                    <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">Choose a division to see students</p>
                </div>
            )}           
            {isReady && paginated.length === 0 && (
                <EmptyState
                    title="No students found"
                    subtitle={query ? "Try a different search" : "No Students in this divisions"}
                    action={
                        !query && (
                            <Button onClick={() => navigate("/students/create")}>
                                <Plus size={14} /> Add Student
                            </Button>
                        )
                    } 
                />
            )}

            {isReady && paginated.length > 0 && (
                <>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs dark:text-slate-500 text-slate-400">
                            {filtered.length} {filtered.length !== 1 ? "students": "student"} in this division
                        </p>
                    </div>
                    <Table
                        columns={columns}
                        data={paginated}
                        onRowClick={(row) => navigate(`/students/${row.id}`)} 
                     />
                     
                </>
            )}
        </div>
    )
}