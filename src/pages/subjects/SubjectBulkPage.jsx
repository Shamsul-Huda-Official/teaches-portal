import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, Download, Trash2, Plus, Check, X, AlertCircle } from "lucide-react"
import * as XLSX from "xlsx"
import { Button, Card, PageHeader, Badge, SectionHeader, Select } from "../../components/ui"

const MOCK_CLASSES = [
  { value: "1", label: "Grade 9"  },
  { value: "2", label: "Grade 10" },
]

const MOCK_DIVISIONS = {
  "1": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
  "2": [{ value: "a", label: "A" }, { value: "b", label: "B" }],
}

const COLUMNS = [
  { key: "name", label: "Subject Name", required: true },
]

function validateRow(row) {
  const errors = []
  if (!row.name?.trim()) errors.push("Subject name required")
  return errors
}

function downloadTemplate(classId, divisionId) {
  const headers = ["Subject Name"]
  const sample  = ["Mathematics"]
  const ws = XLSX.utils.aoa_to_sheet([headers, sample])
  ws["!cols"] = [{ wch: 25 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Subjects")
  XLSX.writeFile(wb, "subjects_template.xlsx")
}

function EditableCell({ value, onChange, hasError }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-2 py-1.5 rounded-lg text-xs transition-all
        dark:bg-slate-800 bg-white dark:text-slate-100 text-slate-800
        focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20
        border ${hasError ? "border-red-500/50 dark:bg-red-500/5" : "dark:border-slate-700 border-slate-200"}
      `}
    />
  )
}

export default function SubjectBulkPage() {
  const navigate    = useNavigate()
  const fileRef     = useRef(null)
  const [classId,    setClassId]    = useState("")
  const [divisionId, setDivisionId] = useState("")
  const [rows,       setRows]       = useState([])
  const [loading,    setLoading]    = useState(false)
  const [done,       setDone]       = useState(false)

  const divisions = classId ? (MOCK_DIVISIONS[classId] || []) : []

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const wb   = XLSX.read(evt.target.result, { type: "binary" })
      const ws   = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" })
      const normalized = data.map((r, i) => ({
        _id:  i,
        name: r["Subject Name"] !== undefined ? String(r["Subject Name"]) : "",
      }))
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

  const deleteRow = (rowIdx) =>
    setRows((prev) => prev.filter((_, i) => i !== rowIdx))

  const addRow = () =>
    setRows((prev) => [...prev, { _id: Date.now(), name: "" }])

  const validRows   = rows.filter((r) => validateRow(r).length === 0)
  const invalidRows = rows.filter((r) => validateRow(r).length > 0)

  const handleUpload = async () => {
    if (!classId || !divisionId || validRows.length === 0) return
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Bulk Upload Subjects"
        subtitle="Select class and division first, then upload subject list"
        actions={
          <Button variant="secondary" onClick={() => navigate("/subjects")}>Cancel</Button>
        }
      />

      <Card className="p-5 mb-4">
        <SectionHeader title="Step 1 — Select Class & Division" />
        <div className="flex gap-3">
          <Select
            placeholder="— Select Class —"
            options={MOCK_CLASSES}
            value={classId}
            onChange={(e) => { setClassId(e.target.value); setDivisionId(""); setRows([]); setDone(false) }}
          />
          <Select
            placeholder="— Select Division —"
            options={divisions}
            value={divisionId}
            onChange={(e) => { setDivisionId(e.target.value); setRows([]); setDone(false) }}
            disabled={!classId}
          />
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionHeader title="Step 2 — Download Template" />
        <div className="flex items-center justify-between">
          <p className="text-sm dark:text-slate-400 text-slate-500">
            One column: <code className="text-blue-600 dark:text-blue-400">Subject Name</code>
          </p>
          <Button variant="secondary" onClick={() => downloadTemplate(classId, divisionId)}>
            <Download size={14} /> Download Template
          </Button>
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionHeader title="Step 3 — Upload Filled File" />
        <label className={`
          flex flex-col items-center justify-center gap-3 py-10
          border-2 border-dashed rounded-xl transition-all
          ${!classId || !divisionId
            ? "dark:border-slate-800 border-slate-200 opacity-50 cursor-not-allowed"
            : "dark:border-slate-700 border-slate-200 cursor-pointer dark:hover:border-blue-500/50 hover:border-blue-400"
          }
        `}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10">
            <Upload size={20} className="text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium dark:text-slate-200 text-slate-700">
              {!classId || !divisionId ? "Select class & division first" : "Click to upload .xlsx file"}
            </p>
            <p className="text-xs dark:text-slate-500 text-slate-400 mt-0.5">
              Only Excel files (.xlsx, .xls) accepted
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFile}
            disabled={!classId || !divisionId}
          />
        </label>
      </Card>

      {rows.length > 0 && (
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
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

          <div className="overflow-x-auto border rounded-xl dark:border-slate-800 border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:bg-slate-800/50 bg-slate-50 dark:border-slate-800 border-slate-200">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold dark:text-slate-400 text-slate-500 w-8">#</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold dark:text-slate-400 text-slate-500">Subject Name *</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold dark:text-slate-400 text-slate-500 w-16">Status</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => {
                  const errs   = validateRow(row)
                  const hasErr = errs.length > 0
                  return (
                    <>
                      <tr
                        key={row._id}
                        className={`border-b dark:border-slate-800/60 border-slate-100 ${hasErr ? "dark:bg-red-500/5 bg-red-50" : "dark:bg-slate-900 bg-white"}`}
                      >
                        <td className="px-3 py-2 text-xs dark:text-slate-500 text-slate-400">{rowIdx + 1}</td>
                        <td className="px-2 py-1.5">
                          <EditableCell
                            value={row.name}
                            onChange={(val) => updateCell(rowIdx, "name", val)}
                            hasError={!row.name?.trim()}
                          />
                        </td>
                        <td className="px-3 py-2">
                          {hasErr ? (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400"><X size={11} /> Error</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Check size={11} /> Ready</span>
                          )}
                        </td>
                        <td className="px-2 py-1.5">
                          <button onClick={() => deleteRow(rowIdx)} className="p-1.5 rounded-lg dark:text-slate-500 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                      {hasErr && (
                        <tr className="border-b dark:bg-red-500/5 bg-red-50 dark:border-slate-800/60 border-slate-100">
                          <td />
                          <td colSpan={3} className="px-3 pb-2">
                            <div className="flex items-center gap-1.5">
                              <AlertCircle size={11} className="text-red-400" />
                              {errs.map((err) => <span key={err} className="text-xs text-red-400">{err}</span>)}
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
            <button onClick={() => { setRows([]); setDone(false) }} className="text-xs transition-all dark:text-slate-500 text-slate-400 hover:text-red-400">
              Clear all
            </button>
            <div className="flex items-center gap-3">
              {done && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  <Check size={14} /> {validRows.length} subjects imported!
                </span>
              )}
              <Button onClick={handleUpload} loading={loading} disabled={validRows.length === 0 || !classId || !divisionId}>
                Import {validRows.length} Subjects
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}