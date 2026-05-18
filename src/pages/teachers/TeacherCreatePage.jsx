import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Camera } from "lucide-react"
import { Button, Input, Select, Card, PageHeader } from "../../components/ui"

const ROLE_OPTIONS = [
  { value: "TEACHER", label: "Teacher" },
  { value: "ADMIN",   label: "Admin"   },
]

const INIT = {
  name:     "",
  phone:    "",
  email:    "",
  password: "",
  role:     "TEACHER",
}

export default function TeacherCreatePage() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState(INIT)
  const [error,  setError]  = useState({})
  const [loading, setLoading] = useState(false)
  const [image,   setImage]   = useState(null)
  const [preview, setPreview] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = "Name is required"
    if (!form.phone.trim())    e.phone    = "Phone is required"
    if (!form.email.trim())    e.email    = "Email is required"
    if (!form.password.trim()) e.password = "Password is required"
    if (form.password.length < 6) e.password = "Minimum 6 characters"
    if (!form.role)            e.role     = "Role is required"
    setError(e)
    return Object.keys(e).length === 0
  }

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/teachers")
    }, 800)
  }

  return (
    <div>
      <PageHeader
        title="Add Teacher"
        subtitle="Create a new teacher account"
      />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Profile image */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden dark:bg-slate-800 bg-slate-100 border-2 dark:border-slate-700 border-slate-200 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl dark:text-slate-600 text-slate-300">👤</span>
                )}
              </div>
              <label className="
                absolute bottom-0 right-0
                w-7 h-7 rounded-full
                bg-blue-600 text-white
                flex items-center justify-center
                shadow-lg hover:bg-blue-500
                transition-all cursor-pointer
              ">
                <Camera size={13} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>
            <p className="text-xs dark:text-slate-500 text-slate-400">
              Profile photo (optional)
            </p>
          </div>

          {/* Fields */}
          <Input
            label="Full Name"
            placeholder="e.g. Unais Hudawi"
            value={form.name}
            onChange={set("name")}
            error={error.name}
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
            placeholder="e.g. teacher@school.com"
            value={form.email}
            onChange={set("email")}
            error={error.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={set("password")}
            error={error.password}
          />

          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={set("role")}
            error={error.role}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/teachers")}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Teacher
            </Button>
          </div>

        </form>
      </Card>
    </div>
  )
}