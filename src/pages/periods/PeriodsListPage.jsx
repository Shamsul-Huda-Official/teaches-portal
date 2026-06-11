import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import {
  Button, PageHeader, Table, Badge,
  EmptyState, Pagination, Select, ConfirmModal, PageLoader
} from "../../components/ui"
import { DAYS_OF_WEEK } from "../../constants"
import toast from "react-hot-toast"
import { getPeriods, deletePeriod } from "../../services/api/period.service"
import { getClasses } from "../../services/api/class.service"

const PAGE_SIZE = 7

export default function PeriodsListPage() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [periods, setPeriods] = useState([])
  const [classId, setClassId] = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const rawDivisions = classId ? (classes.find((c) => String(c.id) === classId)?.divisions || []) : []
  const divisions = rawDivisions.map((d) => ({
    value: String(d.id),
    label: typeof d.name === "string" ? d.name : d.name?.toString() || String(d.id),
  }))
  const isReady = classId && divisionId

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getClasses()
        setClasses(data)
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load classes")
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!classId || !divisionId) return
    const fetch = async () => {
      try {
        setLoading(true)
        const params = { classId, divisionId }
        if (dayOfWeek) params.dayOfWeek = Number(dayOfWeek)
        const data = await getPeriods(params)
        setPeriods(data || [])
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load periods")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [classId, divisionId, dayOfWeek])

  const filtered = isReady
    ? periods.filter((p) => (dayOfWeek ? p.dayOfWeek === Number(dayOfWeek) : true))
    : []

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleClass = (e) => {
    setClassId(e.target.value)
    setDivisionId("")
    setDayOfWeek("")
    setPage(1)
    setPeriods([])
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
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedPeriod(row)
            setDeleteModalOpen(true)
          }}
        >
          Delete
        </Button>
      ),
    },
  ]

  const handleDeleteConfirm = async () => {
    if (!selectedPeriod) return
    setIsDeleting(true)
    try {
      await deletePeriod(selectedPeriod.id)
      toast.success("Period deleted")
      // refresh
      const params = { classId, divisionId }
      if (dayOfWeek) params.dayOfWeek = Number(dayOfWeek)
      const data = await getPeriods(params)
      setPeriods(data || [])
      setDeleteModalOpen(false)
      setSelectedPeriod(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete period")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading && !classes.length) {
    return <PageLoader text="Loading periods..." />
  }

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
          options={classes.map((c) => ({ value: String(c.id), label: c.name }))}
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
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete period"
        message={`Are you sure you want to delete ${selectedPeriod?.name ?? "this period"}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        loading={isDeleting}
      />
    </div>
  )
}