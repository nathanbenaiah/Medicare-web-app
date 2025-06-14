/**
 * Enhanced Supabase MCP Backend Integration
 * Provides comprehensive interface for healthcare data management with DeepSeek AI
 */

class SupabaseMCPBackend {
    constructor() {
        // Supabase configuration - Update these with your actual credentials
        this.supabaseUrl = 'https://your-project-id.supabase.co';
        this.supabaseKey = 'your-supabase-anon-key';
        this.projectId = 'your-project-id';
        
        this.supabase = null;
        this.eventListeners = new Map();
        this.isInitialized = false;
        this.isDemo = false;
    }

    async initialize() {
        try {
            // Check if Supabase is available
            if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
                // Try to initialize with real Supabase
                this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
                
                // Test connection
                const { data, error } = await this.supabase.from('user_profiles').select('count').limit(1);
                
                if (error && error.code === 'PGRST116') {
                    console.warn('⚠️ Supabase tables not found, using demo mode');
                    this.isDemo = true;
                } else if (error) {
                    console.warn('⚠️ Supabase connection failed, using demo mode:', error.message);
                    this.isDemo = true;
                } else {
                    console.log('✅ Supabase MCP Backend connected successfully');
                }
                
                this.isInitialized = true;
                return true;
            } else {
                console.warn('⚠️ Supabase library not available, using demo mode');
                this.isDemo = true;
                this.isInitialized = true;
                return true;
            }
        } catch (error) {
            console.error('❌ Supabase MCP Backend initialization failed:', error);
            this.isDemo = true;
            this.isInitialized = true;
            return true; // Still return true to allow demo mode
        }
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Event callback error:', error);
                }
            });
        }
    }

    // Demo data for when Supabase is not available
    getDemoData(table) {
        const demoData = {
            user_profiles: [
                {
                    id: 'demo-user-123',
                    user_id: 'demo-user-123',
                    email: 'john.smith@email.com',
                    full_name: 'John Smith',
                    phone_number: '+1 (555) 123-4567',
                    bio: 'Healthcare enthusiast',
                    address: '123 Main St, City, State 12345',
                    occupation: 'Software Engineer',
                    height_cm: 175,
                    weight_kg: 70,
                    blood_type: 'O+',
                    created_at: new Date().toISOString()
                }
            ],
            appointments: [
                {
                    id: 'apt-1',
                    user_id: 'demo-user-123',
                    provider_id: 'provider-1',
                    provider_name: 'Dr. Sarah Johnson',
                    status: 'scheduled',
                    scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    notes: 'Regular checkup',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'apt-2',
                    user_id: 'demo-user-123',
                    provider_id: 'provider-2',
                    provider_name: 'Dr. Michael Chen',
                    status: 'scheduled',
                    scheduled_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    notes: 'Follow-up consultation',
                    created_at: new Date().toISOString()
                }
            ],
            medications: [
                {
                    id: 'med-1',
                    user_id: 'demo-user-123',
                    name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    medication_type: 'ACE Inhibitor',
                    notes: 'For blood pressure',
                    start_date: '2024-01-01',
                    is_active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'med-2',
                    user_id: 'demo-user-123',
                    name: 'Metformin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    medication_type: 'Antidiabetic',
                    notes: 'With meals',
                    start_date: '2024-01-15',
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            ],
            vital_signs: [
                {
                    id: 'vital-1',
                    user_id: 'demo-user-123',
                    blood_pressure_systolic: 120,
                    blood_pressure_diastolic: 80,
                    heart_rate: 72,
                    weight: 70.5,
                    temperature: 36.8,
                    recorded_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                },
                {
                    id: 'vital-2',
                    user_id: 'demo-user-123',
                    blood_pressure_systolic: 118,
                    blood_pressure_diastolic: 78,
                    heart_rate: 68,
                    weight: 70.2,
                    temperature: 36.6,
                    recorded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            ai_insights: [
                {
                    id: 'insight-1',
                    user_id: 'demo-user-123',
                    title: 'Blood Pressure Trend',
                    description: 'Your blood pressure has been stable within normal range',
                    recommendation: 'Continue current medication and lifestyle habits',
                    status: 'new',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'insight-2',
                    user_id: 'demo-user-123',
                    title: 'Medication Adherence',
                    description: 'Excellent medication compliance detected',
                    recommendation: 'Keep up the good work with medication timing',
                    status: 'new',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        };
        
        return demoData[table] || [];
    }

    // Enhanced query method with demo fallback
    async query(table, options = {}) {
        if (!this.isInitialized) {
            console.warn('Backend not initialized');
            return { data: [], error: 'Not initialized' };
        }

        // Use demo data if in demo mode
        if (this.isDemo) {
            console.log(`📊 Using demo data for table: ${table}`);
            let data = this.getDemoData(table);
            
            // Apply filters
            if (options.filter) {
                for (const [column, value] of Object.entries(options.filter)) {
                    data = data.filter(item => item[column] === value);
                }
            }
            
            // Apply limit
            if (options.limit) {
                data = data.slice(0, options.limit);
            }
            
            // Apply ordering
            if (options.order) {
                data.sort((a, b) => {
                    const aVal = a[options.order.column];
                    const bVal = b[options.order.column];
                    if (options.order.ascending) {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });
            }
            
            return { data, error: null };
        }

        // Use real Supabase
        try {
            let query = this.supabase.from(table);
            
            if (options.select) {
                query = query.select(options.select);
            }
            
            if (options.filter) {
                for (const [column, value] of Object.entries(options.filter)) {
                    query = query.eq(column, value);
                }
            }
            
            if (options.limit) {
                query = query.limit(options.limit);
            }
            
            if (options.order) {
                query = query.order(options.order.column, { ascending: options.order.ascending });
            }

            const { data, error } = await query;
            return { data, error };
        } catch (error) {
            console.error('Query failed:', error);
            return { data: null, error };
        }
    }

    async insert(table, data) {
        if (!this.isInitialized) {
            console.warn('Backend not initialized');
            return { data: null, error: 'Not initialized' };
        }

        if (this.isDemo) {
            console.log(`📝 Demo mode: Would insert into ${table}:`, data);
            const newRecord = {
                id: 'demo-' + Date.now(),
                ...data,
                created_at: new Date().toISOString()
            };
            this.emit(`${table}:inserted`, [newRecord]);
            return { data: [newRecord], error: null };
        }

        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .insert(data)
                .select();
            
            if (!error && result) {
                this.emit(`${table}:inserted`, result);
            }
            
            return { data: result, error };
        } catch (error) {
            console.error('Insert failed:', error);
            return { data: null, error };
        }
    }

    async update(table, id, data) {
        if (!this.isInitialized) {
            console.warn('Backend not initialized');
            return { data: null, error: 'Not initialized' };
        }

        if (this.isDemo) {
            console.log(`📝 Demo mode: Would update ${table} id ${id}:`, data);
            const updatedRecord = {
                id,
                ...data,
                updated_at: new Date().toISOString()
            };
            this.emit(`${table}:updated`, [updatedRecord]);
            return { data: [updatedRecord], error: null };
        }

        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select();
            
            if (!error && result) {
                this.emit(`${table}:updated`, result);
            }
            
            return { data: result, error };
        } catch (error) {
            console.error('Update failed:', error);
            return { data: null, error };
        }
    }

    async delete(table, id) {
        if (!this.isInitialized) {
            console.warn('Backend not initialized');
            return { data: null, error: 'Not initialized' };
        }

        if (this.isDemo) {
            console.log(`🗑️ Demo mode: Would delete from ${table} id ${id}`);
            this.emit(`${table}:deleted`, { id });
            return { data: null, error: null };
        }

        try {
            const { data, error } = await this.supabase
                .from(table)
                .delete()
                .eq('id', id);
            
            if (!error) {
                this.emit(`${table}:deleted`, { id });
            }
            
            return { data, error };
        } catch (error) {
            console.error('Delete failed:', error);
            return { data: null, error };
        }
    }

    // Real-time subscriptions
    subscribe(table, callback, filter = null) {
        if (this.isDemo) {
            console.log(`📡 Demo mode: Would subscribe to ${table}`);
            return { unsubscribe: () => console.log('Demo subscription unsubscribed') };
        }

        if (!this.supabase) {
            console.warn('Supabase not initialized for subscriptions');
            return { unsubscribe: () => {} };
        }

        try {
            let subscription = this.supabase
                .channel(`${table}_changes`)
                .on('postgres_changes', 
                    { 
                        event: '*', 
                        schema: 'public', 
                        table: table,
                        filter: filter 
                    }, 
                    callback
                )
                .subscribe();

            return subscription;
        } catch (error) {
            console.error('Subscription failed:', error);
            return { unsubscribe: () => {} };
        }
    }

    // Health check
    async healthCheck() {
        if (this.isDemo) {
            return {
                status: 'healthy',
                mode: 'demo',
                timestamp: new Date().toISOString()
            };
        }

        try {
            const { data, error } = await this.supabase.from('user_profiles').select('count').limit(1);
            return {
                status: error ? 'unhealthy' : 'healthy',
                mode: 'production',
                error: error?.message,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                mode: 'production',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    destroy() {
        this.eventListeners.clear();
        this.isInitialized = false;
        this.supabase = null;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.SupabaseMCPBackend = SupabaseMCPBackend;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseMCPBackend;
} 