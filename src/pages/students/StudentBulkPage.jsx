import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, Download, Trash2, Plus, Check, X, AlertCircle  } from "lucide-react"
import * as XLSX from "xlsx"
import { Button, Card, PageHeader, Badge, SectionHeader } from "../../components/ui"

const COLUMNS = [
  { key: "name",            label: "Full Name",       required: true  },
  { key: "admissionNumber", label: "Admission No.",   required: true  },
  { key: "rollNumber",      label: "Roll No.",        required: true  },
  { key: "phone",           label: "Phone",           required: true  },
  { key: "parentName",      label: "Parent Name",     required: true  },
  { key: "email",           label: "Email",           required: false },
]
 
function validateRow(row) {
  const errors = []
  if (!row.name?.trim())            errors.push("Name required")
  if (!row.admissionNumber?.trim()) errors.push("Admission No. required")
  if (!row.rollNumber?.trim())      errors.push("Roll No. required")
  if (!row.phone?.trim())           errors.push("Phone required")
  if (!row.parentName?.trim())      errors.push("Parent name required")
  if (row.phone && !/^\d{10}$/.test(row.phone.trim()))
    errors.push("Phone must be 10 digits")
  return errors
}

function downloadTemplate() {
    const header = COLUMNS.map((c) => c.label);
    const sample = [
        "Mohammed", "067", "01", "9876543210", "Saleem", "mhdk7909@gmail.com" 
    ]
    const ws = XLSX.utils.aoa_to_sheet({
        header, 
        sample
    })
    ws["!cols"] = COLUMNS.map(() => ({ wch: 25}))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")
    XLSX.writeFile(wb, "students_template.xlsx")
}

export default function StudentBulkPage() {
    return (
        <div>
            <h1>Bulk Student Management</h1>
        </div>
    )
}