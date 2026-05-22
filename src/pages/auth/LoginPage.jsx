import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../store/AuthContext"
import { Button, Input } from "../../components/ui"
import toast from "react-hot-toast"

import api from "../../services/api/api"
import { loginUser } from "../../services/api/auth.service"

const INIT = { username: "", password: "" }

export default function LoginPage() {
  const navigate          = useNavigate()
  const { login }         = useAuth()
  const [form, setForm]   = useState(INIT)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = "Username is required"
    if (!form.password.trim()) e.password = "Password is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const response = await api.post("/auth/login", {
        username: form.username,
        password: form.password
      });
      const {token, user} = response.data.data;
      
      login(user, token);
      
      toast.success("Login successful")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark:bg-[#0a0f1e] bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4 bg-blue-600 shadow-xl w-14 h-14 rounded-2xl shadow-blue-600/30">
            <Building2 size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold dark:text-slate-100 text-slate-800">
            AttendSaaS
          </h1>
          <p className="mt-1 text-sm dark:text-slate-400 text-slate-500">
            Sign in to your account
          </p>
        </div>

        <div className="p-6 bg-white border shadow-xl dark:bg-slate-900 dark:border-slate-800 border-slate-200 rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="Enter your username"
              value={form.username}
              onChange={set("username")}
              error={errors.username}
              autoComplete="username"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase dark:text-slate-300 text-slate-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set("password")}
                  autoComplete="current-password"
                  className={`
                    w-full px-3 py-2.5 pr-10 rounded-xl text-sm transition-all duration-150
                    dark:bg-slate-800/60 bg-white
                    dark:border-slate-700 border-slate-200 border
                    dark:text-slate-100 text-slate-800
                    dark:placeholder:text-slate-500 placeholder:text-slate-400
                    focus:outline-none focus:ring-2
                    dark:focus:ring-blue-500/30 focus:ring-blue-500/20
                    dark:focus:border-blue-500/50 focus:border-blue-400
                    ${errors.password ? "border-red-500/50 focus:ring-red-500/20" : ""}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute transition-all -translate-y-1/2 right-3 top-1/2 dark:text-slate-500 text-slate-400 hover:dark:text-slate-300 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="mt-6 text-xs text-center dark:text-slate-500 text-slate-400">
          Smart Attendance Management System
        </p>
      </div>
    </div>
  )
}