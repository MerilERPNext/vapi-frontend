import { useState, useEffect, useRef } from "react"
import "./style.css";
import { ClipboardCheck, AlertCircle, Clock, MapPin, ExternalLink, Timer, Users, ChevronUp, ChevronDown } from "lucide-react"

interface JobCardTimeLog {
    name: string
    owner: string
    creation: string
    modified: string
    modified_by: string
    docstatus: number
    idx: number
    employee: string
    employee_name: string
    time_in_mins: number
    completed_qty: number
    parent: string
    parentfield: string
    parenttype: string
    doctype: string
}
interface JobCard {
    name: string
    operation: string
    custom_operation_description: string
    for_quantity: number
    total_completed_qty: number
    sequence_id: number
    status: string
    workstation: string
    expected_start_date: string
    expected_end_date: string
    employee: JobCardTimeLog[]
    employee_details: any
    time_logs: JobCardTimeLog[]

}
const refinedData = (timelogs: Array<any>) => {
    let arr: Array<JobCardTimeLog> = [];
    for (const element of timelogs) {
        const index = arr.findIndex((e) => e.employee == element.employee)
        if (index !== -1) {
            arr[index]['time_in_mins'] += element.time_in_mins
        } else {
            arr.push(element)
        }

    }
    return arr
};


