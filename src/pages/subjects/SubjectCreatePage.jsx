import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Select, Card, PageHeader } from "../../components/ui"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 9" },
  { value: "2", label: "Grade 10" },
]
const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}

const INIT = { name: "", classId: "", divisionId: "" }

export default function SubjectCreatePage() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState(INIT)
  const [error,  setError]  = useState({})
  const [loading, setLoading] = useState(false)

  const divisions = form.classId ? (MOCK_DIVISIONS[form.classId] || []) : []

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name      = "Required"
    if (!form.classId)      e.classId   = "Required"
    if (!form.divisionId)   e.divisionId = "Required"
    setError(e)
    return Object.keys(e).length === 0
  }

  const set      = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const setClass = (e)   => setForm((p) => ({ ...p, classId: e.target.value, divisionId: "" }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/subjects")
    }, 800)
  }

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Add Subject"
        subtitle="Create a new subject for a class division"
      />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Mathematics"
            value={form.name}
            onChange={set("name")}
            error={error.name}
          />
          <Select
            label="Class"
            options={MOCK_CLASSES}
            value={form.classId}
            onChange={setClass}
            error={error.classId}
          />
          <Select
            label="Division"
            options={divisions}
            value={form.divisionId}
            onChange={set("divisionId")}
            error={error.divisionId}
            disabled={!form.classId}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/subjects")}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Subject
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}