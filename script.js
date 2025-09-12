// Toggle menu overlay and theme
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
};

menuToggle.addEventListener('click', () => {
    menuOverlay.classList.toggle('active');
});

themeToggle.addEventListener('click', toggleDarkMode);

themeToggleMobile.addEventListener('click', () => {
    toggleDarkMode();
    menuOverlay.classList.remove('active');
});

// Close menu when a link is clicked inside the overlay
menuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
});

// --- Calendar & Scheduling Logic ---

const therapyList = document.querySelector('.therapy-list');
const calendarDays = document.getElementById('calendar-days');
const currentMonthEl = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedTherapyEl = document.getElementById('selected-therapy');
const selectedDateEl = document.getElementById('selected-date');
const selectedTimeEl = document.getElementById('selected-time');
const bookFinalBtn = document.getElementById('book-final-btn');

let currentDate = new Date();
let selectedTherapy = null;
let selectedDate = null;
let selectedTime = null;

const therapies = [
    { name: 'Panchakarma Detox', duration: '120 min', price: '$180' },
    { name: 'Abhyanga Massage', duration: '90 min', price: '$120' },
    { name: 'Shirodhara Therapy', duration: '60 min', price: '$100' },
    { name: 'Ayurveda Consultation', duration: '45 min', price: '$80' },
];

const renderTherapies = () => {
    if (!therapyList) return; // Exit if element doesn't exist on page
    therapies.forEach(therapy => {
        const therapyOption = document.createElement('div');
        therapyOption.classList.add('therapy-option');
        therapyOption.innerHTML = `
            <div class="therapy-details">
                <h4>${therapy.name}</h4>
                <p>${therapy.duration}</p>
            </div>
            <span class="therapy-price">${therapy.price}</span>
        `;
        therapyOption.addEventListener('click', () => {
            document.querySelectorAll('.therapy-option').forEach(option => option.classList.remove('selected'));
            therapyOption.classList.add('selected');
            selectedTherapy = therapy.name;
            selectedTherapyEl.textContent = selectedTherapy;
        });
        therapyList.appendChild(therapyOption);
    });
};

const renderCalendar = () => {
    if (!calendarDays) return; // Exit if element doesn't exist on page
    calendarDays.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    currentMonthEl.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    // Add empty cells for the first days
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarDays.appendChild(emptyCell);
    }

    // Add day cells
    for (let i = 1; i <= lastDayOfMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = i;
        dayCell.classList.add('day-cell');
        
        const day = new Date(year, month, i);
        if (day < new Date().setHours(0,0,0,0)) {
            dayCell.classList.add('inactive');
        } else {
            dayCell.addEventListener('click', () => {
                document.querySelectorAll('.day-cell').forEach(cell => cell.classList.remove('selected'));
                dayCell.classList.add('selected');
                selectedDate = day.toDateString();
                selectedDateEl.textContent = selectedDate;
                // For a simple prototype, we'll just show a fixed time
                selectedTime = '10:00 AM';
                selectedTimeEl.textContent = selectedTime;
            });
        }
        calendarDays.appendChild(dayCell);
    }
};

if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

if (bookFinalBtn) {
    bookFinalBtn.addEventListener('click', () => {
        if (selectedTherapy && selectedDate && selectedTime) {
            alert(`Booking Confirmed!
            Therapy: ${selectedTherapy}
            Date: ${selectedDate}
            Time: ${selectedTime}`);
        } else {
            alert('Please select a therapy, date, and time to book.');
        }
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTherapies();
    renderCalendar();
});