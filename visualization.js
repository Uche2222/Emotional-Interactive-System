// visualization.js - Clean Visualization Engine

class EmotionVisualization {
    constructor() {
        this.chartColors = {
            joy: '#36D7B7',
            anger: '#FF6B6B',
            surprise: '#6C63FF',
            fear: '#FFC75F',
            sadness: '#4A90E2',
            neutral: '#A5A7C5'
        };
        
        this.historyChart = null;
        this.audioVisualizer = null;
        this.isVisualizerActive = false;
    }
    
    initializeVisualizations() {
        this.initializeEmotionFace();
        this.initializeHistoryChart();
        this.initializeAudioVisualizer();
        this.initializeMetricBars();
    }
    
    updateEmotionFace(emotion) {
        const emotionFace = document.getElementById('emotionFace');
        const emotionMouth = document.getElementById('emotionMouth');
        const emotionName = document.getElementById('emotionName');
        
        if (!emotionFace || !emotionMouth || !emotionName) return;
        
        emotionFace.style.background = `linear-gradient(135deg, ${emotion.color}99, ${emotion.color})`;
        emotionName.textContent = emotion.name;
        emotionName.style.color = emotion.color;
        
        this.updateMouthShape(emotionMouth, emotion.mouth);
        
        emotionFace.className = 'emotion-face ' + emotion.id + '-animation';
        
        this.updateConfidenceBar(emotion.confidence);
        this.updateMetricBars(emotion);
    }
    
    updateMouthShape(mouthElement, mouthType) {
        mouthElement.style.width = '60px';
        mouthElement.style.height = '20px';
        mouthElement.style.borderRadius = '10px';
        mouthElement.style.marginTop = '40px';
        
        switch(mouthType) {
            case 'smile':
                mouthElement.style.borderRadius = '0 0 30px 30px';
                mouthElement.style.height = '25px';
                mouthElement.style.marginTop = '35px';
                break;
            case 'sad':
                mouthElement.style.borderRadius = '30px 30px 0 0';
                mouthElement.style.height = '20px';
                mouthElement.style.marginTop = '45px';
                break;
            case 'surprise':
                mouthElement.style.borderRadius = '50%';
                mouthElement.style.height = '30px';
                mouthElement.style.width = '30px';
                mouthElement.style.marginTop = '40px';
                break;
            case 'anger':
                mouthElement.style.borderRadius = '10px';
                mouthElement.style.height = '15px';
                mouthElement.style.width = '50px';
                mouthElement.style.marginTop = '45px';
                break;
            case 'fear':
                mouthElement.style.borderRadius = '20px';
                mouthElement.style.height = '10px';
                mouthElement.style.width = '40px';
                mouthElement.style.marginTop = '45px';
                break;
        }
    }
    
