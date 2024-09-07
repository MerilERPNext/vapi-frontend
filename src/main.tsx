import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reactToWebComponent from 'react-to-webcomponent'
import FormbuilderComponent from "./component/formBuilder/formbuilderComponent.tsx";
import QualityControl from "./component/qualityControlComponent/QualityControl.tsx";

declare global {
    interface Window {
        cur_frm: any
    }
}

customElements.define('form-builder', reactToWebComponent(FormbuilderComponent, React, ReactDOM))
customElements.define('quality-control', reactToWebComponent(QualityControl, React, ReactDOM))