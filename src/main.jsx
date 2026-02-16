import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TaskProvider } from './context/TaskContext'
import { PeopleProvider } from './context/PeopleContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <PeopleProvider>
                <TaskProvider>
                    <App />
                </TaskProvider>
            </PeopleProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
