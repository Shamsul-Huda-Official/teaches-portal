import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, Download, Trash2, Plus, Check, X, AlertCircle } from "lucide-react"
import * as XLSX from "xlsx"
import toast from "react-hot-toast"
import { Button, Card, PageHeader, Badge, SectionHeader, Select } from "../../components/ui"
import { bulkCreateStudent } from "../../services/api/student.service"
import { getClasses } from "../../services/api/class.service"

const COLUMNS = [
  { key: "name",            label: "Full Name",     required: true  },
  { key: "admissionNumber", label: "Admission No.", required: true  },
  { key: "rollNumber",      label: "Roll No.",      required: true  },
  { key: "phone",           label: "Phone",         required: true  },
  { key: "parentName",      label: "Parent Name",   required: true  },
  { key: "email",           label: "Email",         required: false },
]

const UNIQUE_FIELDS = [
  { key: "admissionNumber", label: "Admission No." },
  { key: "rollNumber",      label: "Roll No."      },
  { key: "phone",           label: "Phone"         },
  { key: "email",           label: "Email"         },
]

function findDuplicates(rows) {
  const seen   = {}
  const dupMap = {}

  UNIQUE_FIELDS.forEach(({ key, label }) => {
    rows.forEach((row, idx) => {
      const val = row[key]?.trim().toLowerCase()
      if (!val) return
      const mapKey = `${key}:${val}`
      if (seen[mapKey] !== undefined) {
        if (!dupMap[idx]) dupMap[idx] = []
        dupMap[idx].push(`Duplicate ${label}`)
        const firstIdx = seen[mapKey]
        if (!dupMap[firstIdx]) dupMap[firstIdx] = []
        if (!dupMap[firstIdx].includes(`Duplicate ${label}`)) {
          dupMap[firstIdx].push(`Duplicate ${label}`)
        }
      } else {
        seen[mapKey] = idx
      }
    })
  })

  return dupMap
}

function validateRow(row) {
  const errors = []
  if (!row.name?.trim())            errors.push("Name required")
  if (!row.admissionNumber?.trim()) errors.push("Admission No. required")
  if (!row.rollNumber?.trim())      errors.push("Roll No. required")
  if (!row.phone?.trim())           errors.push("Phone required")
  if (!row.parentName?.trim())      errors.push("Parent name required")
  if (row.phone && !/^\d{10}$/.test(row.phone.trim()))
    errors.push("Phone must be 10 digits")
  if (row.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim()))
    errors.push("Invalid email format")
  return errors
}

function downloadTemplate() {
  const headers = COLUMNS.map((c) => c.label)
  const sample  = ["Muhammed Abdul Saleem", "67", "01", "7909137314", "Abdul Saleem", "mhdk7909@mail.com"]
  const ws      = XLSX.utils.aoa_to_sheet([headers, sample])
  ws["!cols"]   = COLUMNS.map(() => ({ wch: 20 }))
  const wb      = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Students")
  XLSX.writeFile(wb, "students_template.xlsx")
}

