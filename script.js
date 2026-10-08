/**
 * PORTFOLIO CLIENT-SIDE SCRIPT - HARSHITHA D N
 * Features:
 *  - Dark / Light Mode Toggle with localStorage persistence & system sync
 *  - Typewriter role effect
 *  - Mobile navigation drawer toggle
 *  - Active section scroll tracking
 *  - Contact form feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. NIGHT MODE (DARK / LIGHT THEME) TOGGLE LOGIC
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Function to determine initial theme
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check OS system preference (default to dark if dark preferred or no preference)
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // Apply theme to document
  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    // Update ARIA label
    if (themeToggleBtn) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${nextTheme} mode`);
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Toggle button click listeners
  function toggleThemeAction() {
    const currentTheme = htmlElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleThemeAction);
  }

  const pixelThemeToggleBtn = document.getElementById('pixel-theme-toggle');
  if (pixelThemeToggleBtn) {
    pixelThemeToggleBtn.addEventListener('click', toggleThemeAction);
  }

  // Listen to OS theme changes if user hasn't explicitly overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // -------------------------------------------------------------------------
  // 2. HERO TYPEWRITER EFFECT
  // -------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter-text');
  const roles = [
    'Software Engineer',
    'Problem Solver',
    'Java & Python Developer',
    'Tech Explorer',
    'Information Science Undergrad'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseBetweenWords = 1800;

  function typeWriter() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end of word
      isDeleting = true;
      setTimeout(typeWriter, pauseBetweenWords);
      return;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeWriter, 350);
      return;
    }

    const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeWriter, currentSpeed);
  }

  // Start typing
  typeWriter();


  // -------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION MENU TOGGLE
  // -------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      });
    });
  }


  // -------------------------------------------------------------------------
  // 4. ACTIVE LINK SCROLL SPY
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  function highlightCurrentNav() {
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightCurrentNav, { passive: true });


  // -------------------------------------------------------------------------
  // 5. CONTACT FORM INTERACTIVE FEEDBACK
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formFeedback && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields marked with *.';
        return;
      }

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please provide a valid email address.';
        return;
      }

      // Simulate sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
      formFeedback.textContent = '';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${name}! Your message has been prepared. HARSHITHA DN will get back to you soon!`;
        contactForm.reset();

        setTimeout(() => {
          formFeedback.textContent = '';
        }, 6000);
      }, 1200);
    });
  }


  // -------------------------------------------------------------------------
  // 6. DYNAMIC COPYRIGHT YEAR
  // -------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
