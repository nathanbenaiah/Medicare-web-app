import { initAuth, signOutUser, db } from './js/firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

let calendar;
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // Handle authentication state
    initAuth(({ isAuthenticated, user }) => {
        if (!isAuthenticated) {
            window.location.href = 'login.html';
            return;
        }

        currentUser = user;

        // Update UI with user info
        document.getElementById('userAvatar').src = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName);
        document.getElementById('userName').textContent = user.displayName;
        document.getElementById('userEmail').textContent = user.email;

        // Initialize calendar and load data
        initializeCalendar();
        loadFamilyMembers();
    });

    // Handle sign out
    document.getElementById('signOutBtn').addEventListener('click', signOutUser);
});

// Initialize calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) {
        console.error('Calendar element not found');
        return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: '100%',
        headerToolbar: false, // We're using our custom header
        views: {
            dayGridMonth: {
                dayMaxEventRows: 4,
                dayMaxEvents: true
            }
        },
        nowIndicator: true,
        navLinks: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventClick: handleEventClick,
        select: handleDateSelect,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize,
        eventClassNames: function(arg) {
            return [arg.event.extendedProps.type];
        },
        eventContent: function(arg) {
            return {
                html: `
                    <div class="fc-event-main-frame">
                        <div class="fc-event-time">${formatTime(arg.event.start)}</div>
                        <div class="fc-event-title-container">
                            <div class="fc-event-title">${arg.event.title}</div>
                            ${arg.event.extendedProps.memberName ? 
                                `<div class="fc-event-member">${arg.event.extendedProps.memberName}</div>` : 
                                ''}
                        </div>
                    </div>
                `
            };
        },
        eventDidMount: function(info) {
            // Add tooltip
            const content = `
                <strong>${info.event.title}</strong><br>
                Time: ${formatTime(info.event.start)}<br>
                ${info.event.extendedProps.memberName ? `For: ${info.event.extendedProps.memberName}<br>` : ''}
                ${info.event.extendedProps.notes ? `Notes: ${info.event.extendedProps.notes}` : ''}
            `;
            tippy(info.el, {
                content: content,
                allowHTML: true,
                placement: 'top',
                animation: 'scale'
            });

            // Add custom classes based on event type
            if (info.event.extendedProps.type === 'medication') {
                info.el.classList.add('medication-event');
            } else if (info.event.extendedProps.type === 'appointment') {
                info.el.classList.add('appointment-event');
            } else if (info.event.extendedProps.type === 'family') {
                info.el.classList.add('family-event');
            }
        }
    });

    // Subscribe to events from Firestore
    const eventsRef = collection(db, 'users', currentUser.uid, 'events');
    onSnapshot(eventsRef, (snapshot) => {
        // Clear existing events
        calendar.removeAllEvents();
        
        // Add events from Firestore
        snapshot.forEach((doc) => {
            const event = doc.data();
            calendar.addEvent({
                id: doc.id,
                title: event.title,
                start: event.start,
                end: event.end || null,
                className: event.type,
                extendedProps: {
                    type: event.type,
                    notes: event.notes,
                    memberId: event.memberId,
                    memberName: event.memberName
                }
            });
        });

        // Update sidebar
        updateSidebar();
    });

    calendar.render();

    // Handle window resize
    window.addEventListener('resize', () => {
        calendar.updateSize();
    });

    // Initialize view controls
    initializeControls(calendar);
    
    // Load initial events
    loadEvents(calendar);
}

// Handle event click
function handleEventClick(info) {
    openEventModal(info.event);
}

// Handle date select
function handleDateSelect(info) {
    openEventModal(null, info.start);
}

// Handle event drop
async function handleEventDrop(info) {
    try {
        const eventDoc = doc(db, 'users', currentUser.uid, 'events', info.event.id);
        await updateDoc(eventDoc, {
            start: info.event.start.toISOString(),
            end: info.event.end?.toISOString() || null
        });
        showToast('Event updated successfully');
    } catch (error) {
        console.error('Error updating event:', error);
        info.revert();
        showToast('Failed to update event', 'error');
    }
}

// Handle event resize
async function handleEventResize(info) {
    try {
        const eventDoc = doc(db, 'users', currentUser.uid, 'events', info.event.id);
        await updateDoc(eventDoc, {
            end: info.event.end.toISOString()
        });
        showToast('Event updated successfully');
    } catch (error) {
        console.error('Error updating event:', error);
        info.revert();
        showToast('Failed to update event', 'error');
    }
}

