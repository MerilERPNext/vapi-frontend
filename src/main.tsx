import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reactToWebComponent from 'react-to-webcomponent'
import FormbuilderComponent from "./component/formbuilderComponent.tsx";


customElements.define('form-builder', reactToWebComponent(FormbuilderComponent, React, ReactDOM))