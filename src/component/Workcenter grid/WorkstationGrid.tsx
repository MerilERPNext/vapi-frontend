import WorkstationCard from "./WorkstationCard"

interface Workstation {
    id: string
    name: string
    status: "online" | "offline" | "maintenance"
    workCenter: string
    lastMaintenance: string
}

const workstations: Workstation[] = [
    { id: "1", name: "Machine A1", status: "online", workCenter: "Assembly", lastMaintenance: "2023-05-15" },
    { id: "2", name: "Machine B2", status: "offline", workCenter: "Packaging", lastMaintenance: "2023-06-01" },
    { id: "3", name: "Machine C3", status: "maintenance", workCenter: "Quality Control", lastMaintenance: "2023-06-10" },
    { id: "4", name: "Machine D4", status: "online", workCenter: "Assembly", lastMaintenance: "2023-05-20" },
    { id: "5", name: "Machine E5", status: "online", workCenter: "Packaging", lastMaintenance: "2023-05-25" },
    { id: "6", name: "Machine F6", status: "offline", workCenter: "Quality Control", lastMaintenance: "2023-06-05" },
]

export default function WorkstationGrid() {
    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "2rem 1rem",
            }}
        >
            <h1
                style={{
                    fontSize: "1.875rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                    color: "#1f2937",
                }}
            >
                Workstation Status
            </h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {workstations.map((workstation) => (
                    <WorkstationCard key={workstation.id} workstation={workstation} />
                ))}
            </div>
        </div>
    )
}

