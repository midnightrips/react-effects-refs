import { useState } from 'react'
import DeckViewer from "./DeckViewer"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <DeckViewer />
    </div>
  )
}

export default App
