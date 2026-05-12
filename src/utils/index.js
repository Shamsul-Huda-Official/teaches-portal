import { DAYS_OF_WEEK } from "../constants";

export const getDayLabel = (val) => DAYS_OF_WEEK.find(day => day.value === val)?.label || "Unknown";

export const formatDate = (dateStr) => {
    if(!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

export const formatCurrency = (amount) => 
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(amount)


export const getInitials = (name = "") => 
    name 
       .split(" ")
       .slice(0, 2)
       .map((word) => word[0])
       .join("")
       .toUpperCase()

export const extractError = (error) => 
        error?.response?.data?.message || error?.message || "Something went wrong"

export const classNames = (...classes) =>
    classes.filter(Boolean).join(" ")