// Format time for display
function formatTime(date) {
    return date ? new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }) : '';
}

// Update sidebar with upcoming events
function updateSidebar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsRef = collection(db, 'users', currentUser.uid, 'events');
    const q = query(eventsRef, where('start', '>=', today.toISOString()));

    onSnapshot(q, (snapshot) => {
        const upcomingEvents = document.getElementById('upcomingEvents');
        
        if (snapshot.empty) {
            upcomingEvents.innerHTML = `
                <div class="empty-state">
                    <i data-feather="calendar"></i>
                    <p>No upcoming events</p>
                    <button class="btn secondary-btn" onclick="openEventModal()">
                        Add Event
                    </button>
                </div>
            `;
            feather.replace();
            return;
        }

        const events = [];
        snapshot.forEach(doc => {
            events.push({ id: doc.id, ...doc.data() });
        });

        // Sort events by date
        events.sort((a, b) => new Date(a.start) - new Date(b.start));

        // Group events by date
        const groupedEvents = events.reduce((groups, event) => {
            const date = new Date(event.start).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(event);
            return groups;
        }, {});

        // Render grouped events
        upcomingEvents.innerHTML = Object.entries(groupedEvents)
            .map(([date, events]) => `
                <div class="date-group">
                    <h3 class="date-header">${formatDate(date)}</h3>
                    ${events.map(event => `
                        <div class="event-card ${event.type}" data-id="${event.id}">
                            <div class="event-time">${formatTime(new Date(event.start))}</div>
                            <div class="event-details">
                                <h4>${event.title}</h4>
                                ${event.memberName ? `<p>${event.memberName}</p>` : ''}
                            </div>
                            <div class="event-actions">
                                <button class="btn icon-btn edit-event" data-id="${event.id}">
                                    <i data-feather="edit-2"></i>
                                </button>
                                <button class="btn icon-btn delete-event" data-id="${event.id}">
                                    <i data-feather="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');

        feather.replace();

        // Add event listeners to the new buttons
        document.querySelectorAll('.edit-event').forEach(btn => {
            btn.addEventListener('click', () => {
                const event = calendar.getEventById(btn.dataset.id);
                if (event) {
                    openEventModal(event);
                }
            });
        });

        document.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this event?')) {
                    deleteEvent(btn.dataset.id);
                }
            });
        });
    });
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Load family members for the select input
function loadFamilyMembers() {
    const familyRef = collection(db, 'users', currentUser.uid, 'family');
    onSnapshot(familyRef, (snapshot) => {
        const memberSelect = document.getElementById('memberSelect');
        memberSelect.innerHTML = '<option value="">Select Family Member</option>';
        
        snapshot.forEach((doc) => {
            const member = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = member.name;
            memberSelect.appendChild(option);
        });
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}

// Delete event
async function deleteEvent(eventId) {
    try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'events', eventId));
        showToast('Event deleted successfully');
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Failed to delete event', 'error');
    }
}

// Initialize calendar controls
function initializeControls(calendar) {
    // Today button
    document.getElementById('todayBtn').addEventListener('click', () => {
        calendar.today();
        updateUpcomingEvents();
    });
    
    // View toggle buttons
    document.querySelectorAll('.view-toggles button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.view-toggles button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Change calendar view
            calendar.changeView(e.target.dataset.view);
        });
    });
    
    // Filter checkboxes
    document.getElementById('showAppointments').addEventListener('change', () => filterEvents(calendar));
    document.getElementById('showMedications').addEventListener('change', () => filterEvents(calendar));
    document.getElementById('showFamilyEvents').addEventListener('change', () => filterEvents(calendar));
    
    // Quick action buttons
    document.getElementById('addAppointmentBtn').addEventListener('click', () => {
        openEventModal('appointment');
    });
    
    document.getElementById('addReminderBtn').addEventListener('click', () => {
        openEventModal('medication');
    });
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeEventModal);
    document.getElementById('cancelEvent').addEventListener('click', closeEventModal);
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
}

