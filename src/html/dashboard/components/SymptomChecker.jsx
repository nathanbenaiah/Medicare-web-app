import React, { useState } from 'react';

const SymptomChecker = ({ onAnalyze }) => {
    const [symptoms, setSymptoms] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!symptoms.trim()) return;
        
        setLoading(true);
        try {
            const result = await onAnalyze(symptoms);
            setAnalysis(result);
        } catch (error) {
            console.error('Symptom analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="symptom-checker">
            <div className="symptom-checker-header">
                <h3>🤖 AI Symptom Checker</h3>
                <p>Describe your symptoms for AI-powered health insights</p>
            </div>
            
            <div className="symptom-input-section">
                <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms in detail... (e.g., headache, fever, fatigue)"
                    className="symptom-textarea"
                    rows={4}
                />
                
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !symptoms.trim()}
                    className={`analyze-btn ${loading ? 'loading' : ''}`}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-brain"></i>
                            Analyze Symptoms
                        </>
                    )}
                </button>
            </div>

            {analysis && (
                <div className="analysis-result">
                    <div className="analysis-header">
                        <i className="fas fa-check-circle"></i>
                        <h4>AI Analysis Complete</h4>
                    </div>
                    
                    <div className="analysis-content">
                        <div className="analysis-section">
                            <h5>🎯 Assessment</h5>
                            <p>{analysis.title}</p>
                        </div>
                        
                        <div className="analysis-section">
                            <h5>📋 Description</h5>
                            <p>{analysis.description}</p>
                        </div>
                        
                        <div className="analysis-section recommendation">
                            <h5>💡 Recommendations</h5>
                            <p>{analysis.recommendation}</p>
                        </div>
                        
                        <div className="analysis-disclaimer">
                            <i className="fas fa-exclamation-triangle"></i>
                            <small>
                                This AI analysis is for informational purposes only. 
                                Please consult with a healthcare professional for proper medical advice.
                            </small>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker; 