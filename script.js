// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form handling
const form = document.getElementById('bookingForm');
const submitButton = form.querySelector('button[type="submit"]');
const bookingConfirmation = document.getElementById('bookingConfirmation');

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Remove any spaces or special characters
    phone = phone.replace(/[^0-9]/g, '');
    
    // Check if it's a valid Indian phone number
    // Should be 10 digits, optionally starting with +91 or 0
    if (phone.length === 10) {
        return true;
    } else if (phone.length === 11 && phone.startsWith('0')) {
        return true;
    } else if (phone.length === 12 && phone.startsWith('91')) {
        return true;
    }
    return false;
}

function validateTravelDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    
    // Reset time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
}

function showBookingConfirmation(formData) {
    const detailsHTML = `
        <div class="confirmation-details">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Package:</strong> ${formData.package}</p>
            <p><strong>Travel Date:</strong> ${formData.travelDate}</p>
            <p><strong>Pickup Location:</strong> ${formData.pickupLocation}</p>
            <p><strong>Pickup Time:</strong> ${formData.pickupTime}</p>
            <p><strong>Additional Requirements:</strong> ${formData.message}</p>
        </div>
    `;
    
    const detailsDiv = bookingConfirmation.querySelector('.booking-details');
    detailsDiv.innerHTML = detailsHTML;
    
    // Show confirmation
    bookingConfirmation.style.display = 'block';
    
    // Scroll to confirmation
    bookingConfirmation.scrollIntoView({ behavior: 'smooth' });
    
    // Hide confirmation after 10 seconds
    setTimeout(() => {
        bookingConfirmation.style.display = 'none';
        form.reset();
    }, 10000);
}

function sendMail() {
    // Get form elements
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const packageSelected = document.getElementById('package').value;
    const travelDate = document.getElementById('travel_date').value;
    const pickupLocation = document.getElementById('pickup_location').value;
    const pickupTime = document.getElementById('pickup_time').value;
    const message = document.getElementById('message').value;

    // Validate inputs
    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number (10 digits, optionally starting with +91 or 0)');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!validateTravelDate(travelDate)) {
        alert('Please select today\'s date or a future date');
        return;
    }

    if (!pickupLocation.trim()) {
        alert('Please enter your pickup location');
        return;
    }

    if (!pickupTime.trim()) {
        alert('Please select your pickup time');
        return;
    }

    // Prepare parameters for EmailJS
    const params = {
        name: name,
        phone: phone,
        email: email,
        package: packageSelected,
        travel_date: travelDate,
        pickup_location: pickupLocation,
        pickup_time: pickupTime,
        message: message
    };

    // Show loading state
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Send email using EmailJS
    emailjs.send('service_3ft8bhe', 'template_7fip91y', params)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            submitButton.textContent = 'Sent Successfully!';
            
            // Show booking confirmation
            showBookingConfirmation({
                name,
                phone,
                email,
                package: packageSelected,
                travelDate,
                pickupLocation,
                pickupTime,
                message
            });
            
            // Reset form
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Check Availability';
                document.getElementById('bookingForm').reset();
            }, 3000);
        }, function(error) {
            console.log('FAILED...', error);
            submitButton.textContent = 'Failed to Send';
            alert('Failed to send message. Please try again.');
            
            // Reset button
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Check Availability';
            }, 3000);
        });
}

// Set minimum date for travel date input
const travelDateInput = document.getElementById('travel_date');
if (travelDateInput) {
    // Set minimum date to today
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = `${yyyy}-${mm}-${dd}`;
    travelDateInput.min = minDate;

    // Add event listener for date validation
    travelDateInput.addEventListener('change', function() {
        if (!validateTravelDate(this.value)) {
            alert('Please select today\'s date or a future date');
            this.value = ''; // Clear invalid date
        }
    });
}

// Phone number validation on input
const phoneInput = form.querySelector('input[name="phone"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        // Remove any non-numeric characters as they type
        this.value = this.value.replace(/[^0-9+]/g, '');
        
        // Limit the length
        if (this.value.length > 12) {
            this.value = this.value.slice(0, 12);
        }
    });
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: form.querySelector('input[name="name"]').value,
        phone: form.querySelector('input[name="phone"]').value,
        email: form.querySelector('input[name="email"]').value,
        package: form.querySelector('select[name="package"]').value,
        travelDate: form.querySelector('input[name="travel_date"]').value,
        pickupLocation: form.querySelector('input[name="pickup_location"]').value,
        pickupTime: form.querySelector('input[name="pickup_time"]').value,
        message: form.querySelector('textarea[name="message"]').value
    };
    
    if (!validatePhone(formData.phone)) {
        alert('Please enter a valid phone number (10 digits, optionally starting with +91 or 0)');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!validateTravelDate(formData.travelDate)) {
        alert('Please select today\'s date or a future date');
        return;
    }

    if (!formData.pickupLocation.trim()) {
        alert('Please enter your pickup location');
        return;
    }

    if (!formData.pickupTime.trim()) {
        alert('Please select your pickup time');
        return;
    }

    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;

    // Simulate processing (you can replace this with actual backend processing later)
    setTimeout(() => {
        showBookingConfirmation(formData);
        submitButton.innerHTML = 'Check Availability';
        submitButton.disabled = false;
    }, 1500);
});

// Intersection Observer for better scroll animations
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Enhanced scroll behavior
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// Service card hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Initialize AOS with custom settings
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});
