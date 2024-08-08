import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reactToWebComponent from 'react-to-webcomponent'
import Formbuilder from "./component/formbuilder.tsx";


customElements.define('form-builder', reactToWebComponent(Formbuilder, React, ReactDOM))