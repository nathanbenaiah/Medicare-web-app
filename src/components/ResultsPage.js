import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Styled Components
const ResultsContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[600]} 0%, 
    ${({ theme }) => theme.colors.primary[700]} 50%, 
    ${({ theme }) => theme.colors.primary[800]} 100%
  );
  padding: 4rem 0;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: white;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const ResultsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
`;

const ResultsTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  .score {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 0.875rem;
    opacity: 0.9;
  }
`;

const PriorityBadge = styled.div`
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 1.125rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &.low {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.3);
  }
  
  &.medium {
    background: rgba(245, 158, 11, 0.2);
    border-color: rgba(245, 158, 11, 0.3);
  }
  
  &.high {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
  }
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;

const ActionButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &.primary {
    background: white;
    color: ${({ theme }) => theme.colors.primary[600]};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
    }
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 2rem 1rem;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MainResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ResultCard = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray[900]};
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    background: ${({ theme }) => theme.colors.primary[100]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary[600]};
    font-size: 1.25rem;
  }
`;

const HealthInsights = styled.div`
  .insight-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
    
    &.positive {
      background: ${({ theme }) => theme.colors.success[50]};
      border: 1px solid ${({ theme }) => theme.colors.success[200]};
    }
    
    &.warning {
      background: ${({ theme }) => theme.colors.warning[50]};
      border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    }
    
    &.danger {
      background: ${({ theme }) => theme.colors.danger[50]};
      border: 1px solid ${({ theme }) => theme.colors.danger[200]};
    }
  }
  
  .insight-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    flex-shrink: 0;
    
    &.positive {
      background: ${({ theme }) => theme.colors.success[500]};
      color: white;
    }
    
    &.warning {
      background: ${({ theme }) => theme.colors.warning[500]};
      color: white;
    }
    
    &.danger {
      background: ${({ theme }) => theme.colors.danger[500]};
      color: white;
    }
  }
  
  .insight-content {
    flex: 1;
    
    h4 {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.gray[900]};
    }
    
    p {
      color: ${({ theme }) => theme.colors.gray[600]};
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }
  }
`;

const Recommendations = styled.div`
  .recommendation-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background: ${({ theme }) => theme.colors.primary[50]};
    border: 1px solid ${({ theme }) => theme.colors.primary[200]};
    margin-bottom: 1rem;
  }
  
  .recommendation-number {
    width: 2rem;
    height: 2rem;
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  
  .recommendation-content {
    flex: 1;
    
    h4 {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.gray[900]};
    }
    
    p {
      color: ${({ theme }) => theme.colors.gray[600]};
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }
    
    .priority {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
      
      &.high {
        background: ${({ theme }) => theme.colors.danger[100]};
        color: ${({ theme }) => theme.colors.danger[700]};
      }
      
      &.medium {
        background: ${({ theme }) => theme.colors.warning[100]};
        color: ${({ theme }) => theme.colors.warning[700]};
      }
      
      &.low {
        background: ${({ theme }) => theme.colors.success[100]};
        color: ${({ theme }) => theme.colors.success[700]};
      }
    }
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin: 1rem 0;
  
  .recharts-wrapper {
    border-radius: 1rem;
  }
`;

const MetricsList = styled.div`
  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .metric-label {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray[700]};
  }
  
  .metric-value {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[900]};
    
    &.good {
      color: ${({ theme }) => theme.colors.success[600]};
    }
    
    &.warning {
      color: ${({ theme }) => theme.colors.warning[600]};
    }
    
    &.danger {
      color: ${({ theme }) => theme.colors.danger[600]};
    }
  }
`;

// Sample data for demonstration
const sampleData = {
  score: 75,
  priority: 'low',
  assessmentType: 'AI Symptom Checker',
  completedAt: new Date().toLocaleDateString(),
  insights: [
    {
      type: 'positive',
      icon: '✓',
      title: 'Overall Health Status',
      description: 'Your symptoms indicate a generally stable health condition with minor concerns that can be easily managed.'
    },
    {
      type: 'warning',
      icon: '⚠',
      title: 'Monitor Symptoms',
      description: 'Some symptoms require monitoring. Consider tracking changes over the next few days.'
    }
  ],
  recommendations: [
    {
      title: 'Schedule Routine Check-up',
      description: 'Based on your responses, we recommend scheduling a routine check-up with your primary care physician within the next 2-3 weeks.',
      priority: 'medium'
    },
    {
      title: 'Lifestyle Modifications',
      description: 'Consider incorporating more physical activity and maintaining a balanced diet to support overall health.',
      priority: 'low'
    },
    {
      title: 'Symptom Monitoring',
      description: 'Keep track of any changes in your symptoms and consult a healthcare provider if they worsen.',
      priority: 'high'
    }
  ],
  metrics: [
    { label: 'Symptom Severity', value: 'Mild', status: 'good' },
    { label: 'Risk Assessment', value: 'Low Risk', status: 'good' },
    { label: 'Urgency Level', value: 'Non-Urgent', status: 'good' },
    { label: 'Follow-up Required', value: 'Routine', status: 'warning' }
  ]
};

const chartData = [
  { name: 'Physical Health', value: 75, fullMark: 100 },
  { name: 'Mental Health', value: 85, fullMark: 100 },
  { name: 'Lifestyle', value: 65, fullMark: 100 },
  { name: 'Risk Factors', value: 30, fullMark: 100 }
];

