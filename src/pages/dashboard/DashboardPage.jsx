import { Users, GraduationCap, School, BookOpen, Clock, TrendingUp } from "lucide-react"
import { StatCard, Card, SectionHeader } from "../../components/ui"

const MOCK_STATS = {
  students: 312,
  teachers: 24,
  classes:  10,
  subjects: 148,
  periods:  60,
}

const MOCK_RECENT_ABSENT = [
  { id: "1", name: "Mohammed Ajmal", class: "Grade 9", division: "A", date: "19/05/2026", subject: "Mathematics" },
  { id: "2", name: "Sara Mathew",    class: "Grade 9", division: "A", date: "19/05/2026", subject: "English"     },
  { id: "3", name: "Riya Nair",      class: "Grade 9", division: "B", date: "19/05/2026", subject: "Physics"     },
  { id: "4", name: "Anoop P",        class: "Grade 10",division: "A", date: "19/05/2026", subject: "Chemistry"   },
  { id: "5", name: "Fatima Zahra",   class: "Grade 10",division: "B", date: "19/05/2026", subject: "Biology"     },
]

const MOCK_TODAY_ATTENDANCE = {
  total:   312,
  present: 275,
  absent:   25,
  leave:    12,
}

export default function DashboardPage() {
  const { total, present, absent, leave } = MOCK_TODAY_ATTENDANCE
  const presentPct = Math.round((present / total) * 100)

  const stats = [
    { label: "Total Students", value: MOCK_STATS.students, icon: GraduationCap, color: "blue"   },
    { label: "Total Teachers", value: MOCK_STATS.teachers, icon: Users,          color: "green"  },
    { label: "Total Classes",  value: MOCK_STATS.classes,  icon: School,         color: "amber"  },
    { label: "Total Subjects", value: MOCK_STATS.subjects, icon: BookOpen,       color: "purple" },
    { label: "Total Periods",  value: MOCK_STATS.periods,  icon: Clock,          color: "rose"   },
  ]

  return (
    <div className="flex flex-col gap-6">

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="p-5 lg:col-span-1">
          <SectionHeader title="Today's Attendance" />
          <div className="flex flex-col gap-3">

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs dark:text-slate-400 text-slate-500">Present rate</span>
                <span className="text-xs font-semibold dark:text-slate-200 text-slate-700">{presentPct}%</span>
              </div>
              <div className="h-2 rounded-full dark:bg-slate-800 bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${presentPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                { label: "Present", value: present, color: "text-emerald-400" },
                { label: "Absent",  value: absent,  color: "text-red-400"     },
                { label: "Leave",   value: leave,   color: "text-blue-400"    },
                { label: "Total",   value: total,   color: "dark:text-slate-200 text-slate-700" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="dark:bg-slate-800/50 bg-slate-50 rounded-xl px-3 py-2.5"
                >
                  <p className="text-xs dark:text-slate-500 text-slate-400">{item.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Recent Absences Today" />
          <div className="flex flex-col divide-y dark:divide-slate-800 divide-slate-100">
            {MOCK_RECENT_ABSENT.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold dark:text-slate-400 text-slate-500">
                      {s.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-slate-100 text-slate-800">{s.name}</p>
                    <p className="text-xs dark:text-slate-500 text-slate-400">
                      {s.class} · {s.division}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs dark:text-slate-300 text-slate-600">{s.subject}</p>
                  <p className="text-xs dark:text-slate-500 text-slate-400">{s.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}