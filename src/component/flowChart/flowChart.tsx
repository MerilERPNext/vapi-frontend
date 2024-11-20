type Status = 'disabled' | 'active' | 'done';

interface FlowChartItem {
    text: string;
    status: Status;
}

const statusColors: Record<Status, { background: string; text: string; border: string }> = {
    disabled: {background: '#d1d5db', text: '#4b5563', border: '#9ca3af'},
    active: {background: '#3b82f6', text: '#ffffff', border: '#2563eb'},
    done: {background: '#10b981', text: '#ffffff', border: '#16a34a'},
};

const defaultColor = {background: '#f3f4f6', text: '#111827', border: '#e5e7eb'};

const FlowChartNode = ({
                           text,
                           status,
                           isLast,
                       }: FlowChartItem & { isLast: boolean }) => {
    const {background, text: textColor, border} = statusColors[status] || defaultColor;

    return (
        <div className="flow-node">
            <div
                className="node"
                style={{
                    backgroundColor: background,
                    color: textColor,
                    border: `2px solid ${border}`,
                }}
            >
                {text}
            </div>
            {!isLast && <div className="connector" style={{borderColor: border}}/>}
        </div>
    );
};

export default function StatusBasedFlowChart({
                                                 items = [
                                                     {text: 'PPIC Planning', status: 'done'},
                                                     {text: 'Work Order Creation', status: 'done'},
                                                     {text: 'Material Request', status: 'active'},
                                                     {text: 'Material Transfer', status: 'disabled'},
                                                     {text: 'Production', status: 'disabled'},
                                                     {text: 'Quality Check', status: 'disabled'},
                                                     {text: 'Packaging', status: 'disabled'},
                                                     {text: 'Dispatch', status: 'disabled'},
                                                 ],
                                             }: { items?: FlowChartItem[] }) {
    if (items.length === 0) {
        return (
            <div className="w-full p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No items to display in the flow chart.</p>
            </div>
        );
    }

    return (
        <div className="flow-chart">
            {items.map((item, index) => (
                <FlowChartNode
                    key={index}
                    {...item}
                    isLast={index === items.length - 1}
                />
            ))}
        </div>
    );
}
