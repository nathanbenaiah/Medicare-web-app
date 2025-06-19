const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class EnhancedPDFService {
    constructor() {
        this.doc = null;
        this.y = 0;
        this.pageMargin = 72;
        this.colors = {
            primary: '#007BFF',
            secondary: '#6c757d',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            dark: '#343a40',
            light: '#f8f9fa'
        };
    }

    async generateAssessmentPDF(assessmentData, responses, analysisResult) {
        try {
            this.doc = new PDFDocument({ 
                size: 'A4', 
                margin: this.pageMargin,
                info: {
                    Title: `${assessmentData.title} Report`,
                    Subject: 'Health Assessment Report',
                    Author: 'MediCare+ AI Health System',
                    Creator: 'MediCare+ PDF Generator'
                }
            });

            // Initialize position
            this.y = this.pageMargin;

            // Generate PDF content
            await this.generateHeader(assessmentData);
            await this.generatePatientInfo(responses);
            await this.generateAssessmentSummary(assessmentData, analysisResult);
            await this.generateDetailedAnalysis(assessmentData, responses, analysisResult);
            await this.generateRecommendations(analysisResult);
            await this.generateCharts(assessmentData, analysisResult);
            await this.generateDisclaimer();
            await this.generateFooter();

            return this.doc;

        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw new Error('Failed to generate PDF report');
        }
    }

    async generateHeader(assessmentData) {
        // Add watermark
        this.doc.save();
        this.doc.rotate(-45, { origin: [300, 400] });
        this.doc.fontSize(60)
           .fillColor('#f0f0f0')
           .text('MediCare+', 200, 300, { align: 'center' });
        this.doc.restore();

        // Header background
        this.doc.rect(0, 0, this.doc.page.width, 120)
           .fillAndStroke(this.colors.primary, this.colors.primary);

        // Logo area (placeholder)
        this.doc.rect(this.pageMargin, 20, 80, 80)
           .fillAndStroke('#ffffff', '#ffffff');
        
        this.doc.fontSize(12)
           .fillColor(this.colors.primary)
           .text('MediCare+', this.pageMargin + 10, 50);

        // Title
        this.doc.fontSize(24)
           .fillColor('#ffffff')
           .text(assessmentData.title, this.pageMargin + 120, 30);

        this.doc.fontSize(16)
           .text('Comprehensive Health Assessment Report', this.pageMargin + 120, 60);

        // Date and time
        const now = new Date();
        this.doc.fontSize(12)
           .text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 
                  this.pageMargin + 120, 85);

        this.y = 140;
    }

    async generatePatientInfo(responses) {
        this.checkPageBreak(100);
        
        this.doc.fontSize(18)
           .fillColor(this.colors.dark)
           .text('Patient Information', this.pageMargin, this.y);
        
        this.y += 30;

        // Draw section background
        this.doc.rect(this.pageMargin, this.y - 10, 
                     this.doc.page.width - (this.pageMargin * 2), 80)
           .fillAndStroke(this.colors.light, '#e0e0e0');

        const patientInfo = [
            { label: 'Name', value: responses['1'] || 'N/A' },
            { label: 'Age', value: responses['2'] || 'N/A' },
            { label: 'Gender', value: responses['3'] || 'N/A' },
            { label: 'Contact', value: responses['4'] || 'N/A' },
            { label: 'Province', value: responses['5'] || 'N/A' }
        ];

        this.doc.fontSize(12).fillColor(this.colors.dark);
        
        patientInfo.forEach((info, index) => {
            const xPos = this.pageMargin + 20 + (index % 2) * 250;
            const yPos = this.y + Math.floor(index / 2) * 25;
            
            this.doc.font('Helvetica-Bold')
               .text(`${info.label}:`, xPos, yPos);
            this.doc.font('Helvetica')
               .text(info.value, xPos + 80, yPos);
        });

        this.y += 100;
    }

    async generateAssessmentSummary(assessmentData, analysisResult) {
        this.checkPageBreak(150);
        
        this.doc.fontSize(18)
           .fillColor(this.colors.dark)
           .text('Assessment Summary', this.pageMargin, this.y);
        
        this.y += 30;

        // Summary stats box
        this.doc.rect(this.pageMargin, this.y, 
                     this.doc.page.width - (this.pageMargin * 2), 120)
           .fillAndStroke('#f8f9ff', this.colors.primary);

        this.doc.fontSize(14).fillColor(this.colors.dark);
        
        const summaryItems = [
            { label: 'Assessment Type', value: assessmentData.title },
            { label: 'Total Questions', value: '30 questions' },
            { label: 'Completion Rate', value: '100%' },
            { label: 'Risk Level', value: analysisResult?.riskLevel || 'Low' },
            { label: 'Overall Score', value: analysisResult?.overallScore || 'Good' },
            { label: 'Priority', value: analysisResult?.priority || 'Routine' }
        ];

        summaryItems.forEach((item, index) => {
            const xPos = this.pageMargin + 20 + (index % 2) * 250;
            const yPos = this.y + 20 + Math.floor(index / 2) * 25;
            
            this.doc.font('Helvetica-Bold')
               .text(`${item.label}:`, xPos, yPos);
            this.doc.font('Helvetica')
               .text(item.value, xPos + 120, yPos);
        });

        this.y += 140;
    }

    async generateDetailedAnalysis(assessmentData, responses, analysisResult) {
        this.checkPageBreak(200);
        
        this.doc.fontSize(18)
           .fillColor(this.colors.dark)
           .text('Detailed Analysis', this.pageMargin, this.y);
        
        this.y += 30;

        // Key findings section
        if (analysisResult?.keyFindings) {
            this.doc.fontSize(14)
               .fillColor(this.colors.primary)
               .text('Key Findings:', this.pageMargin, this.y);
            
            this.y += 25;

            analysisResult.keyFindings.forEach((finding, index) => {
                this.checkPageBreak(30);
                this.doc.fontSize(11)
                   .fillColor(this.colors.dark)
                   .text(`• ${finding}`, this.pageMargin + 20, this.y);
                this.y += 20;
            });
        }

        // Risk factors
        if (analysisResult?.riskFactors) {
            this.y += 20;
            this.doc.fontSize(14)
               .fillColor(this.colors.danger)
               .text('Risk Factors:', this.pageMargin, this.y);
            
            this.y += 25;

            analysisResult.riskFactors.forEach((factor, index) => {
                this.checkPageBreak(30);
                this.doc.fontSize(11)
                   .fillColor(this.colors.dark)
                   .text(`⚠ ${factor}`, this.pageMargin + 20, this.y);
                this.y += 20;
            });
        }

        // Positive indicators
        if (analysisResult?.positiveFactors) {
            this.y += 20;
            this.doc.fontSize(14)
               .fillColor(this.colors.success)
               .text('Positive Health Indicators:', this.pageMargin, this.y);
            
            this.y += 25;

            analysisResult.positiveFactors.forEach((factor, index) => {
                this.checkPageBreak(30);
                this.doc.fontSize(11)
                   .fillColor(this.colors.dark)
                   .text(`✓ ${factor}`, this.pageMargin + 20, this.y);
                this.y += 20;
            });
        }
    }

    async generateRecommendations(analysisResult) {
        this.checkPageBreak(200);
        
        this.doc.fontSize(18)
           .fillColor(this.colors.dark)
           .text('Recommendations', this.pageMargin, this.y);
        
        this.y += 30;

        const recommendations = analysisResult?.recommendations || [
            'Maintain regular exercise routine',
            'Follow a balanced diet',
            'Get adequate sleep (7-9 hours)',
            'Stay hydrated',
            'Schedule regular medical checkups'
        ];

        // Immediate actions
        this.doc.fontSize(14)
           .fillColor(this.colors.warning)
           .text('Immediate Actions:', this.pageMargin, this.y);
        
        this.y += 25;

        recommendations.slice(0, 3).forEach((rec, index) => {
            this.checkPageBreak(30);
            this.doc.fontSize(11)
               .fillColor(this.colors.dark)
               .text(`${index + 1}. ${rec}`, this.pageMargin + 20, this.y);
            this.y += 20;
        });

        // Long-term goals
        this.y += 20;
        this.doc.fontSize(14)
           .fillColor(this.colors.info)
           .text('Long-term Health Goals:', this.pageMargin, this.y);
        
        this.y += 25;

        recommendations.slice(3).forEach((rec, index) => {
            this.checkPageBreak(30);
            this.doc.fontSize(11)
               .fillColor(this.colors.dark)
               .text(`${index + 1}. ${rec}`, this.pageMargin + 20, this.y);
            this.y += 20;
        });
    }

    async generateCharts(assessmentData, analysisResult) {
        this.addNewPage();
        
        this.doc.fontSize(18)
           .fillColor(this.colors.dark)
           .text('Visual Analysis', this.pageMargin, this.y);
        
        this.y += 40;

        // Health metrics chart (placeholder)
        this.generateSimpleChart('Health Metrics Overview', [
            { label: 'Physical Health', value: 85, color: this.colors.success },
            { label: 'Mental Health', value: 78, color: this.colors.info },
            { label: 'Lifestyle', value: 72, color: this.colors.warning },
            { label: 'Risk Factors', value: 20, color: this.colors.danger }
        ]);

        this.y += 200;

        // Progress indicators
        this.generateProgressBars(analysisResult);
    }

    generateSimpleChart(title, data) {
        this.doc.fontSize(14)
           .fillColor(this.colors.dark)
           .text(title, this.pageMargin, this.y);
        
        this.y += 30;

        const chartWidth = 400;
        const chartHeight = 150;
        const barHeight = 25;
        const maxValue = 100;

        data.forEach((item, index) => {
            const barY = this.y + (index * 35);
            const barWidth = (item.value / maxValue) * chartWidth;
            
            // Background bar
            this.doc.rect(this.pageMargin + 150, barY, chartWidth, barHeight)
               .fillAndStroke('#f0f0f0', '#e0e0e0');
            
            // Value bar
            this.doc.rect(this.pageMargin + 150, barY, barWidth, barHeight)
               .fillAndStroke(item.color, item.color);
            
            // Label
            this.doc.fontSize(10)
               .fillColor(this.colors.dark)
               .text(item.label, this.pageMargin, barY + 8);
            
            // Value
            this.doc.text(`${item.value}%`, this.pageMargin + 150 + chartWidth + 10, barY + 8);
        });
    }

    generateProgressBars(analysisResult) {
        const metrics = [
            { name: 'Overall Health Score', value: 82 },
            { name: 'Risk Assessment', value: 25 },
            { name: 'Lifestyle Rating', value: 75 },
            { name: 'Follow-up Priority', value: 60 }
        ];

        this.doc.fontSize(14)
           .fillColor(this.colors.dark)
           .text('Progress Indicators', this.pageMargin, this.y);
        
        this.y += 30;

        metrics.forEach((metric, index) => {
            const barY = this.y + (index * 40);
            const barWidth = 300;
            const progressWidth = (metric.value / 100) * barWidth;
            
            this.doc.fontSize(11)
               .fillColor(this.colors.dark)
               .text(metric.name, this.pageMargin, barY);
            
            // Progress background
            this.doc.rect(this.pageMargin, barY + 15, barWidth, 10)
               .fillAndStroke('#e0e0e0', '#e0e0e0');
            
            // Progress fill
            const color = metric.value > 70 ? this.colors.success :
                         metric.value > 40 ? this.colors.warning : this.colors.danger;
            
            this.doc.rect(this.pageMargin, barY + 15, progressWidth, 10)
               .fillAndStroke(color, color);
            
            // Percentage
            this.doc.text(`${metric.value}%`, this.pageMargin + barWidth + 20, barY + 12);
        });
    }

    async generateDisclaimer() {
        this.addNewPage();
        
        this.doc.fontSize(18)
           .fillColor(this.colors.danger)
           .text('Important Medical Disclaimer', this.pageMargin, this.y);
        
        this.y += 40;

        const disclaimerText = `
This health assessment report is generated by MediCare+ AI Health System and is intended for informational and educational purposes only. This report should NOT be used as a substitute for professional medical advice, diagnosis, or treatment.

IMPORTANT DISCLAIMERS:

• This assessment is not a medical diagnosis and should not be treated as such
• Always consult with qualified healthcare professionals for medical advice
• The AI system provides general health information based on the responses provided
• Individual health conditions may vary and require personalized medical attention
• In case of medical emergencies, contact emergency services immediately
• This report does not replace regular medical checkups and professional healthcare

LIMITATIONS:

• The assessment is based solely on user-provided information
• AI analysis may not capture all health nuances
• Results are probabilistic and not definitive medical conclusions
• Individual circumstances may affect the accuracy of recommendations

Please share this report with your healthcare provider for professional medical interpretation and guidance.

For medical emergencies in Sri Lanka:
Emergency Services: 1990
Ambulance Service: 110

MediCare+ AI Health System
Generated on ${new Date().toLocaleDateString()}
Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
        `;

        this.doc.fontSize(10)
           .fillColor(this.colors.dark)
           .text(disclaimerText.trim(), this.pageMargin, this.y, {
               width: this.doc.page.width - (this.pageMargin * 2),
               align: 'left',
               lineGap: 5
           });
    }

    async generateFooter() {
        const footerY = this.doc.page.height - 50;
        
        this.doc.fontSize(8)
           .fillColor(this.colors.secondary)
           .text('MediCare+ AI Health System - Confidential Health Report', 
                 this.pageMargin, footerY, { align: 'center' });
        
        this.doc.text(`Page ${this.doc.page.count}`, 
                     this.doc.page.width - this.pageMargin - 50, footerY);
    }

    checkPageBreak(requiredHeight) {
        if (this.y + requiredHeight > this.doc.page.height - 100) {
            this.addNewPage();
        }
    }

    addNewPage() {
        this.doc.addPage();
        this.y = this.pageMargin + 20;
    }

    // Static method to generate PDF for assessment
    static async generateAssessmentReport(assessmentData, responses, analysisResult) {
        const pdfService = new EnhancedPDFService();
        return await pdfService.generateAssessmentPDF(assessmentData, responses, analysisResult);
    }
}

module.exports = EnhancedPDFService; 