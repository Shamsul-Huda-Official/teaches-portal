import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload } from "lucide-react"
import {
    Button, PageHeader, Table, Badge, EmptyState, Pagination, SearchInput, Select, Avatar
} from "../../components/ui"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 9" },
]

const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }, { value: "c", label: "C" }],
  "3": [{ value: "a", label: "A" }],
  "4": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}

const MOCK_STUDENTS = [
  { id: "1", name: "Mohammed Ajmal", admissionNumber: "ADM001", rollNumber: "01", phone: "9745804605", parentName: "Ajmal K",   classId: "4", divisionId: "a", isActive: true  },
  { id: "2", name: "Sara Mathew",    admissionNumber: "ADM002", rollNumber: "02", phone: "9123456780", parentName: "John M",    classId: "4", divisionId: "a", isActive: true  },
  { id: "3", name: "Riya Nair",      admissionNumber: "ADM003", rollNumber: "03", phone: "9000011112", parentName: "Priya N",   classId: "4", divisionId: "b", isActive: true  },
  { id: "4", name: "Anoop P",        admissionNumber: "ADM004", rollNumber: "04", phone: "9888877776", parentName: "Rajesh P",  classId: "4", divisionId: "b", isActive: false },
  { id: "5", name: "Fatima Zahra",   admissionNumber: "ADM005", rollNumber: "05", phone: "9777766665", parentName: "Zaid A",    classId: "1", divisionId: "a", isActive: true  },
  { id: "6", name: "Rahul Sharma",   admissionNumber: "ADM006", rollNumber: "06", phone: "9666655554", parentName: "Suresh S",  classId: "1", divisionId: "b", isActive: true  },
  { id: "7", name: "Meera Pillai",   admissionNumber: "ADM007", rollNumber: "07", phone: "9555544443", parentName: "Vijay P",   classId: "2", divisionId: "a", isActive: true  },
  { id: "8", name: "Ahmed Hassan",   admissionNumber: "ADM008", rollNumber: "08", phone: "9444433332", parentName: "Hassan K",  classId: "2", divisionId: "b", isActive: true  },
  { id: "9", name: "Priya Menon",    admissionNumber: "ADM009", rollNumber: "09", phone: "9333322221", parentName: "Suresh M",  classId: "3", divisionId: "a", isActive: false },
  { id: "10", name: "Zaid Rahman",   admissionNumber: "ADM010", rollNumber: "10", phone: "9222211110", parentName: "Rahman A",  classId: "3", divisionId: "a", isActive: true  },
]

const PAGE_SIZE = 7
 
export default function StudentsListPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("")
    const [classId, setClassId] = useState("")
    const [divisionId, setDivisionId] = useState("")
    const [page, setPage] = useState(1)

    const divisions = classId ? (MOCK_STUDENTS[classId] || []) : [];
    
    const filtered = MOCK_STUDENTS.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.admissionNumber.toLowerCase().includes(query.toLowerCase()) ||
            s.phone.includes(query)

        const matchClass = classId ? s.classId === classId : true
        const matchDivision = divisionId ? s.divisionId === divisionId : true

        return matchSearch && matchClass && matchDivision 
    })

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleSearch = (val) => { setQuery(e.target.value); setPage(1)}

    const columns = [
        {
        key: "name",
        label: "Student",
        render: (v, row) => (
            <div className="flex items-center gap-3">
            <Avatar name={v} src={row.profileImageUrl} size="sm" />
            <div>
                <p className="font-medium dark:text-slate-100 text-slate-800 text-sm">{v}</p>
                <p className="text-xs dark:text-slate-500 text-slate-400">{row.admissionNumber}</p>
            </div>
            </div>
        ),
        },
        {
            key: "rollNumber",
            label: "Roll No.",
        },
        {
            key: "phone",
            label: "Phone",
        },
        {
            key: "parentName",
            label: "Parent",
        },
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
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/students/bulk")} 
                        >
                            <Upload size={14} /> Upload Students
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/students/create")}
                        >
                            <Plus size={14} /> Add Student
                        </Button>
                    </>
                }
            />

            
        </div>
    )
}