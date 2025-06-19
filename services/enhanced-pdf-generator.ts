// Enhanced PDF Generator for MediCare+ Health Assessments
// TypeScript-based system for generating specialized PDFs for each assessment type

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

interface AssessmentData {
    type: string;
    userInfo: {
        name: string;
        age: number;
        gender: string;
        contact: string;
        province: string;
    };
    responses: Record<string, any>;
    analysisResults: {
        healthScore: number;
        sections: Array<{
            title: string;
            content: string;
            type: 'analysis' | 'warning' | 'recommendation' | 'success';
        }>;
        metrics?: Array<{
            label: string;
            value: string;
            status: 'good' | 'warning' | 'danger';
        }>;
    };
    completedAt: Date;
}

interface PDFTemplate {
    headerStyle: string;
    bodyStyle: string;
    chartStyles: string;
    generateContent: (data: AssessmentData) => string;
}

class EnhancedPDFGenerator {
    private browser: puppeteer.Browser | null = null;

    async initializeBrowser(): Promise<puppeteer.Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });
        }
        return this.browser;
    }

    async generateAssessmentPDF(data: AssessmentData): Promise<Buffer> {
        const template = this.getTemplateForType(data.type);
        const htmlContent = this.generateHTMLContent(data, template);
        
        const browser = await this.initializeBrowser();
        const page = await browser.newPage();
        
        await page.setViewport({ width: 1200, height: 800 });
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
            displayHeaderFooter: true,
            headerTemplate: this.getHeaderTemplate(data),
            footerTemplate: this.getFooterTemplate()
        });
        
        await page.close();
        return pdfBuffer;
    }

    private getTemplateForType(type: string): PDFTemplate {
        const templates: Record<string, PDFTemplate> = {
            'symptom-checker': this.createSymptomCheckerTemplate(),
            'diet-planner': this.createDietPlannerTemplate(),
            'mental-health': this.createMentalHealthTemplate(),
            'medicine-advisor': this.createMedicineAdvisorTemplate(),
            'fitness-coach': this.createFitnessCoachTemplate(),
            'sleep-analyzer': this.createSleepAnalyzerTemplate()
        };
        
        return templates[type] || templates['symptom-checker'];
    }

    private createSymptomCheckerTemplate(): PDFTemplate {
        return {
            headerStyle: `
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                text-align: center;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            `,
            bodyStyle: `
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.6;
            `,
            chartStyles: `
                .severity-chart { background: #fef2f2; border: 2px solid #ef4444; }
                .risk-indicator { color: #dc2626; font-weight: bold; }
                .urgency-level { background: #fee2e2; padding: 1rem; border-radius: 8px; }
            `,
            generateContent: (data) => this.generateSymptomCheckerContent(data)
        };
    }

    private createDietPlannerTemplate(): PDFTemplate {
        return {
            headerStyle: `
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                text-align: center;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            `,
            bodyStyle: `
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.6;
            `,
            chartStyles: `
                .nutrition-chart { background: #ecfdf5; border: 2px solid #10b981; }
                .calorie-breakdown { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                .meal-plan { background: #f0fdf4; padding: 1.5rem; border-radius: 12px; }
            `,
            generateContent: (data) => this.generateDietPlannerContent(data)
        };
    }

    private createMentalHealthTemplate(): PDFTemplate {
        return {
            headerStyle: `
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                color: white;
                text-align: center;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            `,
            bodyStyle: `
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.6;
            `,
            chartStyles: `
                .mental-wellness-chart { background: #faf5ff; border: 2px solid #8b5cf6; }
                .mood-tracker { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
                .stress-level { background: #f3e8ff; padding: 1rem; border-radius: 8px; }
            `,
            generateContent: (data) => this.generateMentalHealthContent(data)
        };
    }

    private createMedicineAdvisorTemplate(): PDFTemplate {
        return {
            headerStyle: `
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                text-align: center;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            `,
            bodyStyle: `
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.6;
            `,
            chartStyles: `
                .medication-schedule { background: #fffbeb; border: 2px solid #f59e0b; }
                .interaction-warnings { background: #fef3c7; padding: 1rem; border-radius: 8px; }
                .dosage-table { width: 100%; border-collapse: collapse; }
            `,
            generateContent: (data) => this.generateMedicineAdvisorContent(data)
        };
    }

    private createFitnessCoachTemplate(): PDFTemplate {
        return {
            headerStyle: `
                background: linear-gradient(135deg, #f97316, #ea580c);
                color: white;
                text-align: center;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            `,
            bodyStyle: `
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.6;
            `,
            chartStyles: `
                .fitness-progress { background: #fff7ed; border: 2px solid #f97316; }
                .workout-plan { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; }
                .exercise-details { background: #fed7aa; padding: 1rem; border-radius: 8px; }
            `,
            generateContent: (data) => this.generateFitnessCoachContent(data)
        };
    }

    private createSleepAnalyzerTemplate(): PDFTemplate {
        return {
            headerStyle: `
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                text-align: center;
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            `,
            bodyStyle: `
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.6;
            `,
            chartStyles: `
                .sleep-quality-chart { background: #eef2ff; border: 2px solid #6366f1; }
                .sleep-stages { display: flex; justify-content: space-around; }
                .bedtime-routine { background: #e0e7ff; padding: 1rem; border-radius: 8px; }
            `,
            generateContent: (data) => this.generateSleepAnalyzerContent(data)
        };
    }

    private generateHTMLContent(data: AssessmentData, template: PDFTemplate): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${this.getAssessmentTitle(data.type)} - MediCare+ Report</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    ${template.bodyStyle}
                    background: white;
                    font-size: 14px;
                }
                
                .header {
                    ${template.headerStyle}
                }
                
                .content {
                    padding: 0 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                ${template.chartStyles}
                
                .section {
                    margin-bottom: 2rem;
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: #1e293b;
                }
                
                .metric-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin: 1rem 0;
                }
                
                .metric-card {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid #d1d5db;
                    text-align: center;
                }
                
                .metric-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                
                .metric-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .status-good { color: #059669; }
                .status-warning { color: #d97706; }
                .status-danger { color: #dc2626; }
                
                .recommendation {
                    background: #e0f2fe;
                    border-left: 4px solid #0284c7;
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 0 8px 8px 0;
                }
                
                .warning {
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 0 8px 8px 0;
                }
                
                .footer {
                    margin-top: 3rem;
                    padding: 2rem;
                    background: #f1f5f9;
                    border-radius: 12px;
                    text-align: center;
                    font-size: 0.875rem;
                    color: #64748b;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1><i class="fas fa-heart-pulse"></i> MediCare+ Health Report</h1>
                <h2>${this.getAssessmentTitle(data.type)}</h2>
                <p>Generated on ${data.completedAt.toLocaleDateString()}</p>
            </div>
            
            <div class="content">
                ${template.generateContent(data)}
            </div>
            
            <div class="footer">
                <p><strong>Important:</strong> This report is generated by AI and should not replace professional medical advice.</p>
                <p>Always consult with qualified healthcare professionals for medical decisions.</p>
                <p>© ${new Date().getFullYear()} MediCare+ - AI-Powered Healthcare Assistant</p>
            </div>
        </body>
        </html>
        `;
    }

    private generateSymptomCheckerContent(data: AssessmentData): string {
        return `
            <div class="section">
                <h3 class="section-title">Patient Information</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">${data.userInfo.name}</div>
                        <div class="metric-label">Patient Name</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.userInfo.age} years</div>
                        <div class="metric-label">Age</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.userInfo.gender}</div>
                        <div class="metric-label">Gender</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.analysisResults.healthScore}%</div>
                        <div class="metric-label">Health Score</div>
                    </div>
                </div>
            </div>
            
            <div class="section severity-chart">
                <h3 class="section-title">Symptom Analysis</h3>
                <div class="urgency-level">
                    <h4>Primary Symptom: ${data.responses.primarySymptom || 'Not specified'}</h4>
                    <p><strong>Duration:</strong> ${data.responses.duration || 'Not specified'}</p>
                    <p><strong>Severity:</strong> ${data.responses.severity || 'Not specified'}</p>
                </div>
            </div>
            
            ${data.analysisResults.sections.map(section => `
                <div class="section">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="${section.type === 'warning' ? 'warning' : 'recommendation'}">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        `;
    }

    private generateDietPlannerContent(data: AssessmentData): string {
        return `
            <div class="section">
                <h3 class="section-title">Personal Profile</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">${data.userInfo.name}</div>
                        <div class="metric-label">Name</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.height || 'N/A'}</div>
                        <div class="metric-label">Height</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.weight || 'N/A'}</div>
                        <div class="metric-label">Weight</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.bmi || 'N/A'}</div>
                        <div class="metric-label">BMI</div>
                    </div>
                </div>
            </div>
            
            <div class="section nutrition-chart">
                <h3 class="section-title">Nutrition Plan</h3>
                <div class="meal-plan">
                    <h4>Daily Calorie Target: ${data.responses.targetCalories || '2000'} kcal</h4>
                    <div class="calorie-breakdown">
                        <div><strong>Protein:</strong> ${data.responses.proteinTarget || '25%'}</div>
                        <div><strong>Carbs:</strong> ${data.responses.carbTarget || '45%'}</div>
                        <div><strong>Fats:</strong> ${data.responses.fatTarget || '30%'}</div>
                    </div>
                </div>
            </div>
            
            ${data.analysisResults.sections.map(section => `
                <div class="section">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="recommendation">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        `;
    }

    private generateMentalHealthContent(data: AssessmentData): string {
        return `
            <div class="section">
                <h3 class="section-title">Mental Wellness Profile</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">${data.analysisResults.healthScore}%</div>
                        <div class="metric-label">Wellness Score</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.stressLevel || 'Moderate'}</div>
                        <div class="metric-label">Stress Level</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.sleepQuality || 'Fair'}</div>
                        <div class="metric-label">Sleep Quality</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.moodRating || '6/10'}</div>
                        <div class="metric-label">Mood Rating</div>
                    </div>
                </div>
            </div>
            
            <div class="section mental-wellness-chart">
                <h3 class="section-title">Assessment Results</h3>
                <div class="stress-level">
                    <h4>Current Mental Health Status</h4>
                    <p><strong>Primary Concerns:</strong> ${data.responses.primaryConcerns || 'General wellness'}</p>
                    <p><strong>Support Level:</strong> ${data.responses.supportLevel || 'Moderate'}</p>
                </div>
            </div>
            
            ${data.analysisResults.sections.map(section => `
                <div class="section">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="${section.type === 'warning' ? 'warning' : 'recommendation'}">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        `;
    }

    private generateMedicineAdvisorContent(data: AssessmentData): string {
        return `
            <div class="section">
                <h3 class="section-title">Medication Profile</h3>
                <div class="medication-schedule">
                    <h4>Current Medications</h4>
                    <div class="dosage-table">
                        <p><strong>Primary Concern:</strong> ${data.responses.medicationConcern || 'General medication advice'}</p>
                        <p><strong>Current Medications:</strong> ${data.responses.currentMedications || 'None specified'}</p>
                        <p><strong>Allergies:</strong> ${data.responses.allergies || 'None reported'}</p>
                    </div>
                </div>
            </div>
            
            <div class="section interaction-warnings">
                <h3 class="section-title">Safety Information</h3>
                <div class="warning">
                    <h4>Important Safety Notes</h4>
                    <ul>
                        <li>Always inform your doctor about all medications you're taking</li>
                        <li>Check for drug interactions before starting new medications</li>
                        <li>Take medications exactly as prescribed</li>
                        <li>Store medications properly according to instructions</li>
                    </ul>
                </div>
            </div>
            
            ${data.analysisResults.sections.map(section => `
                <div class="section">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="recommendation">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        `;
    }

    private generateFitnessCoachContent(data: AssessmentData): string {
        return `
            <div class="section">
                <h3 class="section-title">Fitness Profile</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.fitnessLevel || 'Beginner'}</div>
                        <div class="metric-label">Fitness Level</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.activityGoal || 'General fitness'}</div>
                        <div class="metric-label">Primary Goal</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.workoutFrequency || '3x/week'}</div>
                        <div class="metric-label">Target Frequency</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.availableTime || '30 min'}</div>
                        <div class="metric-label">Session Duration</div>
                    </div>
                </div>
            </div>
            
            <div class="section fitness-progress">
                <h3 class="section-title">Personalized Workout Plan</h3>
                <div class="exercise-details">
                    <h4>Weekly Training Schedule</h4>
                    <div class="workout-plan">
                        <div><strong>Mon:</strong> Cardio + Core</div>
                        <div><strong>Tue:</strong> Upper Body</div>
                        <div><strong>Wed:</strong> Rest/Yoga</div>
                        <div><strong>Thu:</strong> Lower Body</div>
                        <div><strong>Fri:</strong> Full Body</div>
                        <div><strong>Sat:</strong> Cardio</div>
                        <div><strong>Sun:</strong> Rest</div>
                    </div>
                </div>
            </div>
            
            ${data.analysisResults.sections.map(section => `
                <div class="section">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="recommendation">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        `;
    }

    private generateSleepAnalyzerContent(data: AssessmentData): string {
        return `
            <div class="section">
                <h3 class="section-title">Sleep Profile</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.sleepDuration || '7 hours'}</div>
                        <div class="metric-label">Average Sleep</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.bedtime || '10:30 PM'}</div>
                        <div class="metric-label">Bedtime</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.responses.wakeTime || '6:30 AM'}</div>
                        <div class="metric-label">Wake Time</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.analysisResults.healthScore}%</div>
                        <div class="metric-label">Sleep Quality</div>
                    </div>
                </div>
            </div>
            
            <div class="section sleep-quality-chart">
                <h3 class="section-title">Sleep Analysis</h3>
                <div class="bedtime-routine">
                    <h4>Current Sleep Patterns</h4>
                    <p><strong>Sleep Issues:</strong> ${data.responses.sleepIssues || 'None reported'}</p>
                    <p><strong>Sleep Environment:</strong> ${data.responses.sleepEnvironment || 'Good'}</p>
                    <p><strong>Caffeine Intake:</strong> ${data.responses.caffeineIntake || 'Moderate'}</p>
                </div>
            </div>
            
            ${data.analysisResults.sections.map(section => `
                <div class="section">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="recommendation">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        `;
    }

    private getAssessmentTitle(type: string): string {
        const titles: Record<string, string> = {
            'symptom-checker': 'AI Symptom Analysis Report',
            'diet-planner': 'Personalized Nutrition Plan',
            'mental-health': 'Mental Wellness Assessment',
            'medicine-advisor': 'Medication Advisory Report',
            'fitness-coach': 'Personal Fitness Plan',
            'sleep-analyzer': 'Sleep Quality Analysis'
        };
        return titles[type] || 'Health Assessment Report';
    }

    private getHeaderTemplate(data: AssessmentData): string {
        return `
            <div style="font-size: 10px; margin: 0 auto; color: #666; text-align: center;">
                MediCare+ ${this.getAssessmentTitle(data.type)} - ${data.userInfo.name}
            </div>
        `;
    }

    private getFooterTemplate(): string {
        return `
            <div style="font-size: 10px; margin: 0 auto; color: #666; text-align: center;">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span> | 
                Generated on ${new Date().toLocaleDateString()} | 
                MediCare+ AI Health Assistant
            </div>
        `;
    }

    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

export default EnhancedPDFGenerator; 