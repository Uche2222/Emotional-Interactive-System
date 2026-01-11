// data-simulator.js - Clean Emotion Data Simulator

class EmotionDataSimulator {
    constructor() {
        this.emotions = [
            { 
                id: 'joy', 
                name: 'Joy', 
                color: '#36D7B7',
                valence: 0.8,
                arousal: 0.6,
                mouth: 'smile',
                intensity: 0.75,
                confidence: 0.92
            },
            { 
                id: 'anger', 
                name: 'Anger', 
                color: '#FF6B6B',
                valence: -0.7,
                arousal: 0.9,
                mouth: 'anger',
                intensity: 0.85,
                confidence: 0.88
            },
            { 
                id: 'surprise', 
                name: 'Surprise', 
                color: '#6C63FF',
                valence: 0.3,
                arousal: 0.8,
                mouth: 'surprise',
                intensity: 0.70,
                confidence: 0.85
            },
            { 
                id: 'fear', 
                name: 'Fear', 
                color: '#FFC75F',
                valence: -0.6,
                arousal: 0.7,
                mouth: 'fear',
                intensity: 0.65,
                confidence: 0.79
            },
            { 
                id: 'sadness', 
                name: 'Sadness', 
                color: '#4A90E2',
                valence: -0.8,
                arousal: -0.3,
                mouth: 'sad',
                intensity: 0.60,
                confidence: 0.83
            },
            { 
                id: 'neutral', 
                name: 'Neutral', 
                color: '#A5A7C5',
                valence: 0.1,
                arousal: 0.1,
                mouth: 'neutral',
                intensity: 0.30,
                confidence: 0.95
            }
        ];
        
        this.currentEmotion = this.emotions[5];
        this.emotionHistory = [];
        this.isSimulating = false;
        this.simulationInterval = null;
        this.startTime = new Date();
        
        this.initializeHistory();
    }
    
