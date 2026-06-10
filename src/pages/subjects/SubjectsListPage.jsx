import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Upload } from "lucide-react"
import {
  Button, PageHeader, Table, Badge,
  EmptyState, Pagination, SearchInput, Select, PageLoader
} from "../../components/ui"
import toast from "react-hot-toast"
import { getSubjects } from "../../services/api/subject.service"
import { getClasses } from "../../services/api/class.service"

const PAGE_SIZE = 7

export default function SubjectsListPage() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const classData = await getClasses()
        setClasses(classData)
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load subjects")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!classId || !divisionId) {
      return
    }

    const fetchSubjects = async () => {
      try {
        setLoading(true)
        const subjectData = await getSubjects({ classId, divisionId })
        setSubjects(subjectData)
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load subjects")
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [classId, divisionId])

  const selectedClass = classes.find((c) => String(c.id) === classId)
  const classOptions = classes.map((c) => ({ value: String(c.id), label: c.name }))
  const divisions = selectedClass?.divisions
    ? selectedClass.divisions.map((d) => ({
        value: String(d.id),
        label: typeof d.name === "string" ? d.name : d.name?.toString() || String(d.id),
      }))
    : []
  const isReady = classId && divisionId

  const q = query.trim().toLowerCase()

  const filtered = isReady
    ? subjects.filter((s) => {
        const subjectClassId = String(s.classId || s.class?.id || "")
        const subjectDivisionId = String(
          typeof s.divisionId === "string"
            ? s.divisionId
            : s.divisionId?.id || s.divisionId || ""
        )

        return (
          subjectClassId === classId &&
          subjectDivisionId === divisionId &&
          (!q || s.name?.toLowerCase().includes(q))
        )
      })
    : []

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleClass = (e) => {
    setClassId(e.target.value)
    setDivisionId("")
    setQuery("")
    setPage(1)
    setSubjects([])
  }

  const handleDivision = (e) => {
    setDivisionId(e.target.value)
    setPage(1)
    setSubjects([])
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

  if (loading && !classes.length) {
    return <PageLoader text="Loading subjects..." />
  }

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
          options={classOptions}
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