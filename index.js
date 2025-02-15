// Initialize EmailJS
emailjs.init("5tfG93RgjAaO6v_2d");

document.addEventListener("DOMContentLoaded", () => {
    setupContactForm();
    startTypewriterEffect();
    setupDarkModeToggle();
    setupSkillBarAnimation();
    setupSectionRevealAnimation();
    setupHeaderShrinkEffect();
    setLoadingAnimation(); // Added loading animation initialization
});

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
                    alert("Email sent successfully!");
                    console.log("SUCCESS!", response);
                    form.reset();
                })
                .catch(error => {
                    alert("Failed to send email. Check console for error details.");
                    console.error("FAILED...", error);
                });
        });
    }
}

function startTypewriterEffect() {
    const text = "Aspiring IT Specialist | Software Developer | Web developer";
    const tagline = document.querySelector(".main-header p");
    let index = 0;

    function typeEffect() {
        if (index < text.length) {
            tagline.textContent += text.charAt(index);
            index++;
            setTimeout(typeEffect, 100);
        }
    }

    if (tagline) typeEffect();
}

function setupDarkModeToggle() {
    const toggleButton = document.getElementById("darkModeToggle");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
        });
    }
}

function setupSkillBarAnimation() {
    const skillBars = document.querySelectorAll(".progress");
    window.addEventListener("scroll", () => {
        skillBars.forEach((bar) => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight && !bar.classList.contains("animated")) {
                bar.classList.add("animated");
                bar.style.width = bar.dataset.width;
            }
        });
    });
}

function setupSectionRevealAnimation() {
    const sections = document.querySelectorAll("section");

    function revealSections() {
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && !section.classList.contains("active")) {
                section.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealSections);
    revealSections();
}

function setupHeaderShrinkEffect() {
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }
    });
}

// Added function for loading animation
function setLoadingAnimation() {
    const loadingElement = document.getElementById("loadingText");

    if (loadingElement) {
        let loadingText = "";
        const interval = setInterval(() => {
            loadingText += ".";
            loadingElement.textContent = `Please Wait${loadingText}`;

            // Stop after 3 dots
            if (loadingText.length === 3) {
                clearInterval(interval);
            }
        }, 500); // Change interval speed as needed
    }
}



