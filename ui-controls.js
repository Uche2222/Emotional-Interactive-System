// ui-controls.js - Clean UI Controls

class UIControls {
    constructor() {
        this.isTracking = true;
        this.currentModality = 'face';
        this.recordingTimer = null;
        this.recordingSeconds = 0;
        
        this.initializeControls();
    }
    
    initializeControls() {
        this.setupModalityTabs();
        this.setupEmotionControls();
        this.setupResponseControls();
        this.setupSystemControls();
        this.setupEventListeners();
    }
    
    setupModalityTabs() {
        const tabs = document.querySelectorAll('.modality-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const modality = tab.dataset.modality;
                this.switchModality(modality);
            });
        });
    }
    
    switchModality(modality) {
        this.currentModality = modality;
        
        const tabs = document.querySelectorAll('.modality-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.modality === modality) {
                tab.classList.add('active');
            }
        });
        
        const contents = document.querySelectorAll('.modality-content');
        contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${modality}-content`) {
                content.classList.add('active');
            }
        });
        
        this.updateModalityStatus(modality);
        
        const modalityNames = {
            face: 'Facial Analysis',
            voice: 'Voice Analysis',
            text: 'Text Analysis',
            bio: 'Bio-signals'
        };
        
        window.emotionVisualization.showNotification(
            `Switched to ${modalityNames[modality]} mode`,
            'info'
        );
    }
    
    updateModalityStatus(modality) {
        const statusIndicators = document.querySelectorAll('.status-indicator');
        const statusTexts = document.querySelectorAll('.status-text');
        
        statusIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        statusTexts.forEach(text => {
            text.textContent = 'Ready';
        });
        
        const currentContent = document.getElementById(`${modality}-content`);
        if (currentContent) {
            const statusIndicator = currentContent.querySelector('.status-indicator');
            const statusText = currentContent.querySelector('.status-text');
            
            if (statusIndicator && statusText) {
                statusIndicator.classList.add('active');
                
                if (modality === 'face' || modality === 'text') {
                    statusText.textContent = 'Active';
                } else if (modality === 'voice') {
                    statusText.textContent = 'Ready';
                } else {
                    statusText.textContent = 'Connect Device';
                }
            }
        }
    }
    
    setupEmotionControls() {
        const startTrackingBtn = document.getElementById('startTracking');
        
        if (startTrackingBtn) {
            startTrackingBtn.addEventListener('click', () => {
                this.toggleTracking();
            });
        }
        
        const analyzeTextBtn = document.getElementById('analyzeText');
        if (analyzeTextBtn) {
            analyzeTextBtn.addEventListener('click', () => {
                this.analyzeTextInput();
            });
        }
        
        const clearTextBtn = document.getElementById('clearText');
        if (clearTextBtn) {
            clearTextBtn.addEventListener('click', () => {
                this.clearTextInput();
            });
        }
        
        const startRecordingBtn = document.getElementById('startRecording');
        if (startRecordingBtn) {
            startRecordingBtn.addEventListener('click', () => {
                this.toggleVoiceRecording();
            });
        }
        
        const connectBioBtn = document.getElementById('connectBioDevice');
        if (connectBioBtn) {
            connectBioBtn.addEventListener('click', () => {
                this.connectBioDevice();
            });
        }
        
        const timeRangeSelect = document.getElementById('timeRangeSelect');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.updateHistoryTimeRange(e.target.value);
            });
        }
    }
    
    toggleTracking() {
        this.isTracking = !this.isTracking;
        
        const startTrackingBtn = document.getElementById('startTracking');
        
        if (this.isTracking) {
            window.emotionSimulator.startSimulation();
            
            if (startTrackingBtn) {
                startTrackingBtn.innerHTML = '<i class="fas fa-pause-circle"></i><span class="btn-text">Pause Tracking</span>';
                startTrackingBtn.classList.remove('btn-outline');
                startTrackingBtn.classList.add('btn-primary');
            }
            
            window.emotionVisualization.showNotification(
                'Emotion tracking started',
                'success'
            );
        } else {
            window.emotionSimulator.stopSimulation();
            
            if (startTrackingBtn) {
                startTrackingBtn.innerHTML = '<i class="fas fa-play-circle"></i><span class="btn-text">Resume Tracking</span>';
                startTrackingBtn.classList.remove('btn-primary');
                startTrackingBtn.classList.add('btn-outline');
            }
            
            window.emotionVisualization.showNotification(
                'Emotion tracking paused',
                'warning'
            );
        }
    }
    
    analyzeTextInput() {
        const textInput = document.getElementById('textInput');
        const analyzeTextBtn = document.getElementById('analyzeText');
        
        if (!textInput || !textInput.value.trim()) {
            window.emotionVisualization.showNotification(
                'Please enter some text to analyze',
                'warning'
            );
            return;
        }
        
        if (analyzeTextBtn) {
            const originalHTML = analyzeTextBtn.innerHTML;
            analyzeTextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Analyzing...</span>';
            analyzeTextBtn.disabled = true;
            
            setTimeout(() => {
                const analysis = window.emotionSimulator.generateTextAnalysis(textInput.value);
                
                window.emotionSimulator.currentEmotion = analysis.emotion;
                window.emotionVisualization.updateEmotionFace(analysis.emotion);
                
                this.updateSystemResponse(analysis.emotion);
                
                analyzeTextBtn.innerHTML = '<i class="fas fa-check"></i><span class="btn-text">Analyzed</span>';
                analyzeTextBtn.style.backgroundColor = 'var(--success)';
                
                window.emotionVisualization.showNotification(
                    `Text analyzed: ${analysis.emotion.name} detected`,
                    'success'
                );
                
                setTimeout(() => {
                    analyzeTextBtn.innerHTML = originalHTML;
                    analyzeTextBtn.disabled = false;
                    analyzeTextBtn.style.backgroundColor = '';
                }, 2000);
            }, 1500);
        }
    }
    
    clearTextInput() {
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.value = '';
            textInput.focus();
            
            window.emotionVisualization.showNotification(
                'Text input cleared',
                'info'
            );
        }
    }
    
    toggleVoiceRecording() {
        const startRecordingBtn = document.getElementById('startRecording');
        const recordingTimer = document.getElementById('recordingTimer');
        
        if (!this.recordingTimer) {
            this.recordingSeconds = 0;
            window.emotionVisualization.startAudioVisualization();
            
            if (startRecordingBtn) {
                startRecordingBtn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Recording';
                startRecordingBtn.classList.remove('btn-outline');
                startRecordingBtn.classList.add('btn-primary');
            }
            
            this.recordingTimer = setInterval(() => {
                this.recordingSeconds++;
                if (recordingTimer) {
                    const minutes = Math.floor(this.recordingSeconds / 60);
                    const seconds = this.recordingSeconds % 60;
                    recordingTimer.textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
            
            window.emotionVisualization.showNotification(
                'Voice recording started. Speak now.',
                'info'
            );
        } else {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
            window.emotionVisualization.stopAudioVisualization();
            
            if (startRecordingBtn) {
                startRecordingBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
                startRecordingBtn.classList.remove('btn-primary');
                startRecordingBtn.classList.add('btn-outline');
            }
            
            if (recordingTimer) {
                recordingTimer.textContent = '00:00';
            }
            
            setTimeout(() => {
                const randomEmotion = window.emotionSimulator.getRandomEmotion();
                window.emotionSimulator.currentEmotion = randomEmotion;
                window.emotionVisualization.updateEmotionFace(randomEmotion);
                this.updateSystemResponse(randomEmotion);
                
                window.emotionVisualization.showNotification(
                    `Voice analysis complete: ${randomEmotion.name} detected`,
                    'success'
                );
            }, 1000);
        }
    }
    
    connectBioDevice() {
        const connectBioBtn = document.getElementById('connectBioDevice');
        
        if (connectBioBtn) {
            const originalHTML = connectBioBtn.innerHTML;
            connectBioBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            connectBioBtn.disabled = true;
            
            setTimeout(() => {
                const statusIndicator = document.querySelector('#bio-content .status-indicator');
                const statusText = document.querySelector('#bio-content .status-text');
                
                if (statusIndicator && statusText) {
                    statusIndicator.classList.add('active');
                    statusText.textContent = 'Connected';
                }
                
                connectBioBtn.innerHTML = '<i class="fas fa-check"></i> Connected';
                connectBioBtn.style.backgroundColor = 'var(--success)';
                
                this.startBioSignalsSimulation();
                
                window.emotionVisualization.showNotification(
                    'Bio-signals device connected successfully',
                    'success'
                );
                
                setTimeout(() => {
                    connectBioBtn.innerHTML = originalHTML;
                    connectBioBtn.disabled = false;
                    connectBioBtn.style.backgroundColor = '';
                }, 3000);
            }, 2000);
        }
    }
    
    startBioSignalsSimulation() {
        setInterval(() => {
            const bioData = window.emotionSimulator.generateBioSignals();
            window.emotionVisualization.updateBioSignalsDisplay(bioData);
        }, 5000);
    }
    
    updateHistoryTimeRange(range) {
        window.emotionVisualization.updateHistoryChart(range);
        
        const rangeNames = {
            '1h': 'Last Hour',
            '6h': 'Last 6 Hours',
            '24h': 'Last 24 Hours',
            '7d': 'Last 7 Days'
        };
        
        window.emotionVisualization.showNotification(
            `Showing emotion history for ${rangeNames[range]}`,
            'info'
        );
    }
    
    setupResponseControls() {
        const responseStyleSelect = document.getElementById('responseStyle');
        if (responseStyleSelect) {
            responseStyleSelect.addEventListener('change', (e) => {
                window.emotionEngine.setResponseStyle(e.target.value);
                window.emotionVisualization.showNotification(
                    `Response style changed to ${e.target.value}`,
                    'info'
                );
            });
        }
        
        const responseFrequencySelect = document.getElementById('responseFrequency');
        if (responseFrequencySelect) {
            responseFrequencySelect.addEventListener('change', (e) => {
                window.emotionVisualization.showNotification(
                    `Response frequency set to ${e.target.value}`,
                    'info'
                );
            });
        }
        
        const responseActions = document.querySelectorAll('.action-btn');
        responseActions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleResponseAction(btn.dataset.response);
            });
        });
    }
    
    handleResponseAction(action) {
        const currentEmotion = window.emotionSimulator.getCurrentEmotion();
        let response = '';
        
        switch(action) {
            case 'empathy':
                response = window.emotionEngine.generateEmpatheticResponse(currentEmotion);
                break;
            case 'suggest':
                response = window.emotionEngine.generateActivitySuggestion(currentEmotion);
                break;
            case 'calm':
                response = window.emotionEngine.generateCalmingGuidance(currentEmotion);
                break;
        }
        
        this.updateResponseDisplay(response, action);
        
        const button = document.querySelector(`.action-btn[data-response="${action}"]`);
        if (button) {
            const originalBackground = button.style.backgroundColor;
            button.style.backgroundColor = 'var(--primary)';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.style.backgroundColor = originalBackground;
                button.style.color = '';
            }, 1000);
        }
    }
    
    updateSystemResponse(emotion) {
        const response = window.emotionEngine.generateResponse(
            { type: emotion.id, valence: emotion.valence, arousal: emotion.arousal }
        );
        
        this.updateResponseDisplay(response.text, 'auto');
    }
    
    updateResponseDisplay(responseText, source = 'auto') {
        const responseElement = document.getElementById('responseText');
        const responseTime = document.getElementById('responseTime');
        
        if (responseElement) {
            responseElement.textContent = responseText;
        }
        
        if (responseTime) {
            responseTime.textContent = 'Just now';
            
            setTimeout(() => {
                responseTime.textContent = '1 minute ago';
            }, 60000);
        }
    }
    
    setupSystemControls() {
        const trackingToggle = document.getElementById('trackingToggle');
        const privacyToggle = document.getElementById('privacyToggle');
        const adaptiveToggle = document.getElementById('adaptiveToggle');
        
        if (trackingToggle) {
            trackingToggle.addEventListener('change', (e) => {
                this.isTracking = e.target.checked;
                window.emotionVisualization.showNotification(
                    `Emotion tracking ${this.isTracking ? 'enabled' : 'disabled'}`,
                    this.isTracking ? 'success' : 'warning'
                );
            });
        }
        
        if (privacyToggle) {
            privacyToggle.addEventListener('change', (e) => {
                window.emotionVisualization.showNotification(
                    `Privacy mode ${e.target.checked ? 'enabled' : 'disabled'}`,
                    'info'
                );
            });
        }
        
        if (adaptiveToggle) {
            adaptiveToggle.addEventListener('change', (e) => {
                window.emotionVisualization.showNotification(
                    `Adaptive responses ${e.target.checked ? 'enabled' : 'disabled'}`,
                    'info'
                );
            });
        }
        
        const resetBtn = document.getElementById('resetBtn');
        const exportBtn = document.getElementById('exportBtn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSystem();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
    }
    
    resetSystem() {
        if (confirm("Are you sure you want to reset the system? This will clear all emotion data and history.")) {
            window.emotionSimulator.resetHistory();
            window.emotionSimulator.currentEmotion = window.emotionSimulator.emotions[5];
            
            window.emotionVisualization.updateEmotionFace(window.emotionSimulator.currentEmotion);
            window.emotionVisualization.updateHistoryChart('6h');
            this.updateSystemResponse(window.emotionSimulator.currentEmotion);
            
            this.isTracking = true;
            const trackingToggle = document.getElementById('trackingToggle');
            if (trackingToggle) trackingToggle.checked = true;
            
            window.emotionVisualization.showNotification(
                'System has been reset successfully',
                'success'
            );
        }
    }
    
    exportData() {
        const format = confirm("Export data as JSON? Click OK for JSON, Cancel for CSV") ? 'json' : 'csv';
        const data = window.emotionSimulator.exportData(format);
        
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emotion-data-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.emotionVisualization.showNotification(
            `Data exported as ${format.toUpperCase()}`,
            'success'
        );
    }
    
    setupEventListeners() {
        window.addEventListener('emotionChange', (e) => {
            const emotion = e.detail.emotion;
            window.emotionVisualization.updateEmotionFace(emotion);
            this.updateSystemResponse(emotion);
            
            if (this.currentModality === 'bio') {
                const bioData = window.emotionSimulator.generateBioSignals();
                window.emotionVisualization.updateBioSignalsDisplay(bioData);
            }
        });
        
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });
        
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.showProfileModal();
            });
        }
    }
    
    navigateToPage(page) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
        
        const pageNames = {
            dashboard: 'Dashboard',
            analytics: 'Analytics',
            history: 'History',
            settings: 'Settings'
        };
        
        window.emotionVisualization.showNotification(
            `Navigated to ${pageNames[page]}`,
            'info'
        );
    }
    
    showProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: var(--dark); margin: 0;"><i class="fas fa-user"></i> User Profile</h2>
                <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; color: var(--gray); cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div>
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: var(--dark);">Demo User</h3>
                        <p style="color: var(--gray); margin: 0;">EmotionSense Research Participant</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
                    <div style="padding: 15px; background: var(--light); border-radius: 12px; text-align: center;">
                        <div style="font-size: 0.9rem; color: var(--gray); margin-bottom: 5px;">Sessions</div>
                        <div style="font-size: 1.8rem; font-weight: 600; color: var(--primary);">42</div>
                    </div>
                    <div style="padding: 15px; background: var(--light); border-radius: 12px; text-align: center;">
                        <div style="font-size: 0.9rem; color: var(--gray); margin-bottom: 5px;">Hours Tracked</div>
                        <div style="font-size: 1.8rem; font-weight: 600; color: var(--primary);">168</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h4 style="color: var(--dark); margin-bottom: 15px;">Preferences</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--light-gray);">
                            <span style="color: var(--dark);">Notifications</span>
                            <label class="switch" style="margin: 0;">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--light-gray);">
                            <span style="color: var(--dark);">Dark Mode</span>
                            <label class="switch" style="margin: 0;">
                                <input type="checkbox">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button class="btn btn-outline" style="flex: 1;">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        const closeModal = () => {
            modal.remove();
        };
        
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

window.uiControls = new UIControls();