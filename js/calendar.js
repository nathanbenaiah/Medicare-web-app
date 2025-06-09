class Calendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [];
        this.reminders = [];
        this.appointments = [];
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.loadEvents();
    }

    async loadEvents() {
        try {
            // Load reminders and appointments from API
            const [reminders, appointments] = await Promise.all([
                API.getReminders(),
                API.getAppointments()
            ]);

            this.reminders = reminders;
            this.appointments = appointments;
            this.events = [...this.formatReminders(reminders), ...this.formatAppointments(appointments)];
            this.render();
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    }

    formatReminders(reminders) {
        return reminders.map(reminder => ({
            id: reminder._id,
            title: reminder.title,
            type: 'reminder',
            start: new Date(reminder.startDate),
            end: reminder.endDate ? new Date(reminder.endDate) : null,
            status: reminder.status,
            originalData: reminder
        }));
    }

    formatAppointments(appointments) {
        return appointments.map(appointment => ({
            id: appointment._id,
            title: appointment.title,
            type: 'appointment',
            start: new Date(appointment.dateTime),
            end: new Date(new Date(appointment.dateTime).getTime() + appointment.duration * 60000),
            status: appointment.status,
            originalData: appointment
        }));
    }

    render() {
        const monthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const monthEnd = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="btn-prev"><i class="bx bx-chevron-left"></i></button>
                <h2>${this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button class="btn-next"><i class="bx bx-chevron-right"></i></button>
            </div>
            <div class="calendar-body">
                <div class="calendar-weekdays">
                    ${this.getWeekDays()}
                </div>
                <div class="calendar-days">
                    ${this.getDays(startDate, monthStart, monthEnd)}
                </div>
            </div>
            <div class="calendar-events">
                ${this.getEventsForSelectedDate()}
            </div>
        `;
    }

    getWeekDays() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays.map(day => `<div class="weekday">${day}</div>`).join('');
    }

    getDays(startDate, monthStart, monthEnd) {
        let days = '';
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const isToday = this.isToday(date);
            const isSelected = this.isSelected(date);
            const isCurrentMonth = date.getMonth() === monthStart.getMonth();
            const events = this.getEventsForDate(date);
            const hasEvents = events.length > 0;

            days += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} 
                     ${isCurrentMonth ? 'current-month' : 'other-month'}"
                     data-date="${date.toISOString()}">
                    <span class="day-number">${date.getDate()}</span>
                    ${hasEvents ? this.renderEventDots(events) : ''}
                </div>
            `;
        }

        return days;
    }

    renderEventDots(events) {
        const maxDots = 3;
        const dots = events.slice(0, maxDots).map(event => 
            `<span class="event-dot ${event.type}"></span>`
        ).join('');

        return `
            <div class="event-dots">
                ${dots}
                ${events.length > maxDots ? `<span class="event-dot more">+${events.length - maxDots}</span>` : ''}
            </div>
        `;
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    getEventsForSelectedDate() {
        const events = this.getEventsForDate(this.selectedDate);
        if (events.length === 0) {
            return '<p class="no-events">No events for this date</p>';
        }

        return `
            <h3>Events for ${this.selectedDate.toLocaleDateString()}</h3>
            <div class="events-list">
                ${events.map(event => this.renderEvent(event)).join('')}
            </div>
        `;
    }

    renderEvent(event) {
        const time = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const statusClass = event.status.toLowerCase();

        return `
            <div class="event-item ${event.type} ${statusClass}" data-id="${event.id}">
                <div class="event-time">${time}</div>
                <div class="event-content">
                    <h4>${event.title}</h4>
                    <span class="event-type">${event.type}</span>
                    <span class="event-status">${event.status}</span>
                </div>
                <div class="event-actions">
                    <button class="btn-edit" data-id="${event.id}">
                        <i class="bx bx-edit"></i>
                    </button>
                    <button class="btn-delete" data-id="${event.id}">
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(date) {
        return date.toDateString() === this.selectedDate.toDateString();
    }

    attachEventListeners() {
        this.container.addEventListener('click', (e) => {
            const prevBtn = e.target.closest('.btn-prev');
            const nextBtn = e.target.closest('.btn-next');
            const dayEl = e.target.closest('.calendar-day');
            const editBtn = e.target.closest('.btn-edit');
            const deleteBtn = e.target.closest('.btn-delete');

            if (prevBtn) {
                this.previousMonth();
            } else if (nextBtn) {
                this.nextMonth();
            } else if (dayEl) {
                this.selectDate(new Date(dayEl.dataset.date));
            } else if (editBtn) {
                this.editEvent(editBtn.dataset.id);
            } else if (deleteBtn) {
                this.deleteEvent(deleteBtn.dataset.id);
            }
        });
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    selectDate(date) {
        this.selectedDate = date;
        this.render();
    }

    async editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Dispatch custom event for handling edit
        const editEvent = new CustomEvent('editEvent', { detail: event });
        this.container.dispatchEvent(editEvent);
    }

    async deleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        try {
            if (event.type === 'reminder') {
                await API.deleteReminder(eventId);
            } else {
                await API.deleteAppointment(eventId);
            }

            // Remove from local arrays
            this.events = this.events.filter(e => e.id !== eventId);
            if (event.type === 'reminder') {
                this.reminders = this.reminders.filter(r => r._id !== eventId);
            } else {
                this.appointments = this.appointments.filter(a => a._id !== eventId);
            }

            this.render();
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    }
}

// Export the Calendar class
window.Calendar = Calendar; 