class NotificationManager {
    constructor() {
        this.hasPermission = false;
        this.checkPermission();
    }

    async checkPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        if (Notification.permission === 'granted') {
            this.hasPermission = true;
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === 'granted';
        }
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        const permission = await Notification.requestPermission();
        this.hasPermission = permission === 'granted';
        return this.hasPermission;
    }

    async showNotification(title, options = {}) {
        if (!this.hasPermission) {
            const granted = await this.requestPermission();
            if (!granted) {
                console.warn('Notification permission denied');
                return;
            }
        }

        const defaultOptions = {
            icon: '/images/logo.png',
            badge: '/images/badge.png',
            vibrate: [200, 100, 200],
            tag: 'medicare-plus',
            renotify: true,
            requireInteraction: true
        };

        return new Notification(title, { ...defaultOptions, ...options });
    }

    async scheduleReminder(reminder) {
        const { title, schedule, type } = reminder;
        const times = this.calculateNextReminders(schedule);

        times.forEach(time => {
            const delay = time - Date.now();
            if (delay > 0) {
                setTimeout(() => {
                    this.showNotification(title, {
                        body: `Time for your ${type}: ${title}`,
                        data: reminder
                    });
                }, delay);
            }
        });
    }

    calculateNextReminders(schedule) {
        const times = [];
        const now = new Date();
        const { frequency, times: scheduledTimes, daysOfWeek, specificDates } = schedule;

        switch (frequency) {
            case 'daily':
                scheduledTimes.forEach(time => {
                    const [hours, minutes] = time.split(':');
                    const reminderTime = new Date(now);
                    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    if (reminderTime > now) {
                        times.push(reminderTime.getTime());
                    }
                });
                break;

            case 'weekly':
                daysOfWeek.forEach(day => {
                    scheduledTimes.forEach(time => {
                        const [hours, minutes] = time.split(':');
                        const reminderTime = new Date(now);
                        reminderTime.setDate(now.getDate() + (day - now.getDay() + 7) % 7);
                        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        if (reminderTime > now) {
                            times.push(reminderTime.getTime());
                        }
                    });
                });
                break;

            case 'monthly':
                specificDates.forEach(date => {
                    scheduledTimes.forEach(time => {
                        const reminderTime = new Date(date);
                        const [hours, minutes] = time.split(':');
                        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        if (reminderTime > now) {
                            times.push(reminderTime.getTime());
                        }
                    });
                });
                break;

            case 'custom':
                specificDates.forEach(date => {
                    const reminderTime = new Date(date);
                    if (reminderTime > now) {
                        times.push(reminderTime.getTime());
                    }
                });
                break;
        }

        return times;
    }
}

// Create a global instance
window.notificationManager = new NotificationManager(); 