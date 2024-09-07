import TableInput from "./TableInput.tsx";


const QualityControl = () => {
    const sampleSize = window?.cur_frm?.doc?.sample_size || 2
    const parameters = window?.cur_frm?.doc?.readings || [
        {
            "name": "l3qqbk4c8r",
            "owner": "Administrator",
            "creation": "2024-08-31 10:49:43.442263",
            "modified": "2024-08-31 10:49:55.268166",
            "modified_by": "Administrator",
            "docstatus": 0,
            "idx": 1,
            "specification": "Length",
            "status": "Accepted",
            "numeric": 1,
            "manual_inspection": 0,
            "min_value": 0,
            "max_value": 0,
            "formula_based_criteria": 0,
            "custom_readings_count": 0,
            "parent": "MAT-QA-2024-00001",
            "parentfield": "readings",
            "parenttype": "Quality Inspection",
            "doctype": "Quality Inspection Reading"
        },
        {
            "name": "l3qqumdvph",
            "owner": "Administrator",
            "creation": "2024-08-31 10:49:43.442263",
            "modified": "2024-08-31 10:49:55.268166",
            "modified_by": "Administrator",
            "docstatus": 0,
            "idx": 2,
            "specification": "Diameter",
            "status": "Accepted",
            "numeric": 1,
            "manual_inspection": 0,
            "min_value": 0,
            "max_value": 0,
            "formula_based_criteria": 0,
            "custom_readings_count": 0,
            "parent": "MAT-QA-2024-00001",
            "parentfield": "readings",
            "parenttype": "Quality Inspection",
            "doctype": "Quality Inspection Reading"
        }
    ]

    const columns: number = parameters.reduce((acc: number, param: any) => acc + param.custom_readings_count, 0);

    return (
        <div>
            <TableInput rows={sampleSize} parameters={parameters} columns={columns}/>
        </div>
    );
};

export default QualityControl;