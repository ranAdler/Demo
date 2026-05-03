# Frontend Guide: React + Vite CRUD Application

## Overview

The frontend is a simple but complete React application built with Vite that provides a user interface for managing items. It communicates with a Spring Boot REST API backend to perform CRUD (Create, Read, Update, Delete) operations.

**Stack:**
- **React 18** — UI library
- **Vite** — fast build tool and dev server
- **JavaScript (ES6+)** — no TypeScript, vanilla fetch API for HTTP calls

**Runs on:** `http://localhost:5173` (during development)

---

## Architecture

### Component Tree

```
App.jsx (root component)
├── ItemForm.jsx (input form — create or edit)
└── ItemList.jsx (renders list of items)
```

### Data Flow

```
App.jsx
  │
  ├─ state: items (array of Item objects)
  ├─ state: editTarget (currently editing Item or null)
  │
  ├─ fetch('/api/items') ──→ ItemList.jsx (displays items)
  │
  └─ ItemForm.jsx
       └─ onSubmit → handleCreate() or handleUpdate()
            └─ fetch('/api/items', { method: 'POST'/'PUT' })
                 └─ refresh() → fetches fresh data
```

---

## Component Details

### 1. App.jsx (Container / Root)

**Location:** `frontend/src/App.jsx`

**Purpose:** 
- Manages all state (items list, current edit target)
- Handles all API communication
- Orchestrates CRUD operations
- Passes data and callbacks to child components

**State:**
```javascript
const [items, setItems] = useState([])        // List of all items from backend
const [editTarget, setEditTarget] = useState(null)  // Item being edited, or null
```

**Key Functions:**

1. **`refresh()`**
   - Fetches all items from `/api/items`
   - Called after every CRUD operation to sync with backend
   - Called once on component mount (via `useEffect`)
   ```javascript
   const refresh = () =>
     fetch('/api/items')
       .then(r => r.json())
       .then(setItems)
   ```

2. **`handleCreate(name)`**
   - Sends POST request to create a new item
   - Body: `{ name: "Item name" }`
   - Called when form is submitted in create mode
   - Refreshes the list after success

3. **`handleUpdate(id, name)`**
   - Sends PUT request to update an existing item
   - Body: `{ name: "Updated name" }`
   - Clears edit mode (`setEditTarget(null)`)
   - Refreshes the list after success

4. **`handleDelete(id)`**
   - Sends DELETE request to remove an item
   - Refreshes the list after success

**Render:**
```jsx
<div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
  <h1>Items</h1>
  
  {/* Form for create or edit */}
  <ItemForm 
    onSubmit={editTarget ? (name) => handleUpdate(editTarget.id, name) : handleCreate}
    initial={editTarget?.name ?? ''}
    label={editTarget ? 'Update' : 'Create'}
    onCancel={editTarget ? () => setEditTarget(null) : null}
  />
  
  {/* List of items */}
  <ItemList items={items} onEdit={setEditTarget} onDelete={handleDelete} />
</div>
```

