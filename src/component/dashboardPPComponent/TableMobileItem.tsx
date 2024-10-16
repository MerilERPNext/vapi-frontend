import styled from "styled-components";
import {useEffect, useState} from "react";

const MobileTableRow = styled.div`
    border: 1px solid #ddd;
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 4px;
`

const MobileTableCell = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
`

const MobileTableLabel = styled.span`
    font-weight: bold;`


const TableMobileItem = ({order}: any) => {
    const [jobCard, setJobCard] = useState<any>(null)

    useEffect(() => {
        fetch('/api/method/frappe.client.get?fields=["*"]&doctype=Job Card&name=' + order.name)
            .then((res)=> res.json())
            .then((response)=>{
                setJobCard(response?.message)
            })
    }, [order?.name]);


    return (
        <MobileTableRow>
            <MobileTableCell>
                <MobileTableLabel>Job Card:</MobileTableLabel>
                <span>{jobCard?.name || ''}</span>
            </MobileTableCell>
            <MobileTableCell>
                <MobileTableLabel>Assigned:</MobileTableLabel>
                {/*<span>{jobCard?.employee || ''}</span>*/}
            </MobileTableCell>
            <MobileTableCell>
                <MobileTableLabel>Machine:</MobileTableLabel>
                <span>{jobCard?.machine || ''}</span>
            </MobileTableCell>
            <MobileTableCell>
                <MobileTableLabel>Date:</MobileTableLabel>
                <span>{jobCard?.actual_start_date || ''}</span>
            </MobileTableCell>
            <MobileTableCell>
                <MobileTableLabel>Status:</MobileTableLabel>
                <span>{jobCard?.status || ''}</span>
            </MobileTableCell>
        </MobileTableRow>
    );
};

export default TableMobileItem;