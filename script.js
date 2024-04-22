
        const cityTimeZones = [
            { name: "New York, USA", timeZone: "America/New_York" },
            { name: "Los Angeles, USA", timeZone: "America/Los_Angeles" },
            { name: "London, UK", timeZone: "Europe/London" },
            { name: "Berlin, Germany", timeZone: "Europe/Berlin" },
            { name: "Moscow, Russia", timeZone: "Europe/Moscow" },
            { name: "Beijing, China", timeZone: "Asia/Shanghai" },
            { name: "Tokyo, Japan", timeZone: "Asia/Tokyo" },
            { name: "Sydney, Australia", timeZone: "Australia/Sydney" },
            { name: "Cape Town, South Africa", timeZone: "Africa/Johannesburg" },
            { name: "São Paulo, Brazil", timeZone: "America/Sao_Paulo" },
            { name: "Mexico City, Mexico", timeZone: "America/Mexico_City" },
            { name: "Mumbai, India", timeZone: "Asia/Kolkata" },
            { name: "Cairo, Egypt", timeZone: "Africa/Cairo" },
            { name: "Dubai, UAE", timeZone: "Asia/Dubai" },
            { name: "Singapore", timeZone: "Asia/Singapore" },
            { name: "Ha Noi, Vietnam", timeZone: "Asia/Ho_Chi_Minh" },
            { name: "Brisbane, Australia", timeZone: "Australia/Brisbane" },
            { name: "Melbourne, Australia", timeZone: "Australia/Melbourne" },
            { name: "Minnesota, USA", timeZone: "America/Chicago" },
            { name: "Paris, France", timeZone: "Europe/Paris" }
        ];

        document.addEventListener('DOMContentLoaded', function() {
            loadLocalStorage();
            makeSortable(document.getElementById('counters'));
            makeSortable(document.getElementById('dayNotes'));
            makeSortable(document.getElementById('clocks'));
        });

        function makeSortable(container) {
            new Sortable(container, {
                animation: 150,
                handle: '.handle',
                ghostClass: 'bg-gray-300'
            });
        }

        function addCounter() {
            const startDate = document.getElementById('startDatePicker').value;
            const endDate = document.getElementById('endDatePicker').value;
            const note = document.getElementById('noteInput').value;
            const countersContainer = document.getElementById('counters');

            if (startDate && endDate) {
                const counterData = { startDate, endDate, note };
                const counterDiv = createCounterDiv(counterData);
                countersContainer.appendChild(counterDiv);
                saveToLocal('counters', counterData);
            } else {
                alert('Please select both start and end dates.');
            }
        }

        function createCounterDiv(data) {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'p-4 mt-4 bg-gray-200 rounded shadow fade-in flex justify-between items-center';
            counterDiv.innerHTML = `
                <div class="handle">
                    <div>From: ${formatDate(data.startDate)}</div>
                    <div>To: ${formatDate(data.endDate)}</div>
                    <div>Days: ${calculateDays(data.startDate, data.endDate)}</div>
                    <div>Note: ${data.note}</div>
                </div>
                <div>
                    <button onclick="removeElement(this, 'counters')" class="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Remove</button>
                    <button onclick="togglePriority(this)" class="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="fas fa-star"></i></button>
                    <button onclick="speakText('From ${formatDate(data.startDate)} to ${formatDate(data.endDate)}. Days: ${calculateDays(data.startDate, data.endDate)}. Note: ${data.note}', 'male')" class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="fas fa-volume-up"></i></button>
                </div>
            `;
            return counterDiv;
        }

        function addDayNote() {
            const selectedDay = document.getElementById('dayPicker').value;
            const dayNote = document.getElementById('dayNoteInput').value;
            const dayNotesContainer = document.getElementById('dayNotes');

            if (selectedDay && dayNote) {
                const dayNoteData = { date: selectedDay, note: dayNote };
                const dayNoteDiv = createDayNoteDiv(dayNoteData);
                dayNotesContainer.appendChild(dayNoteDiv);
                saveToLocal('dayNotes', dayNoteData);
            } else {
                alert('Please fill in both fields.');
            }
        }

        function createDayNoteDiv(data) {
            const dayNoteDiv = document.createElement('div');
            dayNoteDiv.className = 'p-4 mt-4 bg-green-200 rounded shadow fade-in flex justify-between items-center';
            dayNoteDiv.innerHTML = `
                <div class="handle">
                    <div>Date: ${formatDateTime(data.date)}</div>
                    <div>Note: ${data.note}</div>
                </div>
                <div>
                    <button onclick="removeElement(this, 'dayNotes')" class="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Remove</button>
                    <button onclick="togglePriority(this)" class="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="fas fa-star"></i></button>
                    <button onclick="speakText('Date: ${formatDateTime(data.date)}. Note: ${data.note}', 'female')" class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="fas fa-volume-up"></i></button>
                </div>
            `;
            return dayNoteDiv;
        }

        function addClock(city) {
            const clocksContainer = document.getElementById('clocks');
            const clockData = { name: city.name, timeZone: city.timeZone };
            const clockDiv = createClockDiv(clockData);
            clocksContainer.appendChild(clockDiv);
            saveToLocal('clocks', clockData);
            updateClock(city);
        }

        function createClockDiv(data) {
            const clockDiv = document.createElement('div');
            clockDiv.className = 'p-4 mt-4 bg-gray-200 rounded shadow fade-in flex justify-between items-center';
            clockDiv.innerHTML = `
                <div class="handle">
                    <div>${data.name}</div>
                    <div id="${data.name.replace(/ /g, '-')}-time"></div>
                </div>
                <div>
                    <button onclick="removeElement(this, 'clocks')" class="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Remove</button>
                    <button onclick="togglePriority(this)" class="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="fas fa-star"></i></button>
                    <button onclick="speakClock('${data.name}')" class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="fas fa-volume-up"></i></button>
                </div>
            `;
            return clockDiv;
        }

        function removeElement(button, storageKey) {
            const item = button.parentElement.parentElement;
            const container = item.parentElement;
            const index = Array.from(container.children).indexOf(item);
            removeFromLocal(storageKey, index);
            item.remove();
        }

        function togglePriority(button) {
            const item = button.parentElement.parentElement;
            item.classList.toggle('priority');
            const container = item.parentElement;
            if (item.classList.contains('priority')) {
                container.prepend(item);
            } else {
                container.appendChild(item);
            }
        }

        function calculateDays(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
        }

        function formatDate(date) {
            const d = new Date(date);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        }

        function formatDateTime(dateTime) {
            const d = new Date(dateTime);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        }

        function searchCity() {
            const input = document.getElementById('cityInput').value.toLowerCase();
            const cityList = document.getElementById('cityList');
            cityList.innerHTML = '';
            cityTimeZones.filter(city => city.name.toLowerCase().includes(input)).forEach(city => {
                const cityDiv = document.createElement('div');
                cityDiv.className = 'p-2 hover:bg-gray-100 cursor-pointer fade-in';
                cityDiv.textContent = city.name;
                cityDiv.onclick = () => selectCity(city);
                cityList.appendChild(cityDiv);
            });
        }

        function selectCity(city) {
            document.getElementById('cityInput').value = city.name;
            document.getElementById('cityList').innerHTML = '';
            addClock(city);
        }

        function updateClock(city) {
            const clockElement = document.getElementById(`${city.name.replace(/ /g, '-')}-time`);
            function update() {
                const now = new Date().toLocaleTimeString('en-US', { timeZone: city.timeZone });
                clockElement.textContent = now;
            }
            update();
            setInterval(update, 1000);
        }
        function speakText(text) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }

        function speakClock(cityName) {
            const city = cityTimeZones.find(c => c.name === cityName);
            const now = new Date().toLocaleTimeString('en-US', { timeZone: city.timeZone });
            speakText(`Current time in ${cityName} is ${now}`);
        }

        function toggleTheme() {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }

        function removeFromLocal(key, index) {
    try {
        let items = JSON.parse(localStorage.getItem(key));
        if (!items) {
            console.error("Error: No items found in local storage for key:", key);
            return;
        }
        items.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error("Error managing local storage:", error);
    }
}

function saveToLocal(key, data) {
    try {
        let items = JSON.parse(localStorage.getItem(key)) || [];
        items.push(data);
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error("Error saving to local storage:", error);
        alert("Failed to save data: Local storage might be full.");
    }
}