// Load events from API
async function loadEvents(calendar) {
    try {
        const response = await api.get('/api/events');
        const events = response.data;
        
        // Clear existing events
        calendar.removeAllEvents();
        
        // Add new events
        events.forEach(event => {
            calendar.addEvent({
                id: event._id,
                title: event.title,
                start: event.startTime,
                end: event.endTime,
                color: event.color,
                extendedProps: {
                    type: event.type,
                    description: event.description,
                    reminder: event.reminder
                }
            });
        });
        
        // Update upcoming events sidebar
        updateUpcomingEvents();
        
    } catch (error) {
        console.error('Error loading events:', error);
        notifications.show('Error loading events. Please try again.', 'error');
    }
}

// Filter events based on checkboxes
function filterEvents(calendar) {
    const showAppointments = document.getElementById('showAppointments').checked;
    const showMedications = document.getElementById('showMedications').checked;
    const showFamilyEvents = document.getElementById('showFamilyEvents').checked;
    
    calendar.getEvents().forEach(event => {
        const type = event.extendedProps.type;
        if (type === 'appointment') {
            event.setDisplay(showAppointments ? 'auto' : 'none');
        } else if (type === 'medication') {
            event.setDisplay(showMedications ? 'auto' : 'none');
        } else if (type === 'family') {
            event.setDisplay(showFamilyEvents ? 'auto' : 'none');
        }
    });
}

// Open event modal
function openEventModal(type = null, selectInfo = null, event = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const titleEl = document.getElementById('modalTitle');
    
    // Reset form
    form.reset();
    
    // Set modal title and type
    if (event) {
        titleEl.textContent = 'Edit Event';
        document.getElementById('eventType').value = event.extendedProps.type;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventStart').value = formatDateTime(event.start);
        document.getElementById('eventEnd').value = formatDateTime(event.end);
        document.getElementById('eventDescription').value = event.extendedProps.description;
        document.getElementById('eventColor').value = event.backgroundColor;
        document.getElementById('eventReminder').checked = event.extendedProps.reminder;
    } else {
        titleEl.textContent = 'Add New Event';
        if (type) document.getElementById('eventType').value = type;
        if (selectInfo) {
            document.getElementById('eventStart').value = formatDateTime(selectInfo.start);
            document.getElementById('eventEnd').value = formatDateTime(selectInfo.end);
        }
    }
    
    // Store event data for form submission
    form.dataset.eventId = event ? event.id : '';
    form.dataset.selectInfo = selectInfo ? JSON.stringify(selectInfo) : '';
    
    // Show modal
    modal.classList.add('active');
}

// Close event modal
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
}

// Handle event form submission
async function handleEventSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const eventId = form.dataset.eventId;
    const selectInfo = form.dataset.selectInfo ? JSON.parse(form.dataset.selectInfo) : null;
    
    const eventData = {
        type: document.getElementById('eventType').value,
        title: document.getElementById('eventTitle').value,
        startTime: document.getElementById('eventStart').value,
        endTime: document.getElementById('eventEnd').value,
        description: document.getElementById('eventDescription').value,
        color: document.getElementById('eventColor').value,
        reminder: document.getElementById('eventReminder').checked
    };
    
    try {
        if (eventId) {
            // Update existing event
            await api.put(`/api/events/${eventId}`, eventData);
            notifications.show('Event updated successfully', 'success');
        } else {
            // Create new event
            await api.post('/api/events', eventData);
            notifications.show('Event created successfully', 'success');
        }
        
        // Reload events and close modal
        await loadEvents(calendar);
        closeEventModal();
        
    } catch (error) {
        console.error('Error saving event:', error);
        notifications.show('Error saving event. Please try again.', 'error');
    }
}

// Update upcoming events sidebar
function updateUpcomingEvents() {
    const container = document.getElementById('upcomingEvents');
    const events = calendar.getEvents()
        .filter(event => event.start >= new Date())
        .sort((a, b) => a.start - b.start)
        .slice(0, 5);
    
    if (events.length === 0) {
        container.innerHTML = '<div class="no-events">No upcoming events</div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-item ${event.extendedProps.type}">
            <div class="event-title">${event.title}</div>
            <div class="event-time">
                ${formatDate(event.start)} at ${formatTime(event.start)}
            </div>
        </div>
    `).join('');
}

// Helper function to format date for datetime-local input
function formatDateTime(date) {
    return new Date(date).toISOString().slice(0, 16);
}

// Helper function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Export calendar functionality
export const scheduleManager = {
    loadEvents,
    updateUpcomingEvents,
    filterEvents
}; 