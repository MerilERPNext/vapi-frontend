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
                return "text-green-500"
            case "offline":
                return "text-red-500"
            case "maintenance":
                return "text-yellow-500"
            default:
                return "text-gray-500"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "online":
                return <CheckCircle className="w-6 h-6" />
            case "offline":
                return <XCircle className="w-6 h-6" />
            case "maintenance":
                return <AlertTriangle className="w-6 h-6" />
            default:
                return null
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{workstation.name}</h2>
                <span className={`flex items-center ${getStatusColor(workstation.status)}`}>
          {getStatusIcon(workstation.status)}
                    <span className="ml-2 capitalize">{workstation.status}</span>
        </span>
            </div>
            <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                    <Box className="w-5 h-5 mr-2" />
                    <span>Work Center: {workstation.workCenter}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Last Maintenance: {workstation.lastMaintenance}</span>
                </div>
            </div>
        </div>
    )
}