    initializeHistory() {
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
            const hour = time.getHours();
            
            let emotion;
            if (hour >= 22 || hour < 6) {
                emotion = Math.random() > 0.7 ? this.emotions[4] : this.emotions[5];
            } else if (hour >= 6 && hour < 9) {
                emotion = Math.random() > 0.5 ? this.emotions[2] : this.emotions[5];
            } else if (hour >= 9 && hour < 12) {
                emotion = Math.random() > 0.3 ? this.emotions[0] : this.emotions[5];
            } else if (hour >= 12 && hour < 14) {
                const rand = Math.random();
                if (rand < 0.4) emotion = this.emotions[0];
                else if (rand < 0.7) emotion = this.emotions[5];
                else emotion = this.emotions[1];
            } else if (hour >= 14 && hour < 18) {
                emotion = Math.random() > 0.6 ? this.emotions[3] : this.emotions[5];
            } else {
                emotion = Math.random() > 0.4 ? this.emotions[0] : this.emotions[5];
            }
            
            this.emotionHistory.push({
                emotion: { ...emotion },
                timestamp: time,
                intensity: emotion.intensity + (Math.random() * 0.3 - 0.15),
                source: 'simulated'
            });
        }
    }
    
    getRandomEmotion() {
        const weights = [0.2, 0.15, 0.15, 0.15, 0.15, 0.2];
        const cumulativeWeights = [];
        let sum = 0;
        
        weights.forEach(weight => {
            sum += weight;
            cumulativeWeights.push(sum);
        });
        
        const random = Math.random();
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (random < cumulativeWeights[i]) {
                return { ...this.emotions[i] };
            }
        }
        
        return { ...this.emotions[5] };
    }
    
    simulateEmotionChange() {
        if (!this.isSimulating) return;
        
        let newEmotion;
        if (Math.random() < 0.7) {
            const similarThreshold = 0.3;
            const similarEmotions = this.emotions.filter(e => 
                Math.abs(e.valence - this.currentEmotion.valence) < similarThreshold &&
                Math.abs(e.arousal - this.currentEmotion.arousal) < similarThreshold
            );
            
            if (similarEmotions.length > 0) {
                newEmotion = similarEmotions[Math.floor(Math.random() * similarEmotions.length)];
            } else {
                newEmotion = this.getRandomEmotion();
            }
        } else {
            newEmotion = this.getRandomEmotion();
        }
        
        newEmotion = {
            ...newEmotion,
            valence: newEmotion.valence + (Math.random() * 0.4 - 0.2),
            arousal: newEmotion.arousal + (Math.random() * 0.4 - 0.2),
            intensity: Math.min(1, Math.max(0.1, newEmotion.intensity + (Math.random() * 0.3 - 0.15))),
            confidence: Math.min(0.99, Math.max(0.7, newEmotion.confidence + (Math.random() * 0.1 - 0.05)))
        };
        
        this.currentEmotion = newEmotion;
        
        this.emotionHistory.push({
            emotion: { ...newEmotion },
            timestamp: new Date(),
            intensity: newEmotion.intensity,
            source: 'simulated'
        });
        
        if (this.emotionHistory.length > 1000) {
            this.emotionHistory.shift();
        }
        
        return newEmotion;
    }
    
    startSimulation(interval = 5000) {
        if (this.isSimulating) return;
        
        this.isSimulating = true;
        this.simulationInterval = setInterval(() => {
            const newEmotion = this.simulateEmotionChange();
            this.triggerEmotionChange(newEmotion);
        }, interval);
    }
    
    stopSimulation() {
        this.isSimulating = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }
    
    triggerEmotionChange(emotion) {
        const event = new CustomEvent('emotionChange', {
            detail: { emotion }
        });
        window.dispatchEvent(event);
    }
    
    getCurrentEmotion() {
        return { ...this.currentEmotion };
    }
    
    getEmotionHistory(timeRange = '6h') {
        const now = new Date();
        let cutoffTime;
        
        switch(timeRange) {
            case '1h':
                cutoffTime = new Date(now.getTime() - (60 * 60 * 1000));
                break;
            case '6h':
                cutoffTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
                break;
            case '24h':
                cutoffTime = new Date(now.getTime() - (24 * 60 * 60 * 1000));
                break;
            case '7d':
                cutoffTime = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                break;
            default:
                cutoffTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
        }
        
        return this.emotionHistory.filter(entry => 
            entry.timestamp >= cutoffTime
        );
    }
    
    getEmotionStats(timeRange = '6h') {
        const history = this.getEmotionHistory(timeRange);
        
        if (history.length === 0) {
            return {
                dominantEmotion: 'Neutral',
                emotionalVariability: 'Low',
                positiveRatio: '50%',
                peakIntensity: 0.5
            };
        }
        
        const emotionCount = {};
        history.forEach(entry => {
            const emotionName = entry.emotion.name;
            emotionCount[emotionName] = (emotionCount[emotionName] || 0) + 1;
        });
        
        let dominantEmotion = 'Neutral';
        let maxCount = 0;
        Object.keys(emotionCount).forEach(emotion => {
            if (emotionCount[emotion] > maxCount) {
                maxCount = emotionCount[emotion];
                dominantEmotion = emotion;
            }
        });
        
        const valences = history.map(entry => entry.emotion.valence);
        const meanValence = valences.reduce((a, b) => a + b, 0) / valences.length;
        const variance = valences.reduce((a, b) => a + Math.pow(b - meanValence, 2), 0) / valences.length;
        const stdDev = Math.sqrt(variance);
        
        let emotionalVariability;
        if (stdDev < 0.2) emotionalVariability = 'Low';
        else if (stdDev < 0.4) emotionalVariability = 'Medium';
        else emotionalVariability = 'High';
        
        const positiveCount = history.filter(entry => entry.emotion.valence > 0).length;
        const positiveRatio = Math.round((positiveCount / history.length) * 100);
        
        const peakIntensity = Math.max(...history.map(entry => entry.intensity));
        
        return {
            dominantEmotion,
            emotionalVariability,
            positiveRatio: `${positiveRatio}%`,
            peakIntensity: peakIntensity.toFixed(2)
        };
    }
    
    generateTextAnalysis(text) {
        const positiveWords = ['good', 'great', 'happy', 'excited', 'wonderful', 'awesome', 'love', 'like', 'amazing', 'fantastic'];
        const negativeWords = ['bad', 'sad', 'angry', 'mad', 'hate', 'terrible', 'awful', 'upset', 'negative', 'horrible'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
            if (text.toLowerCase().includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
            if (text.toLowerCase().includes(word)) negativeCount++;
        });
        
        const sentimentScore = positiveCount - negativeCount;
        let emotion;
        
        if (sentimentScore > 2) {
            emotion = this.emotions[0];
        } else if (sentimentScore > 0) {
            emotion = this.emotions[5];
        } else if (sentimentScore === 0) {
            emotion = this.emotions[5];
        } else if (sentimentScore > -3) {
            emotion = this.emotions[4];
        } else {
            emotion = this.emotions[1];
        }
        
        emotion = {
            ...emotion,
            valence: emotion.valence + (Math.random() * 0.2 - 0.1),
            arousal: emotion.arousal + (Math.random() * 0.2 - 0.1),
            intensity: Math.min(1, Math.max(0.3, emotion.intensity + (Math.random() * 0.2 - 0.1))),
            confidence: 0.8 + (Math.random() * 0.15)
        };
        
        return {
            emotion,
            sentimentScore,
            positiveWords: positiveCount,
            negativeWords: negativeCount
        };
    }
    
    generateBioSignals() {
        const baseHeartRate = 70;
        const baseGSR = 2.0;
        const baseTemp = 36.5;
        
        let heartRateVariation = 0;
        let gsrVariation = 0;
        let tempVariation = 0;
        
        switch(this.currentEmotion.id) {
            case 'joy':
                heartRateVariation = 5;
                gsrVariation = 0.1;
                tempVariation = -0.1;
                break;
            case 'anger':
                heartRateVariation = 15;
                gsrVariation = 0.5;
                tempVariation = 0.3;
                break;
            case 'surprise':
                heartRateVariation = 10;
                gsrVariation = 0.3;
                tempVariation = 0.1;
                break;
            case 'fear':
                heartRateVariation = 20;
                gsrVariation = 0.6;
                tempVariation = -0.2;
                break;
            case 'sadness':
                heartRateVariation = -5;
                gsrVariation = -0.1;
                tempVariation = -0.1;
                break;
        }
        
        const randomNoise = () => (Math.random() * 2 - 1);
        
        return {
            heartRate: Math.round(baseHeartRate + heartRateVariation + randomNoise()),
            gsr: (baseGSR + gsrVariation + (randomNoise() * 0.1)).toFixed(1),
            skinTemp: (baseTemp + tempVariation + (randomNoise() * 0.1)).toFixed(1),
            timestamp: new Date()
        };
    }
    
    resetHistory() {
        this.emotionHistory = [];
        this.initializeHistory();
    }
    
    exportData(format = 'json') {
        const data = {
            simulationStart: this.startTime,
            currentEmotion: this.currentEmotion,
            emotionHistory: this.emotionHistory,
            stats: this.getEmotionStats('24h')
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            let csv = 'Timestamp,Emotion,Valence,Arousal,Intensity\n';
            this.emotionHistory.forEach(entry => {
                csv += `${entry.timestamp.toISOString()},${entry.emotion.name},${entry.emotion.valence},${entry.emotion.arousal},${entry.intensity}\n`;
            });
            return csv;
        }
        
        return data;
    }
}

window.emotionSimulator = new EmotionDataSimulator();