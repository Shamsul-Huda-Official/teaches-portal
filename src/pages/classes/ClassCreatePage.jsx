import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2 } from "lucide-react"
import { Button, Input, Card, PageHeader, SectionHeader } from "../../components/ui"

const INIT = { name: "" }

export default function ClassCreatePage() {
  const navigate = useNavigate()
  const [form, setForm]           = useState(INIT)
  const [divisions, setDivisions] = useState([{ name: "" }])
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name = "Class name is required"
    if (divisions.some((d) => !d.name.trim())) e.divisions = "All division names are required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/classes")
    }, 800)
  }

  const addDivision    = () => setDivisions((p) => [...p, { name: "" }])
  const removeDivision = (i) => setDivisions((p) => p.filter((_, idx) => idx !== i))
  const setDivName     = (i, val) =>
    setDivisions((p) => p.map((d, idx) => (idx === i ? { ...d, name: val } : d)))

  return (
    <div>
      <PageHeader
        title="Add Class"
        subtitle="Create a new class with divisions"
      />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Class Name"
            placeholder="e.g. Grade 9"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            error={errors.name}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionHeader title="Divisions" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDivision}
              >
                <Plus size={13} /> Add Division
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {divisions.map((d, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Division name e.g. A`}
                    value={d.name}
                    onChange={(e) => setDivName(i, e.target.value)}
                    className="flex-1"
                  />
                  {divisions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDivision(i)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              {errors.divisions && (
                <p className="text-xs text-red-400">{errors.divisions}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/classes")}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Class
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}