const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// In-memory storage for demo purposes (use a database in production)
const assessments = new Map();
const results = new Map();

// Assessment questions database
const assessmentQuestions = {
  'symptom-checker': [
    {
      id: 1,
      question: "What is your primary symptom?",
      type: "multiple-choice",
      options: [
        { value: "headache", label: "Headache", weight: 2 },
        { value: "fever", label: "Fever", weight: 3 },
        { value: "cough", label: "Cough", weight: 2 },
        { value: "fatigue", label: "Fatigue", weight: 1 }
      ]
    },
    {
      id: 2,
      question: "How long have you been experiencing this symptom?",
      type: "multiple-choice",
      options: [
        { value: "less-than-day", label: "Less than a day", weight: 1 },
        { value: "1-3-days", label: "1-3 days", weight: 2 },
        { value: "4-7-days", label: "4-7 days", weight: 3 },
        { value: "more-than-week", label: "More than a week", weight: 4 }
      ]
    },
    {
      id: 3,
      question: "Rate the severity of your symptom (1-10)",
      type: "scale",
      min: 1,
      max: 10,
      weight: 1
    },
    {
      id: 4,
      question: "Do you have any of the following additional symptoms?",
      type: "multiple-select",
      options: [
        { value: "nausea", label: "Nausea", weight: 2 },
        { value: "vomiting", label: "Vomiting", weight: 3 },
        { value: "dizziness", label: "Dizziness", weight: 2 },
        { value: "chest-pain", label: "Chest pain", weight: 4 }
      ]
    },
    {
      id: 5,
      question: "Have you taken any medication for this symptom?",
      type: "yes-no",
      weight: 1
    }
  ],
  'diet-planner': [
    {
      id: 1,
      question: "What is your primary health goal?",
      type: "multiple-choice",
      options: [
        { value: "weight-loss", label: "Weight Loss", weight: 3 },
        { value: "weight-gain", label: "Weight Gain", weight: 2 },
        { value: "maintenance", label: "Maintain Current Weight", weight: 1 },
        { value: "muscle-gain", label: "Muscle Gain", weight: 3 }
      ]
    },
    {
      id: 2,
      question: "How active are you during the week?",
      type: "multiple-choice",
      options: [
        { value: "sedentary", label: "Sedentary (little to no exercise)", weight: 1 },
        { value: "light", label: "Light activity (1-3 days/week)", weight: 2 },
        { value: "moderate", label: "Moderate activity (3-5 days/week)", weight: 3 },
        { value: "very-active", label: "Very active (6-7 days/week)", weight: 4 }
      ]
    },
    {
      id: 3,
      question: "Do you have any dietary restrictions?",
      type: "multiple-select",
      options: [
        { value: "vegetarian", label: "Vegetarian", weight: 2 },
        { value: "vegan", label: "Vegan", weight: 3 },
        { value: "gluten-free", label: "Gluten-free", weight: 2 },
        { value: "dairy-free", label: "Dairy-free", weight: 2 },
        { value: "none", label: "No restrictions", weight: 1 }
      ]
    },
    {
      id: 4,
      question: "How many meals do you prefer per day?",
      type: "multiple-choice",
      options: [
        { value: "2", label: "2 meals", weight: 1 },
        { value: "3", label: "3 meals", weight: 2 },
        { value: "4", label: "4 meals", weight: 2 },
        { value: "5-6", label: "5-6 small meals", weight: 3 }
      ]
    },
    {
      id: 5,
      question: "Rate your current energy levels (1-10)",
      type: "scale",
      min: 1,
      max: 10,
      weight: 1
    }
  ],
  'mental-health': [
    {
      id: 1,
      question: "How would you rate your overall mood this week?",
      type: "scale",
      min: 1,
      max: 10,
      weight: 3
    },
    {
      id: 2,
      question: "How often do you feel stressed or anxious?",
      type: "multiple-choice",
      options: [
        { value: "never", label: "Never", weight: 1 },
        { value: "rarely", label: "Rarely", weight: 2 },
        { value: "sometimes", label: "Sometimes", weight: 3 },
        { value: "often", label: "Often", weight: 4 },
        { value: "always", label: "Always", weight: 5 }
      ]
    },
    {
      id: 3,
      question: "How many hours of sleep do you get per night?",
      type: "multiple-choice",
      options: [
        { value: "less-than-5", label: "Less than 5 hours", weight: 4 },
        { value: "5-6", label: "5-6 hours", weight: 3 },
        { value: "7-8", label: "7-8 hours", weight: 1 },
        { value: "more-than-8", label: "More than 8 hours", weight: 2 }
      ]
    },
    {
      id: 4,
      question: "Do you have any of the following symptoms?",
      type: "multiple-select",
      options: [
        { value: "difficulty-concentrating", label: "Difficulty concentrating", weight: 3 },
        { value: "loss-of-interest", label: "Loss of interest in activities", weight: 4 },
        { value: "irritability", label: "Irritability", weight: 2 },
        { value: "mood-swings", label: "Mood swings", weight: 3 }
      ]
    },
    {
      id: 5,
      question: "How often do you engage in physical exercise?",
      type: "multiple-choice",
      options: [
        { value: "never", label: "Never", weight: 3 },
        { value: "once-week", label: "Once a week", weight: 2 },
        { value: "2-3-times", label: "2-3 times a week", weight: 1 },
        { value: "daily", label: "Daily", weight: 1 }
      ]
    }
  ]
};

