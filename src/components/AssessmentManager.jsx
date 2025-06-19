// Enhanced Assessment Manager - React Component
// Handles all health assessment types with specialized PDF generation

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AssessmentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const AssessmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const AssessmentCard = styled.div`
  background: linear-gradient(135deg, ${props => props.primaryColor}15, white);
  border: 2px solid ${props => props.primaryColor};
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px ${props => props.primaryColor}30;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, ${props => props.primaryColor}20, transparent);
    border-radius: 50%;
  }
`;

const AssessmentIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const AssessmentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.primaryColor};
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const AssessmentDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const AssessmentFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const FeatureTag = styled.span`
  background: ${props => props.primaryColor}20;
  color: ${props => props.primaryColor};
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, ${props => props.primaryColor}, ${props => props.secondaryColor});
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px ${props => props.primaryColor}40;
  }
`;

const PDFPreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PDFPreviewContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.25rem;
`;

const AssessmentManager = () => {
  const [assessments, setAssessments] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);

  const assessmentTypes = [
    {
      id: 'symptom-checker',
      title: 'AI Symptom Checker',
      icon: '🩺',
      description: 'Advanced symptom analysis with AI-powered medical guidance.',
      primaryColor: '#ef4444',
      features: ['95% Accurate', 'Instant Results', 'Risk Assessment'],
      questions: 25,
      duration: '5-7 minutes'
    },
    {
      id: 'diet-planner',
      title: 'Smart Diet Planner',
      icon: '🍽️',
      description: 'Personalized nutrition plans based on your health goals.',
      primaryColor: '#10b981',
      features: ['Personalized', 'Nutritionist Approved', 'BMI Calculator'],
      questions: 30,
      duration: '8-10 minutes'
    },
    {
      id: 'mental-health',
      title: 'Mental Health Support',
      icon: '🧠',
      description: 'Comprehensive mental wellness assessment and support.',
      primaryColor: '#8b5cf6',
      features: ['Evidence-Based', 'Confidential', 'Wellness Score'],
      questions: 35,
      duration: '10-12 minutes'
    },
    {
      id: 'medicine-advisor',
      title: 'Medicine Advisor',
      icon: '💊',
      description: 'Expert guidance about medications and drug interactions.',
      primaryColor: '#f59e0b',
      features: ['Drug Interactions', 'Safety Alerts', 'Dosage Guide'],
      questions: 20,
      duration: '5-6 minutes'
    },
    {
      id: 'fitness-coach',
      title: 'AI Fitness Coach',
      icon: '💪',
      description: 'Personalized workout plans and fitness guidance.',
      primaryColor: '#f97316',
      features: ['Custom Workouts', 'Progress Tracking', 'Adaptive Plans'],
      questions: 28,
      duration: '7-9 minutes'
    },
    {
      id: 'sleep-analyzer',
      title: 'Sleep Quality Analyzer',
      icon: '😴',
      description: 'Comprehensive sleep analysis with improvement recommendations.',
      primaryColor: '#6366f1',
      features: ['Sleep Scoring', 'Pattern Analysis', 'Improvement Tips'],
      questions: 22,
      duration: '6-8 minutes'
    }
  ];

  useEffect(() => {
    loadUserAssessments();
  }, []);

  const loadUserAssessments = async () => {
    try {
      // Load user's previous assessments
      // This would typically fetch from an API
      setAssessments([]);
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
  };

  const startAssessment = (assessmentType) => {
    window.location.href = `/new-ai-assessment.html?type=${assessmentType.id}`;
  };

  const generateSamplePDF = async (assessmentType) => {
    setLoading(true);
    
    try {
      const sampleData = {
        type: assessmentType.id,
        userInfo: {
          name: 'John Doe',
          age: 30,
          gender: 'Male',
          province: 'Western Province'
        },
        responses: generateSampleResponses(assessmentType.id),
        analysisResults: {
          healthScore: Math.floor(Math.random() * 30) + 70,
          sections: [
            {
              title: 'Assessment Overview',
              content: `This ${assessmentType.title} assessment provides comprehensive analysis.`,
              type: 'analysis'
            },
            {
              title: 'Key Recommendations',
              content: 'Follow the personalized recommendations for optimal health outcomes.',
              type: 'recommendation'
            }
          ]
        }
      };

      const response = await fetch('/api/assessment/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleData)
      });

      const result = await response.json();
      
      if (result.success) {
        setPdfData({ ...result, assessmentType: assessmentType.title });
        setShowPDFPreview(true);
      } else {
        alert('Error generating PDF: ' + result.error);
      }
      
    } catch (error) {
      console.error('Error generating sample PDF:', error);
      alert('Error generating PDF preview');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleResponses = (type) => {
    const samples = {
      'symptom-checker': { primarySymptom: 'Headache', duration: 'Few days', severity: 'Moderate' },
      'diet-planner': { height: '170', weight: '70', dietGoal: 'Weight maintenance' },
      'mental-health': { stressLevel: 'Moderate', sleepQuality: 'Fair' },
      'medicine-advisor': { medicationConcern: 'Drug interactions', currentMedications: 'Paracetamol' },
      'fitness-coach': { fitnessLevel: 'Intermediate', fitnessGoal: 'Strength building' },
      'sleep-analyzer': { sleepDuration: '7 hours', sleepQuality: 'Good' }
    };
    return samples[type] || {};
  };

  const downloadPDF = () => {
    if (pdfData && pdfData.downloadUrl) {
      window.open(pdfData.downloadUrl, '_blank');
    }
  };

  return (
    <AssessmentContainer>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
          🏥 MediCare+ Health Assessments
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          Complete comprehensive health assessments with AI-powered analysis and professional PDF reports
        </p>
      </div>

      <AssessmentGrid>
        {assessmentTypes.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            primaryColor={assessment.primaryColor}
          >
            <AssessmentIcon>{assessment.icon}</AssessmentIcon>
            <AssessmentTitle primaryColor={assessment.primaryColor}>
              {assessment.title}
            </AssessmentTitle>
            <AssessmentDescription>
              {assessment.description}
            </AssessmentDescription>
            
            <AssessmentFeatures>
              {assessment.features.map((feature, index) => (
                <FeatureTag key={index} primaryColor={assessment.primaryColor}>
                  {feature}
                </FeatureTag>
              ))}
            </AssessmentFeatures>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                📝 {assessment.questions} questions • ⏱️ {assessment.duration}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <StartButton
                primaryColor={assessment.primaryColor}
                secondaryColor={assessment.primaryColor}
                onClick={() => startAssessment(assessment)}
                style={{ flex: 1 }}
              >
                Start Assessment
              </StartButton>
              
              <StartButton
                primaryColor="#6b7280"
                secondaryColor="#4b5563"
                onClick={() => generateSamplePDF(assessment)}
                disabled={loading}
                style={{ padding: '0.75rem', minWidth: 'auto' }}
                title="Preview PDF Report"
              >
                {loading ? '⏳' : '📄'}
              </StartButton>
            </div>
          </AssessmentCard>
        ))}
      </AssessmentGrid>

      {showPDFPreview && pdfData && (
        <PDFPreviewModal onClick={() => setShowPDFPreview(false)}>
          <PDFPreviewContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowPDFPreview(false)}>
              ×
            </CloseButton>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>
                📄 PDF Report Generated
              </h2>
              <p style={{ color: '#64748b' }}>
                {pdfData.assessmentType} assessment report has been successfully generated
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <strong>Report ID:</strong> {pdfData.reportId}
                </div>
                <div>
                  <strong>File Size:</strong> {Math.round(pdfData.filesize / 1024)} KB
                </div>
                <div>
                  <strong>Format:</strong> PDF Document
                </div>
                <div>
                  <strong>Status:</strong> ✅ Ready for Download
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={downloadPDF}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                📥 Download PDF Report
              </button>
              
              <button
                onClick={() => setShowPDFPreview(false)}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Close Preview
              </button>
            </div>
          </PDFPreviewContent>
        </PDFPreviewModal>
      )}

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: '#fef3c7', borderRadius: '15px', border: '1px solid #f59e0b' }}>
        <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>
          🩺 Health Assessment Disclaimer
        </h3>
        <p style={{ color: '#92400e', lineHeight: '1.6' }}>
          These AI-powered health assessments provide general health information and educational content. 
          They should NOT replace professional medical advice, diagnosis, or treatment. Always consult 
          qualified healthcare professionals for medical concerns, emergencies, or treatment decisions.
        </p>
      </div>
    </AssessmentContainer>
  );
};

export default AssessmentManager; 