const trendData = [
  { date: '1 week ago', score: 70 },
  { date: '3 days ago', score: 72 },
  { date: 'Yesterday', score: 74 },
  { date: 'Today', score: 75 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const ResultsPage = () => {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(sampleData);
  const resultsRef = useRef();

  useEffect(() => {
    // In a real app, fetch results data based on sessionId
    // For now, using sample data
  }, [sessionId]);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const element = resultsRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add title page
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text('AI Health Assessment Results', 20, 30);
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Assessment Type: ${data.assessmentType}`, 20, 50);
      pdf.text(`Completed: ${data.completedAt}`, 20, 60);
      pdf.text(`Health Score: ${data.score}%`, 20, 70);
      pdf.text(`Priority Level: ${data.priority.toUpperCase()}`, 20, 80);

      // Add divider
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(59, 130, 246);
      pdf.line(20, 90, 190, 90);

      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`health-assessment-results-${sessionId || 'report'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Health Assessment Results',
        text: `I completed an AI health assessment and got a score of ${data.score}%. Check out MediCare+ for your own assessment!`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Results link copied to clipboard!');
    }
  };

  return (
    <ResultsContainer>
      <HeroSection>
        <BackButton to="/health-assistant">
          <i className="fas fa-arrow-left"></i>
          Back to Assessments
        </BackButton>

        <HeroContent>
          <ResultsBadge>
            <i className="fas fa-chart-line"></i>
            {data.assessmentType} Results
          </ResultsBadge>
          
          <ResultsTitle>Your Health Assessment Results</ResultsTitle>
          
          <ScoreDisplay>
            <ScoreCircle>
              <div className="score">{data.score}%</div>
              <div className="label">Health Score</div>
            </ScoreCircle>
            
            <PriorityBadge className={data.priority}>
              <i className="fas fa-circle"></i> {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)} Priority
            </PriorityBadge>
          </ScoreDisplay>

          <ActionsBar>
            <ActionButton
              className="primary"
              onClick={generatePDF}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Generating PDF...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i>
                  Download PDF Report
                </>
              )}
            </ActionButton>
            
            <ActionButton onClick={shareResults}>
              <i className="fas fa-share"></i>
              Share Results
            </ActionButton>
            
            <ActionButton as={Link} to="/health-assistant">
              <i className="fas fa-redo"></i>
              Take Another Assessment
            </ActionButton>
          </ActionsBar>
        </HeroContent>
      </HeroSection>

      <ContentContainer>
        <div ref={resultsRef} className="print-content">
          <ResultsGrid>
            <MainResults>
              {/* Health Insights */}
              <ResultCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <CardHeader>
                  <h3>
                    <div className="icon">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    Health Insights
                  </h3>
                </CardHeader>
                
                <HealthInsights>
                  {data.insights.map((insight, index) => (
                    <div key={index} className={`insight-item ${insight.type}`}>
                      <div className={`insight-icon ${insight.type}`}>
                        {insight.icon}
                      </div>
                      <div className="insight-content">
                        <h4>{insight.title}</h4>
                        <p>{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </HealthInsights>
              </ResultCard>

              {/* Health Score Breakdown */}
              <ResultCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardHeader>
                  <h3>
                    <div className="icon">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                    Health Score Breakdown
                  </h3>
                </CardHeader>
                
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={chartData}>
                      <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                        fill="#3b82f6"
                      />
                      <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </ResultCard>

              {/* Recommendations */}
              <ResultCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CardHeader>
                  <h3>
                    <div className="icon">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                    Personalized Recommendations
                  </h3>
                </CardHeader>
                
                <Recommendations>
                  {data.recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <div className="recommendation-number">{index + 1}</div>
                      <div className="recommendation-content">
                        <h4>{rec.title}</h4>
                        <p>{rec.description}</p>
                        <span className={`priority ${rec.priority}`}>
                          {rec.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>
                  ))}
                </Recommendations>
              </ResultCard>
            </MainResults>

            <Sidebar>
              {/* Health Metrics */}
              <ResultCard
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <CardHeader>
                  <h3>
                    <div className="icon">
                      <i className="fas fa-thermometer-half"></i>
                    </div>
                    Health Metrics
                  </h3>
                </CardHeader>
                
                <MetricsList>
                  {data.metrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                      <span className="metric-label">{metric.label}</span>
                      <span className={`metric-value ${metric.status}`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </MetricsList>
              </ResultCard>

              {/* Trend Chart */}
              <ResultCard
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <CardHeader>
                  <h3>
                    <div className="icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    Health Trend
                  </h3>
                </CardHeader>
                
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </ResultCard>

              {/* Next Steps */}
              <ResultCard
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <CardHeader>
                  <h3>
                    <div className="icon">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                    Next Steps
                  </h3>
                </CardHeader>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => window.open('https://calendar.google.com', '_blank')}
                  >
                    <i className="fas fa-calendar-plus" style={{ color: '#3b82f6' }}></i>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        Schedule Appointment
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Book with a healthcare provider
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => window.open('/health-resources', '_blank')}
                  >
                    <i className="fas fa-book-medical" style={{ color: '#10b981' }}></i>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        Health Resources
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Learn more about your condition
                      </div>
                    </div>
                  </motion.button>
                </div>
              </ResultCard>
            </Sidebar>
          </ResultsGrid>
        </div>
      </ContentContainer>
    </ResultsContainer>
  );
};

export default ResultsPage; 