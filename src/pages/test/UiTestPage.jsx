import {
  Button, Input, Select, Textarea, Badge, Card, StatCard,
  Spinner, PageLoader, PageHeader, Avatar, EmptyState, Table,
  SearchInput, Tabs,  ConfirmModal, Pagination, SectionHeader
} from "../../components/ui"
import { Users, GraduationCap, School, BookOpen, Clock } from "lucide-react"
import { useState } from "react"

export default function UITestPage() {
  const [tab, setTab] = useState("a")
  const [confirm, setConfirm] = useState(false)
  const [page, setPage] = useState(1)

  return (

    <div className="flex flex-col max-w-4xl gap-10">

      {/* BUTTONS */}
      <Card className="p-6">
        <SectionHeader title="Buttons" />
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Card>

      {/* INPUTS */}
      <Card className="p-6">
        <SectionHeader title="Inputs" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" placeholder="Enter name" />
          <Input label="With Error" placeholder="Enter phone" error="Phone is required" />
          <Input label="With Hint" placeholder="Enter email" hint="We'll never share your email" />
          <Select label="Class" options={[{ value: "1", label: "Grade 1" }, { value: "2", label: "Grade 2" }]} />
          <Textarea label="Purpose" placeholder="Enter purpose..." className="col-span-2" />
        </div>
      </Card>

      {/* BADGES */}
      <Card className="p-6">
        <SectionHeader title="Badges" />
        <div className="flex flex-wrap gap-2">
          <Badge color="slate">Slate</Badge>
          <Badge color="blue">Blue</Badge>
          <Badge color="green">Active</Badge>
          <Badge color="red">Inactive</Badge>
          <Badge color="amber">Pending</Badge>
          <Badge color="purple">Medical</Badge>
          <Badge color="cyan">Cyan</Badge>
        </div>
      </Card>

      {/* STAT CARDS */}
      <div>
        <SectionHeader title="Stat Cards" />
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Students" value="300+" icon={GraduationCap} color="blue" />
          <StatCard label="Total Teachers" value="20+"  icon={Users}         color="green" />
          <StatCard label="Total Classes"  value="10+"  icon={School}        color="amber" />
          <StatCard label="Total Subjects" value="150+" icon={BookOpen}      color="purple" />
          <StatCard label="Total Periods"  value="9+"   icon={Clock}         color="rose" />
        </div>
      </div>

      {/* AVATARS */}
      <Card className="p-6">
        <SectionHeader title="Avatars" />
        <div className="flex items-end gap-4">
          <Avatar name="Ali Khan" size="sm" />
          <Avatar name="Ali Khan" size="md" />
          <Avatar name="Ali Khan" size="lg" />
          <Avatar name="Ali Khan" size="xl" />
        </div>
      </Card>

      {/* TABS */}
      <Card className="p-6">
        <SectionHeader title="Tabs" />
        <Tabs
          tabs={[
            { label: "Attendance", value: "a" },
            { label: "Recovery",   value: "r" },
            { label: "Funding",    value: "f" },
          ]}
          active={tab}
          onChange={setTab}
        />
        <p className="mt-4 text-sm dark:text-slate-400 text-slate-500">
          Active tab: {tab}
        </p>
      </Card>

      {/* TABLE */}
      <div>
        <SectionHeader title="Table" />
        <Table
          columns={[
            { key: "name",   label: "Name" },
            { key: "roll",   label: "Roll" },
            { key: "status", label: "Status", render: (v) => <Badge color={v === "Active" ? "green" : "red"}>{v}</Badge> },
          ]}
          data={[
            { id: 1, name: "Ali Khan",   roll: "01", status: "Active" },
            { id: 2, name: "Sara Mathew", roll: "02", status: "Inactive" },
            { id: 3, name: "Riya Nair",  roll: "03", status: "Active" },
          ]}
          onRowClick={(r) => console.log(r)}
        />
        <Pagination page={page} totalPages={5} onChange={setPage} />
      </div>

      {/* EMPTY STATE */}
      <Card className="p-6">
        <SectionHeader title="Empty State" />
        <EmptyState
          title="No students found"
          subtitle="Add your first student to get started"
          action={<Button size="sm">Add Student</Button>}
        />
      </Card>

      {/* CONFIRM MODAL */}
      <Card className="p-6">
        <SectionHeader title="Confirm Modal" />
        <Button variant="danger" onClick={() => setConfirm(true)}>
          Open Confirm Modal
        </Button>
        <ConfirmModal
          open={confirm}
          title="Delete Student"
          message="This will permanently delete the student. Are you sure?"
          onConfirm={() => setConfirm(false)}
          onCancel={() => setConfirm(false)}
        />
      </Card>

    </div>
  )
}