// BUTTON 
export function Button ( {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    className = "",
    ...props
}) {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-2.5 text-sm"
    }
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20",
        secondary: "dark:bg-slate-800 bg-slate-100 dark:text-slate-200 text-slate-700 dark:hover:bg-slate-700 hover:bg-slate-200 dark:border-slate-700 border-slate-200 border",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "dark:text-slate-400 text-slate-500 dark:hover:text-slate-100 hover:text-slate-900 dark:hover:bg-white/8 hover:bg-black/5",
        success: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20",
    }
    
    return (
        <button
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )} 
            { children }
        </button>
    )
}

// Input
export function Input({ label, error, hint, className = "", ...props}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-medium tracking-wide uppercase dark:text-slate-300 text-slate-600">
                    {label}
                </label>
            )}
            <input 
                className={`w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 dark:bg-slate-800/60 bg-white dark:border-slate-700 border-slate-200 border dark:text-slate-100 text-slate-800 dark:placeholder:text-slate-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20 dark:focus:border-blue-500/50 focus:border-blue-400 
                    ${error ? "border-red-500/50 focus:ring-red-500/20" : ""}
                    ${className}
                    `}  
                {...props}
            />
            {hint && !error && <p className="text-xs dark:text-slate-500 text-slate-400">
                {hint}
            </p> }
            {error && <p className="text-xs text-red-400">{error}</p> }
        </div>
    )
}

// Select 
export function Select({ label, error, options = [], className="", ...props}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-medium tracking-wide uppercase dark:text-slate-300 text-slate-600"> 
                    {label} 
                </label>
            )}
            <select className={`w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 dark:bg-slate-800/60 bg-white dark:border-slate-700 border-slate-200 border dark:text-slate-100 text-slate-800 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20 dark:focus:border-blue-500/50 focus:border-blue-400
                    ${error ? "border-red-500/50" : ""}
                    ${className}
                `}
                {...props}>
                    <option value="">-- Select --</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-400">{error}</p> }
        </div>
    )
}

// Textarea
export function Textarea ({ label, error, className="", ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-medium tracking-wide uppercase dark:text-slate-300 text-slate-600">
                    {label}
                </label>
            )}
            <textarea className={`w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 resize-none dark:bg-slate-800/60 bg-white dark:border-slate-700 border-slate-800 dark:placeholder:text-slate-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20
                ${error ? "border-red-500/50" : ""}
                ${className}
                `}
                rows={3}
                {...props}
                />
                 {error && <p className="text-xs text-red-400">{error}</p>}  
        </div>
    )
}

// Badge 
export function Badge({ children, color="slate"}) {
    const colors = {
        slate: "dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600",
        blue: "bg-blue-500/10 text-emerald-400",
        green: "bg-emerald-500/10 text-emerald-400",
        red: "bg-red-500/10 text-red-400",
        amber:  "bg-amber-500/10 text-amber-400",
        purple: "bg-purple-500/10 text-purple-400",
        cyan:   "bg-cyan-500/10 text-cyan-400",
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    )
}

// Card
export function Card({ children, className = "", onClick }) {
    return (
        <div className={`bg-white dark:bg-slate-900 dark:border-slate-800 border-slate-200 border rounded-2xl transition-colors duration-150
            ${onClick ? "cursor-pointer dark:hover:bg-slate-800/60 hover:bg-slate-50": ""}
            ${className}
            `}>
                {children}
            </div>
    )
}

// Stat Card
export function StatCard({ label, value, icon: Icon, color = "blue"}) {
    const colors = {
        blue:   "text-blue-400   bg-blue-500/10",
        green:  "text-emerald-400 bg-emerald-500/10",
        amber:  "text-amber-400  bg-amber-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        rose:   "text-rose-400   bg-rose-500/10",
        cyan:   "text-cyan-400   bg-cyan-500/10",
    }
    return (
        <Card className="p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium tracking-wide uppercase dark:text-slate-400 text-slate-500">
                        {label}
                    </p>
                    <p className="text-2xl font-bold dark:text-slate-100 text-slate-800 mt-1.5">
                        {value}
                    </p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                    ${colors[color]}
                    `}>
                    <Icon size={20} strokeWidth={1.75} />
                </div>
            </div>
        </Card>
    )
}

// Spinner
export function Spinner ({size="md"}) {
    const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg:"w-10 h-10"}
    return (
        <div className={`${sizes[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
    )
}

// Page Loader
export function PageLoader() {
    return (
        <div className="flex items-center justify-center h-64">
            <Spinner />
        </div>
    )
}

// Page Header
export function PageHeader ({ title, subtitle, actions }) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h2 className="text-lg font-bold dark:text-slate-100 text-slate-800">
                    {title}
                </h2>
                {subtitle && (
                <p className="mt-0.5 text-sm dark:text-slate-400 text-slate-500">
                    {subtitle}
                </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center flex-shrink-0 gap-2 ml-4">
                    {actions}
                </div>
            )}
        </div>
    )
}

