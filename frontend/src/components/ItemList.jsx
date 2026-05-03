export default function ItemList({ items, onEdit, onDelete }) {
  if (items.length === 0) return <p>No items yet.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map(item => (
        <li key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <span style={{ flex: 1 }}>{item.id}. {item.name}</span>
          <button onClick={() => onEdit(item)}>Edit</button>
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}