import { useState, useEffect } from 'react'

export default function ItemForm({ onSubmit, initial = '', label, onCancel }) {
  const [name, setName] = useState(initial)

  useEffect(() => setName(initial), [initial])

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim())
    if (!onCancel) setName('')
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: '1rem' }}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Item name"
        style={{ marginRight: 8 }}
      />
      <button type="submit">{label}</button>
      {onCancel && <button type="button" onClick={onCancel} style={{ marginLeft: 4 }}>Cancel</button>}
    </form>
  )
}