// Format time in minutes to hours and minutes
const formatTimeInMins = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60

    if (hours > 0) {
        return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`
    }
    return `${minutes}m`
}

const getAvatarColor = (id: string) => {
    const colors: string[] = [
        "#f43f5e",  // bg-rose-500
        "#ec4899",  // bg-pink-500
        "#d946ef",  // bg-fuchsia-500
        "#a855f7",  // bg-purple-500
        "#8b5cf6",  // bg-violet-500
        "#6366f1",  // bg-indigo-500
        "#0ea5e9",  // bg-sky-500
        "#06b6d4",  // bg-cyan-500
        "#14b8a6",  // bg-teal-500
        "#10b981",  // bg-emerald-500
        "#22c55e",  // bg-green-500
        "#84cc16",  // bg-lime-500
        "#f59e0b",  // bg-amber-500
        "#f97316",  // bg-orange-500
        "#ef4444",  // bg-red-500
    ]

    // Simple hash function to get a consistent index
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
}
export default function JobCards({ name }: { name: string }) {
    const [jobCards, setJobCards] = useState<JobCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const ref = useRef<HTMLDivElement>(null)
    const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({})



    const toggleEmployeeList = (cardName: string) => {
        setExpandedEmployees((prev) => ({
            ...prev,
            [cardName]: !prev[cardName],
        }))
    }

    useEffect(() => {
        setLoading(true)
        fetch(
            `/api/method/chatnext_manufacturing.config.py.work_order_methods.get_full_job_cards_by_work_order?work_order=${name}`,
            {
                method: "GET"

            }
        ).then(async (res) => {
            const data = await res.json()
            let newArr = []
            for (const element of data?.message) {
                element["time_logs"] = refinedData(element.time_logs)
                newArr.push(element)
            }
            setJobCards(newArr || [])

        }).catch((e) => {
            setError(e.message || 'Something went wrong')

        }).finally(() => {
            setLoading(false)
        })


    }, [name])


    useEffect(() => {


        const handleView = () => {
            console.log(ref);

            if (ref.current) {
                const w = ref.current.clientWidth
                console.log(w);

                if (w < 550) {
                    setViewMode('list')
                } else {
                    setViewMode('grid')
                }
            }

        }
        setTimeout(() => {
            handleView()
        }, 100);

    }, [ref.current])


    // useEffect(() => {
    //     // In a real application, this would be an API call
    //     // For this example, we're using the provided data
    //     try {

    //         if (!window?.frappe?.db) {
    //             setJobCards([
    //                 {
    //                     name: "PO-JOB00056",
    //                     operation: "UW",
    //                     custom_operation_description: "STP ULTRASONIC WELDING",
    //                     for_quantity: 1,
    //                     total_completed_qty: 0,
    //                     sequence_id: 2,
    //                     status: "Open",
    //                     workstation: "Blanking Machine",
    //                     expected_start_date: "2024-12-30 17:14:40",
    //                     expected_end_date: "2024-12-30 17:24:40",
    //                     employee: [
    //                         {
    //                             name: "791lufrr7e",
    //                             owner: "Administrator",
    //                             creation: "2025-04-11 16:28:11.221114",
    //                             modified: "2025-04-11 16:37:02.030416",
    //                             modified_by: "funnel@chatnext.hybrowlabs.com",
    //                             docstatus: 1,
    //                             idx: 1,
    //                             employee: "12359",
    //                             time_in_mins: 120,
    //                             completed_qty: 0,
    //                             parent: "PO-JOB00059",
    //                             parentfield: "employee",
    //                             parenttype: "Job Card",
    //                             doctype: "Job Card Time Log",
    //                         },
    //                         {
    //                             name: "791lufrr8e",
    //                             owner: "Administrator",
    //                             creation: "2025-04-11 16:28:11.221114",
    //                             modified: "2025-04-11 16:37:02.030416",
    //                             modified_by: "funnel@chatnext.hybrowlabs.com",
    //                             docstatus: 1,
    //                             idx: 2,
    //                             employee: "12360",
    //                             time_in_mins: 60,
    //                             completed_qty: 0,
    //                             parent: "PO-JOB00059",
    //                             parentfield: "employee",
    //                             parenttype: "Job Card",
    //                             doctype: "Job Card Time Log",
    //                         },
    //                     ]
    //                 },
    //                 {
    //                     name: "PO-JOB00057",
    //                     operation: "BS",
    //                     custom_operation_description: "STP BLISTER SEALING",
    //                     for_quantity: 1,
    //                     total_completed_qty: 0,
    //                     sequence_id: 3,
    //                     status: "Open",
    //                     workstation: "Blister Packing",
    //                     expected_start_date: "2024-12-30 17:34:40",
    //                     expected_end_date: "2024-12-30 17:44:40",
    //                     employee: []
    //                 },
    //                 {
    //                     name: "PO-JOB00058",
    //                     operation: "STRLZT",
    //                     custom_operation_description: "STP STERILIZATION",
    //                     for_quantity: 1,
    //                     total_completed_qty: 0,
    //                     sequence_id: 4,
    //                     status: "Open",
    //                     workstation: "Cellophene",
    //                     expected_start_date: "2024-12-30 17:54:40",
    //                     expected_end_date: "2024-12-30 18:04:40",
    //                     employee: []

    //                 },
    //                 {
    //                     name: "PO-JOB00059",
    //                     operation: "FP",
    //                     custom_operation_description: "STP FINAL PACKING",
    //                     for_quantity: 1,
    //                     total_completed_qty: 0,
    //                     sequence_id: 5,
    //                     status: "Open",
    //                     workstation: "Cellophene",
    //                     expected_start_date: "2024-12-30 18:14:40",
    //                     expected_end_date: "2024-12-30 18:24:40",
    //                     employee: []

    //                 },
    //                 {
    //                     name: "PO-JOB00060",
    //                     operation: "RFG",
    //                     custom_operation_description: "STP RELEASE OF FINISHED GOODS",
    //                     for_quantity: 1,
    //                     total_completed_qty: 0,
    //                     sequence_id: 6,
    //                     status: "Open",
    //                     workstation: "Cutting",
    //                     expected_start_date: "2024-12-30 18:34:40",
    //                     expected_end_date: "2024-12-30 18:44:40",
    //                     employee: []

    //                 },
    //                 {
    //                     name: "PO-JOB00055",
    //                     operation: "FHA",
    //                     custom_operation_description: "STP FIRING HANDLE ASSEMBLY",
    //                     for_quantity: 1,
    //                     total_completed_qty: 0,
    //                     sequence_id: 1,
    //                     status: "Completed",
    //                     workstation: "Binding",
    //                     expected_start_date: "2024-12-30 16:54:40",
    //                     expected_end_date: "2024-12-30 17:04:40",
    //                     employee: []

    //                 },
    //             ])
    //             setLoading(false)
    //         } else {

    //             // This would normally be a fetch call
    //             window?.frappe?.db?.get_list("Job Card", {
    //                 filters: { work_order: name },
    //                 fields: "*"
    //             }).then((data: any) => {
    //                 // Sort the job cards by sequence_id
    //                 const sortedData = [...data].sort((a, b) => a.sequence_id - b.sequence_id)
    //                 setJobCards(sortedData)
    //                 setLoading(false)
    //             })
    //         }


    //     } catch (err: any) {
    //         console.log(err)
    //         setError("Failed to load job cards")
    //         setLoading(false)
    //     }
    // }, [name])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    if (loading) {
        return (
            <div className="woi-loading-container">
                <div className="woi-loading-spinner"></div>
                <p>Loading job cards...</p>
            </div>
        )
    }

    if (error) {
        return <div className="woi-error">{error}</div>
    }

    return (
        <div className={`woi-dialog-container ${viewMode === "list" ? "woi-list-view" : ""}`}>
            <div className="woi-dialog-header">
                <h1 className="woi-dialog-title">Manufacturing Job Cards</h1>
                <p className="woi-dialog-subtitle">Sorted by sequence</p>
            </div>

            {/* <div className="woi-view-toggle">
                <button
                    className={`woi-view-button ${viewMode === "grid" ? "woi-active" : ""}`}
                    onClick={() => setViewMode("grid")}
                >
                    <Grid size={16} className="mr-2"/>
                    Grid View
                </button>
                <button
                    className={`woi-view-button ${viewMode === "list" ? "woi-active" : ""}`}
                    onClick={() => setViewMode("list")}
                >
                    <List size={16} className="mr-2"/>
                    List View
                </button>
            </div> */}

            <div className="woi-cards-stack" ref={ref}>
                {jobCards.map((card) => (
                    <div
                        key={card.name}
                        className={`woi-card ${card.status === "Completed" ? "woi-card-completed" : "woi-card-open"}`}
                    >
                        <div className="woi-card-sequence-badge">#{card.sequence_id}</div>
                        <div className="woi-card-content">
                            <div className="woi-card-header">
                                <div className="woi-card-title-area">
                                    <a onClick={() => {
                                        window.frappe.set_route(["Form", "Job Card", card.name])
                                    }} style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        <h2 className="woi-card-name" style={{
                                            display: "flex",
                                            alignItems: "center"
                                        }}>{card.name}</h2>
                                        <ExternalLink size={"15"} />
                                    </a>
                                    <div className="woi-card-operation">
                                        <span className="woi-operation-code">{card.operation}</span>
                                        <span
                                            className="woi-operation-description">{card.custom_operation_description}</span>
                                    </div>
                                </div>
                                <div
                                    className={`woi-card-status ${card.status === "Completed" ? "woi-status-completed" : "woi-status-open"}`}
                                >
                                    {card.status === "Completed" ? (
                                        <ClipboardCheck className="woi-status-icon" />
                                    ) : (
                                        <AlertCircle className="woi-status-icon" />
                                    )}
                                    <span>{card.status}</span>
                                </div>
                            </div>

                            <div className="woi-card-details">
                                <div className="woi-card-workstation">
                                    <MapPin size={14} className="woi-icon" />
                                    <span>{card.workstation}</span>
                                </div>

                                <div className="woi-card-schedule">
                                    <Clock size={14} className="woi-icon" />
                                    <span>
                                        {formatDate(card.expected_start_date)} - {formatDate(card.expected_end_date)}
                                    </span>
                                </div>
                            </div>

                            {/* Employee Section */}
                            {card.time_logs && card.time_logs.length > 0 && (
                                <div className="woi-card-employees">
                                    <div className="woi-employees-header" onClick={() => toggleEmployeeList(card.name)}>
                                        <div className="woi-employees-title">
                                            <Users size={14} className="woi-icon" />
                                            <span>Assigned Employees ({card.time_logs.length})</span>
                                        </div>
                                        <button className="woi-employees-toggle">
                                            {expandedEmployees[card.name] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    </div>

                                    {/* Avatar Stack (always visible) */}
                                    <div className="woi-employee-avatars">
                                        {card.time_logs.slice(0, 3).map((timeLog) => (
                                            <div
                                                key={timeLog.name}
                                                className={`woi-employee-avatar`}
                                                style={{ backgroundColor: getAvatarColor(timeLog.employee) }}
                                                title={`Employee ID: ${card.employee_details[timeLog.employee]?.employee_name} (${formatTimeInMins(timeLog.time_in_mins)})`}
                                            >
                                                <span>{card.employee_details[timeLog.employee]?.employee_name.substring(0, 2)}</span>
                                            </div>
                                        ))}
                                        {card.time_logs.length > 3 && (
                                            <div className="woi-employee-avatar woi-avatar-more">
                                                <span>+{card.time_logs.length - 3}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Employee List */}
                                    {expandedEmployees[card.name] && (
                                        <div className="woi-employee-list">
                                            {card.time_logs.map((timeLog) => {
                                                return (
                                                    <div key={timeLog.name} className="woi-employee-item">
                                                        <div className={`woi-employee-avatar-small`} style={{ backgroundColor: getAvatarColor(timeLog.employee) }}>
                                                            <span>{card.employee_details[timeLog.employee]?.employee_name.substring(0, 2)}</span>
                                                        </div>
                                                        <div className="woi-employee-info">
                                                            <div className="woi-employee-id">Employee: {card.employee_details[timeLog.employee]?.employee_name}</div>
                                                            <div className="woi-employee-meta">
                                                                <span className="woi-employee-completed">Completed: {timeLog.completed_qty}</span>
                                                                <span className="woi-employee-docstatus">
                                                                    Status: {timeLog.docstatus === 1 ? "Active" : "Inactive"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="woi-employee-time">
                                                            <Timer size={12} className="woi-time-icon" />
                                                            <span>{formatTimeInMins(timeLog.time_in_mins)}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="woi-card-quantities-container">
                                <div className="woi-quantity-box woi-quantity-required">
                                    <div className="woi-quantity-label">Required Qty</div>
                                    <div className="woi-quantity-value">{card.for_quantity}</div>
                                </div>
                                <div className="woi-quantity-box woi-quantity-completed">
                                    <div className="woi-quantity-label">Completed Qty</div>
                                    <div className="woi-quantity-value">{card.total_completed_qty}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

