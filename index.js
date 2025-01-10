// script.js

// Typewriter Effect
const text = "Aspiring IT Specialist | Software Developer | Ethical Hacker";
const tagline = document.querySelector(".main-header p");
let index = 0;

function typeEffect() {
  if (index < text.length) {
    tagline.textContent += text.charAt(index);
    index++;
    setTimeout(typeEffect, 100);
  }
}

window.onload = typeEffect;

const toggleButton = document.getElementById("darkModeToggle");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Animate Skill Bars
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

// Contact Form Handling (Using EmailJS Example)
const contactForm = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  emailjs.init("RW_Kq29z8lUPQ3CCx"); // Initialize with your EmailJS user ID

  const serviceID = "service_xl29bwe"; // Replace with your EmailJS service ID
  const templateID = "template_xjsk7nn"; // Replace with your EmailJS template ID

  // Prepare template parameters
  const templateParams = {
    from_name: document.getElementById("name").value, // Send the user's name as from_name
    message: document.getElementById("message").value, // Send the message content as message
    email: document.getElementById("email").value, // Optionally, include the email address (not required in your template)
  };

  // Send email with the specified template
  emailjs.send(serviceID, templateID, templateParams).then(
    () => {
      formResponse.textContent = "Message sent successfully!";
      formResponse.style.color = "green";
      contactForm.reset();
    },
    (error) => {
      formResponse.textContent = "Failed to send the message. Please try again.";
      formResponse.style.color = "red";
    }
  );
});

// Select all sections
const sections = document.querySelectorAll("section");

function revealSections() {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Trigger the animation when the section is 75% visible
    if (rect.top < window.innerHeight * 0.75 && !section.classList.contains("active")) {
      section.classList.add("active");
    }
  });
}

// Listen for scroll events
window.addEventListener("scroll", revealSections);

// Run on page load to catch any visible sections
revealSections();

const header = document.querySelector(".main-header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});

