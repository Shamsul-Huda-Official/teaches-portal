import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Select, Card, PageHeader } from "../../components/ui"
import { DAYS_OF_WEEK } from "../../constants"
 
const MOCK_CLASSES = [
  { value: "1", label: "Grade 9" },
  { value: "2", label: "Grade 10" },
]
const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}
 
const INIT = {
  classId: "", divisionId: "",
  dayOfWeek: "", length: "45", count: "1",
}

export default function PeriodCreatePage() {
    const navigate = useNavigate()
    const [form, setForm] = useState(INIT)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    
    const divisions = form.classId ? (MOCK_DIVISIONS[form.classId] || []) : []
    const validate = () => {
        const e = {}
            if (!form.classId)    e.classId   = "Required"
            if (!form.divisionId) e.divisionId = "Required"
            if (!form.dayOfWeek)  e.dayOfWeek  = "Required"
            if (!form.length || Number(form.length) < 5)
            e.length = "Minimum 5 minutes"
            if (!form.count || Number(form.count) < 1)
            e.count = "Minimum 1 period"
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
            navigate("/periods")
        }, 800)
    }

    return (
        <div>
            <PageHeader
                title="Add Periods"
                subtitle="Periods are auto-named: Period 1, Period 2..."
            />
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <Select
                    label="Day of Week"
                    options={DAYS_OF_WEEK.map((d) => ({
                    value: d.value,
                    label: d.label,
                    }))}
                    value={form.dayOfWeek}
                    onChange={set("dayOfWeek")}
                    error={error.dayOfWeek}
                />
                <Input
                    label="Period Length (minutes)"
                    type="number"
                    min={5}
                    max={120}
                    value={form.length}
                    onChange={set("length")}
                    error={error.length}
                />
                <Input
                    label="Number of Periods"
                    type="number"
                    min={1}
                    max={12}
                    value={form.count}
                    onChange={set("count")}
                    error={error.count}
                    hint="How many periods to create for this day"
                />
        
                <div className="flex gap-3 pt-2">
                    <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/periods")}
                    >
                    Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                    Create Periods
                    </Button>
                </div>
                </form>
            </Card>
        </div>
    )
}