import { useState, useEffect } from 'react'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import './App.css'

export default function App() {
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
  )
}