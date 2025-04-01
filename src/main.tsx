import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reactToWebComponent from 'react-to-webcomponent'
import FormbuilderComponent from "./component/formBuilder/formbuilderComponent.tsx";
import DashboardPPComponent from "./component/dashboardPPComponent/DashboardPPComponent.tsx";
import StatusBasedFlowChart from "./component/flowChart/flowChart.tsx";
import WorkstationGrid from "./component/Workcenter grid/WorkstationGrid.tsx";
import WorkOrderInfo from "./component/WorkOrderInfo/WorkOrderInfo.tsx";

declare global {
    interface Window {
        cur_frm: any
        cur_page: any
        cur_dialog: any
        frappe: any
    }
}

customElements.define('custom-form-builder', reactToWebComponent(FormbuilderComponent, React, ReactDOM))
customElements.define('work-order-info', reactToWebComponent(WorkOrderInfo, React, ReactDOM, {
    props: {
        "name": "string"
    }
}))
customElements.define('dashboard-pp-component', reactToWebComponent(DashboardPPComponent, React, ReactDOM))
customElements.define('flow-chart', reactToWebComponent(StatusBasedFlowChart, React, ReactDOM))
customElements.define('workstation-grid', reactToWebComponent(WorkstationGrid, React, ReactDOM))
