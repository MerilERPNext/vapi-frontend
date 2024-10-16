import styled from "styled-components";
import {useEffect, useState} from "react";

const TableCell = styled.td`
    padding: 12px;
    border-bottom: 1px solid #ddd;`

const Link = styled.a`
    text-decoration: underline !important;
    color: #007bff !important;
    cursor: pointer;
`

const TableItem = ({order}: any) => {
    const [jobCard, setJobCard] = useState<any>(null)

    useEffect(() => {
        fetch('/api/method/frappe.client.get?fields=["*"]&doctype=Job Card&name=' + order?.name)
            .then((res)=> res.json())
            .then((response)=>{
                setJobCard(response?.message)
            })
    }, [order.name]);

    return (
        <tr>
            <TableCell><Link onClick={()=>{
                window.frappe.set_route('Form', 'Job Card', jobCard?.name)
            }}>{jobCard?.name}</Link></TableCell>
            <TableCell>{jobCard?.employee.map((employee: any) => employee.employee).join(',') || ''}</TableCell>
            <TableCell>{jobCard?.machine}</TableCell>
            <TableCell>{(() => new Date(jobCard?.actual_start_date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }))()}</TableCell>
            <TableCell>{jobCard?.status}</TableCell>
        </tr>
    );
};

export default TableItem;