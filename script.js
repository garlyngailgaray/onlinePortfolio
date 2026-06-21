document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 2. Active Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger skill bar animation if inside skills section
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => revealObserver.observe(el));

    // 4. Skill Bars Animation
    function animateSkillBars(container) {
        const bars = container.querySelectorAll('.progress');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    // 5. Handle Form Success/Error Messages from PHP
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const messageBox = document.getElementById('form-message');

    if (status === 'success') {
        messageBox.textContent = 'Message sent successfully! I will get back to you soon.';
        messageBox.className = 'form-message success';
        document.getElementById('contact-form').reset();
    } else if (status === 'error') {
        messageBox.textContent = 'Failed to send message. Please try again later.';
        messageBox.className = 'form-message error';
    }

    // Scroll to contact section if there is a message
    if (status) {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }

    // 6. Project gallery modal
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalGallery = document.getElementById('project-modal-gallery');
    const projectModalPreviewButton = document.getElementById('project-modal-preview-button');
    let currentProjectImages = [];
    let currentProjectTitle = '';

    const certificateModal = document.getElementById('certificate-modal');
    const certificateModalTitle = document.getElementById('certificate-modal-title');
    const certificateModalImage = document.getElementById('certificate-modal-image');

    function renderProjectPreview(src, index) {
        projectModalPreviewButton.innerHTML = `
            <img src="${src}" alt="${currentProjectTitle} screenshot ${index + 1}">
        `;
        projectModalPreviewButton.dataset.previewSrc = src;
    }

    function openProjectModal(card) {
        currentProjectTitle = card.getAttribute('data-project-title') || 'Project Gallery';
        currentProjectImages = JSON.parse(card.getAttribute('data-project-gallery') || '[]');

        projectModalTitle.textContent = currentProjectTitle;
        projectModalGallery.innerHTML = currentProjectImages.map((src, index) => `
            <button type="button" class="project-gallery-thumb" data-gallery-index="${index}" aria-label="View ${currentProjectTitle} screenshot ${index + 1}">
                <img src="${src}" alt="${currentProjectTitle} screenshot ${index + 1}">
            </button>
        `).join('');

        renderProjectPreview(currentProjectImages[0], 0);

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeProjectModal() {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('[data-project-open]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const card = trigger.closest('.project-card');
            if (card) {
                openProjectModal(card);
            }
        });
    });

    projectModal.querySelectorAll('[data-modal-close]').forEach(trigger => {
        trigger.addEventListener('click', closeProjectModal);
    });

    projectModalPreviewButton.addEventListener('click', () => {
        const previewSrc = projectModalPreviewButton.dataset.previewSrc;
        if (previewSrc) {
            window.open(previewSrc, '_blank', 'noopener,noreferrer');
        }
    });

    projectModalGallery.addEventListener('click', event => {
        const thumb = event.target.closest('[data-gallery-index]');
        if (!thumb) {
            return;
        }

        const index = Number(thumb.getAttribute('data-gallery-index'));
        const src = currentProjectImages[index];
        if (src) {
            renderProjectPreview(src, index);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
        if (event.key === 'Escape' && certificateModal.classList.contains('active')) {
            closeCertificateModal();
        }
    });

    function openCertificateModal(card) {
        const title = card.getAttribute('data-cert-title') || 'Certificate';
        const image = card.getAttribute('data-cert-image') || '';

        certificateModalTitle.textContent = title;
        certificateModalImage.src = image;
        certificateModalImage.alt = `${title} certificate`;

        certificateModal.classList.add('active');
        certificateModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeCertificateModal() {
        certificateModal.classList.remove('active');
        certificateModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('[data-cert-title]').forEach(card => {
        card.addEventListener('click', () => openCertificateModal(card));
    });

    certificateModal.querySelectorAll('[data-cert-modal-close]').forEach(trigger => {
        trigger.addEventListener('click', closeCertificateModal);
    });
});