// Assessment scoring algorithm
function calculateAssessmentScore(type, answers) {
  const questions = assessmentQuestions[type];
  if (!questions) return { score: 0, insights: [], recommendations: [] };

  let totalScore = 0;
  let maxScore = 0;
  const insights = [];
  const recommendations = [];

  answers.forEach((answer, index) => {
    const question = questions[index];
    if (!question) return;

    let questionScore = 0;
    let questionMaxScore = question.weight * 5; // Base max score

    if (question.type === 'scale') {
      questionScore = (11 - answer.value) * question.weight; // Invert scale for health score
      questionMaxScore = 10 * question.weight;
    } else if (question.type === 'multiple-choice') {
      const option = question.options.find(opt => opt.value === answer.value);
      if (option) {
        questionScore = (6 - option.weight) * question.weight; // Higher weight = lower score
        questionMaxScore = 5 * question.weight;
      }
    } else if (question.type === 'multiple-select') {
      const selectedOptions = question.options.filter(opt => 
        answer.value.includes(opt.value)
      );
      const avgWeight = selectedOptions.length > 0 
        ? selectedOptions.reduce((sum, opt) => sum + opt.weight, 0) / selectedOptions.length 
        : 1;
      questionScore = (6 - avgWeight) * question.weight;
      questionMaxScore = 5 * question.weight;
    } else if (question.type === 'yes-no') {
      questionScore = answer.value === 'yes' ? 2 * question.weight : 4 * question.weight;
      questionMaxScore = 4 * question.weight;
    }

    totalScore += questionScore;
    maxScore += questionMaxScore;
  });

  const normalizedScore = Math.round((totalScore / maxScore) * 100);
  const finalScore = Math.max(0, Math.min(100, normalizedScore));

  // Generate insights based on score and type
  generateInsights(type, finalScore, answers, insights, recommendations);

  return {
    score: finalScore,
    insights,
    recommendations,
    priority: finalScore > 70 ? 'low' : finalScore > 40 ? 'medium' : 'high'
  };
}

function generateInsights(type, score, answers, insights, recommendations) {
  switch (type) {
    case 'symptom-checker':
      if (score > 70) {
        insights.push({
          type: 'positive',
          icon: '✓',
          title: 'Overall Health Status',
          description: 'Your symptoms indicate a generally stable health condition with minor concerns that can be easily managed.'
        });
        recommendations.push({
          title: 'Routine Monitoring',
          description: 'Continue monitoring your symptoms and maintain healthy lifestyle habits.',
          priority: 'low'
        });
      } else if (score > 40) {
        insights.push({
          type: 'warning',
          icon: '⚠',
          title: 'Monitor Symptoms',
          description: 'Some symptoms require monitoring. Consider tracking changes over the next few days.'
        });
        recommendations.push({
          title: 'Schedule Check-up',
          description: 'Consider scheduling a routine check-up with your healthcare provider within 2-3 weeks.',
          priority: 'medium'
        });
      } else {
        insights.push({
          type: 'danger',
          icon: '⚠',
          title: 'Concerning Symptoms',
          description: 'Your symptoms may require immediate medical attention. Please consult a healthcare provider.'
        });
        recommendations.push({
          title: 'Seek Medical Attention',
          description: 'We recommend consulting with a healthcare provider as soon as possible.',
          priority: 'high'
        });
      }
      break;

    case 'diet-planner':
      if (score > 70) {
        insights.push({
          type: 'positive',
          icon: '✓',
          title: 'Good Nutritional Foundation',
          description: 'Your current dietary habits show a solid foundation for achieving your health goals.'
        });
      } else {
        insights.push({
          type: 'warning',
          icon: '⚠',
          title: 'Nutritional Optimization Needed',
          description: 'There are opportunities to optimize your nutrition for better health outcomes.'
        });
      }
      recommendations.push({
        title: 'Personalized Meal Plan',
        description: 'Follow a customized meal plan based on your goals and preferences.',
        priority: 'medium'
      });
      break;

    case 'mental-health':
      if (score > 70) {
        insights.push({
          type: 'positive',
          icon: '✓',
          title: 'Good Mental Wellness',
          description: 'Your mental health indicators suggest good overall psychological well-being.'
        });
      } else if (score > 40) {
        insights.push({
          type: 'warning',
          icon: '⚠',
          title: 'Mental Health Support Recommended',
          description: 'Consider implementing stress management techniques and lifestyle improvements.'
        });
      } else {
        insights.push({
          type: 'danger',
          icon: '⚠',
          title: 'Mental Health Concerns',
          description: 'Your responses suggest you may benefit from professional mental health support.'
        });
      }
      break;
  }

  // Add general recommendations
  recommendations.push({
    title: 'Lifestyle Modifications',
    description: 'Consider incorporating more physical activity and maintaining a balanced diet to support overall health.',
    priority: 'low'
  });
}

