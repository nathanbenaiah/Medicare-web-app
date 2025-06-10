// Form templates
const reminderFormTemplate = `
    <div class="form-group">
        <label for="title">Medication Name</label>
        <input type="text" id="title" name="title" required>
    </div>
    <div class="form-group">
        <label for="dosage">Dosage</label>
        <input type="text" id="dosage" name="dosage" required>
    </div>
    <div class="form-group">
        <label for="frequency">Frequency</label>
        <select id="frequency" name="frequency" required onchange="toggleFrequencyOptions(this.value)">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
        </select>
    </div>
    <div class="form-group" id="timeGroup">
        <label for="time">Time</label>
        <input type="time" id="time" name="time" required>
        <button type="button" class="btn-add" onclick="addTimeField()">
            <i class="bx bx-plus"></i> Add Time
        </button>
    </div>
    <div class="form-group" id="daysGroup" style="display: none;">
        <label>Days of Week</label>
        <div class="checkbox-group">
            <label><input type="checkbox" name="days" value="0"> Sunday</label>
            <label><input type="checkbox" name="days" value="1"> Monday</label>
            <label><input type="checkbox" name="days" value="2"> Tuesday</label>
            <label><input type="checkbox" name="days" value="3"> Wednesday</label>
            <label><input type="checkbox" name="days" value="4"> Thursday</label>
            <label><input type="checkbox" name="days" value="5"> Friday</label>
            <label><input type="checkbox" name="days" value="6"> Saturday</label>
        </div>
    </div>
    <div class="form-group">
        <label for="instructions">Instructions</label>
        <textarea id="instructions" name="instructions" rows="3"></textarea>
    </div>
    <div class="form-group">
        <label for="refillDate">Refill Date</label>
        <input type="date" id="refillDate" name="refillDate">
    </div>
    <div class="form-group">
        <label for="familyMember">For Family Member</label>
        <select id="familyMember" name="familyMember">
            <option value="">Myself</option>
            <!-- Family members will be populated dynamically -->
        </select>
    </div>
    <div class="form-group">
        <label>Notification Preferences</label>
        <div class="checkbox-group">
            <label>
                <input type="checkbox" name="notificationTypes" value="email" checked>
                Email Notifications
            </label>
            <label>
                <input type="checkbox" name="notificationTypes" value="push" checked>
                Push Notifications
            </label>
        </div>
    </div>
    <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="hideModal('addReminderModal')">Cancel</button>
        <button type="submit" class="btn-primary">Add Reminder</button>
    </div>
`;

const appointmentFormTemplate = `
    <div class="form-group">
        <label for="appointmentTitle">Appointment Title</label>
        <input type="text" id="appointmentTitle" name="title" required>
    </div>
    <div class="form-group">
        <label for="doctorName">Doctor's Name</label>
        <input type="text" id="doctorName" name="doctorName" required>
    </div>
    <div class="form-group">
        <label for="specialty">Specialty</label>
        <input type="text" id="specialty" name="specialty">
    </div>
    <div class="form-group">
        <label for="appointmentDate">Date & Time</label>
        <input type="datetime-local" id="appointmentDate" name="dateTime" required>
    </div>
    <div class="form-group">
        <label for="duration">Duration (minutes)</label>
        <input type="number" id="duration" name="duration" value="30" min="15" step="15">
    </div>
    <div class="form-group">
        <label>Location</label>
        <input type="text" name="address" placeholder="Address">
        <div class="location-grid">
            <input type="text" name="city" placeholder="City">
            <input type="text" name="state" placeholder="State">
            <input type="text" name="zipCode" placeholder="ZIP Code">
        </div>
    </div>
    <div class="form-group">
        <label>Contact Information</label>
        <input type="tel" name="phone" placeholder="Phone Number">
        <input type="email" name="email" placeholder="Email">
    </div>
    <div class="form-group">
        <label for="appointmentNotes">Notes</label>
        <textarea id="appointmentNotes" name="notes" rows="3"></textarea>
    </div>
    <div class="form-group">
        <label for="appointmentFamilyMember">For Family Member</label>
        <select id="appointmentFamilyMember" name="familyMember">
            <option value="">Myself</option>
            <!-- Family members will be populated dynamically -->
        </select>
    </div>
    <div class="form-group">
        <label>Reminders</label>
        <div class="reminder-times">
            <label>
                <input type="checkbox" name="reminderTimes" value="1440" checked>
                1 day before
            </label>
            <label>
                <input type="checkbox" name="reminderTimes" value="120" checked>
                2 hours before
            </label>
            <label>
                <input type="checkbox" name="reminderTimes" value="30" checked>
                30 minutes before
            </label>
        </div>
    </div>
    <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="hideModal('addAppointmentModal')">Cancel</button>
        <button type="submit" class="btn-primary">Book Appointment</button>
    </div>
`;

