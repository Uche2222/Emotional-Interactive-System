// app.js - Clean Main Application

class EmotionSenseApp {
    constructor() {
        this.isInitialized = false;
        this.startTime = new Date();
    }
    
    initialize() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }
        
        console.log('Initializing EmotionSense 2026...');
        
        this.initializeComponents();
        this.setupInitialState();
        this.startEmotionSimulation();
        this.updateUI();
        
        this.isInitialized = true;
        console.log('EmotionSense 2026 initialized successfully');
        
        setTimeout(() => {
            window.emotionVisualization.showNotification(
                'EmotionSense 2026 Ready',
                'info'
            );
        }, 1000);
    }
    
    initializeComponents() {
        if (!window.emotionSimulator) {
            console.error('Emotion simulator not found');
            return;
        }
        
        if (!window.emotionEngine) {
            console.error('Emotion engine not found');
            return;
        }
        
        if (!window.emotionVisualization) {
            console.error('Emotion visualization not found');
            return;
        }
        
        window.emotionVisualization.initializeVisualizations();
        
        if (!window.uiControls) {
            console.error('UI controls not found');
            return;
        }
    }
    
    setupInitialState() {
        const initialEmotion = window.emotionSimulator.getCurrentEmotion();
        window.emotionVisualization.updateEmotionFace(initialEmotion);
        
        window.uiControls.updateSystemResponse(initialEmotion);
        
        window.emotionVisualization.updateHistoryChart('6h');
        
        const initialBioData = window.emotionSimulator.generateBioSignals();
        window.emotionVisualization.updateBioSignalsDisplay(initialBioData);
        
        this.updateCopyrightYear();
    }
    
    updateCopyrightYear() {
        const copyrightElements = document.querySelectorAll('.copyright p');
        copyrightElements.forEach(element => {
            if (element.textContent.includes('2023')) {
                element.textContent = element.textContent.replace('2023', '2026');
            }
        });
    }
    
    startEmotionSimulation() {
        window.emotionSimulator.startSimulation(7000);
    }
    
    updateUI() {
        setInterval(() => {
            this.updateTimeDisplays();
        }, 60000);
    }
    
    updateTimeDisplays() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const timeElements = document.querySelectorAll('.current-time');
        timeElements.forEach(element => {
            element.textContent = timeString;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.emotionSenseApp = new EmotionSenseApp();
    window.emotionSenseApp.initialize();
    
    console.log('EmotionSense 2026 is ready!');
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            window.emotionSenseApp.showSystemInfo();
        }
        
        if (e.code === 'Space' && !e.target.matches('textarea, input')) {
            e.preventDefault();
            window.uiControls.toggleTracking();
        }
        
        if (e.code === 'Escape') {
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.remove();
            }
        }
    });
    
    window.addEventListener('offline', () => {
        window.emotionVisualization.showNotification(
            'You are offline. Some features may not work.',
            'warning'
        );
    });
    
    window.addEventListener('online', () => {
        window.emotionVisualization.showNotification(
            'You are back online!',
            'success'
        );
    });
});