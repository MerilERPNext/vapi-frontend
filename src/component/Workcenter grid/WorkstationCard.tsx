import { CheckCircle, XCircle, AlertTriangle, PauseCircle, Wrench, Settings, Calendar, Box } from "lucide-react";

interface WorkstationCardProps {
    workstation: {
        id: string;
        name: string;
        status: "production" | "off" | "maintenance" | "problem" | "idle" | "setup";
        workCenter: string;
        lastMaintenance: string;
    };
}


export default function WorkstationCard({ workstation }: WorkstationCardProps) {
    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case "production": // For production
                return "#10B981"; // Green
            case "off": // For off
                return "#9CA3AF"; // Gray (representing "off")
            case "problem":
                return "#EF4444"; // Red (representing an issue or problem)
            case "maintenance":
                return "#F59E0B"; // Amber (maintenance status)
            case "idle":
                return "#3B82F6"; // Blue (waiting or inactive)
            case "setup":
                return "#8B5CF6"; // Purple (setup or configuration)
            default:
                return "#6B7280"; // Dark Gray (unknown or unrecognized statuses)
        }
    };


    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "online": // For production
                return <CheckCircle style={{ width: "1.5rem", height: "1.5rem" }} />;
            case "offline": // For off
                return <XCircle style={{ width: "1.5rem", height: "1.5rem" }} />;
            case "problem":
                return <AlertTriangle style={{ width: "1.5rem", height: "1.5rem" }} />;
            case "maintenance":
                return <Wrench style={{ width: "1.5rem", height: "1.5rem" }} />;
            case "idle":
                return <PauseCircle style={{ width: "1.5rem", height: "1.5rem" }} />;
            case "setup":
                return <Settings style={{ width: "1.5rem", height: "1.5rem" }} />;
            default:
                return null; // Return null if status is unrecognized
        }
    };


    return (
        <button
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
            onClick={()=>{
                window.frappe.set_route("form", "Workstation", workstation.id)
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
        </button>
    )
}

