import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload } from "lucide-react"
import {
    Button, PageHeader, EmptyState, PageLoader, Pagination, SearchInput, Table, Badge, Avatar
} from "../../components/ui"

const MOCK_TEACHERS = [
  { id: "1", name: "Unais Hudawi",    phone: "9876543210", email: "unais@mail.com",   isActive: true  },
  { id: "2", name: "Sara Mathew",     phone: "9123456780", email: "sara@mail.com",    isActive: true  },
  { id: "3", name: "Riya Nair",       phone: "9000011112", email: "riya@mail.com",    isActive: false },
  { id: "4", name: "Ahmed Khan",      phone: "9888877776", email: "ahmed@mail.com",   isActive: true  },
  { id: "5", name: "Fatima Zahra",    phone: "9777766665", email: "fatima@mail.com",  isActive: true  },
  { id: "6", name: "Anoop Krishnan",  phone: "9666655554", email: "anoop@mail.com",   isActive: true  },
  { id: "7", name: "Meera Pillai",    phone: "9555544443", email: "meera@mail.com",   isActive: false },
  { id: "8", name: "Rahul Sharma",    phone: "9444433332", email: "rahul@mail.com",   isActive: true  },
]

const PAGE_SIZE = 6;

export default function TeachersListPage() {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)

    const filtered = MOCK_TEACHERS.filter((t) => 
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
    return (
        <div>
            <PageHeader
                title="Teachers"
                subtitle={`${MOCK_TEACHERS.length} total`}
                actions={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/teachers/bulk")} 
                        >
                            <Upload size={14} /> Bulk Upload
                        </Button>
                    </>
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