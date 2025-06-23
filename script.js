// Load configuration and initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Config is already loaded from config.js
    initializePage();
    fetchGitHubStats();
    addInteractiveFeatures();
});

// Initialize page with configuration data
function initializePage() {
    if (typeof config === 'undefined') {
        console.error('Config not loaded');
        return;
    }
    
    updatePageMetadata();
    updatePersonalInfo();
    updateNavigationLinks();
    updateAboutSection();
    updateContactSection();
    renderPrivateProjects();
    renderGitHubProjects();
}

// Update page metadata
function updatePageMetadata() {
    document.title = config.settings.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = config.settings.description;
    }
}

// Update personal information in profile
function updatePersonalInfo() {
    // Update name
    const nameElement = document.querySelector('.name');
    if (nameElement) nameElement.textContent = config.personal.name;
    
    // Update status
    const statusElement = document.querySelector('.status-text');
    if (statusElement) statusElement.textContent = config.personal.status;
    
    // Dynamically generate personal details
    const detailsContainer = document.getElementById('personal-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = '';
        
        // Exclude 'name' and 'status' from details as they're displayed elsewhere
        const excludeKeys = ['name', 'status'];
        
        Object.entries(config.personal).forEach(([key, value]) => {
            if (!excludeKeys.includes(key)) {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                
                const label = document.createElement('span');
                label.className = 'label';
                label.textContent = key.toUpperCase() + ':';
                
                const valueSpan = document.createElement('span');
                valueSpan.className = 'value';
                valueSpan.textContent = value;
                
                detailItem.appendChild(label);
                detailItem.appendChild(valueSpan);
                detailsContainer.appendChild(detailItem);
            }
        });
    }
}

// Update navigation links
function updateNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks[0]) navLinks[0].href = config.contact.github;
    if (navLinks[1]) navLinks[1].href = config.contact.blog;
    if (navLinks[2]) navLinks[2].href = `mailto:${config.contact.email}`;
}

// Update about section content
function updateAboutSection() {
    const aboutContainer = document.querySelector('.about-content');
    if (aboutContainer) {
        aboutContainer.innerHTML = '';
        
        config.about.paragraphs.forEach(text => {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = text
                .replace('GitHub', `<a href="${config.contact.github}" target="_blank" class="link">GitHub</a>`)
                .replace('blog', `<a href="${config.contact.blog}" target="_blank" class="link">blog</a>`);
            aboutContainer.appendChild(paragraph);
        });
    }
}

// Update contact section
function updateContactSection() {
    const emailLink = document.querySelector('.json-value[href^="mailto:"]');
    if (emailLink) {
        emailLink.href = `mailto:${config.contact.email}`;
        emailLink.textContent = `"${config.contact.email}"`;
    }
    
    const githubLink = document.querySelector('.json-value[href*="github.com"]');
    if (githubLink) {
        githubLink.href = config.contact.github;
        githubLink.textContent = `"${config.contact.github.replace('https://', '')}"`;
    }
    
    const blogLink = document.querySelector('.json-value[href*="blog"]');
    if (blogLink) {
        blogLink.href = config.contact.blog;
        blogLink.textContent = `"${config.contact.blog.replace('https://', '')}"`;
    }
}

// Render private projects dynamically
function renderPrivateProjects() {
    const container = document.getElementById('private-projects');
    if (!container) return;
    
    container.innerHTML = '';
    
    config.private_projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card private';
        
        projectCard.innerHTML = `
            <div class="project-header">
                <h3 class="project-name">${project.name}</h3>
                <span class="project-type">${project.type}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <a href="${project.url}" target="_blank" class="project-link">
                Visit Site →
            </a>
        `;
        
        container.appendChild(projectCard);
    });
}

// Render GitHub projects dynamically
function renderGitHubProjects() {
    const container = document.getElementById('github-projects');
    if (!container) return;
    
    container.innerHTML = '';
    
    config.github_projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card github';
        projectCard.setAttribute('data-repo', project.repo);
        
        projectCard.innerHTML = `
            <div class="project-header">
                <h3 class="project-name">${project.name}</h3>
                <div class="github-stats">
                    <span class="stars">⭐ <span class="star-count">-</span></span>
                </div>
            </div>
            <p class="project-description">${project.description}</p>
            <a href="${project.url}" target="_blank" class="project-link">
                View on GitHub →
            </a>
        `;
        
        container.appendChild(projectCard);
    });
}

// Fetch GitHub repository statistics with caching
async function fetchGitHubStats() {
    if (typeof config === 'undefined') return;
    
    const CACHE_KEY = 'k4l1sh_github_stats';
    const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    
    // Check if we have cached data
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(CACHE_KEY + '_timestamp');
    
    if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < CACHE_DURATION) {
            // Use cached data
            const stats = JSON.parse(cachedData);
            updateStarCounts(stats, true);
            return;
        }
    }
    
    // Try to fetch fresh data
    const fetchPromises = config.github_projects.map(async (project) => {
        try {
            const response = await fetch(`https://api.github.com/repos/${project.repo}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    repo: project.repo,
                    stars: data.stargazers_count,
                    success: true
                };
            }
        } catch (error) {
            // API failed
        }
        return {
            repo: project.repo,
            stars: project.stars || 0,
            success: false
        };
    });
    
    const results = await Promise.all(fetchPromises);
    
    // Always cache the results (either fresh API data or fallback stars)
    const statsToCache = {};
    results.forEach(result => {
        statsToCache[result.repo] = result.stars;
    });
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(statsToCache));
    localStorage.setItem(CACHE_KEY + '_timestamp', Date.now().toString());
    
    // Check if we got any successful API responses
    const hasSuccessfulFetch = results.some(result => result.success);
    
    // Update the UI with results (mix of fresh data and fallbacks)
    const statsToDisplay = {};
    results.forEach(result => {
        statsToDisplay[result.repo] = result.stars;
    });
    
    updateStarCounts(statsToDisplay, hasSuccessfulFetch);
}

// Update star counts in the UI
function updateStarCounts(stats, isFromAPI = false) {
    Object.entries(stats).forEach(([repo, stars]) => {
        const projectCard = document.querySelector(`[data-repo="${repo}"]`);
        if (!projectCard) return;
        
        const starCount = projectCard.querySelector('.star-count');
        if (!starCount) return;
        
        starCount.textContent = stars;
        starCount.style.opacity = isFromAPI ? '1' : '0.8';
    });
}

// Add interactive features to the page
function addInteractiveFeatures() {
    // Add click effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
                const link = card.querySelector('.project-link');
                if (link) {
                    window.open(link.href, '_blank');
                }
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-3px)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add typing effect to terminal cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 1000);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (typeof config === 'undefined') return;
        
        // Ctrl/Cmd + K to focus on contact
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const contactSection = document.querySelector('.contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Ctrl/Cmd + G to open GitHub
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            window.open(config.contact.github, '_blank');
        }
        
        // Ctrl/Cmd + B to open blog
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            window.open(config.contact.blog, '_blank');
        }
    });
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Handle online/offline status
window.addEventListener('online', function() {
    fetchGitHubStats();
}); 