import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reactToWebComponent from 'react-to-webcomponent'
import FormbuilderComponent from "./component/formBuilder/formbuilderComponent.tsx";
import DashboardPPComponent from "./component/dashboardPPComponent/DashboardPPComponent.tsx";
import StatusBasedFlowChart from "./component/flowChart/flowChart.tsx";

declare global {
    interface Window {
        cur_frm: any
        cur_page: any
        cur_dialog: any
        frappe: any
    }
}

customElements.define('custom-form-builder', reactToWebComponent(FormbuilderComponent, React, ReactDOM))
customElements.define('dashboard-pp-component', reactToWebComponent(DashboardPPComponent, React, ReactDOM))
customElements.define('flow-chart', reactToWebComponent(StatusBasedFlowChart, React, ReactDOM))
