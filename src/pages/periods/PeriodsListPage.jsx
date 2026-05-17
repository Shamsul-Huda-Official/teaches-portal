import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import {
  Button, PageHeader, Table, Badge,
  EmptyState, Pagination, Select
} from "../../components/ui"
import { DAYS_OF_WEEK } from "../../constants"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 9"  },
  { value: "2", label: "Grade 10" },
]

const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}

const MOCK_PERIODS = [
  { id: "1",  name: "Period 1", classId: "1", divisionId: "a", dayOfWeek: 1, length: 45, subject: "Mathematics", teacher: "Unais Hudawi" },
  { id: "2",  name: "Period 2", classId: "1", divisionId: "a", dayOfWeek: 1, length: 45, subject: "English",     teacher: "Sara Mathew"  },
  { id: "3",  name: "Period 3", classId: "1", divisionId: "a", dayOfWeek: 1, length: 45, subject: "Physics",     teacher: null           },
  { id: "4",  name: "Period 1", classId: "1", divisionId: "a", dayOfWeek: 2, length: 45, subject: "Chemistry",   teacher: "Ahmed Khan"   },
  { id: "5",  name: "Period 2", classId: "1", divisionId: "a", dayOfWeek: 2, length: 45, subject: null,          teacher: null           },
  { id: "6",  name: "Period 1", classId: "1", divisionId: "b", dayOfWeek: 1, length: 45, subject: "Biology",     teacher: "Meera Pillai" },
  { id: "7",  name: "Period 2", classId: "1", divisionId: "b", dayOfWeek: 1, length: 45, subject: "Social",      teacher: "Riya Nair"    },
  { id: "8",  name: "Period 1", classId: "2", divisionId: "a", dayOfWeek: 3, length: 45, subject: "Mathematics", teacher: "Rahul Sharma" },
  { id: "9",  name: "Period 2", classId: "2", divisionId: "a", dayOfWeek: 3, length: 45, subject: null,          teacher: null           },
  { id: "10", name: "Period 1", classId: "2", divisionId: "b", dayOfWeek: 4, length: 45, subject: "English",     teacher: "Fatima Zahra" },
]

const PAGE_SIZE = 7

export default function PeriodsListPage() {
  const navigate = useNavigate()
  const [classId,    setClassId]    = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [dayOfWeek,  setDayOfWeek]  = useState("")
  const [page,       setPage]       = useState(1)

  const divisions = classId ? (MOCK_DIVISIONS[classId] || []) : []
  const isReady   = classId && divisionId

  const filtered = isReady
    ? MOCK_PERIODS.filter((p) =>
        p.classId    === classId &&
        p.divisionId === divisionId &&
        (dayOfWeek ? p.dayOfWeek === Number(dayOfWeek) : true)
      )
    : []

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleClass = (e) => {
    setClassId(e.target.value)
    setDivisionId("")
    setDayOfWeek("")
    setPage(1)
  }

  const columns = [
    {
      key: "name",
      label: "Period",
      render: (v) => (
        <span className="font-medium dark:text-slate-100 text-slate-800">{v}</span>
      ),
    },
    {
      key: "dayOfWeek",
      label: "Day",
      render: (v) => (
        <span className="dark:text-slate-300 text-slate-600">
          {DAYS_OF_WEEK.find((d) => d.value === v)?.label ?? "—"}
        </span>
      ),
    },
    {
      key: "length",
      label: "Length",
      render: (v) => (
        <span className="hidden sm:block dark:text-slate-300 text-slate-600">
          {v} min
        </span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (v) =>
        v ? (
          <span className="dark:text-slate-300 text-slate-600">{v}</span>
        ) : (
          <Badge color="amber">Unassigned</Badge>
        ),
    },
    {
      key: "teacher",
      label: "Teacher",
      render: (v) =>
        v ? (
          <span className="hidden sm:block dark:text-slate-300 text-slate-600">{v}</span>
        ) : (
          <Badge color="amber">Unassigned</Badge>
        ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Periods"
        actions={
          <Button onClick={() => navigate("/periods/create")}>
            <Plus size={14} />
            <span className="hidden sm:inline">Add Period</span>
          </Button>
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
          onChange={(e) => { setDivisionId(e.target.value); setPage(1) }}
          disabled={!classId}
        />
        {isReady && (
          <Select
            placeholder="— All Days —"
            options={DAYS_OF_WEEK.map((d) => ({ value: d.value, label: d.label }))}
            value={dayOfWeek}
            onChange={(e) => { setDayOfWeek(e.target.value); setPage(1) }}
          />
        )}
      </div>

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
          <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">Choose a division to see periods</p>
        </div>
      )}

      {isReady && paginated.length === 0 && (
        <EmptyState
          title="No periods found"
          subtitle="Try a different day filter or add a new period"
          action={
            <Button onClick={() => navigate("/periods/create")}>
              <Plus size={14} /> Add Period
            </Button>
          }
        />
      )}

      {isReady && paginated.length > 0 && (
        <>
          <p className="mb-3 text-xs dark:text-slate-500 text-slate-400">
            {filtered.length} {filtered.length !== 1 ? "periods" : "period"} found
          </p>
          <Table
            columns={columns}
            data={paginated}
            onRowClick={(row) => navigate(`/periods/${row.id}/assign`)}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}