// Empty State
export function EmptyState({ title = "No data found", subtitle, action }) {
    return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl dark:bg-slate-800 bg-slate-100">
        <span className="text-2xl">📭</span>
      </div>
      <p className="text-sm font-medium dark:text-slate-300 text-slate-600">{title}</p>
      {subtitle && (
        <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">{subtitle}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
    )
}

// Table
export function Table({ columns, data, onRowClick }) {
    return (
        <div className="overflow-x-auto border rounded-2xl dark:border-slate-800 border-slate-200">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border border-b dark:border-slate-800 border-slate-200 dark:bg-slate-800/50 bg-slate-50">
                        {columns.map((col) => (
                            <th 
                               className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase dark:text-slate-400 text-slate-500" 
                               key={col.key}
                               >
                                    {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={row.id ?? i}
                            onClick={() => onRowClick?.(row)}
                            className={`
                                border-b dark:border-slate-800/60 border-slate-100 dark:bg-slate-900 bg-white transition-colors duration-100 
                                ${onRowClick ? "cursor-pointer dark:hover:bg-slate-800/60 hover:bg-slate-50" : ""} 
                                `}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3.5 dark:text-slate-300 text-slate-700">
                                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "-")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Search Input 
export function SearchInput ({ value, onChange, placeholder = "Search..."}) {
    return (
        <div className="relative">
            <svg
                className="absolute -translate-y-1/2 left-3 top-1/2 dark:text-slate-500 text-slate-400"
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder} 
                className="w-64 py-2 pl-6 pr-4 text-sm transition-all duration-150 bg-white border rounded-xl dark:bg-slate-800/60 dark:border-slate-700 border-slate-200 dark:text-slate-100 text-slate-800 dark:placeholder:text-slate-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/30 focus:ring-blue-500/20 dark:focus:border-blue-500/50 focus:border-blue-400"
            />
        </div>
    )
}

export function Tabs({ tabs, active, onChange }) {
    return (
        <div className="flex gap-1 p-1 dark:bg-slate-800 bg-slate-100 rounded-xl">
            {tabs.map((tab) => (
                <button
                key={tab.value}
                onClick={() => onChange(tab.value)}
                className={`
                    flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active === tab.value
                    ? "dark:bg-slate-900 bg-white dark:text-slate-100 text-slate-800 shadow-sm"
                    : "dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
                    }
                `}
                >
                {tab.label}
                </button>
            ))}
        </div>
    )
}

// Avatar
export function Avatar({ name, src, size = "md"}) {
    const sizes = {
        sm:  "w-8 h-8 text-xs",
        md:  "w-10 h-10 text-sm",
        lg:  "w-16 h-16 text-lg",
        xl:  "w-24 h-24 text-2xl",
    }
    const initials = name
        ? name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
        : "U"
        
    if (src) {
        return (
            <img src={src} alt={name}
                className={`${sizes[size]} rounded-full object-cover border-2 dark:border-slate-700 border-slate-200 flex-shrink-0`} 
             />
        )
    }
    return (
        <div className={`${sizes[size]} rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center font-bold text-blue-400 flex-shrink-0`}>
            {initials}
        </div>
    )
}

// Confirm Modal
export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 bg-white border shadow-2xl dark:bg-slate-900 dark:border-slate-700 border-slate-200 rounded-2xl">
                <h3 className="mb-2 text-base font-semibold dark:text-slate-100 text-slate-800">
                {title}
                </h3>
                <p className="mb-6 text-sm dark:text-slate-400 text-slate-500">
                {message}
                </p>
                <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} loading={loading}>
                    Confirm
                </Button>
                </div>
            </div>
        </div>
    )
}

// Pagination
export function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;
    console.log("Total Page: ", totalPages)
    return (
        <div className="flex items-center justify-end gap-1.5 mt-4">
            <button 
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500 disabled:opacity-40 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all"
            >
                Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                            ${ p === page
                                ? "bg-blue-600 text-white"
                                : "dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500 dark:hover:bg-slate-700 hover:bg-slate-200"
                             }
                        `}
                >
                    {p}      
                </button>
            ))}
            <button 
                onClick={() => onChange(page + 1)}
                className="px-3 py-1.5 rounded-lg text-xs dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500 disabled:opacity-40 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all">
                    Next         
            </button>
        </div>
    )
}

// Section Header (inside a card)
export function SectionHeader({ title, action }) {
    return(
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase dark:text-slate-200 text-slate-700">
                {title}
            </h3>
            {action}
        </div>
    )
}