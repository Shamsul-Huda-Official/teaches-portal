import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload } from "lucide-react"
import {
  Button, PageHeader, Table, Badge,
  EmptyState, Pagination, SearchInput, Select
} from "../../components/ui"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 9"  },
  { value: "2", label: "Grade 10" },
]

const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}

const MOCK_SUBJECTS = [
  { id: "1",  name: "Mathematics",    classId: "1", divisionId: "a", isActive: true  },
  { id: "2",  name: "English",        classId: "1", divisionId: "a", isActive: true  },
  { id: "3",  name: "Physics",        classId: "1", divisionId: "a", isActive: true  },
  { id: "4",  name: "Chemistry",      classId: "1", divisionId: "a", isActive: false },
  { id: "5",  name: "Biology",        classId: "1", divisionId: "b", isActive: true  },
  { id: "6",  name: "Social Science", classId: "1", divisionId: "b", isActive: true  },
  { id: "7",  name: "Historiography", classId: "1", divisionId: "b", isActive: true  },
  { id: "8",  name: "Mathematics",    classId: "2", divisionId: "a", isActive: true  },
  { id: "9",  name: "English",        classId: "2", divisionId: "a", isActive: true  },
  { id: "10", name: "Physics",        classId: "2", divisionId: "b", isActive: true  },
]

const PAGE_SIZE = 7

export default function SubjectsListPage() {
  const navigate = useNavigate()
  const [classId,    setClassId]    = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [query,      setQuery]      = useState("")
  const [page,       setPage]       = useState(1)

  const divisions = classId ? (MOCK_DIVISIONS[classId] || []) : []
  const isReady   = classId && divisionId

  const q = query.trim().toLowerCase()

  const filtered = isReady
    ? MOCK_SUBJECTS.filter((s) =>
        s.classId    === classId &&
        s.divisionId === divisionId &&
        (!q || s.name.toLowerCase().includes(q))
      )
    : []

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleClass = (e) => {
    setClassId(e.target.value)
    setDivisionId("")
    setQuery("")
    setPage(1)
  }

  const columns = [
    {
      key: "name",
      label: "Subject",
      render: (v) => (
        <span className="font-medium dark:text-slate-100 text-slate-800">{v}</span>
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
        title="Subjects"
        actions={
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/subjects/bulk")}
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Bulk Upload</span>
            </Button>
            <Button onClick={() => navigate("/subjects/create")}>
              <Plus size={14} />
              <span className="hidden sm:inline">Add Subject</span>
            </Button>
          </div>
        }
      />

      {/* Filters */}
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
          onChange={(e) => { setDivisionId(e.target.value); setPage(1) }}
          disabled={!classId}
        />
        {isReady && (
          <SearchInput
            value={query}
            onChange={(v) => { setQuery(v); setPage(1) }}
            placeholder="Search"
          />
        )}
      </div>

      {/* States */}
      {!classId && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100">
            <span className="text-2xl">🏫</span>
          </div>
          <p className="text-sm font-medium dark:text-slate-300 text-slate-600">Select a Class</p>
          <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">Choose a class to continue</p>
        </div>
      )}

      {classId && !divisionId && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-sm font-medium dark:text-slate-300 text-slate-600">Select a Division</p>
          <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">Choose a division to see subjects</p>
        </div>
      )}

      {isReady && paginated.length === 0 && (
        <EmptyState
          title="No subjects found"
          subtitle={query ? "Try a different search" : "No subjects in this division"}
          action={
            !query && (
              <Button onClick={() => navigate("/subjects/create")}>
                <Plus size={14} /> Add Subject
              </Button>
            )
          }
        />
      )}

      {isReady && paginated.length > 0 && (
        <>
          <p className="mb-3 text-xs dark:text-slate-500 text-slate-400">
            {filtered.length} {filtered.length !== 1 ? "subjects" : "subject"} in this division
          </p>
          <Table columns={columns} data={paginated} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}