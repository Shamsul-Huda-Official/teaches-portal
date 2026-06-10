import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Button, Input, Select, Card, PageHeader } from "../../components/ui"
import { createSubject } from "../../services/api/subject.service"
import { getClasses } from "../../services/api/class.service"
import { getTeachers } from "../../services/api/teacher.service"

const INIT = { name: "", classId: "", divisionId: "", teacherId: "" }

export default function SubjectCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INIT)
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [rawClasses, setRawClasses] = useState([])
  const [classData, setClassData] = useState(null)
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, teacherData] = await Promise.all([
          getClasses(),
          getTeachers(),
        ])

        setRawClasses(classesData)
        setClasses(classesData.map((cls) => ({ value: String(cls.id), label: cls.name })))
        setTeachers(
          teacherData.map((teacher) => ({
            value: String(teacher.id),
            label: teacher.name || teacher.fullName || teacher.user?.name || "Teacher",
          }))
        )
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load form data")
      }
    }

    fetchData()
  }, [])

  const divisions = classData?.divisions
    ? classData.divisions.map((division) => ({
        value: String(division.id),
        label:
          typeof division.name === "string"
            ? division.name
            : division.name?.toString() || String(division.id),
      }))
    : []

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.classId) e.classId = "Required"
    if (!form.divisionId) e.divisionId = "Required"
    if (!form.teacherId) e.teacherId = "Required"
    setError(e)
    return Object.keys(e).length === 0
  }

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const setClass = (e) => {
    const newClassId = e.target.value
    setForm((p) => ({ ...p, classId: newClassId, divisionId: "" }))
    const selected = rawClasses.find((cls) => String(cls.id) === newClassId)
    setClassData(selected || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      await createSubject({
        name: form.name,
        classId: form.classId,
        divisionId: form.divisionId,
        teacherId: form.teacherId,
      })
      toast.success("Subject created")
      navigate("/subjects")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create subject")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
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
            onChange={setField("name")}
            error={error.name}
          />
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
            onChange={setField("divisionId")}
            error={error.divisionId}
            disabled={!form.classId}
          />
          <Select
            label="Teacher"
            options={teachers}
            value={form.teacherId}
            onChange={setField("teacherId")}
            error={error.teacherId}
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