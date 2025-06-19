/**
 * 🏥 Health Document AI Service
 * Inspired by Doctor Dok - Advanced medical document processing and AI analysis
 * 
 * Features:
 * - Medical document OCR and parsing
 * - Structured JSON health data extraction
 * - Multi-modal health record processing
 * - AI-powered medical insights
 * - FHIR compliance
 * - PII removal and security
 */

const Tesseract = require('tesseract.js');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

class HealthDocumentAI {
    constructor() {
        this.supportedFormats = ['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'bmp'];
        this.medicalTerms = this.initializeMedicalTerms();
        this.fhirTemplates = this.initializeFHIRTemplates();
        this.processingQueue = [];
        this.cache = new Map();
        
        // DeepSeek API configuration for medical analysis
        this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || 'sk-b8184eae23dc4da58b48abf95892d4c0';
        this.deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        console.log('🏥 Health Document AI Service initialized');
    }

    // ==================== DOCUMENT PROCESSING ====================

    async processHealthDocument(filePath, documentType = 'unknown') {
        try {
            console.log(`📄 Processing health document: ${documentType}`);
            
            const fileExtension = path.extname(filePath).toLowerCase().substring(1);
            
            if (!this.supportedFormats.includes(fileExtension)) {
                throw new Error(`Unsupported file format: ${fileExtension}`);
            }

            // Step 1: OCR the document
            const ocrResult = await this.performOCR(filePath);
            
            // Step 2: Parse medical content
            const parsedData = await this.parseMedicalContent(ocrResult.text, documentType);
            
            // Step 3: Structure as FHIR-compliant JSON
            const structuredData = await this.convertToFHIR(parsedData, documentType);
            
            // Step 4: AI-powered analysis and insights
            const aiAnalysis = await this.generateMedicalInsights(structuredData);
            
            // Step 5: Remove PII if requested
            const sanitizedData = await this.removePII(structuredData);
            
            return {
                success: true,
                originalText: ocrResult.text,
                confidence: ocrResult.confidence,
                parsedData,
                structuredData,
                sanitizedData,
                aiAnalysis,
                processingTime: Date.now(),
                documentType,
                metadata: {
                    fileSize: await this.getFileSize(filePath),
                    processingDate: new Date().toISOString(),
                    language: 'en', // TODO: Add language detection
                    piiRemoved: true
                }
            };
            
        } catch (error) {
            console.error('❌ Document processing error:', error);
            return {
                success: false,
                error: error.message,
                fallback: await this.getFallbackAnalysis(documentType)
            };
        }
    }

    async performOCR(filePath) {
        try {
            console.log('🔍 Performing OCR...');
            
            // Preprocess image for better OCR
            const processedImagePath = await this.preprocessImage(filePath);
            
            const { data: { text, confidence } } = await Tesseract.recognize(
                processedImagePath,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                        }
                    }
                }
            );

