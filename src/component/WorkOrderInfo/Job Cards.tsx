import {useState, useEffect} from "react"
import "./style.css";
import {ClipboardCheck, AlertCircle, Clock, MapPin, Grid, List, ExternalLink} from "lucide-react"

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
}

export default function JobCards({name}: { name: string }) {
    const [jobCards, setJobCards] = useState<JobCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")


    useEffect(() => {
        // In a real application, this would be an API call
        // For this example, we're using the provided data
        try {

            if(!window?.frappe?.db) {
                setJobCards([
                    {
                        name: "PO-JOB00056",
                        operation: "UW",
                        custom_operation_description: "STP ULTRASONIC WELDING",
                        for_quantity: 1,
                        total_completed_qty: 0,
                        sequence_id: 2,
                        status: "Open",
                        workstation: "Blanking Machine",
                        expected_start_date: "2024-12-30 17:14:40",
                        expected_end_date: "2024-12-30 17:24:40",
                    },
                    {
                        name: "PO-JOB00057",
                        operation: "BS",
                        custom_operation_description: "STP BLISTER SEALING",
                        for_quantity: 1,
                        total_completed_qty: 0,
                        sequence_id: 3,
                        status: "Open",
                        workstation: "Blister Packing",
                        expected_start_date: "2024-12-30 17:34:40",
                        expected_end_date: "2024-12-30 17:44:40",
                    },
                    {
                        name: "PO-JOB00058",
                        operation: "STRLZT",
                        custom_operation_description: "STP STERILIZATION",
                        for_quantity: 1,
                        total_completed_qty: 0,
                        sequence_id: 4,
                        status: "Open",
                        workstation: "Cellophene",
                        expected_start_date: "2024-12-30 17:54:40",
                        expected_end_date: "2024-12-30 18:04:40",
                    },
                    {
                        name: "PO-JOB00059",
                        operation: "FP",
                        custom_operation_description: "STP FINAL PACKING",
                        for_quantity: 1,
                        total_completed_qty: 0,
                        sequence_id: 5,
                        status: "Open",
                        workstation: "Cellophene",
                        expected_start_date: "2024-12-30 18:14:40",
                        expected_end_date: "2024-12-30 18:24:40",
                    },
                    {
                        name: "PO-JOB00060",
                        operation: "RFG",
                        custom_operation_description: "STP RELEASE OF FINISHED GOODS",
                        for_quantity: 1,
                        total_completed_qty: 0,
                        sequence_id: 6,
                        status: "Open",
                        workstation: "Cutting",
                        expected_start_date: "2024-12-30 18:34:40",
                        expected_end_date: "2024-12-30 18:44:40",
                    },
                    {
                        name: "PO-JOB00055",
                        operation: "FHA",
                        custom_operation_description: "STP FIRING HANDLE ASSEMBLY",
                        for_quantity: 1,
                        total_completed_qty: 0,
                        sequence_id: 1,
                        status: "Completed",
                        workstation: "Binding",
                        expected_start_date: "2024-12-30 16:54:40",
                        expected_end_date: "2024-12-30 17:04:40",
                    },
                ])
                setLoading(false)
            } else {

                // This would normally be a fetch call
                window?.frappe?.db?.get_list("Job Card", {
                    filters: {work_order: name},
                    fields: "*"
                }).then((data: any) => {
                    // Sort the job cards by sequence_id
                    const sortedData = [...data].sort((a, b) => a.sequence_id - b.sequence_id)
                    setJobCards(sortedData)
                    setLoading(false)
                })
            }


        } catch (err: any) {
            console.log(err)
            setError("Failed to load job cards")
            setLoading(false)
        }
    }, [name])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
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

            <div className="woi-view-toggle">
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
            </div>

            <div className="woi-cards-stack">
                {jobCards.map((card) => (
                    <div
                        key={card.name}
                        className={`woi-card ${card.status === "Completed" ? "woi-card-completed" : "woi-card-open"}`}
                    >
                        <div className="woi-card-sequence-badge">#{card.sequence_id}</div>
                        <div className="woi-card-content">
                            <div className="woi-card-header">
                                <div className="woi-card-title-area">
                                    <a onClick={()=>{
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
                                        <ClipboardCheck className="woi-status-icon"/>
                                    ) : (
                                        <AlertCircle className="woi-status-icon"/>
                                    )}
                                    <span>{card.status}</span>
                                </div>
                            </div>

                            <div className="woi-card-details">
                                <div className="woi-card-workstation">
                                    <MapPin size={14} className="woi-icon"/>
                                    <span>{card.workstation}</span>
                                </div>

                                <div className="woi-card-schedule">
                                    <Clock size={14} className="woi-icon"/>
                                    <span>
                    {formatDate(card.expected_start_date)} - {formatDate(card.expected_end_date)}
                  </span>
                                </div>
                            </div>

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