The form's `onSubmit` handler **switches** based on `editTarget`:
- If `editTarget` is null → create mode (calls `handleCreate`)
- If `editTarget` exists → edit mode (calls `handleUpdate` with the item's id)

---

### 2. ItemForm.jsx (Input Form)

**Location:** `frontend/src/components/ItemForm.jsx`

**Purpose:**
- Reusable form for both creating and editing items
- Controlled input (React manages the state of the text field)

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | function | Called when form is submitted with the item name |
| `initial` | string | Pre-filled text (empty string for create, item name for edit) |
| `label` | string | Button text ("Create" or "Update") |
| `onCancel` | function \| null | Cancel button; null = don't show cancel button |

**State:**
```javascript
const [name, setName] = useState(initial)  // Current text in input
```

**Key Features:**

1. **Controlled Input**
   - `value={name}` — React owns the input value
   - `onChange={e => setName(e.target.value)}` — update state on every keystroke

2. **Sync on Prop Change**
   ```javascript
   useEffect(() => setName(initial), [initial])
   ```
   When switching from create to edit mode (or vice versa), the form re-populates with the correct initial value.

3. **Form Submit**
   - Prevents default form behavior
   - Validates that name is not empty (trimmed)
   - Calls `onSubmit(name.trim())`
   - Clears input only in create mode (not in edit mode, since edit mode clears via parent's `setEditTarget(null)`)

4. **Cancel Button**
   - Only shown when `onCancel` prop is provided (edit mode)
   - Calls `onCancel()` to exit edit mode

**Render:**
```jsx
<form onSubmit={submit}>
  <input 
    value={name}
    onChange={e => setName(e.target.value)}
    placeholder="Item name"
  />
  <button type="submit">{label}</button>
  {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
</form>
```

---

### 3. ItemList.jsx (Item List Display)

**Location:** `frontend/src/components/ItemList.jsx`

**Purpose:**
- Renders the list of items
- Provides Edit and Delete buttons for each item

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `items` | array | Array of item objects: `[{ id, name }, ...]` |
| `onEdit` | function | Called with an item object when Edit is clicked |
| `onDelete` | function | Called with an item id when Delete is clicked |

**Render:**
- If items list is empty: displays "No items yet."
- Otherwise: renders `<ul>` with one `<li>` per item

Each item row shows:
```
[id]. [name]     [Edit] [Delete]
```

Example:
```
1. First item    [Edit] [Delete]
2. Second item   [Edit] [Delete]
3. My new item   [Edit] [Delete]
```

When you click:
- **Edit** → calls `onEdit(item)` → App sets `editTarget = item` → form repopulates with item name
- **Delete** → calls `onDelete(item.id)` → App deletes via API and refreshes

---

## Manual Testing Guide

### Prerequisites
1. Spring Boot backend is running on `http://localhost:8080`
2. React frontend is running on `http://localhost:5173`
3. Open `http://localhost:5173` in your browser

You should see:
```
Items

[Input field with placeholder "Item name"]  [Create] [Cancel] (hidden)

1. First item    [Edit] [Delete]
2. Second item   [Edit] [Delete]
```

---

### Test 1: Create a New Item

**Steps:**
1. Type "My first item" in the input field
2. Click the **Create** button
3. **Expected:** The input clears, and a new row appears at the bottom:
   ```
   3. My first item    [Edit] [Delete]
   ```

**Verify:**
- Refresh the browser (F5) — the item should still be there (proves it was saved in the backend)

**What's happening:**
1. Form submit → `handleCreate("My first item")`
2. App sends `POST /api/items` with body `{ name: "My first item" }`
3. Backend creates the item in H2 and returns `{ id: 3, name: "My first item" }`
4. App calls `refresh()` → fetches all items again → `setItems([..., new item])`
5. Component re-renders with the new item in the list

---

### Test 2: Edit an Item

**Steps:**
1. Click **Edit** on "First item" (the original seeded item)
2. **Expected:** 
   - The form input now shows "First item"
   - The button changes from "Create" to "Update"
   - A **Cancel** button appears next to Update
3. Change the text to "First item (updated)"
4. Click **Update**
5. **Expected:**
   - Form clears and resets to create mode
   - The Cancel button disappears
   - The first item's name in the list now shows "First item (updated)"

**Verify:**
- Refresh the browser — the updated name should persist

**What's happening:**
1. Click Edit → App calls `setEditTarget(item)` with the item object
2. ItemForm's `useEffect` detects `initial` prop changed → re-populates the input
3. Form switches to edit mode: label = "Update", Cancel button visible
4. Form submit → `handleUpdate(1, "First item (updated)")`
5. App sends `PUT /api/items/1` with body `{ name: "First item (updated)" }`
6. Backend updates the item and returns the updated object
7. App calls `setEditTarget(null)` → exits edit mode
8. App calls `refresh()` → fetches all items and re-renders

---

### Test 3: Cancel Edit

**Steps:**
1. Click **Edit** on any item
2. Change the text in the input (e.g., to "xyz")
3. Click **Cancel**
4. **Expected:**
   - The form clears
   - The button changes back to "Create"
   - The Cancel button disappears
   - The item's name in the list is **unchanged**

**Verify:**
- The original item name should still be in the list (no API call was made)

**What's happening:**
1. Click Edit → form enters edit mode
2. Click Cancel → App calls `setEditTarget(null)` → form resets to create mode
3. No API call is made (cancel is a local operation)

---

### Test 4: Delete an Item

**Steps:**
1. Click **Delete** next to "My first item"
2. **Expected:**
   - The item disappears from the list immediately
   - The list now only shows the remaining items

**Verify:**
- Refresh the browser — the deleted item should not reappear (proves it was deleted in the backend)

**What's happening:**
1. Click Delete → App calls `handleDelete(3)` (the item id)
2. App sends `DELETE /api/items/3` (no request body)
3. Backend deletes the item
4. App calls `refresh()` → fetches all items (now without the deleted one) → re-renders

---

### Test 5: Validation — Empty Name

**Steps:**
1. Leave the input field empty
2. Click **Create**
3. **Expected:** Nothing happens (the item is not created)

**Why:**
```javascript
if (!name.trim()) return  // Exits early if name is empty or whitespace only
```

The form validates client-side before sending to the backend.

---

### Test 6: Network Error Simulation

**Purpose:** Understand what happens if the backend is unavailable.

**Steps:**
1. Stop the Spring Boot backend (kill the `mvn spring-boot:run` process)
2. Try to create a new item in the React app
3. Open the browser's **Developer Console** (F12 or Cmd+Opt+I)
4. **Expected:** You'll see an error in the console, and the item won't be added to the list

**What happens:**
- The `fetch()` call fails (no server to respond)
- The error is not caught (no error handling in the code)
- The UI becomes out of sync with the backend
- The `refresh()` call fails silently — no new items appear

**Why this is okay for a demo:**
- The skeleton doesn't include error handling yet
- Production code would catch the error and show a toast message to the user
- For now, the backend should always be running

---

### Test 7: Rapid Operations

**Purpose:** Verify that state is correctly synced after multiple operations.

**Steps:**
1. Create 3 items in quick succession: "Item A", "Item B", "Item C"
2. Edit "Item B" to "Item B (v2)"
3. Delete "Item A"
4. Create "Item D"
5. **Expected:** Final list has 5 items (original 2 + new 3, minus 1 deleted):
   ```
   1. First item
   2. Second item
   3. Item A
   5. Item B (v2)
   6. Item C
   7. Item D
   ```
   (Note: Item 4 is missing because it was deleted)

**Verify:**
- Refresh the browser — same list should appear

**What's happening:**
- Each operation calls `refresh()` after the API call completes
- React re-renders the list each time `setItems()` is called
- The IDs are generated by the backend (auto-increment in H2)

---

## Browser Developer Tools Testing

### Network Tab

**To see API requests:**
1. Open Developer Tools (F12)
2. Click the **Network** tab
3. Perform any CRUD operation
4. **Expected:** You'll see requests like:
   - `POST /api/items` (create)
   - `GET /api/items` (fetch all)
   - `PUT /api/items/1` (update)
   - `DELETE /api/items/1` (delete)

**Inspect a request:**
- Click on a request
- View the **Headers** tab to see method, URL, content-type
- View the **Payload** tab to see the request body (JSON)
- View the **Response** tab to see the server's response

### Console Tab

**What to watch for:**
- Errors or warnings (there should be none in normal operation)
- The app logs nothing by default, but you can add `console.log()` to debug

**Common issues:**
- `Failed to fetch /api/items` — backend is not running
- `CORS error` — unlikely, since the Vite proxy handles it in dev

---

## How the Frontend Connects to the Backend

### The Vite Proxy

In `frontend/vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

**What this does:**
- Any request to `/api/*` is forwarded to `http://localhost:8080/api/*`
- The frontend code can use relative URLs: `fetch('/api/items')`
- In production, you'd change this to an absolute URL or use environment variables

**Example:**
```javascript
fetch('/api/items')
// Vite intercepts this and forwards to:
// http://localhost:8080/api/items
```

### CORS

The Spring Boot backend includes `@CrossOrigin(origins = "http://localhost:5173")` on the controller. This tells the browser:

> "Requests from http://localhost:5173 are allowed to access these endpoints"

This is necessary for browser security. Without it, the browser would block requests from the React app to the Java backend.

---

## File Structure

```
frontend/
├── package.json              # Dependencies, scripts (npm run dev, npm run build)
├── vite.config.js            # Vite configuration (proxy to backend)
├── index.html                # Entry HTML file
├── src/
│   ├── main.jsx              # React entry point (renders App into #root)
│   ├── App.jsx               # Root component (state, API calls, CRUD logic)
│   ├── App.css               # Styles for App
│   └── components/
│       ├── ItemForm.jsx      # Input form (create / edit)
│       └── ItemList.jsx      # Item list display
└── public/                   # Static assets (favicon, etc.)
```

---

## Common Issues & Solutions

### Issue: "Cannot read property 'map' of undefined"
**Cause:** `items` is undefined, not an empty array.
**Solution:** Initialize state: `const [items, setItems] = useState([])`

### Issue: Form input won't clear after create
**Cause:** Missing `setName('')` in the submit handler.
**Solution:** Add `if (!onCancel) setName('')` after `onSubmit()`.

### Issue: Edit form doesn't populate with the item name
**Cause:** Missing `useEffect` to sync the input when `initial` prop changes.
**Solution:** Add:
```javascript
useEffect(() => setName(initial), [initial])
```

### Issue: Items don't persist after browser refresh
**Cause:** 
- Backend is not running, or
- Items are stored in browser state only (not in H2)
**Solution:** Ensure backend is running and `refresh()` is called after every operation.

### Issue: "No items yet" appears but backend has items
**Cause:** `refresh()` fetch failed silently (backend down).
**Solution:** Check backend logs, ensure `mvn spring-boot:run` is active.

---

## Next Steps (Future Enhancements)

Ideas for extending the frontend:

1. **Error Handling** — catch fetch errors and show user-friendly messages
2. **Loading States** — show a spinner while fetching data
3. **Styling** — add CSS or use a UI library (Tailwind, Material-UI)
4. **Search/Filter** — filter items by name
5. **Sorting** — sort items by name or ID
6. **TypeScript** — add type safety for props and state
7. **Unit Tests** — test components with Vitest or Jest
8. **Form Validation** — more robust validation (length limits, special chars, etc.)
9. **Debounce** — prevent multiple rapid requests
10. **Optimistic Updates** — update UI before server confirms (improves perceived performance)

---

## Summary

The frontend is a lightweight, straightforward React app with three components and no external UI libraries. It's ideal for learning how to build a client-server application:

- **App.jsx** manages all state and API communication
- **ItemForm.jsx** provides a reusable input form for create/edit
- **ItemList.jsx** renders the item list with Edit/Delete actions

Test it by creating, editing, and deleting items through the browser UI. All changes are persisted in the H2 backend database.