    updateConfidenceBar(confidence) {
        const confidenceFill = document.getElementById('confidenceFill');
        const confidenceValue = document.getElementById('confidenceValue');
        
        if (confidenceFill && confidenceValue) {
            const percentage = Math.min(100, Math.max(0, confidence * 100));
            confidenceFill.style.width = `${percentage}%`;
            confidenceValue.textContent = `${Math.round(percentage)}%`;
            
            if (percentage >= 80) {
                confidenceFill.style.background = 'linear-gradient(90deg, #36D7B7, #5FE3C9)';
            } else if (percentage >= 60) {
                confidenceFill.style.background = 'linear-gradient(90deg, #FFC75F, #FFD689)';
            } else {
                confidenceFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8A8A)';
            }
        }
    }
    
    updateMetricBars(emotion) {
        const valenceFill = document.getElementById('valenceFill');
        if (valenceFill) {
            const valencePercentage = ((emotion.valence + 1) / 2) * 100;
            valenceFill.style.width = `${valencePercentage}%`;
        }
        
        const arousalFill = document.getElementById('arousalFill');
        if (arousalFill) {
            const arousalPercentage = ((emotion.arousal + 1) / 2) * 100;
            arousalFill.style.width = `${arousalPercentage}%`;
        }
        
        const engagementFill = document.getElementById('engagementFill');
        if (engagementFill) {
            const engagementPercentage = emotion.intensity * 100;
            engagementFill.style.width = `${engagementPercentage}%`;
        }
        
        this.updateStressIndicator(emotion);
    }
    
    updateStressIndicator(emotion) {
        const indicatorDots = document.querySelectorAll('.indicator-dot');
        if (!indicatorDots.length) return;
        
        let stressLevel = 1;
        
        if (emotion.id === 'anger' || emotion.id === 'fear') {
            stressLevel = 4 + Math.floor(emotion.intensity * 2);
        } else if (emotion.id === 'sadness') {
            stressLevel = 3;
        } else if (emotion.id === 'surprise') {
            stressLevel = 2;
        }
        
        indicatorDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index < stressLevel) {
                dot.classList.add('active');
            }
        });
    }
    
    initializeHistoryChart() {
        const chartContainer = document.getElementById('historyChart');
        if (!chartContainer) return;
        
        chartContainer.innerHTML = '';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        
        chartContainer.appendChild(svg);
        this.historyChart = svg;
        
        this.updateHistoryChart('6h');
    }
    
    updateHistoryChart(timeRange = '6h') {
        if (!this.historyChart) return;
        
        const history = window.emotionSimulator.getEmotionHistory(timeRange);
        if (history.length === 0) return;
        
        this.historyChart.innerHTML = '';
        
        const padding = 5;
        const chartWidth = 100 - (padding * 2);
        const chartHeight = 100 - (padding * 2);
        
        this.drawGridLines(this.historyChart, chartWidth, chartHeight, padding);
        
        const timeExtent = this.getTimeExtent(history, timeRange);
        const valenceExtent = this.getValenceExtent(history);
        
        this.drawEmotionLine(this.historyChart, history, timeExtent, valenceExtent, chartWidth, chartHeight, padding);
        
        this.updateChartLegend();
        this.updateSummaryStats(timeRange);
    }
    
    drawGridLines(svg, width, height, padding) {
        for (let i = 0; i <= 4; i++) {
            const y = padding + (i * height / 4);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', padding);
            line.setAttribute('y1', y);
            line.setAttribute('x2', padding + width);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'rgba(165, 167, 197, 0.2)');
            line.setAttribute('stroke-width', '0.5');
            svg.appendChild(line);
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', padding - 2);
            label.setAttribute('y', y);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('font-size', '3');
            label.setAttribute('fill', '#A5A7C5');
            
            const valence = 1 - (i / 2);
            label.textContent = valence.toFixed(1);
            svg.appendChild(label);
        }
        
        const timeLabels = this.getTimeLabels();
        timeLabels.forEach((label, i) => {
            const x = padding + (i * width / (timeLabels.length - 1));
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', padding);
            line.setAttribute('x2', x);
            line.setAttribute('y2', padding + height);
            line.setAttribute('stroke', 'rgba(165, 167, 197, 0.2)');
            line.setAttribute('stroke-width', '0.5');
            svg.appendChild(line);
            
            const timeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            timeLabel.setAttribute('x', x);
            timeLabel.setAttribute('y', padding + height + 4);
            timeLabel.setAttribute('text-anchor', 'middle');
            timeLabel.setAttribute('font-size', '3');
            timeLabel.setAttribute('fill', '#A5A7C5');
            timeLabel.textContent = label;
            svg.appendChild(timeLabel);
        });
    }
    
    getTimeExtent(history, timeRange) {
        if (history.length === 0) return { min: 0, max: 1 };
        
        const timestamps = history.map(h => h.timestamp.getTime());
        return {
            min: Math.min(...timestamps),
            max: Math.max(...timestamps)
        };
    }
    
    getValenceExtent(history) {
        if (history.length === 0) return { min: -1, max: 1 };
        
        const valences = history.map(h => h.emotion.valence);
        const min = Math.min(...valences);
        const max = Math.max(...valences);
        
        const padding = Math.max(0.1, (max - min) * 0.1);
        return {
            min: Math.max(-1, min - padding),
            max: Math.min(1, max + padding)
        };
    }
    
    getTimeLabels() {
        const now = new Date();
        const labels = [];
        
        for (let i = 4; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 6 * 60 * 60 * 1000 / 4));
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
        }
        
        return labels;
    }
    
    drawEmotionLine(svg, history, timeExtent, valenceExtent, width, height, padding) {
        if (history.length < 2) return;
        
        let pathData = '';
        
        history.forEach((entry, index) => {
            const x = padding + ((entry.timestamp.getTime() - timeExtent.min) / (timeExtent.max - timeExtent.min)) * width;
            const y = padding + ((valenceExtent.max - entry.emotion.valence) / (valenceExtent.max - valenceExtent.min)) * height;
            
            if (index === 0) {
                pathData = `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
            
            const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            point.setAttribute('cx', x);
            point.setAttribute('cy', y);
            point.setAttribute('r', '1.5');
            point.setAttribute('fill', entry.emotion.color);
            point.setAttribute('stroke', 'white');
            point.setAttribute('stroke-width', '0.5');
            
            point.setAttribute('data-emotion', entry.emotion.name);
            point.setAttribute('data-time', entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            point.setAttribute('data-valence', entry.emotion.valence.toFixed(2));
            
            svg.appendChild(point);
        });
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#6C63FF');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('stroke-opacity', '0.7');
        svg.appendChild(path);
    }
    
    updateChartLegend() {
        const legendContainer = document.getElementById('chartLegend');
        if (!legendContainer) return;
        
        legendContainer.innerHTML = '';
        
        Object.entries(this.chartColors).forEach(([emotion, color]) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorDot = document.createElement('div');
            colorDot.className = 'legend-color';
            colorDot.style.backgroundColor = color;
            
            const label = document.createElement('span');
            label.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
            
            legendItem.appendChild(colorDot);
            legendItem.appendChild(label);
            legendContainer.appendChild(legendItem);
        });
    }
    
    updateSummaryStats(timeRange = '6h') {
        const stats = window.emotionSimulator.getEmotionStats(timeRange);
        
        const elements = {
            'dominantEmotion': stats.dominantEmotion,
            'emotionalVariability': stats.emotionalVariability,
            'positiveRatio': stats.positiveRatio,
            'peakIntensity': stats.peakIntensity
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    initializeAudioVisualizer() {
        this.audioVisualizer = document.getElementById('audioVisualizer');
        if (!this.audioVisualizer) return;
        
        this.generateAudioBars();
    }
    
    generateAudioBars() {
        if (!this.audioVisualizer) return;
        
        this.audioVisualizer.innerHTML = '';
        const barCount = 40;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.left = `${(i / barCount) * 100}%`;
            bar.style.animationDelay = `${i * 0.05}s`;
            bar.style.height = `${20 + Math.random() * 70}%`;
            bar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            this.audioVisualizer.appendChild(bar);
        }
    }
    
    startAudioVisualization() {
        if (!this.audioVisualizer || this.isVisualizerActive) return;
        
        this.isVisualizerActive = true;
        const bars = this.audioVisualizer.querySelectorAll('.visualizer-bar');
        
        const animateBars = () => {
            if (!this.isVisualizerActive) return;
            
            bars.forEach(bar => {
                const newHeight = 20 + Math.random() * 70;
                bar.style.height = `${newHeight}%`;
                
                const hue = 255 + (Math.random() * 20 - 10);
                bar.style.backgroundColor = `hsl(${hue}, 100%, 65%)`;
            });
            
            setTimeout(animateBars, 100);
        };
        
        animateBars();
    }
    
    stopAudioVisualization() {
        this.isVisualizerActive = false;
        
        if (this.audioVisualizer) {
            const bars = this.audioVisualizer.querySelectorAll('.visualizer-bar');
            bars.forEach(bar => {
                bar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            });
        }
    }
    
    updateBioSignalsDisplay(bioData) {
        const heartRateElement = document.getElementById('heartRate');
        if (heartRateElement && bioData.heartRate) {
            heartRateElement.textContent = `${bioData.heartRate} BPM`;
        }
        
        const gsrElement = document.getElementById('gsrValue');
        if (gsrElement && bioData.gsr) {
            gsrElement.textContent = `${bioData.gsr} µS`;
        }
        
        const tempElement = document.getElementById('skinTemp');
        if (tempElement && bioData.skinTemp) {
            tempElement.textContent = `${bioData.skinTemp}°C`;
        }
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let bgColor, icon;
        switch(type) {
            case 'success':
                bgColor = 'var(--success)';
                icon = 'fas fa-check-circle';
                break;
            case 'warning':
                bgColor = 'var(--warning)';
                icon = 'fas fa-exclamation-triangle';
                break;
            case 'error':
                bgColor = 'var(--danger)';
                icon = 'fas fa-times-circle';
                break;
            case 'info':
            default:
                bgColor = 'var(--primary)';
                icon = 'fas fa-info-circle';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            background: ${bgColor};
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 350px;
            font-size: 0.9rem;
            animation: slideInRight 0.3s ease;
        `;
        
        const iconEl = document.createElement('i');
        iconEl.className = icon;
        
        const text = document.createElement('span');
        text.textContent = message;
        
        notification.appendChild(iconEl);
        notification.appendChild(text);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

window.emotionVisualization = new EmotionVisualization();