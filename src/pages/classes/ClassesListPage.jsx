import { useNavigate } from "react-router-dom"
import { Plus } from 'lucide-react'
import {
    Button, PageHeader, Table, Badge, EmptyState, PageLoader, Pagination
} from "../../components/ui"
import { useState } from "react"

const MOCK_CLASSES = [
  { id: "1", name: "Grade 1",  divisions: ["A", "B"],      students: 60, isActive: true  },
  { id: "2", name: "Grade 2",  divisions: ["A", "B", "C"], students: 90, isActive: true  },
  { id: "3", name: "Grade 3",  divisions: ["A"],            students: 30, isActive: false },
  { id: "4", name: "Grade 4",  divisions: ["A", "B"],      students: 55, isActive: true  },
  { id: "5", name: "Grade 5",  divisions: ["A"],            students: 28, isActive: true  },
  { id: "6", name: "Grade 6",  divisions: ["A", "B"],      students: 50, isActive: true  },
  { id: "7", name: "Grade 7",  divisions: ["A", "B", "C"], students: 88, isActive: true  },
  { id: "8", name: "Grade 8",  divisions: ["A", "B"],      students: 62, isActive: false },
  { id: "9", name: "Grade 9",  divisions: ["A", "B"],      students: 58, isActive: true  },
  { id: "10", name: "Grade 10", divisions: ["A", "B"],     students: 70, isActive: true  },
]

const PAGE_SIZE = 7

export default function ClassesListPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(MOCK_CLASSES.length / PAGE_SIZE)
    const paginated = MOCK_CLASSES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
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
            {v.map((d) => (
                <Badge key={d} color="blue">{d}</Badge>
            ))}
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
                subtitle={`${MOCK_CLASSES.length} total`} 
                actions={
                    <Button onClick={() => navigate("/classes/create")}>
                        <Plus size={15 } /> Add Class
                    </Button>
                }
            />
            
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