            return {
                text: text.trim(),
                confidence: Math.round(confidence)
            };
            
        } catch (error) {
            console.error('❌ OCR error:', error);
            throw new Error(`OCR failed: ${error.message}`);
        }
    }

    async preprocessImage(filePath) {
        try {
            const outputPath = filePath.replace(/\.[^/.]+$/, '_processed.png');
            
            await sharp(filePath)
                .resize(2000, 2000, { 
                    fit: 'inside',
                    withoutEnlargement: true 
                })
                .grayscale()
                .normalize()
                .sharpen()
                .png({ quality: 90 })
                .toFile(outputPath);
                
            return outputPath;
            
        } catch (error) {
            console.warn('⚠️ Image preprocessing failed, using original:', error);
            return filePath;
        }
    }

    // ==================== MEDICAL CONTENT PARSING ====================

    async parseMedicalContent(text, documentType) {
        try {
            console.log('🧠 Parsing medical content with AI...');
            
            const prompt = this.buildMedicalParsingPrompt(text, documentType);
            const aiResponse = await this.callDeepSeekAPI(prompt);
            
            return JSON.parse(aiResponse);
            
        } catch (error) {
            console.error('❌ Medical parsing error:', error);
            return this.getFallbackParsing(text, documentType);
        }
    }

    buildMedicalParsingPrompt(text, documentType) {
        return `
You are a medical AI specialized in parsing health documents. Extract structured data from this ${documentType} document.

DOCUMENT TEXT:
${text}

Extract the following information in JSON format:
{
  "patientInfo": {
    "name": "string or null",
    "dateOfBirth": "YYYY-MM-DD or null",
    "patientId": "string or null",
    "gender": "string or null"
  },
  "documentInfo": {
    "documentType": "${documentType}",
    "documentDate": "YYYY-MM-DD or null",
    "facility": "string or null",
    "provider": "string or null"
  },
  "medicalData": {
    "vitalSigns": {
      "bloodPressure": "string or null",
      "heartRate": "number or null",
      "temperature": "number or null",
      "respiratoryRate": "number or null",
      "oxygenSaturation": "number or null",
      "weight": "number or null",
      "height": "number or null"
    },
    "labResults": [
      {
        "testName": "string",
        "result": "string",
        "normalRange": "string",
        "unit": "string",
        "flagged": "boolean"
      }
    ],
    "medications": [
      {
        "medication": "string",
        "dosage": "string",
        "frequency": "string",
        "duration": "string"
      }
    ],
    "diagnoses": [
      {
        "condition": "string",
        "icd10Code": "string or null",
        "severity": "string or null"
      }
    ],
    "procedures": [
      {
        "procedure": "string",
        "cptCode": "string or null",
        "date": "YYYY-MM-DD or null"
      }
    ],
    "findings": [
      {
        "category": "string",
        "finding": "string",
        "significance": "normal|abnormal|critical"
      }
    ]
  },
  "recommendations": [
    {
      "type": "follow-up|medication|lifestyle|test",
      "recommendation": "string",
      "priority": "low|medium|high|urgent"
    }
  ],
  "keyInsights": [
    {
      "insight": "string",
      "category": "risk|improvement|concern|normal",
      "confidence": 0.0-1.0
    }
  ]
}

Return only valid JSON. If information is not available, use null values.
`;
    }

    // ==================== FHIR CONVERSION ====================

    async convertToFHIR(parsedData, documentType) {
        try {
            console.log('🔄 Converting to FHIR format...');
            
            const fhirBundle = {
                resourceType: "Bundle",
                id: this.generateId(),
                type: "document",
                timestamp: new Date().toISOString(),
                entry: []
            };

            // Add Patient resource
            if (parsedData.patientInfo) {
                fhirBundle.entry.push({
                    resource: this.createPatientResource(parsedData.patientInfo)
                });
            }

            // Add Observation resources for lab results
            if (parsedData.medicalData?.labResults) {
                parsedData.medicalData.labResults.forEach(lab => {
                    fhirBundle.entry.push({
                        resource: this.createObservationResource(lab)
                    });
                });
            }

            // Add MedicationStatement resources
            if (parsedData.medicalData?.medications) {
                parsedData.medicalData.medications.forEach(med => {
                    fhirBundle.entry.push({
                        resource: this.createMedicationResource(med)
                    });
                });
            }

            // Add Condition resources for diagnoses
            if (parsedData.medicalData?.diagnoses) {
                parsedData.medicalData.diagnoses.forEach(diagnosis => {
                    fhirBundle.entry.push({
                        resource: this.createConditionResource(diagnosis)
                    });
                });
            }

            return fhirBundle;
            
        } catch (error) {
            console.error('❌ FHIR conversion error:', error);
            return parsedData; // Return original if FHIR conversion fails
        }
    }

    createPatientResource(patientInfo) {
        return {
            resourceType: "Patient",
            id: this.generateId(),
            name: patientInfo.name ? [{
                text: patientInfo.name
            }] : undefined,
            birthDate: patientInfo.dateOfBirth,
            gender: patientInfo.gender?.toLowerCase(),
            identifier: patientInfo.patientId ? [{
                value: patientInfo.patientId
            }] : undefined
        };
    }

    createObservationResource(labResult) {
        return {
            resourceType: "Observation",
            id: this.generateId(),
            status: "final",
            code: {
                text: labResult.testName
            },
            valueString: `${labResult.result} ${labResult.unit || ''}`.trim(),
            referenceRange: labResult.normalRange ? [{
                text: labResult.normalRange
            }] : undefined,
            interpretation: labResult.flagged ? [{
                coding: [{
                    code: "A",
                    display: "Abnormal"
                }]
            }] : undefined
        };
    }

    createMedicationResource(medication) {
        return {
            resourceType: "MedicationStatement",
            id: this.generateId(),
            status: "active",
            medicationCodeableConcept: {
                text: medication.medication
            },
            dosage: [{
                text: `${medication.dosage} ${medication.frequency}`.trim()
            }]
        };
    }

    createConditionResource(diagnosis) {
        return {
            resourceType: "Condition",
            id: this.generateId(),
            code: {
                text: diagnosis.condition,
                coding: diagnosis.icd10Code ? [{
                    system: "http://hl7.org/fhir/sid/icd-10",
                    code: diagnosis.icd10Code
                }] : undefined
            },
            severity: diagnosis.severity ? {
                text: diagnosis.severity
            } : undefined
        };
    }

    // ==================== AI MEDICAL INSIGHTS ====================

    async generateMedicalInsights(structuredData) {
        try {
            console.log('🤖 Generating AI medical insights...');
            
            const prompt = this.buildInsightsPrompt(structuredData);
            const aiResponse = await this.callDeepSeekAPI(prompt);
            
            return JSON.parse(aiResponse);
            
        } catch (error) {
            console.error('❌ AI insights error:', error);
            return this.getFallbackInsights(structuredData);
        }
    }

    buildInsightsPrompt(data) {
        return `
Analyze this medical data and provide comprehensive insights as a medical AI assistant.

MEDICAL DATA:
${JSON.stringify(data, null, 2)}

Provide analysis in this JSON format:
{
  "overallAssessment": {
    "summary": "Brief overall health assessment",
    "riskLevel": "low|moderate|high|critical",
    "confidence": 0.0-1.0
  },
  "keyFindings": [
    {
      "category": "lab|vital|medication|diagnosis",
      "finding": "Specific finding",
      "significance": "normal|concerning|critical",
      "explanation": "What this means for the patient"
    }
  ],
  "riskFactors": [
    {
      "factor": "Risk factor identified",
      "severity": "low|moderate|high",
      "recommendations": ["List of recommendations"]
    }
  ],
  "trends": [
    {
      "parameter": "What parameter",
      "trend": "improving|stable|declining",
      "timeframe": "Recent change timeframe",
      "significance": "Clinical significance"
    }
  ],
  "actionItems": [
    {
      "action": "Recommended action",
      "priority": "low|medium|high|urgent",
      "timeframe": "When to complete",
      "reason": "Why this is important"
    }
  ],
  "followUpRecommendations": [
    {
      "type": "appointment|test|monitoring|lifestyle",
      "recommendation": "Specific recommendation",
      "timeframe": "When to do it",
      "reason": "Why it's needed"
    }
  ],
  "drugInteractions": [
    {
      "medications": ["List of interacting medications"],
      "severity": "minor|moderate|major",
      "effect": "Description of interaction",
      "recommendation": "What to do about it"
    }
  ],
  "lifestyle": [
    {
      "category": "diet|exercise|sleep|stress",
      "current": "Current status based on data",
      "recommendation": "Specific lifestyle advice",
      "impact": "Expected health impact"
    }
  ]
}

IMPORTANT: 
- Be conservative in assessments
- Always recommend consulting healthcare providers
- Focus on factual analysis, not diagnoses
- Highlight urgent issues clearly
`;
    }

    // ==================== PII REMOVAL ====================

    async removePII(data) {
        try {
            console.log('🔒 Removing PII from medical data...');
            
            const piiFields = ['name', 'patientId', 'address', 'phone', 'email', 'ssn'];
            const sanitized = JSON.parse(JSON.stringify(data));
            
            // Recursively remove PII
            this.recursivelyRemovePII(sanitized, piiFields);
            
            return sanitized;
            
        } catch (error) {
            console.error('❌ PII removal error:', error);
            return data; // Return original if sanitization fails
        }
    }

    recursivelyRemovePII(obj, piiFields) {
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                if (piiFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
                    obj[key] = '[REDACTED]';
                } else if (typeof obj[key] === 'object') {
                    this.recursivelyRemovePII(obj[key], piiFields);
                }
            });
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    async callDeepSeekAPI(prompt) {
        try {
            const response = await axios.post(this.deepseekApiUrl, {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a medical AI assistant specializing in health document analysis. Always respond with valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 4000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.deepseekApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
            
        } catch (error) {
            console.error('❌ DeepSeek API error:', error);
            throw error;
        }
    }

    initializeMedicalTerms() {
        return {
            vitalSigns: ['bp', 'blood pressure', 'heart rate', 'hr', 'temperature', 'temp', 'respiratory rate', 'rr', 'oxygen saturation', 'spo2'],
            labTests: ['glucose', 'cholesterol', 'hdl', 'ldl', 'triglycerides', 'hba1c', 'creatinine', 'bun', 'alt', 'ast'],
            medications: ['mg', 'ml', 'tablets', 'capsules', 'daily', 'twice daily', 'bid', 'tid', 'qid'],
            conditions: ['diabetes', 'hypertension', 'copd', 'asthma', 'depression', 'anxiety', 'arthritis']
        };
    }

    initializeFHIRTemplates() {
        return {
            observation: {
                resourceType: "Observation",
                status: "final"
            },
            patient: {
                resourceType: "Patient"
            },
            condition: {
                resourceType: "Condition"
            }
        };
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    async getFileSize(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch {
            return 0;
        }
    }

    getFallbackParsing(text, documentType) {
        return {
            documentType,
            extractedText: text,
            confidence: 0.5,
            parsed: false,
            fallback: true,
            message: 'AI parsing failed, returning raw text'
        };
    }

    getFallbackInsights(data) {
        return {
            overallAssessment: {
                summary: 'Unable to generate AI insights',
                riskLevel: 'unknown',
                confidence: 0.0
            },
            keyFindings: [],
            actionItems: [{
                action: 'Review document manually',
                priority: 'medium',
                timeframe: 'Soon',
                reason: 'AI analysis unavailable'
            }],
            fallback: true
        };
    }

    async getFallbackAnalysis(documentType) {
        return {
            documentType,
            processed: false,
            error: 'Document processing failed',
            recommendations: [
                'Try uploading a clearer image',
                'Ensure document is in supported format',
                'Check if document contains readable text'
            ]
        };
    }

    // ==================== BATCH PROCESSING ====================

    async processBatchDocuments(documents) {
        console.log(`📚 Processing batch of ${documents.length} documents...`);
        
        const results = [];
        for (const doc of documents) {
            try {
                const result = await this.processHealthDocument(doc.filePath, doc.type);
                results.push({
                    ...result,
                    originalFileName: doc.fileName
                });
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    originalFileName: doc.fileName
                });
            }
        }
        
        return {
            success: true,
            totalProcessed: documents.length,
            successCount: results.filter(r => r.success).length,
            results
        };
    }

    // ==================== HEALTH TIMELINE ====================

    generateHealthTimeline(processedDocuments) {
        console.log('📅 Generating health timeline...');
        
        const timeline = processedDocuments
            .filter(doc => doc.success && doc.structuredData)
            .map(doc => ({
                date: doc.parsedData?.documentInfo?.documentDate || doc.processingTime,
                type: doc.documentType,
                summary: this.generateDocumentSummary(doc.parsedData),
                data: doc.structuredData
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            timeline,
            totalEvents: timeline.length,
            dateRange: {
                earliest: timeline[0]?.date,
                latest: timeline[timeline.length - 1]?.date
            }
        };
    }

    generateDocumentSummary(parsedData) {
        if (!parsedData?.medicalData) return 'Medical document processed';
        
        const summaryParts = [];
        
        if (parsedData.medicalData.vitalSigns) {
            summaryParts.push('Vital signs recorded');
        }
        if (parsedData.medicalData.labResults?.length) {
            summaryParts.push(`${parsedData.medicalData.labResults.length} lab results`);
        }
        if (parsedData.medicalData.diagnoses?.length) {
            summaryParts.push(`${parsedData.medicalData.diagnoses.length} diagnoses`);
        }
        
        return summaryParts.join(', ') || 'Medical document processed';
    }
}

module.exports = HealthDocumentAI; 