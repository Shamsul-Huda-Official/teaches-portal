import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Button, Input, Select, Card, PageHeader } from "../../components/ui"
import { createStudent } from "../../services/api/student.service"
import { getClasses } from "../../services/api/class.service"

const INIT = {
    name: "", admissionNumber: "", rollNumber: "",
    phone: "", email: "", parentName: "", classId: "", divisionId: "",    
}

export default function StudentCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(INIT);
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)
    
    const [classes, setClasses] = useState([])
    const [classData, setClassData] = useState(null)

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClasses()
                setClasses(data.map((c) => ({ value: c.id, label: c.name })))
            } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to fetch classes")
            }
        }
        fetchClasses()
    }, [])

    const divisions = classData?.divisions
        ? classData.divisions.map((d) => ({ 
            value: d.id, 
            label: typeof d.name === 'string' ? d.name : d.name?.toString() || d.id 
        }))
        : []

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
    
    const setClass = async (e) => {
        const newClassId = e.target.value
        setForm((p) => ({ ...p, classId: newClassId, divisionId: ""}))
        
        // Fetch the class data to get divisions
        try {
            const classesData = await getClasses()
            const selectedClass = classesData.find((c) => c.id === newClassId)
            if (selectedClass) {
                setClassData(selectedClass)
            }
        } catch {
            toast.error("Failed to load divisions")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return 
        setLoading(true)
        
        try {
            await createStudent({
                name: form.name,
                admissionNumber: form.admissionNumber,
                rollNumber: form.rollNumber,
                phone: form.phone,
                email: form.email,
                parentName: form.parentName,
                classId: form.classId,
                divisionId: form.divisionId,
            })
            toast.success("Student created")
            navigate("/students")
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create student")
        } finally {
            setLoading(false)
        }
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
                        options={classes}
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