// API Routes

// Get assessment questions
app.get('/api/assessment/:type', (req, res) => {
  const { type } = req.params;
  const questions = assessmentQuestions[type];
  
  if (!questions) {
    return res.status(404).json({ error: 'Assessment type not found' });
  }
  
  res.json({
    type,
    questions,
    totalQuestions: questions.length
  });
});

// Submit assessment
app.post('/api/assessment/:type/submit', (req, res) => {
  try {
    const { type } = req.params;
    const { answers, userInfo } = req.body;
    
    if (!assessmentQuestions[type]) {
      return res.status(404).json({ error: 'Assessment type not found' });
    }
    
    const sessionId = uuidv4();
    const result = calculateAssessmentScore(type, answers);
    
    const assessmentData = {
      id: sessionId,
      type,
      answers,
      userInfo,
      result,
      completedAt: new Date().toISOString(),
      metrics: generateMetrics(type, result.score)
    };
    
    results.set(sessionId, assessmentData);
    
    res.json({
      sessionId,
      score: result.score,
      priority: result.priority,
      message: 'Assessment completed successfully'
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessment results
app.get('/api/results/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const result = results.get(sessionId);
  
  if (!result) {
    return res.status(404).json({ error: 'Results not found' });
  }
  
  res.json(result);
});

// Generate PDF report
app.post('/api/results/:sessionId/pdf', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = results.get(sessionId);
    
    if (!result) {
      return res.status(404).json({ error: 'Results not found' });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Generate HTML for PDF
    const htmlContent = generatePDFHTML(result);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="health-assessment-${sessionId}.pdf"`);
    res.send(pdf);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Generate metrics for different assessment types
function generateMetrics(type, score) {
  const baseMetrics = [
    { 
      label: 'Overall Score', 
      value: `${score}%`, 
      status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
    },
    { 
      label: 'Risk Assessment', 
      value: score > 70 ? 'Low Risk' : score > 40 ? 'Medium Risk' : 'High Risk', 
      status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
    }
  ];

  switch (type) {
    case 'symptom-checker':
      return [
        ...baseMetrics,
        { 
          label: 'Symptom Severity', 
          value: score > 70 ? 'Mild' : score > 40 ? 'Moderate' : 'Severe', 
          status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
        },
        { 
          label: 'Urgency Level', 
          value: score > 70 ? 'Non-Urgent' : score > 40 ? 'Monitor' : 'Urgent', 
          status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
        }
      ];
    
    case 'diet-planner':
      return [
        ...baseMetrics,
        { 
          label: 'Nutrition Quality', 
          value: score > 70 ? 'Good' : score > 40 ? 'Fair' : 'Needs Improvement', 
          status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
        },
        { 
          label: 'Goal Alignment', 
          value: score > 70 ? 'On Track' : score > 40 ? 'Adjustments Needed' : 'Major Changes Required', 
          status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
        }
      ];
    
    case 'mental-health':
      return [
        ...baseMetrics,
        { 
          label: 'Mental Wellness', 
          value: score > 70 ? 'Good' : score > 40 ? 'Fair' : 'Needs Support', 
          status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
        },
        { 
          label: 'Stress Level', 
          value: score > 70 ? 'Low' : score > 40 ? 'Moderate' : 'High', 
          status: score > 70 ? 'good' : score > 40 ? 'warning' : 'danger' 
        }
      ];
    
    default:
      return baseMetrics;
  }
}

// Generate HTML content for PDF
function generatePDFHTML(result) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Health Assessment Results</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: white;
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 2rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .logo {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            opacity: 0.9;
            font-size: 1.125rem;
        }
        
        .content {
            padding: 0 2rem;
        }
        
        .score-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            border: 1px solid #e2e8f0;
        }
        
        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: #3b82f6;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: 800;
        }
        
        .score-number {
            font-size: 2.5rem;
        }
        
        .score-label {
            font-size: 0.875rem;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .info-item {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
        }
        
        .info-label {
            font-weight: 600;
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .info-value {
            font-weight: 700;
            color: #1e293b;
            margin-top: 0.25rem;
        }
        
        .section {
            margin-bottom: 2rem;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #3b82f6;
        }
        
        .insight-item {
            background: #f0f9ff;
            border: 1px solid #bfdbfe;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .insight-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .insight-description {
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .recommendation-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .recommendation-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .recommendation-description {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        
        .priority-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .priority-high {
            background: #fef2f2;
            color: #dc2626;
        }
        
        .priority-medium {
            background: #fffbeb;
            color: #d97706;
        }
        
        .priority-low {
            background: #ecfdf5;
            color: #059669;
        }
        
        .metrics-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
        }
        
        .metrics-table th,
        .metrics-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .metrics-table th {
            background: #f8fafc;
            font-weight: 600;
        }
        
        .footer {
            margin-top: 3rem;
            padding: 2rem;
            background: #f8fafc;
            border-radius: 1rem;
            text-align: center;
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .disclaimer {
            margin-top: 1rem;
            font-size: 0.75rem;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏥 MediCare+ AI Health Assessment</div>
        <div class="subtitle">Comprehensive Health Analysis Report</div>
    </div>
    
    <div class="content">
        <div class="score-section">
            <div>
                <h2>Assessment Results</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Assessment Type</div>
                        <div class="info-value">${result.type.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Completed Date</div>
                        <div class="info-value">${new Date(result.completedAt).toLocaleDateString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Priority Level</div>
                        <div class="info-value">${result.result.priority.toUpperCase()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Session ID</div>
                        <div class="info-value">${result.id}</div>
                    </div>
                </div>
            </div>
            <div class="score-circle">
                <div class="score-number">${result.result.score}%</div>
                <div class="score-label">Health Score</div>
            </div>
        </div>
        
        <div class="section">
            <h3 class="section-title">Health Insights</h3>
            ${result.result.insights.map(insight => `
                <div class="insight-item">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-description">${insight.description}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h3 class="section-title">Personalized Recommendations</h3>
            ${result.result.recommendations.map((rec, index) => `
                <div class="recommendation-item">
                    <div class="recommendation-title">${index + 1}. ${rec.title}</div>
                    <div class="recommendation-description">${rec.description}</div>
                    <span class="priority-badge priority-${rec.priority}">${rec.priority.toUpperCase()} PRIORITY</span>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h3 class="section-title">Health Metrics</h3>
            <table class="metrics-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.metrics.map(metric => `
                        <tr>
                            <td>${metric.label}</td>
                            <td>${metric.value}</td>
                            <td style="color: ${
                              metric.status === 'good' ? '#059669' : 
                              metric.status === 'warning' ? '#d97706' : '#dc2626'
                            }">${metric.status.toUpperCase()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p><strong>MediCare+ AI Health Assessment</strong></p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This assessment is for informational purposes only and does not constitute medical advice. 
                Always consult with a qualified healthcare provider for medical concerns and decisions.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

// Health dashboard data
app.get('/api/dashboard/stats', (req, res) => {
  const totalAssessments = results.size;
  const completedToday = Array.from(results.values()).filter(result => {
    const today = new Date().toDateString();
    const resultDate = new Date(result.completedAt).toDateString();
    return today === resultDate;
  }).length;

  const averageScore = Array.from(results.values()).reduce((sum, result) => {
    return sum + result.result.score;
  }, 0) / Math.max(totalAssessments, 1);

  res.json({
    totalAssessments,
    completedToday,
    averageScore: Math.round(averageScore),
    activeUsers: Math.floor(totalAssessments * 0.7) // Mock data
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enhanced MediCare+ Server running on port ${PORT}`);
  console.log(`📊 Health Assessment API available at http://localhost:${PORT}/api`);
  console.log(`💊 AI-powered assessments ready for use`);
});

module.exports = app; 