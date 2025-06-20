// Enhanced PDF Generator for MediCare+ AI Health Assessments
// Professional medical report generation with open-source data integration

class EnhancedPDFGenerator {
    constructor() {
        this.assessmentData = null;
        this.loadAssessmentData();
    }

    async loadAssessmentData() {
        try {
            const response = await fetch('./js/assessment-data.json');
            this.assessmentData = await response.json();
        } catch (error) {
            console.error('Failed to load assessment data:', error);
            this.assessmentData = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            brandInfo: {
                logo: "🏥 MediCare+",
                title: "Professional Health Assessment Report",
                tagline: "An all-in-one AI-powered healthcare platform for Sri Lankans"
            },
            disclaimer: "By proceeding with this assessment, you acknowledge that you have read, understood, and agree to our AI Usage Policy, Privacy Policy, and Terms of Use.",
            copyright: "© 2024 MediCare+ Healthcare Platform. All rights reserved."
        };
    }

    async generateAssessmentPDF(assessmentType, responses, aiAnalysis) {
        return new Promise((resolve) => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Get current date and generate report ID
            const currentDate = new Date().toLocaleDateString('en-GB');
            const reportId = this.generateReportId();
            
            let yPosition = 20;
            
            // Header Section
            yPosition = this.addHeader(doc, currentDate, reportId, yPosition);
            
            // Assessment Title
            yPosition = this.addAssessmentTitle(doc, assessmentType, yPosition);
            
            // Patient Information
            yPosition = this.addPatientInfo(doc, responses, yPosition);
            
            // Assessment Date and Disclaimer
            yPosition = this.addDateAndDisclaimer(doc, currentDate, yPosition);
            
            // AI Analysis Results
            yPosition = this.addAnalysisResults(doc, assessmentType, aiAnalysis, yPosition);
            
            // Specific Recommendations based on assessment type
            yPosition = this.addSpecificRecommendations(doc, assessmentType, responses, yPosition);
            
            // Footer
            this.addFooter(doc);
            
            // Convert to blob and resolve
            const pdfBlob = doc.output('blob');
            resolve(pdfBlob);
        });
    }

    addHeader(doc, currentDate, reportId, yPosition) {
        const brandInfo = this.assessmentData?.brandInfo || this.getDefaultData().brandInfo;
        
        // Logo and Brand
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 123, 255); // Primary blue
        doc.text(brandInfo.logo, 20, yPosition);
        
        // Title
        doc.setFontSize(14);
        doc.setTextColor(108, 117, 125); // Secondary gray
        doc.text(brandInfo.title, 20, yPosition + 10);
        
        // Date and Report ID (right aligned)
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated: ${currentDate}`, 150, yPosition);
        doc.text(`Report ID: ${reportId}`, 150, yPosition + 8);
        
        // Horizontal line
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition + 18, 190, yPosition + 18);
        
        return yPosition + 30;
    }

    addAssessmentTitle(doc, assessmentType, yPosition) {
        const typeData = this.assessmentData?.assessmentTypes?.[assessmentType];
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        
        const title = typeData?.title || this.getAssessmentTitle(assessmentType);
        doc.text(title, 20, yPosition);
        
        if (typeData?.subtitle) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125);
            doc.text(typeData.subtitle, 20, yPosition + 10);
            yPosition += 10;
        }
        
        return yPosition + 20;
    }

    addPatientInfo(doc, responses, yPosition) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Information", 20, yPosition);
        
        // Create patient info box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPosition + 5, 170, 35, 'FD');
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        // Extract patient info from responses
        const patientInfo = this.extractPatientInfo(responses);
        
        let infoY = yPosition + 15;
        doc.text(`Name: ${patientInfo.name}`, 25, infoY);
        doc.text(`Age: ${patientInfo.age}`, 25, infoY + 8);
        doc.text(`Gender: ${patientInfo.gender}`, 25, infoY + 16);
        doc.text(`District: ${patientInfo.district}`, 100, infoY);
        doc.text(`Contact: ${patientInfo.contact}`, 100, infoY + 8);
        doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 100, infoY + 16);
        
        return yPosition + 50;
    }

    addDateAndDisclaimer(doc, currentDate, yPosition) {
        const disclaimer = this.assessmentData?.disclaimer || this.getDefaultData().disclaimer;
        
        // Disclaimer box
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(255, 193, 7); // Warning color
        
        const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
        const disclaimerHeight = disclaimerLines.length * 5 + 10;
        
        doc.setDrawColor(255, 193, 7);
        doc.setFillColor(255, 248, 225);
        doc.rect(20, yPosition, 170, disclaimerHeight, 'FD');
        
        doc.text(disclaimerLines, 25, yPosition + 8);
        
        return yPosition + disclaimerHeight + 15;
    }

    addAnalysisResults(doc, assessmentType, aiAnalysis, yPosition) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("AI Analysis Results", 20, yPosition);
        
        yPosition += 15;
        
        // Parse AI analysis
        const analysisData = this.parseAIAnalysis(aiAnalysis);
        
        // Add each section of analysis
        for (const section of analysisData) {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            yPosition = this.addAnalysisSection(doc, section, yPosition);
        }
        
        return yPosition + 10;
    }

    addSpecificRecommendations(doc, assessmentType, responses, yPosition) {
        const typeData = this.assessmentData?.assessmentTypes?.[assessmentType];
        if (!typeData) return yPosition;
        
        if (yPosition > 200) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 167, 69); // Success color
        doc.text("Personalized Recommendations", 20, yPosition);
        
        yPosition += 15;
        
        switch (assessmentType) {
            case 'diet-planner':
                yPosition = this.addDietRecommendations(doc, typeData, yPosition);
                break;
            case 'symptom-checker':
                yPosition = this.addSymptomRecommendations(doc, typeData, yPosition);
                break;
            case 'mental-health':
                yPosition = this.addMentalHealthRecommendations(doc, typeData, yPosition);
                break;
            case 'fitness-coach':
                yPosition = this.addFitnessRecommendations(doc, typeData, yPosition);
                break;
            default:
                yPosition = this.addGeneralRecommendations(doc, yPosition);
        }
        
        return yPosition;
    }

    addDietRecommendations(doc, typeData, yPosition) {
        // Sri Lankan Superfoods Section
        if (typeData.sriLankanSuperfoods) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 123, 255);
            doc.text("🌟 Recommended Sri Lankan Superfoods", 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            
            for (const food of typeData.sriLankanSuperfoods) {
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`• ${food.food}`, 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(`Benefits: ${food.benefits}`, 30, yPosition + 6);
                doc.text(`Serving: ${food.serving} (${food.calories} calories)`, 30, yPosition + 12);
                yPosition += 20;
            }
        }
        
        // Foods to Avoid
        if (typeData.avoidanceList) {
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(220, 53, 69); // Danger color
            doc.text("⚠️ Foods to Limit or Avoid", 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            
            for (const item of typeData.avoidanceList) {
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`• ${item.item}`, 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(`Reason: ${item.reason}`, 30, yPosition + 6);
                doc.text(`Alternative: ${item.alternatives}`, 30, yPosition + 12);
                yPosition += 20;
            }
        }
        
        // Timeline
        if (typeData.timeline) {
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 123, 255);
            doc.text("📅 Expected Timeline", 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            
            for (const [period, description] of Object.entries(typeData.timeline)) {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`${period.replace('_', '-')}: `, 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(description, 60, yPosition);
                yPosition += 8;
            }
        }
        
        return yPosition + 15;
    }

    addSymptomRecommendations(doc, typeData, yPosition) {
        // Risk levels
        if (typeData.riskLevels) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(220, 53, 69);
            doc.text("🚨 Risk Assessment Guidelines", 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            
            for (const [level, action] of Object.entries(typeData.riskLevels)) {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`${level.toUpperCase()}: `, 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(action, 60, yPosition);
                yPosition += 8;
            }
        }
        
        return yPosition + 15;
    }

    addMentalHealthRecommendations(doc, typeData, yPosition) {
        // Crisis support
        if (typeData.crisisSupport) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(220, 53, 69);
            doc.text("🆘 Crisis Support Resources", 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            
            for (const support of typeData.crisisSupport) {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`${support.service}: `, 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(`${support.number} (${support.availability})`, 80, yPosition);
                yPosition += 8;
            }
        }
        
        // Interventions
        if (typeData.interventions) {
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 123, 255);
            doc.text("💡 Recommended Interventions", 20, yPosition);
            yPosition += 10;
            
            for (const [timeframe, actions] of Object.entries(typeData.interventions)) {
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text(`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}:`, 25, yPosition);
                yPosition += 8;
                
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                
                for (const action of actions) {
                    doc.text(`• ${action}`, 30, yPosition);
                    yPosition += 6;
                }
                yPosition += 5;
            }
        }
        
        return yPosition + 15;
    }

    addFitnessRecommendations(doc, typeData, yPosition) {
        // Beginner plan
        if (typeData.beginnerPlan) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 167, 69);
            doc.text("🏃‍♂️ Beginner Fitness Plan", 20, yPosition);
            yPosition += 10;
            
            for (const [period, plan] of Object.entries(typeData.beginnerPlan)) {
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text(`${period.replace('_', '-')}:`, 25, yPosition);
                yPosition += 8;
                
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(`Frequency: ${plan.frequency}`, 30, yPosition);
                doc.text(`Duration: ${plan.duration}`, 30, yPosition + 6);
                doc.text(`Exercises: ${plan.exercises.join(', ')}`, 30, yPosition + 12);
                yPosition += 25;
            }
        }
        
        // Sri Lankan activities
        if (typeData.sriLankanActivities) {
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 123, 255);
            doc.text("🏝️ Local Activity Recommendations", 20, yPosition);
            yPosition += 10;
            
            for (const activity of typeData.sriLankanActivities) {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont("helvetica", "bold");
                doc.text(`• ${activity.activity}`, 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(`Location: ${activity.location}`, 30, yPosition + 6);
                doc.text(`Benefits: ${activity.benefits}`, 30, yPosition + 12);
                yPosition += 20;
            }
        }
        
        return yPosition + 15;
    }

    addGeneralRecommendations(doc, yPosition) {
        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125);
        doc.text("General health recommendations based on your assessment will be provided here.", 20, yPosition);
        return yPosition + 15;
    }

    addFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        const copyright = this.assessmentData?.copyright || this.getDefaultData().copyright;
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Footer line
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(20, 280, 190, 280);
            
            // Copyright and page number
            doc.setFontSize(8);
            doc.setTextColor(108, 117, 125);
            doc.text(copyright, 20, 285);
            doc.text(`Page ${i} of ${pageCount}`, 170, 285);
            
            // Generated by
            doc.text("Generated by MediCare+ AI Health Assistant", 20, 290);
        }
    }

    // Utility methods
    generateReportId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `MC-${timestamp}-${random}`;
    }

    extractPatientInfo(responses) {
        return {
            name: responses.find(r => r.question.includes('name'))?.answer || 'Not provided',
            age: responses.find(r => r.question.includes('age'))?.answer || 'Not provided',
            gender: responses.find(r => r.question.includes('gender'))?.answer || 'Not provided',
            district: responses.find(r => r.question.includes('district'))?.answer || 'Not provided',
            contact: responses.find(r => r.question.includes('contact'))?.answer || 'Not provided'
        };
    }

    parseAIAnalysis(aiAnalysis) {
        // Parse the AI analysis text into structured sections
        const sections = [];
        
        if (typeof aiAnalysis === 'string') {
            const lines = aiAnalysis.split('\n').filter(line => line.trim());
            let currentSection = null;
            
            for (const line of lines) {
                if (line.startsWith('##') || line.startsWith('**') && line.endsWith('**')) {
                    // New section header
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        title: line.replace(/[#*]/g, '').trim(),
                        content: []
                    };
                } else if (currentSection) {
                    currentSection.content.push(line.trim());
                }
            }
            
            if (currentSection) {
                sections.push(currentSection);
            }
        }
        
        return sections.length > 0 ? sections : [{ title: 'Analysis Results', content: [aiAnalysis] }];
    }

    addAnalysisSection(doc, section, yPosition) {
        // Section title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 123, 255);
        doc.text(section.title, 20, yPosition);
        yPosition += 10;
        
        // Section content
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        for (const contentLine of section.content) {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            const lines = doc.splitTextToSize(contentLine, 170);
            for (const line of lines) {
                doc.text(line, 25, yPosition);
                yPosition += 6;
            }
            yPosition += 3;
        }
        
        return yPosition + 10;
    }

    getAssessmentTitle(assessmentType) {
        const titles = {
            'symptom-checker': 'AI Symptom Analysis Report',
            'diet-planner': 'Personalized Diet Plan Report',
            'mental-health': 'Mental Health Assessment Report',
            'fitness-coach': 'Personalized Fitness Plan Report',
            'sleep-analyzer': 'Sleep Quality Analysis Report',
            'medicine-advisor': 'Medication Advisory Report',
            'chronic-disease': 'Chronic Disease Management Report',
            'womens-health': 'Women\'s Health Assessment Report',
            'pediatric-health': 'Pediatric Health Assessment Report',
            'senior-health': 'Senior Health Assessment Report',
            'preventive-screening': 'Preventive Health Screening Report',
            'addiction-recovery': 'Addiction Recovery Support Report'
        };
        
        return titles[assessmentType] || 'Health Assessment Report';
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EnhancedPDFGenerator = EnhancedPDFGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedPDFGenerator;
} 