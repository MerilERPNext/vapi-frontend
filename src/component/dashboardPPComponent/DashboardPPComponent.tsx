import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Calendar, GanttChartSquare, Menu } from 'lucide-react'
import TableItem from "./TableItem.tsx";
import TableMobileItem from "./TableMobileItem.tsx";

const Container = styled.div`
    padding: 16px;
    max-width: 1200px;
    margin: 0 auto;

    @media (min-width: 768px) {
        padding: 24px;
    }
`

const TopSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
`

const DropdownContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`

const Dropdown = styled.select`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
    width: 100%;

    @media (min-width: 768px) {
        width: auto;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
`

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
    flex: 1;

    @media (min-width: 768px) {
        flex: 0 1 auto;
    }

    &:hover {
        background-color: #f0f0f0;
    }
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`

const TableHeader = styled.th`
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid #ddd;
`

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    margin-bottom: 16px;

    @media (min-width: 768px) {
        display: none;
    }
`

const DesktopTable = styled(Table)`
  display: none;
  @media (min-width: 768px) {
    display: table;
  }
`

const MobileCards = styled.div`
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`

export default function Component() {
    const [activeWorkOrders, setActiveWorkOrders] = useState<unknown[]>([]);
    const [operations, setOperations] = useState<unknown[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [operation, setOperation]=useState('')
    const [workOrder, setWorkOrder] = useState('')
    const [filteredJobCards, setFilteredJobCards] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/resource/Work Order?fields=["*"]&filters=[["Work Order","status","not in",["Closed","Cancelled","Completed"]]]')
            .then((res)=> res.json())
            .then((response)=>{
                setActiveWorkOrders(response.data)
            }).catch((e)=>{
            console.error(e)
        });
        fetch('/api/resource/Operation?fields=["*"]')
            .then((res)=> res.json())
            .then((response)=>{
                setOperations(response.data)
            });
    }, []);

    useEffect(() => {
        const filters = [];
        if (workOrder) {
            filters.push(["Job Card", "work_order", "=", workOrder]);
        }
        if (operation) {
            filters.push(["Job Card", "operation", "=", operation]);
        }

// Convert filters to JSON string
        const filtersString = JSON.stringify(filters);

// Fetch request with conditional filters
        fetch(`/api/method/frappe.client.get_list?doctype=Job Card&filters=${filtersString}`)
            .then((res) => res.json())
            .then((response) => {
                setFilteredJobCards(response.message);
            });
    }, [operation, workOrder]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener('resize', handleResize)
        handleResize() // Call once to set initial state

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    console.log({filteredJobCards})

    return (
        <Container>
            <button onClick={()=>{
                fetch('/api/method/login?usr=Administrator&pwd=Hybrowlabs@1234')
            }}>Login</button>
            {isMobile && (
                <MenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu size={24} />
                </MenuButton>
            )}
            <TopSection style={{ display: isMobile && !isMobileMenuOpen ? 'none' : 'flex' }}>
                <DropdownContainer>
                    <Dropdown value={workOrder} onChange={(event)=>{
                        setWorkOrder(event.target.value)
                    }}>
                        <option value={''}>All Work Orders</option>
                        {
                            activeWorkOrders?.map((wo: any,i)=>{
                                return (<option key={i} value={wo.name}>
                                    {wo.name}
                                </option>)
                            })
                        }
                    </Dropdown>
                    <Dropdown value={operation} onChange={(event)=>{
                        setOperation(event.target.value)
                    }}>
                        <option value={''}>All Operations</option>
                        {
                            operations?.map((op: any,i)=>{
                                return (<option key={i} value={op.name}>
                                    {op.name}
                                </option>)
                            })
                        }
                    </Dropdown>
                </DropdownContainer>
                <ButtonContainer>
                    <Button onClick={()=>{
                        window.frappe.set_route('/app/job-card/view/gantt?work_order=' + workOrder + '&operation=' + operation)
                    }}>
                        <GanttChartSquare size={16} style={{ marginRight: '8px' }} />
                        View Gantt
                    </Button>
                    <Button>
                        <Calendar size={16} style={{ marginRight: '8px' }} />
                        View Calendar
                    </Button>
                </ButtonContainer>
            </TopSection>
            <DesktopTable>
                <thead>
                <tr>
                    <TableHeader>Job Card</TableHeader>
                    <TableHeader>Assigned</TableHeader>
                    <TableHeader>Machine</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                </tr>
                </thead>
                <tbody>
                {filteredJobCards?.map((order: any, index) => (
                    <TableItem order={order} key={index} />
                ))}
                </tbody>
            </DesktopTable>
            <MobileCards>
                {filteredJobCards?.map((order: any, index) => (
                    <TableMobileItem order={order} key={index} />
                ))}
            </MobileCards>
        </Container>
    )
}