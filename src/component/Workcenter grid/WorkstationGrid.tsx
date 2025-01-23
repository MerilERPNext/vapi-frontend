import WorkstationCard from "./WorkstationCard"

// Define the structure of a workstation
interface Workstation {
    id: string
    name: string
    status: "online" | "offline" | "maintenance"
    workCenter: string
    lastMaintenance: string
}

// Sample data (in a real application, this would come from an API or database)
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Workstation Status</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workstations.map((workstation) => (
                    <WorkstationCard key={workstation.id} workstation={workstation} />
                ))}
            </div>
        </div>
    )
}

