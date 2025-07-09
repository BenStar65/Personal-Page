 // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animate sections on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Animate skill progress bars
         const skillObserver = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
          if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress-fill');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('style').match(/width:\s*(\d+%)/);
                if (width && width[1]) {
                    bar.style.width = width[1]; // animate to actual width
                }
            });
        }
    });
     }, { threshold: 0.5 });

        document.querySelectorAll('.skill-category').forEach(category => {
            skillObserver.observe(category);
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // Mobile Responsiveness
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('show');
});

//EmailJs Feature 
emailjs.init("5tfG93RgjAaO6v_2d");

function setupContactForm() {
    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const serviceID = "service_xl29bwe";
            const templateID = "template_xjsk7nn";

            const templateParams = {
                message: document.getElementById("message").value,
                from_name: document.getElementById("name").value,
                reply_to: document.getElementById("email").value,
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(response => {
                    alert("✅ Email sent successfully!");
                    console.log("SUCCESS!", response);
                    form.reset();
                })
                .catch(error => {
                    alert("❌ Failed to send email. Check console for error details.");
                    console.error("FAILED...", error);
                });
        });
    }
}

// DarkMode Feature
document.addEventListener("DOMContentLoaded", setupContactForm);

function setupDarkMode() {
    const toggle = document.getElementById('darkToggle');
    const isDark = localStorage.getItem('dark-mode') === 'true';

    if (isDark) {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'false');
        }
    });
}

document.addEventListener('DOMContentLoaded', setupDarkMode);
