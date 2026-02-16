```javascript
import React, { useState } from 'react'
import Layout from './components/Layout'
import TaskBoard from './components/TaskBoard'
import WeeklyProgress from './components/WeeklyProgress'
import PeopleManager from './components/PeopleManager'

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'dashboard' && <TaskBoard />}
      {currentView === 'reports' && <WeeklyProgress />}
      {currentView === 'people' && <PeopleManager />}
    </Layout>
  )
}

export default App
```
