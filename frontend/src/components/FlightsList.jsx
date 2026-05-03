import { useState, useEffect } from 'react'
import '../styles/FlightsList.css'

export default function FlightsList() {
  const [flights, setFlights] = useState([])
  const [filteredFlights, setFilteredFlights] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [flightType, setFlightType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seconds, setSeconds] = useState(600) // 10 minutes
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString())

  const itemsPerPage = 50

  const fetchFlights = () => {
    fetch('/api/flights')
      .then(r => r.json())
      .then(data => {
        setFlights(data)
        setLoading(false)
        setLastUpdated(new Date().toLocaleTimeString())
        setSeconds(600) // Reset timer
      })
      .catch(err => {
        setError('Failed to load flights')
        setLoading(false)
        console.error(err)
      })
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          fetchFlights() // Refresh flights when timer reaches zero
          return 600
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = flights
    if (flightType !== 'all') {
      filtered = flights.filter(f => f.CHAORD === flightType)
    }
    setFilteredFlights(filtered)
    setCurrentPage(1)
  }, [flights, flightType])

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentFlights = filteredFlights.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  if (loading) {
    return <div className="flights-container"><div className="loading">Loading flights...</div></div>
  }

  if (error) {
    return <div className="flights-container"><div className="error">{error}</div></div>
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'DEPARTED': 'available',
      'BOARDING': 'boarding',
      'DELAYED': 'delayed',
      'CANCELLED': 'cancelled',
      'SCHEDULED': 'available',
      'ON TIME': 'available',
      'IN FLIGHT': 'updating'
    }
    return statusMap[status] || 'default'
  }

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formatTime = (val) => String(val).padStart(2, '0')

  return (
    <div className="flights-container">
      <div className="flights-header">
        <div className="header-top">
          <h1>✈️ Flight Board</h1>
          <div className="timer-widget">
            <div className="timer-small">
              <span className="timer-label">Next Update in</span>
              <span className="timer-value">{formatTime(minutes)}:{formatTime(secs)}</span>
            </div>
            <div className="last-updated">
              Last updated: <span className="time">{lastUpdated}</span>
            </div>
          </div>
        </div>
        <div className="filter-section">
          <label htmlFor="flight-type">Filter by Type:</label>
          <select
            id="flight-type"
            value={flightType}
            onChange={(e) => setFlightType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Flights ({flights.length})</option>
            <option value="D">Departures ({flights.filter(f => f.CHAORD === 'D').length})</option>
            <option value="A">Arrivals ({flights.filter(f => f.CHAORD === 'A').length})</option>
          </select>
        </div>
      </div>

      {currentFlights.length > 0 ? (
        <>
          <div className="flights-grid">
            {currentFlights.map((flight, index) => (
              <div key={index} className="flight-card">
                <div className="flight-header">
                  <div className="airline-info">
                    <span className="airline-code">{flight.CHOPER}</span>
                    <span className="airline-name">{flight.CHOPERD}</span>
                  </div>
                  <span className={`status-badge ${getStatusBadge(flight.CHRMINE)}`}>
                    {flight.CHRMINE}
                  </span>
                </div>

                <div className="flight-number">
                  Flight {flight.CHFLTN}
                </div>

                <div className="flight-details">
                  <div className="detail-item">
                    <span className="label">Destination</span>
                    <span className="value">{flight.CHLOC1D} ({flight.CHLOC1})</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Country</span>
                    <span className="value">{flight.CHLOCCT}</span>
                  </div>
                </div>

                <div className="flight-times">
                  <div className="time-section">
                    <span className="time-label">Scheduled</span>
                    <span className="time">{flight.CHSTOL?.split('T')[1] || '-'}</span>
                  </div>
                  <div className="time-section">
                    <span className="time-label">Actual</span>
                    <span className="time">{flight.CHPTOL?.split('T')[1] || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>

            <div className="page-info">
              Page <span className="current-page">{currentPage}</span> of <span className="total-pages">{totalPages}</span>
              <span className="flight-count">({startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFlights.length)} of {filteredFlights.length})</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="no-flights">
          <p>No flights found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}