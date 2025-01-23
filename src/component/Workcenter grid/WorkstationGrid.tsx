import WorkstationCard from "./WorkstationCard"
import {useEffect, useState} from "react";

interface Workstation {
    id: string
    name: string
    status: "online" | "offline" | "maintenance"
    workCenter: string
    lastMaintenance: string
}

// frappe.db.get_list("Workstation", {
//     filters: {
//         "workstation_type": cur_frm.doc.name
//     },
//     fields: "*"
// }).then((res)=>{
//     console.log(res)
// })


// const data = [
//     {
//         "name": "HEAT TIPPING & CUTTING",
//         "owner": "Administrator",
//         "creation": "2024-11-19 10:28:48.575062",
//         "modified": "2025-01-22 12:05:10.726536",
//         "modified_by": "Administrator",
//         "docstatus": 0,
//         "idx": 164,
//         "workstation_name": "HEAT TIPPING & CUTTING",
//         "workstation_type": "HEAT TIPPING & CUTTING",
//         "plant_floor": "Suture",
//         "production_capacity": 1,
//         "warehouse": null,
//         "custom_operation": null,
//         "custom_process": null,
//         "status": "Production",
//         "on_status_image": null,
//         "off_status_image": null,
//         "hour_rate_electricity": 250,
//         "hour_rate_consumable": 889,
//         "hour_rate_rent": 77,
//         "hour_rate_labour": 10,
//         "hour_rate": 1226,
//         "description": null,
//         "holiday_list": null,
//         "total_working_hours": 0
//     },
//     {
//         "name": "Frame winding machine- 01",
//         "owner": "Administrator",
//         "creation": "2024-12-23 17:22:56.247805",
//         "modified": "2025-01-22 23:38:51.162147",
//         "modified_by": "Administrator",
//         "docstatus": 0,
//         "idx": 0,
//         "workstation_name": "Frame winding machine- 01",
//         "workstation_type": "HEAT TIPPING & CUTTING",
//         "plant_floor": "Suture",
//         "production_capacity": 1,
//         "warehouse": null,
//         "custom_operation": "HTC",
//         "custom_process": "Chemical Tipping",
//         "status": "Production",
//         "on_status_image": null,
//         "off_status_image": null,
//         "hour_rate_electricity": 250,
//         "hour_rate_consumable": 889,
//         "hour_rate_rent": 77,
//         "hour_rate_labour": 10,
//         "hour_rate": 1226,
//         "description": null,
//         "holiday_list": null,
//         "total_working_hours": 0
//     },
//     {
//         "name": "Frame winding machine- 02",
//         "owner": "Administrator",
//         "creation": "2024-12-23 17:22:56.266658",
//         "modified": "2025-01-22 23:38:51.199979",
//         "modified_by": "Administrator",
//         "docstatus": 0,
//         "idx": 0,
//         "workstation_name": "Frame winding machine- 02",
//         "workstation_type": "HEAT TIPPING & CUTTING",
//         "plant_floor": "Suture",
//         "production_capacity": 1,
//         "warehouse": null,
//         "custom_operation": "HTC",
//         "custom_process": "Chemical Tipping",
//         "status": "Production",
//         "on_status_image": null,
//         "off_status_image": null,
//         "hour_rate_electricity": 250,
//         "hour_rate_consumable": 889,
//         "hour_rate_rent": 77,
//         "hour_rate_labour": 10,
//         "hour_rate": 1226,
//         "description": null,
//         "holiday_list": null,
//         "total_working_hours": 0
//     },
//     {
//         "name": "Thermal Tipping Machine-01",
//         "owner": "Administrator",
//         "creation": "2024-12-23 17:22:57.684743",
//         "modified": "2025-01-22 23:38:51.216343",
//         "modified_by": "Administrator",
//         "docstatus": 0,
//         "idx": 0,
//         "workstation_name": "Thermal Tipping Machine-01",
//         "workstation_type": "HEAT TIPPING & CUTTING",
//         "plant_floor": "Suture",
//         "production_capacity": 1,
//         "warehouse": null,
//         "custom_operation": "HTC",
//         "custom_process": "Heat Tipping",
//         "status": "Production",
//         "on_status_image": null,
//         "off_status_image": null,
//         "hour_rate_electricity": 250,
//         "hour_rate_consumable": 889,
//         "hour_rate_rent": 77,
//         "hour_rate_labour": 10,
//         "hour_rate": 1226,
//         "description": null,
//         "holiday_list": null,
//         "total_working_hours": 0
//     },
//     {
//         "name": "Thermal Tipping Machine-02",
//         "owner": "Administrator",
//         "creation": "2024-12-23 17:22:57.702162",
//         "modified": "2025-01-22 23:38:51.232587",
//         "modified_by": "Administrator",
//         "docstatus": 0,
//         "idx": 0,
//         "workstation_name": "Thermal Tipping Machine-02",
//         "workstation_type": "HEAT TIPPING & CUTTING",
//         "plant_floor": "Suture",
//         "production_capacity": 1,
//         "warehouse": null,
//         "custom_operation": "HTC",
//         "custom_process": "Heat Tipping",
//         "status": "Production",
//         "on_status_image": null,
//         "off_status_image": null,
//         "hour_rate_electricity": 250,
//         "hour_rate_consumable": 889,
//         "hour_rate_rent": 77,
//         "hour_rate_labour": 10,
//         "hour_rate": 1226,
//         "description": null,
//         "holiday_list": null,
//         "total_working_hours": 0
//     }
// ]
//
// const workstations: Workstation[] = [
//     { id: "1", name: "Machine A1", status: "online", workCenter: "Assembly", lastMaintenance: "2023-05-15" },
//     { id: "2", name: "Machine B2", status: "offline", workCenter: "Packaging", lastMaintenance: "2023-06-01" },
//     { id: "3", name: "Machine C3", status: "maintenance", workCenter: "Quality Control", lastMaintenance: "2023-06-10" },
//     { id: "4", name: "Machine D4", status: "online", workCenter: "Assembly", lastMaintenance: "2023-05-20" },
//     { id: "5", name: "Machine E5", status: "online", workCenter: "Packaging", lastMaintenance: "2023-05-25" },
//     { id: "6", name: "Machine F6", status: "offline", workCenter: "Quality Control", lastMaintenance: "2023-06-05" },
// ]

function convertToWorkstations(data: any[]): Workstation[] {
    return data.map((item, index) => ({
        id: item.name, // Assign a sequential ID starting from 1
        name: item.workstation_name || `Unnamed Workstation ${index + 1}`,
        status: item.status.toLowerCase(), // Map "Production" to "online"
        workCenter: item.plant_floor || "Unknown Work Center", // Default if plant_floor is null
        lastMaintenance: item.modified.split(" ")[0], // Use the date part of the "modified" field
    }));
}

export default function WorkstationGrid() {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        window.frappe.db.get_list("Workstation", {
            filters: {
                "workstation_type": window.cur_frm.doc.name
            },
            fields: "*"
        }).then((res: any) => {
            setData(res)
        })
    }, [])
    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "2rem 1rem",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {convertToWorkstations(data).map((workstation) => (
                    <WorkstationCard key={workstation.id} workstation={workstation}/>
                ))}
            </div>
        </div>
    )
}

