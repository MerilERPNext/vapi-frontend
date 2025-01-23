import { CheckCircle, XCircle, AlertTriangle, Calendar, Box } from "lucide-react"

interface WorkstationCardProps {
    workstation: {
        id: string
        name: string
        status: "online" | "offline" | "maintenance"
        workCenter: string
        lastMaintenance: string
    }
}

export default function WorkstationCard({ workstation }: WorkstationCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "#10B981"
            case "offline":
                return "#EF4444"
            case "maintenance":
                return "#F59E0B"
            default:
                return "#6B7280"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "online":
                return <CheckCircle style={{ width: "1.5rem", height: "1.5rem" }} />
            case "offline":
                return <XCircle style={{ width: "1.5rem", height: "1.5rem" }} />
            case "maintenance":
                return <AlertTriangle style={{ width: "1.5rem", height: "1.5rem" }} />
            default:
                return null
        }
    }

    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                padding: "1.5rem",
                transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#1f2937",
                    }}
                >
                    {workstation.name}
                </h2>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        color: getStatusColor(workstation.status),
                    }}
                >
          {getStatusIcon(workstation.status)}
                    <span style={{ marginLeft: "0.5rem", textTransform: "capitalize" }}>{workstation.status}</span>
        </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", color: "#4B5563" }}>
                    <Box style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
                    <span>Work Center: {workstation.workCenter}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", color: "#4B5563" }}>
                    <Calendar style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
                    <span>Last Maintenance: {workstation.lastMaintenance}</span>
                </div>
            </div>
        </div>
    )
}

