import React, { useState } from 'react';

const AppointmentScheduler = ({ onSchedule }) => {
    const [appointmentData, setAppointmentData] = useState({
        type: 'consultation',
        date: '',
        time: '',
        complaint: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const appointmentTypes = [
        { value: 'consultation', label: '🩺 General Consultation' },
        { value: 'follow_up', label: '🔄 Follow-up Visit' },
        { value: 'emergency', label: '🚨 Emergency' },
        { value: 'routine_checkup', label: '✅ Routine Checkup' },
        { value: 'specialist', label: '👨‍⚕️ Specialist Consultation' },
        { value: 'telemedicine', label: '💻 Telemedicine' }
    ];

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const handleInputChange = (field, value) => {
        setAppointmentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSchedule = async () => {
        if (!appointmentData.date || !appointmentData.time) {
            alert('Please select date and time');
            return;
        }
        
        setLoading(true);
        try {
            await onSchedule(appointmentData);
            // Reset form
            setAppointmentData({
                type: 'consultation',
                date: '',
                time: '',
                complaint: '',
                notes: ''
            });
        } catch (error) {
            console.error('Appointment scheduling failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="appointment-scheduler">
            <div className="scheduler-header">
                <h3>📅 Schedule Appointment</h3>
                <p>Book your next healthcare appointment</p>
            </div>
            
            <div className="scheduler-form">
                <div className="form-group">
                    <label>Appointment Type</label>
                    <select
                        value={appointmentData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="form-select"
                    >
                        {appointmentTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={appointmentData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Time</label>
                        <select
                            value={appointmentData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select time</option>
                            {timeSlots.map(time => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Chief Complaint</label>
                    <input
                        type="text"
                        value={appointmentData.complaint}
                        onChange={(e) => handleInputChange('complaint', e.target.value)}
                        placeholder="Brief description of your concern"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                        value={appointmentData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Any additional information for your healthcare provider"
                        className="form-textarea"
                        rows={3}
                    />
                </div>

                <button
                    onClick={handleSchedule}
                    disabled={loading || !appointmentData.date || !appointmentData.time}
                    className={`schedule-btn ${loading ? 'loading' : ''}`}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Scheduling...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-calendar-check"></i>
                            Schedule Appointment
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AppointmentScheduler; 