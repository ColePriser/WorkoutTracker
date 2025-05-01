import React, { useEffect, useState } from 'react';

function Report() {
    const [exercises, setExercises] = useState([]);
    const [exerciseId, setExerciseId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState(null);

    // Fetch exercises from the server
    useEffect(() => {
        fetch('http://localhost:5000/exercises')
            .then(res => res.json())
            .then(data => setExercises(data))
            .catch(error => console.error('Error fetching exercises:', error));
    }, []);

    const handleApplyFilters = () => {
        if (!exerciseId || !startDate || !endDate) {
            alert('Please select an exercise and date range.');
            return;
        }
        const qs = 'exerciseId=' + exerciseId + '&startDate=' + startDate + '&endDate=' + endDate;
        fetch(`http://localhost:5000/report?${qs}`)
            .then(res => res.json())
            .then(data => setReportData(data))
            .catch(error => console.error('Error fetching report data:', error));
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
          <h2>Exercise Report</h2>
    
          {/* Filter Row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
              <option value="">-- Select exercise --</option>
              {exercises.map((ex) => (
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
                <li><strong>Total Sets Completed:</strong> {report.totalSets}</li>
                <li><strong>Total Reps Completed:</strong> {report.totalReps}</li>
                <li><strong>Average Weight Lifted:</strong> {report.avgWeight.toFixed(2)} lbs</li>
                <li><strong>Maximum Weight Lifted:</strong> {report.maxWeight} lbs</li>
                <li><strong>Total Volume:</strong> {report.totalVolume.toFixed(2)} (reps × lbs)</li>
              </ul>
            </div>
          )}
        </div>
      );
}
export default Report;