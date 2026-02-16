import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TaskProvider } from './context/TaskContext'
import { PeopleProvider } from './context/PeopleContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PeopleProvider>
            <TaskProvider>
                <App />
            </TaskProvider>
        </PeopleProvider>
    </React.StrictMode>,
)
