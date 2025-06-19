// PDF Assessment Service - Enhanced PDF Generation for Health Assessments
const fs = require('fs').promises;
const path = require('path');

class PDFAssessmentService {
    constructor() {
        this.outputDir = path.join(__dirname, '../uploads/pdf-reports');
        this.ensureOutputDirectory();
    }

    async ensureOutputDirectory() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            console.error('Error creating PDF output directory:', error);
        }
    }

    async generateAssessmentReport(assessmentData) {
        try {
            console.log('📄 Generating PDF for assessment type:', assessmentData.type);
            
            // Enhanced assessment data structure
            const enhancedData = this.enhanceAssessmentData(assessmentData);
            
            // Generate specialized PDF based on assessment type
            const pdfBuffer = await this.createSpecializedPDF(enhancedData);
            
            // Save PDF to file system
            const filename = this.generateFilename(enhancedData);
            const filepath = path.join(this.outputDir, filename);
            
            await fs.writeFile(filepath, pdfBuffer);
            
            console.log('✅ PDF generated successfully:', filename);
            
            return {
                success: true,
                filename,
                filepath,
                filesize: pdfBuffer.length,
                downloadUrl: `/download/pdf/${filename}`,
                reportId: this.generateReportId(enhancedData)
            };
            
        } catch (error) {
            console.error('❌ PDF generation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    enhanceAssessmentData(data) {
        const enhanced = {
            ...data,
            completedAt: new Date(),
            analysisResults: {
                ...data.analysisResults,
                metrics: this.calculateMetrics(data),
                recommendations: this.generateRecommendations(data)
            }
        };

        // Add assessment-specific enhancements
        switch (data.type) {
            case 'diet-planner':
                enhanced.nutritionAnalysis = this.calculateNutritionMetrics(data);
                break;
            case 'symptom-checker':
                enhanced.riskAssessment = this.calculateRiskLevel(data);
                break;
            case 'mental-health':
                enhanced.wellnessScore = this.calculateWellnessScore(data);
                break;
        }

        return enhanced;
    }

    async createSpecializedPDF(data) {
        const template = this.getTemplateForAssessment(data.type);
        const htmlContent = await this.generateHTMLReport(data, template);
        
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
        });
        
        await page.close();
        await browser.close();
        
        return pdfBuffer;
    }

    getTemplateForAssessment(type) {
        const templates = {
            'symptom-checker': {
                primaryColor: '#ef4444',
                secondaryColor: '#fef2f2',
                icon: '🩺',
                title: 'AI Symptom Analysis Report'
            },
            'diet-planner': {
                primaryColor: '#10b981',
                secondaryColor: '#ecfdf5',
                icon: '🍽️',
                title: 'Personalized Nutrition Plan'
            },
            'mental-health': {
                primaryColor: '#8b5cf6',
                secondaryColor: '#faf5ff',
                icon: '🧠',
                title: 'Mental Wellness Assessment'
            },
            'medicine-advisor': {
                primaryColor: '#f59e0b',
                secondaryColor: '#fffbeb',
                icon: '💊',
                title: 'Medication Advisory Report'
            },
            'fitness-coach': {
                primaryColor: '#f97316',
                secondaryColor: '#fff7ed',
                icon: '💪',
                title: 'Personal Fitness Program'
            },
            'sleep-analyzer': {
                primaryColor: '#6366f1',
                secondaryColor: '#eef2ff',
                icon: '😴',
                title: 'Sleep Quality Analysis'
            }
        };

        return templates[type] || templates['symptom-checker'];
    }

    async generateHTMLReport(data, template) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${template.title} - MediCare+</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    color: #1e293b;
                    background: white;
                    font-size: 14px;
                }
                
                .header {
                    background: linear-gradient(135deg, ${template.primaryColor}, ${this.darkenColor(template.primaryColor)});
                    color: white;
                    padding: 3rem 2rem;
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                }
                
                .content {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                
                .section {
                    background: ${template.secondaryColor};
                    border: 1px solid ${template.primaryColor}33;
                    border-radius: 15px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                
                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: ${template.primaryColor};
                    margin-bottom: 1.5rem;
                }
                
                .patient-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .info-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                
                .info-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: ${template.primaryColor};
                    margin-bottom: 0.5rem;
                }
                
                .info-label {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }
                
                .recommendation {
                    background: #e0f2fe;
                    border: 1px solid #0284c7;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin: 1rem 0;
                }
                
                .footer {
                    margin-top: 3rem;
                    padding: 2rem;
                    background: #f8fafc;
                    border-radius: 15px;
                    text-align: center;
                }
                
                .disclaimer {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin: 2rem 0;
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">${template.icon} MediCare+</div>
                <h1 class="title">${template.title}</h1>
                <p>Generated on ${data.completedAt.toLocaleDateString()}</p>
            </div>
            
            <div class="content">
                ${this.generatePatientInfoSection(data)}
                ${this.generateAnalysisSection(data)}
                ${this.generateRecommendationsSection(data)}
            </div>
            
            <div class="footer">
                <div class="disclaimer">
                    <strong>Medical Disclaimer:</strong> This AI report provides general health information and should NOT replace professional medical advice.
                </div>
                <p>Report ID: ${this.generateReportId(data)}</p>
                <p>© ${new Date().getFullYear()} MediCare+</p>
            </div>
        </body>
        </html>
        `;
    }

    generatePatientInfoSection(data) {
        return `
            <div class="section">
                <h2 class="section-title">📋 Patient Information</h2>
                <div class="patient-info">
                    <div class="info-card">
                        <div class="info-value">${data.userInfo.name}</div>
                        <div class="info-label">Patient Name</div>
                    </div>
                    <div class="info-card">
                        <div class="info-value">${data.userInfo.age} years</div>
                        <div class="info-label">Age</div>
                    </div>
                    <div class="info-card">
                        <div class="info-value">${data.userInfo.gender}</div>
                        <div class="info-label">Gender</div>
                    </div>
                    <div class="info-card">
                        <div class="info-value">${data.analysisResults.healthScore}%</div>
                        <div class="info-label">Health Score</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAnalysisSection(data) {
        return `
            <div class="section">
                <h2 class="section-title">🔍 Analysis Results</h2>
                ${data.analysisResults.sections.map(section => `
                    <div class="recommendation">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateRecommendationsSection(data) {
        return `
            <div class="section">
                <h2 class="section-title">💡 Recommendations</h2>
                <div class="recommendation">
                    <ul>
                        ${data.analysisResults.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    calculateMetrics(data) {
        const baseScore = data.analysisResults.healthScore || 75;
        return [
            {
                label: 'Overall Health Score',
                value: `${baseScore}%`,
                status: baseScore >= 80 ? 'good' : 'warning'
            }
        ];
    }

    generateRecommendations(data) {
        return [
            "Follow the personalized recommendations in this report",
            "Consult with healthcare professionals for ongoing support",
            "Monitor your progress regularly",
            "Schedule follow-up assessments as needed"
        ];
    }

    calculateNutritionMetrics(data) {
        return {
            bmi: this.calculateBMI(data.responses.height, data.responses.weight),
            targetCalories: 2000
        };
    }

    calculateRiskLevel(data) {
        return 'moderate';
    }

    calculateWellnessScore(data) {
        return 75;
    }

    calculateBMI(height, weight) {
        if (!height || !weight) return 'N/A';
        const heightM = parseFloat(height) / 100;
        const weightKg = parseFloat(weight);
        return (weightKg / (heightM * heightM)).toFixed(1);
    }

    darkenColor(color) {
        const colors = {
            '#ef4444': '#dc2626',
            '#10b981': '#059669',
            '#8b5cf6': '#7c3aed',
            '#f59e0b': '#d97706',
            '#f97316': '#ea580c',
            '#6366f1': '#4f46e5'
        };
        return colors[color] || color;
    }

    generateFilename(data) {
        const timestamp = new Date().toISOString().split('T')[0];
        const sanitizedName = data.userInfo.name.replace(/[^a-zA-Z0-9]/g, '_');
        return `${data.type}_${sanitizedName}_${timestamp}.pdf`;
    }

    generateReportId(data) {
        const timestamp = Date.now();
        const typeCode = data.type.substring(0, 3).toUpperCase();
        return `MC${typeCode}${timestamp}`;
    }
}

module.exports = PDFAssessmentService; 