function EditableCell({ value, onChange, hasError }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-2 py-1.5 rounded-lg text-xs transition-all
        dark:bg-slate-800 bg-white dark:text-slate-100 text-slate-800
        focus:outline-none focus:ring-2
        dark:focus:ring-blue-500/30 focus:ring-blue-500/20 border
        ${hasError ? "border-red-500/50 dark:bg-red-500/5" : "dark:border-slate-700 border-slate-200"}
      `}
    />
  )
}

export default function StudentBulkPage() {
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  const [classId,    setClassId]    = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [rows,       setRows]       = useState([])
  const [loading,    setLoading]    = useState(false)
  const [done,       setDone]       = useState(false)
  
  const [classes, setClasses] = useState([])
  const [classData, setClassData] = useState(null)

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses()
        // ensure option values are strings so they match e.target.value
        setClasses(data.map((c) => ({ value: String(c.id), label: c.name })))
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch classes")
      }
    }
    fetchClasses()
  }, [])

  // Get divisions from selected class
  const divisions = classId && classData?.divisions
    ? classData.divisions.map((d) => ({
        // stringify division id as well to match select value type
        value: String(d.id),
        label: typeof d.name === 'string' ? d.name : d.name?.toString() || d.id
      }))
    : []

  const isReady   = classId && divisionId

  const dupMap    = findDuplicates(rows)

  const getRowErrors = (row, idx) => [
    ...validateRow(row),
    ...(dupMap[idx] || []),
  ]

  const validRows   = rows.filter((_, i) => getRowErrors(rows[i], i).length === 0)
  const invalidRows = rows.filter((_, i) => getRowErrors(rows[i], i).length > 0)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const wb   = XLSX.read(evt.target.result, { type: "binary" })
      const ws   = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" })
      const colMap = {
        "Full Name":     "name",
        "Admission No.": "admissionNumber",
        "Roll No.":      "rollNumber",
        "Phone":         "phone",
        "Parent Name":   "parentName",
        "Email":         "email",
      }
      const normalized = data.map((r, i) => {
        const row = { _id: i }
        Object.entries(colMap).forEach(([excelCol, key]) => {
          row[key] = r[excelCol] !== undefined ? String(r[excelCol]) : ""
        })
        return row
      })
      setRows(normalized)
      setDone(false)
    }
    reader.readAsBinaryString(file)
    e.target.value = ""
  }

  const updateCell = (rowIdx, key, val) => {
    setRows((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, [key]: val } : r)))
    setDone(false)
  }

  const deleteRow = (rowIdx) => {
    setRows((prev) => prev.filter((_, i) => i !== rowIdx))
    setDone(false)
  }

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { _id: Date.now(), name: "", admissionNumber: "", rollNumber: "", phone: "", parentName: "", email: "" },
    ])

  const handleClassChange = async (e) => {
    const newClassId = e.target.value
    setClassId(newClassId)
    setDivisionId("")
    setRows([])
    setDone(false)

    // Fetch class data to get divisions
    try {
      const classesData = await getClasses()
      // find by stringified id to match select value
      const selected = classesData.find((c) => String(c.id) === newClassId)
      if (selected) {
        setClassData(selected)
      }
    } catch {
      toast.error("Failed to load divisions")
    }
  }

  const handleUpload = async () => {
    if (!isReady || validRows.length === 0) return
    setLoading(true)
    
    try {
      const payload = validRows.map((row) => ({
        name: row.name,
        admissionNumber: row.admissionNumber,
        rollNumber: row.rollNumber,
        phone: row.phone,
        parentName: row.parentName,
        email: row.email,
        classId: classId,
        divisionId: divisionId,
      }))
      
      await bulkCreateStudent(payload)
      toast.success(`${validRows.length} students imported successfully`)
      setDone(true)
      // Clear after success
      setTimeout(() => {
        setRows([])
        setDone(false)
        navigate("/students")
      }, 2000)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to import students")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Bulk Upload Students"
        subtitle="Select class and division, then download template, fill and upload"
        actions={
          <Button variant="secondary" onClick={() => navigate("/students")}>Cancel</Button>
        }
      />

      <Card className="p-5 mb-4">
        <SectionHeader title="Step 1 — Select Class & Division" />
        <p className="mb-3 text-sm dark:text-slate-400 text-slate-500">
          All uploaded students will be assigned to this class and division.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select
            placeholder="— Select Class —"
            options={classes}
            value={classId}
            onChange={handleClassChange}
          />
          <Select
            placeholder="— Select Division —"
            options={divisions}
            value={divisionId}
            onChange={(e) => { setDivisionId(e.target.value); setRows([]); setDone(false) }}
            disabled={!classId}
          />
        </div>
        {isReady && (
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
            <Check size={12} />
            Students will be added to{" "}
            <span className="font-semibold">
              {classes.find((c) => c.value === classId)?.label} — Division{" "}
              {divisions.find((d) => d.value === divisionId)?.label}
            </span>
          </p>
        )}
      </Card>

      <Card className={`p-5 mb-4 transition-opacity ${!isReady ? "opacity-50 pointer-events-none" : ""}`}>
        <SectionHeader title="Step 2 — Download Template" />
        <div className="flex items-center justify-between">
          <p className="text-sm dark:text-slate-400 text-slate-500">
            Download the Excel template with correct columns and a sample row.
          </p>
          <Button variant="secondary" onClick={downloadTemplate} disabled={!isReady}>
            <Download size={14} /> Download Template
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {COLUMNS.map((c) => (
            <span
              key={c.key}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                c.required
                  ? "dark:border-blue-500/30 border-blue-200 dark:text-blue-400 text-blue-600 dark:bg-blue-500/10 bg-blue-50"
                  : "dark:border-slate-700 border-slate-200 dark:text-slate-400 text-slate-500"
              }`}
            >
              {c.label} {c.required ? "*" : "(optional)"}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs dark:text-slate-500 text-slate-400">
          💡 Unique fields: <span className="text-blue-600 dark:text-blue-400">Admission No., Roll No., Phone, Email</span>
        </p>
      </Card>

      <Card className={`p-5 mb-4 transition-opacity ${!isReady ? "opacity-50 pointer-events-none" : ""}`}>
        <SectionHeader title="Step 3 — Upload Filled File" />
        <label className={`
          flex flex-col items-center justify-center gap-3 py-10
          border-2 border-dashed rounded-xl transition-all
          ${!isReady
            ? "dark:border-slate-800 border-slate-200 cursor-not-allowed"
            : "dark:border-slate-700 border-slate-200 cursor-pointer dark:hover:border-blue-500/50 hover:border-blue-400"
          }
        `}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10">
            <Upload size={20} className="text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium dark:text-slate-200 text-slate-700">
              {!isReady ? "Select class & division first" : "Click to upload .xlsx file"}
            </p>
            <p className="text-xs dark:text-slate-500 text-slate-400 mt-0.5">
              Only Excel files (.xlsx, .xls) accepted
            </p>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} disabled={!isReady} />
        </label>
      </Card>

      {rows.length > 0 && (
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <SectionHeader
              title="Step 4 — Review & Edit"
              action={
                <div className="flex items-center gap-2">
                  <Badge color="green">{validRows.length} ready</Badge>
                  {invalidRows.length > 0 && <Badge color="red">{invalidRows.length} errors</Badge>}
                </div>
              }
            />
          </div>
          <p className="mb-3 text-xs dark:text-slate-500 text-slate-400">
            Click any cell to edit. Red rows have errors or duplicate values.
          </p>

          <div className="overflow-x-auto border rounded-xl dark:border-slate-800 border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:bg-slate-800/50 bg-slate-50 dark:border-slate-800 border-slate-200">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold dark:text-slate-400 text-slate-500 w-8">#</th>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className="px-3 py-2.5 text-left text-xs font-semibold dark:text-slate-400 text-slate-500">
                      {c.label}
                      {c.required && <span className="text-red-400 ml-0.5">*</span>}
                      {UNIQUE_FIELDS.find((u) => u.key === c.key) && (
                        <span className="ml-1 text-xs font-normal text-blue-400">(unique)</span>
                      )}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-left text-xs font-semibold dark:text-slate-400 text-slate-500 w-16">Status</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => {
                  const errs   = getRowErrors(row, rowIdx)
                  const hasErr = errs.length > 0
                  return (
                    <>
                      <tr
                        key={row._id}
                        className={`
                          border-b dark:border-slate-800/60 border-slate-100
                          ${hasErr ? "dark:bg-red-500/5 bg-red-50" : "dark:bg-slate-900 bg-white"}
                        `}
                      >
                        <td className="px-3 py-2 text-xs dark:text-slate-500 text-slate-400">{rowIdx + 1}</td>
                        {COLUMNS.map((c) => {
                          const isDupField = (dupMap[rowIdx] || []).some((e) => e.toLowerCase().includes(c.label.toLowerCase().split(" ")[0].toLowerCase()))
                          const isMissing  = c.required && !row[c.key]?.trim()
                          return (
                            <td key={c.key} className="px-2 py-1.5">
                              <EditableCell
                                value={row[c.key]}
                                onChange={(val) => updateCell(rowIdx, c.key, val)}
                                hasError={isMissing || isDupField}
                              />
                            </td>
                          )
                        })}
                        <td className="px-3 py-2">
                          {hasErr ? (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400">
                              <X size={11} /> Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                              <Check size={11} /> Ready
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-1.5">
                          <button
                            onClick={() => deleteRow(rowIdx)}
                            className="p-1.5 rounded-lg dark:text-slate-500 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                      {hasErr && (
                        <tr className="border-b dark:bg-red-500/5 bg-red-50 dark:border-slate-800/60 border-slate-100">
                          <td />
                          <td colSpan={COLUMNS.length + 2} className="px-3 pb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <AlertCircle size={11} className="shrink-0 text-red-400" />
                              {errs.map((err) => (
                                <span key={err} className="text-xs text-red-400">{err}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={addRow}
            className="w-full mt-2 py-2.5 rounded-xl text-xs dark:text-slate-500 text-slate-400 dark:hover:text-slate-300 hover:text-slate-600 dark:hover:bg-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 border dark:border-slate-800 border-slate-200"
          >
            <Plus size={13} /> Add row manually
          </button>

          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => { setRows([]); setDone(false) }}
              className="text-xs transition-all dark:text-slate-500 text-slate-400 hover:text-red-400"
            >
              Clear all
            </button>
            <div className="flex items-center gap-3">
              {done && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  <Check size={14} /> {validRows.length} students imported!
                </span>
              )}
              <Button
                onClick={handleUpload}
                loading={loading}
                disabled={validRows.length === 0 || !isReady}
              >
                Import {validRows.length} Students
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}