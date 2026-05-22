import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from 'lucide-react'
import {
    Button, PageHeader, Table, Badge, EmptyState, PageLoader, Pagination, SearchInput
} from "../../components/ui"
import toast from "react-hot-toast"
import { getClasses } from "../../services/api/class.service"

const PAGE_SIZE = 7

export default function ClassesListPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true)
                const data = await getClasses()
                setClasses(data || [])
            } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to fetch classes")
            } finally {
                setLoading(false)
            }
        }

        fetchClasses()
    }, [])

    const getDivisionName = (division) =>
        typeof division === "string"
            ? division
            : division?.name || division?.id || ""

    const q = query.trim().toLowerCase()
    const filtered = classes.filter((item) => {
        if (!q) return true
        const nameMatch = item.name?.toLowerCase().includes(q)
        const divisionMatch = item.divisions?.some((division) => {
            const divisionName = getDivisionName(division)
            return divisionName.toLowerCase().includes(q)
        })
        return nameMatch || divisionMatch
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if (loading) {
        return <PageLoader text="Loading classes..." />
    }

    const columns = [
        {
            key: "name",
            label: "Class Name",
            render: (v) => (
                <span className="font-medium dark:text-slate-100 text-slate-800">{v}</span>
            ),
        },
        {
        key: "divisions",
        label: "Divisions",
        render: (v) => (
            <div className="flex gap-1.5 flex-wrap">
            {v.map((d, index) => {
                const divisionName = typeof d === "string" ? d : d?.name || d?.id || "Unknown"
                const divisionKey = typeof d === "string" ? d : d?.id || `${divisionName}-${index}`
                return (
                    <Badge key={divisionKey} color="blue">{divisionName}</Badge>
                )
            })}
            </div>
        ),
        },
        {
        key: "students",
        label: "Students",
        render: (v) => (
            <span className="dark:text-slate-300 text-slate-600">{v}</span>
        ),
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
                title="Classes"
                subtitle={`${classes.length} total`}
                actions={
                    <Button onClick={() => navigate("/classes/create")}>
                        <Plus size={15 } /> Add Class
                    </Button>
                }
            />

            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <SearchInput
                    value={query}
                    onChange={(value) => { setQuery(value); setPage(1) }}
                    placeholder="Search classes"
                />
            </div>

            {paginated.length === 0 ? (
                <EmptyState
                    title="No Classes Yet"
                    subtitle="Add your first class to get started"
                    action={
                        <Button onClick={() => navigate("/classes/create")}>
                            <Plus size={15} /> Add Class
                        </Button>
                    }
                />
            ) : (
                <>
                    <Table
                        columns={columns}
                        data={paginated}
                        onRowClick={(row) => navigate(`/classes/${row.id}`)}
                    />
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </>
            )}
        </div>
    )
}