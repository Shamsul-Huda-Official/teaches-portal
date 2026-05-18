import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Select, Card, PageHeader } from "../../components/ui"

const MOCK_CLASSES = [
    { value: 1, label: "Grade 9" },
    { value: 2, label: "Grade 10" },
]

const MOCK_DIVISION = {
    "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
    "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }]
}

const INIT = {
    name: "", admissionNumber: "", rollNumber: "",
    phone: "", email: "", parentName: "", classId: "", divisionId: "",    
}

export default function StudentCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(INIT);
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)

    const divisions = form.classId ? (MOCK_DIVISION[form.classId] || []) : [];
    const validate = () => {
        const e = {} 
            if (!form.name.trim()) e.name = "Required"
            if (!form.admissionNumber.trim()) e.admissionNumber = "Required"
            if (!form.rollNumber.trim()) e.rollNumber = "Required"
            if (!form.phone.trim()) e.phone = "Required"
            if (!form.email.trim()) e.email = "Required"
            if (!form.parentName.trim()) e.parentName = "Required"
            if (!form.classId) e.classId = "Required"
            if (!form.divisionId) e.divisionId = "Required"
            setError(e)
            return Object.keys(e).length === 0 
    }

    const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
    const setClass = (e) => setForm((p) => ({ ...p, classId: e.target.value, divisionId: ""}))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return 
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            navigate("/students")
        }, 800) 
    }

    return (
        <div>
            <PageHeader
                title="Add Students"
                subtitle="Create a new student" 
            />
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Input
                            label="FULL NAME"
                            placeholder="e.g Aakhil Mohammed"
                            value={form.name}
                            onChange={set("name")}
                            error={error.name}
                        />
                    </div>

                    <Input
                        label="Admission Number"
                        placeholder="e.g 071"
                        value={form.admissionNumber}
                        onChange={set("admissionNumber")}
                        error={error.admissionNumber}
                        hint="Default Password"
                    />

                    <Input
                        label="Roll Number"
                        placeholder="e.g. 01"
                        value={form.rollNumber}
                        onChange={set("rollNumber")}
                        error={error.rollNumber}
                    />
                    <Input
                        label="Phone"
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={set("phone")}
                        error={error.phone}
                        hint="Used as login username"
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="e.g. student@mail.com"
                        value={form.email}
                        onChange={set("email")}
                    />
            
                    <div className="col-span-2">
                        <Input
                        label="Parent Name"
                        placeholder="e.g. Hassan K"
                        value={form.parentName}
                        onChange={set("parentName")}
                        error={error.parentName}
                        />
                    </div>
            
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
                    <div className="col-span-2 flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/students")} 
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Create Student
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}