const familyFormTemplate = `
    <div class="form-group">
        <label for="familyEmail">Email Address</label>
        <input type="email" id="familyEmail" name="email" required>
    </div>
    <div class="form-group">
        <label>Shared Information</label>
        <div class="checkbox-group">
            <label>
                <input type="checkbox" name="shareTypes" value="medications" checked>
                Medications
            </label>
            <label>
                <input type="checkbox" name="shareTypes" value="appointments" checked>
                Appointments
            </label>
        </div>
    </div>
    <div class="form-group">
        <label for="relationship">Relationship</label>
        <select id="relationship" name="relationship" required>
            <option value="spouse">Spouse</option>
            <option value="parent">Parent</option>
            <option value="child">Child</option>
            <option value="sibling">Sibling</option>
            <option value="other">Other</option>
        </select>
    </div>
    <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="hideModal('addFamilyModal')">Cancel</button>
        <button type="submit" class="btn-primary">Send Invitation</button>
    </div>
`;

// Form handling functions
function populateReminderForm() {
    const form = document.getElementById('reminderForm');
    form.innerHTML = reminderFormTemplate;
    populateFamilyMembers('familyMember');
}

function populateAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    form.innerHTML = appointmentFormTemplate;
    populateFamilyMembers('appointmentFamilyMember');
}

function populateFamilyForm() {
    const form = document.getElementById('familyForm');
    form.innerHTML = familyFormTemplate;
}

async function populateFamilyMembers(selectId) {
    try {
        const familyMembers = await API.getFamilyMembers();
        const select = document.getElementById(selectId);
        const options = familyMembers.map(member => 
            `<option value="${member._id}">${member.displayName}</option>`
        ).join('');
        select.innerHTML += options;
    } catch (error) {
        console.error('Failed to load family members:', error);
    }
}

// Form utility functions
function toggleFrequencyOptions(frequency) {
    const daysGroup = document.getElementById('daysGroup');
    daysGroup.style.display = frequency === 'weekly' ? 'block' : 'none';
}

function addTimeField() {
    const timeGroup = document.getElementById('timeGroup');
    const newTimeInput = document.createElement('input');
    newTimeInput.type = 'time';
    newTimeInput.name = 'time';
    newTimeInput.required = true;
    timeGroup.insertBefore(newTimeInput, timeGroup.lastElementChild);
}

// Form submission handlers
async function handleReminderSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const reminder = {
        title: formData.get('title'),
        type: 'medication',
        medication: {
            name: formData.get('title'),
            dosage: formData.get('dosage'),
            instructions: formData.get('instructions'),
            refillDate: formData.get('refillDate')
        },
        schedule: {
            frequency: formData.get('frequency'),
            times: Array.from(formData.getAll('time')),
            daysOfWeek: formData.get('frequency') === 'weekly' ? 
                Array.from(formData.getAll('days')).map(Number) : [],
        },
        notifications: formData.getAll('notificationTypes').map(type => ({
            type,
            time: 0 // Immediate notification
        }))
    };

    try {
        await API.createReminder(reminder);
        hideModal('addReminderModal');
        await loadTodayReminders();
        await updateQuickStats();
    } catch (error) {
        console.error('Failed to create reminder:', error);
    }
}

async function handleAppointmentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const appointment = {
        title: formData.get('title'),
        doctor: {
            name: formData.get('doctorName'),
            specialty: formData.get('specialty'),
            location: {
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode')
            },
            contactInfo: {
                phone: formData.get('phone'),
                email: formData.get('email')
            }
        },
        dateTime: formData.get('dateTime'),
        duration: parseInt(formData.get('duration')),
        notes: formData.get('notes'),
        reminders: formData.getAll('reminderTimes').map(time => ({
            type: 'both',
            time: parseInt(time)
        }))
    };

    try {
        await API.createAppointment(appointment);
        hideModal('addAppointmentModal');
        await loadUpcomingAppointments();
        await updateQuickStats();
    } catch (error) {
        console.error('Failed to create appointment:', error);
    }
}

async function handleFamilySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        await API.sendFamilyInvitation(formData.get('email'));
        hideModal('addFamilyModal');
        await loadFamilyActivity();
        await updateQuickStats();
    } catch (error) {
        console.error('Failed to send invitation:', error);
    }
}

// Export form functions
window.populateReminderForm = populateReminderForm;
window.populateAppointmentForm = populateAppointmentForm;
window.populateFamilyForm = populateFamilyForm;
window.handleReminderSubmit = handleReminderSubmit;
window.handleAppointmentSubmit = handleAppointmentSubmit;
window.handleFamilySubmit = handleFamilySubmit;
window.toggleFrequencyOptions = toggleFrequencyOptions;
window.addTimeField = addTimeField; 