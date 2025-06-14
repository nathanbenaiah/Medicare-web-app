import React, { useState } from 'react';

const VitalSignsRecorder = ({ onRecord }) => {
    const [vitalData, setVitalData] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: '',
        glucoseLevel: ''
    });
    const [loading, setLoading] = useState(false);

    const vitalFields = [
        {
            key: 'systolic',
            label: 'Systolic BP',
            unit: 'mmHg',
            icon: 'fas fa-heartbeat',
            placeholder: '120',
            color: '#dc3545'
        },
        {
            key: 'diastolic',
            label: 'Diastolic BP',
            unit: 'mmHg',
            icon: 'fas fa-heartbeat',
            placeholder: '80',
            color: '#dc3545'
        },
        {
            key: 'heartRate',
            label: 'Heart Rate',
            unit: 'bpm',
            icon: 'fas fa-heart',
            placeholder: '72',
            color: '#e74c3c'
        },
        {
            key: 'temperature',
            label: 'Temperature',
            unit: '°F',
            icon: 'fas fa-thermometer-half',
            placeholder: '98.6',
            color: '#f39c12'
        },
        {
            key: 'weight',
            label: 'Weight',
            unit: 'kg',
            icon: 'fas fa-weight',
            placeholder: '70',
            color: '#3498db'
        },
        {
            key: 'height',
            label: 'Height',
            unit: 'cm',
            icon: 'fas fa-ruler-vertical',
            placeholder: '175',
            color: '#9b59b6'
        },
        {
            key: 'oxygenSaturation',
            label: 'Oxygen Sat.',
            unit: '%',
            icon: 'fas fa-lungs',
            placeholder: '98',
            color: '#1abc9c'
        },
        {
            key: 'glucoseLevel',
            label: 'Glucose',
            unit: 'mg/dL',
            icon: 'fas fa-tint',
            placeholder: '100',
            color: '#e67e22'
        }
    ];

    const handleInputChange = (field, value) => {
        setVitalData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateBMI = () => {
        if (vitalData.weight && vitalData.height) {
            const heightInMeters = parseFloat(vitalData.height) / 100;
            const bmi = parseFloat(vitalData.weight) / (heightInMeters * heightInMeters);
            return bmi.toFixed(1);
        }
        return null;
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
        if (bmi < 25) return { category: 'Normal', color: '#27ae60' };
        if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
        return { category: 'Obese', color: '#e74c3c' };
    };

    const handleRecord = async () => {
        const filledFields = Object.values(vitalData).filter(value => value.trim() !== '');
        if (filledFields.length === 0) {
            alert('Please enter at least one vital sign');
            return;
        }
        
        setLoading(true);
        try {
            await onRecord(vitalData);
            // Reset form
            setVitalData({
                systolic: '',
                diastolic: '',
                heartRate: '',
                temperature: '',
                weight: '',
                height: '',
                oxygenSaturation: '',
                glucoseLevel: ''
            });
        } catch (error) {
            console.error('Vital signs recording failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const bmi = calculateBMI();
    const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

    return (
        <div className="vital-signs-recorder">
            <div className="recorder-header">
                <h3>📊 Record Vital Signs</h3>
                <p>Track your health metrics</p>
            </div>
            
            <div className="vitals-grid">
                {vitalFields.map(field => (
                    <div key={field.key} className="vital-field">
                        <div className="vital-icon" style={{ color: field.color }}>
                            <i className={field.icon}></i>
                        </div>
                        <div className="vital-input-group">
                            <label>{field.label}</label>
                            <div className="input-with-unit">
                                <input
                                    type="number"
                                    value={vitalData[field.key]}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="vital-input"
                                    step="0.1"
                                />
                                <span className="unit">{field.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {bmi && (
                <div className="bmi-calculator">
                    <div className="bmi-result">
                        <h4>BMI Calculator</h4>
                        <div className="bmi-value">
                            <span className="bmi-number">{bmi}</span>
                            <span 
                                className="bmi-category" 
                                style={{ color: bmiInfo.color }}
                            >
                                {bmiInfo.category}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="vital-summary">
                <h4>📋 Summary</h4>
                <div className="summary-grid">
                    {Object.entries(vitalData).map(([key, value]) => {
                        if (!value) return null;
                        const field = vitalFields.find(f => f.key === key);
                        return (
                            <div key={key} className="summary-item">
                                <i className={field.icon} style={{ color: field.color }}></i>
                                <span>{field.label}: {value} {field.unit}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handleRecord}
                disabled={loading}
                className={`record-btn ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Recording...
                    </>
                ) : (
                    <>
                        <i className="fas fa-save"></i>
                        Record Vital Signs
                    </>
                )}
            </button>
        </div>
    );
};

export default VitalSignsRecorder; 