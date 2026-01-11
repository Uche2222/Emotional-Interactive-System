// emotion-engine.js - Clean Emotion Engine

class EmotionEngine {
    constructor() {
        this.emotionStates = {
            joy: {
                name: 'Joy',
                color: '#36D7B7',
                responseTemplates: [
                    "I can see you're feeling joyful! That's wonderful.",
                    "Your happiness is contagious! What's making you smile?",
                    "It's great to see you in such a positive mood!"
                ]
            },
            anger: {
                name: 'Anger',
                color: '#FF6B6B',
                responseTemplates: [
                    "I sense some frustration. Would you like to talk about it?",
                    "It's okay to feel upset. Let's take a moment to breathe.",
                    "I'm here to help you work through these feelings."
                ]
            },
            surprise: {
                name: 'Surprise',
                color: '#6C63FF',
                responseTemplates: [
                    "You seem surprised! Care to share what happened?",
                    "That was unexpected, wasn't it?",
                    "Surprises can be exciting or unsettling. How are you feeling about this?"
                ]
            },
            fear: {
                name: 'Fear',
                color: '#FFC75F',
                responseTemplates: [
                    "I sense some anxiety. Remember, you're safe here.",
                    "Fear is a natural response. Let's face this together.",
                    "Take a deep breath. You can get through this."
                ]
            },
            sadness: {
                name: 'Sadness',
                color: '#4A90E2',
                responseTemplates: [
                    "I'm here for you during this difficult time.",
                    "It's okay to feel sad. These feelings will pass.",
                    "Would you like to share what's on your mind?"
                ]
            },
            neutral: {
                name: 'Neutral',
                color: '#A5A7C5',
                responseTemplates: [
                    "How are you feeling today?",
                    "I'm here when you're ready to share.",
                    "Take your time. I'm listening."
                ]
            }
        };
        
        this.responseStyles = {
            professional: {
                tone: 'formal',
                empathyLevel: 'moderate'
            },
            friendly: {
                tone: 'casual',
                empathyLevel: 'high'
            },
            empathetic: {
                tone: 'caring',
                empathyLevel: 'very high'
            }
        };
        
        this.currentResponseStyle = 'friendly';
    }
    
    generateResponse(emotionData) {
        const emotionState = this.emotionStates[emotionData.type] || this.emotionStates.neutral;
        const style = this.responseStyles[this.currentResponseStyle];
        
        const templates = emotionState.responseTemplates;
        const baseResponse = templates[Math.floor(Math.random() * templates.length)];
        
        let enhancedResponse = this.applyResponseStyle(baseResponse, style);
        
        const emoji = this.getEmojiForEmotion(emotionData.type);
        enhancedResponse = `${enhancedResponse} ${emoji}`;
        
        return {
            text: enhancedResponse,
            emotionType: emotionData.type,
            timestamp: new Date(),
            style: this.currentResponseStyle
        };
    }
    
    applyResponseStyle(response, style) {
        switch(style.tone) {
            case 'formal':
                return response.charAt(0).toUpperCase() + response.slice(1);
            case 'casual':
                return response;
            case 'caring':
                return `I want you to know that ${response.toLowerCase()}`;
            default:
                return response;
        }
    }
    
    getEmojiForEmotion(emotionType) {
        const emojis = {
            joy: '😊',
            anger: '😠',
            surprise: '😲',
            fear: '😨',
            sadness: '😔',
            neutral: '😐'
        };
        
        return emojis[emotionType] || '🤖';
    }
    
    generateActivitySuggestion(emotionData) {
        const suggestions = {
            joy: [
                "Why not capture this moment by writing in a gratitude journal?",
                "Share your happiness with someone you care about!",
                "This is a great time to tackle a creative project you've been putting off."
            ],
            anger: [
                "Try some deep breathing exercises: inhale for 4 counts, hold for 4, exhale for 6.",
                "Physical activity can help - how about a brisk walk or some stretching?",
                "Write down what's bothering you, then tear it up as a symbolic release."
            ],
            sadness: [
                "Listening to calming music might help soothe your mood.",
                "Reach out to a friend or loved one for support.",
                "Sometimes watching a comforting movie or show can provide distraction and comfort."
            ],
            fear: [
                "Practice grounding techniques: name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste.",
                "Create a safe space for yourself, even if it's just a comfortable corner of a room.",
                "Breaking down what's worrying you into smaller, manageable steps can help."
            ],
            surprise: [
                "Take a moment to process what just happened before reacting.",
                "Share the surprising event with someone - talking it through can help.",
                "Journal about the experience to understand your reaction better."
            ],
            neutral: [
                "This could be a good time for some self-reflection or meditation.",
                "How about learning something new? Even 15 minutes on an interesting topic.",
                "Organize something small in your environment - a clean space can bring mental clarity."
            ]
        };
        
        const emotionSuggestions = suggestions[emotionData.type] || suggestions.neutral;
        return emotionSuggestions[Math.floor(Math.random() * emotionSuggestions.length)];
    }
    
    generateCalmingGuidance(emotionData) {
        const guidance = {
            joy: "Enjoy this positive state, but remember to stay grounded. Happiness is wonderful, but balance is key.",
            anger: "Your feelings are valid. Let's focus on breathing: in through the nose, out through the mouth. Count your breaths.",
            sadness: "It's okay to sit with these feelings. You don't need to fix everything right now. Just breathe.",
            fear: "You are safe in this moment. Focus on what you can control. One step at a time.",
            surprise: "Take a deep breath. Surprises can be disorienting. Give yourself permission to process.",
            neutral: "This calm state is perfect for mindfulness. Notice your breath, your body, your surroundings without judgment."
        };
        
        return guidance[emotionData.type] || guidance.neutral;
    }
    
    generateEmpatheticResponse(emotionData) {
        const empathy = {
            joy: "I'm genuinely happy to see you feeling this way. Joy is such a beautiful emotion to experience.",
            anger: "I understand how frustrating this must be for you. Your feelings are completely valid.",
            sadness: "My heart goes out to you. It takes courage to sit with these difficult emotions.",
            fear: "I can sense how unsettling this feels. Remember, I'm here with you through this.",
            surprise: "That must have been quite a shock. It's completely normal to need time to process.",
            neutral: "I'm here with you in this moment, whatever you're experiencing."
        };
        
        return empathy[emotionData.type] || empathy.neutral;
    }
    
    setResponseStyle(style) {
        if (this.responseStyles[style]) {
            this.currentResponseStyle = style;
            return true;
        }
        return false;
    }
}

window.emotionEngine = new EmotionEngine();