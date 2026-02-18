import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(App, null)
    )
  )
)