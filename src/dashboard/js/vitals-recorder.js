// =====================================================
// 💓 VITALS RECORDER COMPONENT
// =====================================================

function initializeVitalsRecorder() {
    const container = document.getElementById('vitals-recorder');
    
    container.innerHTML = `
        <div class="vitals-recorder">
            <div class="vitals-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="vital-field" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
                    <div class="vital-icon" style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #dc3545, #c82333); display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-weight: 600; color: #212529; margin-bottom: 0.25rem; font-size: 0.8rem;">Systolic BP</label>
                        <input type="number" id="systolic" placeholder="120" style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 0.9rem;">
                    </div>
                </div>
                
                <div class="vital-field" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
                    <div class="vital-icon" style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #dc3545, #c82333); display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-weight: 600; color: #212529; margin-bottom: 0.25rem; font-size: 0.8rem;">Diastolic BP</label>
                        <input type="number" id="diastolic" placeholder="80" style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 0.9rem;">
                    </div>
                </div>
                
                <div class="vital-field" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
                    <div class="vital-icon" style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #e74c3c, #c0392b); display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-weight: 600; color: #212529; margin-bottom: 0.25rem; font-size: 0.8rem;">Heart Rate</label>
                        <input type="number" id="heartRate" placeholder="72" style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 0.9rem;">
                    </div>
                </div>
                
                <div class="vital-field" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
                    <div class="vital-icon" style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #3498db, #2980b9); display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-weight"></i>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-weight: 600; color: #212529; margin-bottom: 0.25rem; font-size: 0.8rem;">Weight (kg)</label>
                        <input type="number" id="weight" placeholder="70" step="0.1" style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 0.9rem;">
                    </div>
                </div>
            </div>
            
            <button 
                onclick="recordVitalSigns()"
                style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; transition: all 0.3s ease;"
            >
                <i class="fas fa-save"></i> Record Vital Signs
            </button>
            
            <div id="vitals-result" style="margin-top: 1rem;"></div>
        </div>
    `;
}

async function recordVitalSigns() {
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;
    const heartRate = document.getElementById('heartRate').value;
    const weight = document.getElementById('weight').value;
    const resultContainer = document.getElementById('vitals-result');
    
    // Validate input
    if (!systolic && !diastolic && !heartRate && !weight) {
        showToast('Please enter at least one vital sign', 'warning');
        return;
    }
    
    try {
        // Prepare vital signs data
        const vitalData = {
            user_id: currentUser.id,
            blood_pressure_systolic: systolic ? parseInt(systolic) : null,
            blood_pressure_diastolic: diastolic ? parseInt(diastolic) : null,
            heart_rate: heartRate ? parseInt(heartRate) : null,
            weight: weight ? parseFloat(weight) : null,
            recorded_at: new Date().toISOString()
        };
        
        // Save to database
        const { data, error } = await supabase
            .from('vital_signs')
            .insert([vitalData]);
            
        if (error) throw error;
        
        // Clear form
        document.getElementById('systolic').value = '';
        document.getElementById('diastolic').value = '';
        document.getElementById('heartRate').value = '';
        document.getElementById('weight').value = '';
        
        // Show success message
        resultContainer.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 10px; border-left: 4px solid #28a745; display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-check-circle"></i>
                <span>Vital signs recorded successfully!</span>
            </div>
        `;
        
        // Refresh dashboard data
        await loadDashboardData();
        
        showToast('Vital signs recorded successfully!', 'success');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            resultContainer.innerHTML = '';
        }, 3000);
        
    } catch (error) {
        console.error('Failed to record vital signs:', error);
        
        resultContainer.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 10px; border-left: 4px solid #dc3545; display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-exclamation-circle"></i>
                <span>Failed to record vital signs. Please try again.</span>
            </div>
        `;
        
        showToast('Failed to record vital signs', 'error');
    }
}

// Medication taking function
async function takeMedication(medicationId) {
    try {
        // Record medication log
        const { data, error } = await supabase
            .from('medication_logs')
            .insert([{
                user_id: currentUser.id,
                medication_id: medicationId,
                taken_at: new Date().toISOString(),
                was_on_time: true
            }]);
            
        if (error) throw error;
        
        showToast('Medication marked as taken!', 'success');
        
        // Refresh medications display
        await loadDashboardData();
        
    } catch (error) {
        console.error('Failed to record medication:', error);
        showToast('Failed to record medication', 'error');
    }
}

// Generate health insights function
async function generateHealthInsights() {
    try {
        showLoading(true);
        
        // Analyze recent vital signs and generate insights
        const recentVitals = dashboardData.vitalSigns.slice(0, 7);
        const medications = dashboardData.medications;
        
        let insights = [];
        
        // Blood pressure analysis
        if (recentVitals.length > 0) {
            const avgSystolic = recentVitals.reduce((sum, v) => sum + (v.blood_pressure_systolic || 0), 0) / recentVitals.length;
            const avgDiastolic = recentVitals.reduce((sum, v) => sum + (v.blood_pressure_diastolic || 0), 0) / recentVitals.length;
            
            if (avgSystolic > 140 || avgDiastolic > 90) {
                insights.push({
                    title: 'Elevated Blood Pressure Detected',
                    description: `Your average blood pressure over the last week is ${Math.round(avgSystolic)}/${Math.round(avgDiastolic)} mmHg, which is above normal range.`,
                    recommendation: 'Consider consulting your healthcare provider. Monitor your sodium intake, exercise regularly, and manage stress levels.'
                });
            } else if (avgSystolic > 0 && avgDiastolic > 0) {
                insights.push({
                    title: 'Blood Pressure Within Normal Range',
                    description: `Your average blood pressure is ${Math.round(avgSystolic)}/${Math.round(avgDiastolic)} mmHg, which is within healthy limits.`,
                    recommendation: 'Continue your current lifestyle habits. Regular monitoring is recommended to maintain good cardiovascular health.'
                });
            }
        }
        
        // Medication adherence
        if (medications.length > 0) {
            insights.push({
                title: 'Medication Management',
                description: `You currently have ${medications.length} active medications in your regimen.`,
                recommendation: 'Continue taking medications as prescribed. Set up reminders to ensure consistent adherence and better health outcomes.'
            });
        }
        
        // Save insights to database
        for (const insight of insights) {
            await supabase
                .from('ai_insights')
                .insert([{
                    user_id: currentUser.id,
                    title: insight.title,
                    description: insight.description,
                    recommendation: insight.recommendation,
                    status: 'new'
                }]);
        }
        
        // Refresh dashboard
        await loadDashboardData();
        
        showToast('Health insights generated successfully!', 'success');
        
    } catch (error) {
        console.error('Failed to generate insights:', error);
        showToast('Failed to generate insights', 'error');
    } finally {
        showLoading(false);
    }
} 