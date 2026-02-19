import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8001' : 'http://localhost:8001';

const LegalHomeScreen = ({ navigation }: { navigation: any }) => {
    const [isListening, setIsListening] = useState(false);
    const [response, setResponse] = useState("Tap the mic to speak to Sakhi.");

    const handleMicPress = () => {
        setIsListening(true);
        setResponse("Listening...");

        // Simulate Voice Input (since we don't have real voice in this demo)
        setTimeout(async () => {
            try {
                const simulatedSpeech = "I am facing domestic violence. What can I do?";
                setResponse(`You said: "${simulatedSpeech}"\n\nThinking...`);

                // Call Backend
                const formData = new FormData();
                formData.append('SpeechResult', simulatedSpeech);

                const res = await fetch(`${BACKEND_URL}/api/voice/process`, {
                    method: 'POST',
                    body: formData,
                });

                const text = await res.text();
                // Extract clean text from TwiML (Simple Regex for demo)
                const cleanText = text.match(/<Say.*?>(.*?)<\/Say>/)?.[1] || "Visual response not parsed.";

                setIsListening(false);
                setResponse(`Sakhi: ${cleanText}`);
            } catch (error) {
                console.error(error);
                setIsListening(false);
                setResponse("Error connecting to Sakhi Brain. Is Backend running?");
                Alert.alert("Connection Error", "Check if backend is running on port 8001.");
            }
        }, 2000);
    };

    const handleQuickExit = () => {
        // Immediately navigate back to Calculator pseudo-exit
        navigation.popToTop();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>JusticeVoice - Sakhi</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.responseText}>{response}</Text>

                <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
                    {isListening ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <Text style={styles.micText}>🎤</Text>
                    )}
                </TouchableOpacity>
                <Text style={styles.hint}>Tap to Speak</Text>
            </View>

            {/* QUICK EXIT BUTTON (Always Visible) */}
            <TouchableOpacity style={styles.exitButton} onPress={handleQuickExit}>
                <Text style={styles.exitText}>✖ QUICK EXIT</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 20, backgroundColor: '#6200ee', alignItems: 'center', marginTop: 30 },
    title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    responseText: { fontSize: 18, textAlign: 'center', marginBottom: 50, color: '#333' },
    micButton: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#6200ee', justifyContent: 'center', alignItems: 'center', elevation: 5 },
    micText: { fontSize: 40 },
    hint: { marginTop: 10, color: '#666' },
    exitButton: { position: 'absolute', bottom: 30, right: 30, backgroundColor: 'red', padding: 15, borderRadius: 30, elevation: 10 },
    exitText: { color: 'white', fontWeight: 'bold' },
});

export default LegalHomeScreen;
