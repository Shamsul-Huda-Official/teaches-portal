import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import {
    Button, PageHeader, Table, Badge, EmptyState, SearchInput, Select, Avatar, ConfirmModal
} from "../../components/ui"
import {
    deleteStudent,
    getStudents,
} from "../../services/api/student.service"
import { getClasses } from "../../services/api/class.service"

const PAGE_SIZE = 7
 
export default function StudentsListPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("")
    const [classId, setClassId] = useState("")
    const [divisionId, setDivisionId] = useState("")
    const [page, setPage] = useState(1)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClasses()
                const options = data.map((c) => ({ value: c.id, label: c.name, divisions: c.divisions || [] }))
                setClasses(options)
            } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to fetch classes")
            }
        }
        fetchClasses()
    }, [])

    // Fetch students (all) when class/division changes; we'll filter client-side
    useEffect(() => {
        if (!classId || !divisionId) return

        const fetchStudents = async () => {
            try {
                const data = await getStudents()
                setStudents(data)
            } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to fetch students")
            }
        }

        fetchStudents()
    }, [classId, divisionId])

    const q = query.trim().toLowerCase()

    const filtered = classId && divisionId
        ? students.filter((s) => {
            const matchClass = s.classId === classId
            const matchDivision = 
                typeof s.divisionId === "string" 
                    ? s.divisionId === divisionId 
                    : s.divisionId?.id === divisionId
            const matchSearch = !q
                ? true
                : s.name?.toLowerCase().includes(q) ||
                s.admissionNumber?.toLowerCase().includes(q) ||
                s.phone?.startsWith(q)
            return matchClass && matchDivision && matchSearch
        })
        : []

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

    const handleDeleteClick = (student) => {
        setSelectedStudent(student)
        setDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedStudent) return
        setIsDeleting(true)
            try {
            await deleteStudent(selectedStudent.id)
            toast.success("Student deleted successfully")
            const data = await getStudents()
            setStudents(data)
            setDeleteModalOpen(false)
            setSelectedStudent(null)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete student")
        } finally {
            setIsDeleting(false)
        }
    }

    const selectedClass = classes.find(
        (c) => c.value === classId
    )
    
    const divisions = 
        selectedClass?.divisions?.map((d) => ({
            value: d.id,
            label: d.name,
        })) || [];

    const isReady = classId && divisionId

    const columns = [
        {
            key: "name",
            label: "Student",
            render: (v, row) => (
            <div className="flex items-center gap-3">
                <Avatar name={v} src={row.profileImageUrl} size="sm" />
                <div>
                <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{v}</p>
                <p className="text-xs dark:text-slate-500 text-slate-400">{row.phone}</p>
                </div>
            </div>
            ),
        },
        {
            key: "admissionNumber",
            label: "Admission No.",
        },
        {
            key: "rollNumber",
            label: "Roll No.",
        },
        {
            key: "isActive",
            label: "Status",
            render: (v) => (
            <Badge color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(row)
                    }}
                >
                    <Trash2 size={14} />
                </Button>
            ),
        },
    ]

    return (
        <div>
            <PageHeader
                title="Students"
                subtitle={`${students.length} total`}
                actions={
                    <div className="flex flex-wrap justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/students/bulk")} 
                            >
                                <Upload size={14} /> <span className="hidden sm:inline"> Bulk Upload</span>
                            </Button>
                        <Button
                            onClick={() => navigate("/students/create")}
                        >
                            <Plus size={14} /> <span className="hidden sm:inline">Add Student</span>
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <Select
                    placeholder="Select Class"
                    options={classes}
                    value={classId}
                    onChange={handleClass} 
                />
                <Select
                    placeholder="Select Division"
                    options={divisions}
                    value={divisionId} 
                    onChange={handleDivision}
                    disabled={!classId}
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
            <ConfirmModal
                open={deleteModalOpen}
                title="Delete student"
                message={`Are you sure you want to delete ${selectedStudent?.name ?? "this student"}? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
                loading={isDeleting}
            />
        </div>
    )
}