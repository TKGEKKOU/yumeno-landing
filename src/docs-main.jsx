import React from 'react'
import ReactDOM from 'react-dom/client'
import Docs from './Docs.jsx'
import './Docs.css'

const root = document.getElementById('docs-root')

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Docs />
    </React.StrictMode>,
  )
}
