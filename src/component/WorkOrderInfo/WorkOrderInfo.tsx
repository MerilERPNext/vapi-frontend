import JobCards from "./Job Cards.tsx";

const WorkOrderInfo = ({name}: {name: string}) => {
    return (
        <JobCards name={name} />
    );
};

export default WorkOrderInfo;