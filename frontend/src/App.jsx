import React, { useState, useCallback } from 'react'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  const [searchVisible, setSearchVisible] = useState(true)

  const handleSearchVisibility = useCallback((visible) => {
    setSearchVisible(visible)
  }, [])

  return <HomePage searchVisible={searchVisible} onSearchVisibilityChange={handleSearchVisibility} />
}