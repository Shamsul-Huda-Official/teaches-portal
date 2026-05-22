import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload } from "lucide-react"
import {
    Button, PageHeader, EmptyState, PageLoader, Pagination, SearchInput, Table, Badge, Avatar
} from "../../components/ui"

import { getTeachers } from "../../services/api/teacher.service"
import toast from "react-hot-toast"

const PAGE_SIZE = 10;

export default function TeachersListPage() {
    const navigate = useNavigate()
    const [teachers, setTeachers] = useState([])
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        fetchTeachers()
    }, [])
    
    const fetchTeachers = async () => {
        try {
            setLoading(true)
            const data = await getTeachers()
            
            setTeachers(data)
            
            setLoading(false)
        }
        catch(err) {
            toast.error(
                err?.response?.data?.message || 'Failed to fetch teachers'
            )
        } finally {
            setLoading(false)
        }
    }
    

    const filtered = teachers.filter((t) => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.phone.includes(query) || 
        t.email.toLowerCase().includes(query.toLowerCase())
    )

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleSearch = (val) => {
        setQuery(val)
        setPage(1)
    }

    const columns = [
        {
            key: "name",
            label: "Teacher",
            render: (v, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={v} src={row.profileImageUrl} size="sm" />
                    <span className="font-medium dark:text-slate-100 text-slate-800">{v}</span>
                </div>
            ),
        },
        {
            key: "phone",
            label: "Phone",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "isActive",
            label: "Status",
            render: (v) => (
                <Badge color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Badge>
            ),
        },
    ]
    
    if(loading) {
        return <PageLoader text="Loading Teachers..." />
    }
    
    return (
        <div>
            <PageHeader
                title="Teachers"
                subtitle={`${teachers.length} total`}
                actions={
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/teachers/bulk")} 
                        >
                            <Upload size={14} /> <span className="hidden sm:inline"> Bulk Upload</span>
                        </Button>
                        <Button
                            onClick={() => navigate("/teachers/create")}
                        >
                            <Plus size={14} /> <span className="hidden sm:inline">Add Student</span>
                        </Button>
                    </div>
                } 
             />
             
             <div className="mb-4">
                <SearchInput
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search" 
                />
             </div>
             {paginated.length === 0 ? (
            <EmptyState
            title="No teachers found"
            subtitle={query ? "Try a different search" : "Add your first teacher"}
            action={
                !query && (
                <Button onClick={() => navigate("/teachers/create")}>
                    <Plus size={14} /> Add Teacher
                </Button>
                )
                }
                />
            ) : ( 
                <>
                    <Table
                        columns={columns}
                        data={paginated} 
                        onRowClick={(row) => navigate(`/teachers/${row.id}`)}    
                    />                
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </>
            )}
        </div>
    )
}