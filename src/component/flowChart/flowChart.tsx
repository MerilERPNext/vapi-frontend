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
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div
                style={{
                    minWidth: '100px',
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '50%',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    backgroundColor: background,
                    color: textColor,
                    border: `2px solid ${border}`,
                }}
            >
                {text}
            </div>
            {!isLast && (
                <div
                    style={{
                        width: '60px',
                        height: '2px',
                        backgroundColor: 'transparent',
                        borderTop: `2px solid ${border}`,
                    }}
                />
            )}
        </div>
    );
};

export default function StatusBasedFlowChart({
                                                 items = [],
                                             }: { items?: FlowChartItem[] }) {
    if (items.length === 0) {
        return (
            <div
                style={{
                    width: '100%',
                    padding: '32px',
                    background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                }}
            >
                <p style={{color: '#6b7280'}}>No items to display in the flow chart.</p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflowX: 'auto',
                padding: '20px',
                background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                gap: '16px',
            }}
        >
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
