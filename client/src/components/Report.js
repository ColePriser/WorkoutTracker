import React, { useEffect, useState } from 'react';

function Report({ exerciseVersion }) {
    const [exercisesList, setExercisesList] = useState([]);
    const [exerciseId, setExerciseId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState(null);

    // Fetch the Exercises from the Server
    useEffect(() => {
        fetchExercises();
    }, [exerciseVersion]);
    
    const fetchExercises = () => {
        fetch('http://localhost:5000/api/exercises')
          .then((res) => res.json())
          .then(data => setExercisesList(data))
          .catch((err) => console.error('Error fetching exercises:', err));
      };

    const handleApplyFilters = () => {
        if (!exerciseId || !startDate || !endDate) {
            alert('Please select an exercise and date range.');
            return;
        }
        const qs = `exerciseId=${exerciseId}&start=${startDate}&end=${endDate}`;
        fetch(`http://localhost:5000/api/report?${qs}`)
            .then(res => res.json())
            .then(data => setReport(data))
            .catch(error => console.error('Error fetching report data:', error));
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
          <h2>Exercise Report</h2>
    
          {/* Filter Row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
              <option value="">-- Select exercise --</option>
              {exercisesList.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.exercise_name}
                </option>
              ))}
            </select>
    
            <label>
              Start:&nbsp;
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
    
            <label>
              End:&nbsp;
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
    
            <button onClick={handleApplyFilters}>Apply Filters</button>
          </div>
    
          {/* Report Result */}
          {report && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Report Summary</h3>
              <ul>
                <li><strong>Total Sets Completed:</strong> {report.totalSets ?? 0}</li>
                <li><strong>Total Reps Completed:</strong> {report.totalReps ?? 0}</li>
                <li>
                    <strong>Average Weight Lifted:</strong>{' '}
                    {(report.avgWeight ?? 0).toFixed(2)}&nbsp;lbs
                </li>
                <li>
                    <strong>Maximum Weight Lifted:</strong>{' '}
                    {report.maxWeight ?? 0}&nbsp;lbs
                </li>
                <li>
                    <strong>Total Volume:</strong>{' '}
                    {(report.totalVolume ?? 0).toFixed(2)}&nbsp;(reps × lbs)
                </li>
              </ul>
            </div>
          )}
        </div>
      );
}
export default Report;