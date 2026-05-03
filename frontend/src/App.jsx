import { useState, useEffect } from 'react'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import FlightsList from './components/FlightsList'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('flights')
  const [items, setItems] = useState([])
  const [editTarget, setEditTarget] = useState(null)

  const refresh = () =>
    fetch('/api/items')
      .then(r => r.json())
      .then(setItems)

  useEffect(() => { refresh() }, [])

  const handleCreate = (name) =>
    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(refresh)

  const handleUpdate = (id, name) =>
    fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(() => { setEditTarget(null); refresh() })

  const handleDelete = (id) =>
    fetch(`/api/items/${id}`, { method: 'DELETE' }).then(refresh)

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Demo App</div>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-btn ${currentView === 'flights' ? 'active' : ''}`}
              onClick={() => setCurrentView('flights')}
            >
              ✈️ Flights
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${currentView === 'items' ? 'active' : ''}`}
              onClick={() => setCurrentView('items')}
            >
              📝 Items
            </button>
          </li>
        </ul>
      </nav>

      <main>
        {currentView === 'flights' && <FlightsList />}
        {currentView === 'items' && (
          <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
            <h1>Items</h1>
            <ItemForm
              onSubmit={editTarget
                ? (name) => handleUpdate(editTarget.id, name)
                : handleCreate}
              initial={editTarget?.name ?? ''}
              label={editTarget ? 'Update' : 'Create'}
              onCancel={editTarget ? () => setEditTarget(null) : null}
            />
            <ItemList
              items={items}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  )
}