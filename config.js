// Portfolio Configuration
const config = {
    personal: {
        name: "k4l1sh",
        role: "Software Engineer",
        specialization: "Cybersecurity",
        experience: "10+ Years",
        status: "Available"
        
    },
    contact: {
        email: "contact@k4l1sh.com",
        github: "https://github.com/k4l1sh",
        blog: "https://blog.k4l1sh.com"
    },
    about: {
        paragraphs: [
            "I'm passionate about building innovative software solutions and sharing knowledge with the developer community. My work includes architecting cloud infrastructure with Kubernetes, engineering web applications, developing security tools, LLM solutions and more.",
            "You can explore my open-source contributions on GitHub and read about my thoughts and experiences on my blog. These platforms showcase my journey and the projects I'm passionate about.",
            "Feel free to visit these links to learn more about my work and connect with me!"
        ]
    },
    private_projects: [
        {
            name: "OpiniData",
            description: "Data analytics and opinion mining platform for businesses",
            url: "https://opinidata.com",
            type: "Private"
        }
    ],
    github_projects: [
        {
            name: "alexa-gpt",
            repo: "k4l1sh/alexa-gpt",
            description: "Integration of Alexa with ChatGPT for voice-powered AI interactions",
            url: "https://github.com/k4l1sh/alexa-gpt",
            stars: 288
        },
        {
            name: "wordlist-gpt",
            repo: "k4l1sh/WordlistGPT",
            description: "AI-powered wordlist generation tool for cybersecurity testing",
            url: "https://github.com/k4l1sh/WordlistGPT",
            stars: 13
        },
        {
            name: "network-gpt",
            repo: "k4l1sh/network-gpt",
            description: "Natural language interface for network security commands",
            url: "https://github.com/k4l1sh/network-gpt",
            stars: 9
        },
        {
            name: "cert-chrome-docker",
            repo: "k4l1sh/auto-cert-chrome-docker",
            description: "A Docker for Undetected Chromedriver with certificate import",
            url: "https://github.com/k4l1sh/auto-cert-chrome-docker",
            stars: 5
        }
    ],
    settings: {
        title: "k4l1sh",
        description: "Software engineer focused on cybersecurity and AI-driven solutions. Explore my projects and blog.",
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 