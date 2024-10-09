import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reactToWebComponent from 'react-to-webcomponent'
import FormbuilderComponent from "./component/formBuilder/formbuilderComponent.tsx";

declare global {
    interface Window {
        cur_frm: any
    }
}

customElements.define('custom-form-builder', reactToWebComponent(FormbuilderComponent, React, ReactDOM))
