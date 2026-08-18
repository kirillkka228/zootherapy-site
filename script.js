document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ЗАВАНТАЖЕННЯ КЛІНІК ---
    const clinicsContainer = document.querySelector('.clinics-container');
    if (clinicsContainer) {
        loadClinics();

        // Форма додавання нової клініки
        const addClinicForm = document.getElementById('addClinicForm');
        if (addClinicForm) {
            addClinicForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newClinic = {
                    name: document.getElementById('cl-name').value,
                    city: document.getElementById('cl-city').value,
                    address: document.getElementById('cl-address').value,
                    phone: document.getElementById('cl-phone').value,
                    therapy_type: document.getElementById('cl-type').value,
                    description: document.getElementById('cl-desc').value
                };

                fetch('/api/clinics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newClinic)
                })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    addClinicForm.reset();
                    loadClinics(); // Оновлюємо каталог на сторінці
                });
            });
        }
    }

    function loadClinics() {
        clinicsContainer.innerHTML = '<p>Завантаження даних...</p>';
        fetch('/api/clinics')
            .then(res => {
                if (!res.ok) throw new Error('Помилка сервера: ' + res.status);
                return res.json();
            })
            .then(data => {
                clinicsContainer.innerHTML = '';
                
                if (!data || data.length === 0) {
                    clinicsContainer.innerHTML = '<p>У базі даних поки немає записаних клінік.</p>';
                    return;
                }

                data.forEach(clinic => {
                    const therapyType = clinic.therapy_type || '';
                    const badgeClass = therapyType.toLowerCase().includes('каніс') ? 'c-dog' : 'c-horse';
                    
                    clinicsContainer.innerHTML += `
                        <div class="clinic-card">
                            <div class="clinic-badge ${badgeClass}">${therapyType}</div>
                            <h3>${clinic.name}</h3>
                            <p><strong>Місто:</strong> ${clinic.city}</p>
                            <p><strong>Адреса:</strong> ${clinic.address}</p>
                            <p class="clinic-desc">${clinic.description || ''}</p>
                            <a href="tel:${clinic.phone}" class="btn-contact">Зателефонувати</a>
                        </div>`;
                });
            })
            .catch(err => {
                console.error('Помилка завантаження клінік:', err);
                clinicsContainer.innerHTML = '<p style="color: red;">Помилка завантаження даних із бази. Перевірте консоль (F12).</p>';
            });
    }

    // --- 2. ЗАВАНТАЖЕННЯ ЗАХОДІВ ---
    const eventsContainer = document.querySelector('.events-container');
    if (eventsContainer) {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                eventsContainer.innerHTML = '';
                if (data.length === 0) {
                    eventsContainer.innerHTML = '<p>Запланованих заходів поки немає.</p>';
                    return;
                }
                data.forEach(event => {
                    eventsContainer.innerHTML += `
                        <div class="clinic-card" style="border-left: 5px solid #ff9233;">
                            <h3>${event.title}</h3>
                            <p><strong>Дата:</strong> ${event.date}</p>
                            <p><strong>Локація:</strong> ${event.location}</p>
                            <p class="clinic-desc">${event.description || ''}</p>
                        </div>`;
                });
            });
    }

    // --- 3. ФОРМА КОНТАКТІВ ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageData = {
                name: document.getElementById('c-name').value,
                email: document.getElementById('c-email').value,
                message: document.getElementById('c-message').value
            };

            fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            })
            .then(res => res.json())
            .then(data => {
                const status = document.getElementById('formResponse');
                status.style.color = 'green';
                status.innerText = data.message;
                contactForm.reset();
            });
        });
    }
});