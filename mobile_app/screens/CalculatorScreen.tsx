import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const CalculatorScreen = ({ navigation }: { navigation: any }) => {
    const [display, setDisplay] = useState('0');

    const handlePress = (val: string) => {
        if (val === 'C') {
            setDisplay('0');
        } else if (val === '=') {
            // STEALTH LOGIC
            if (display === '112') {
                navigation.navigate('LegalHome');
                setDisplay('0');
            } else if (display === '0000') {
                // DECORY TRIGGER (Fake Shopping List)
                Alert.alert("Decoy Mode Activated", "Opening Shopping List...");
                setDisplay('0');
            } else {
                // Real Calculator Logic (Simplified)
                try {
                    // eslint-disable-next-line no-eval
                    setDisplay(eval(display).toString());
                } catch (e) {
                    setDisplay('Error');
                }
            }
        } else {
            setDisplay(display === '0' ? val : display + val);
        }
    };

    const buttons = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['C', '0', '=', '+'],
    ];

    return (
        <View style={styles.container}>
            <View style={styles.displayContainer}>
                <Text style={styles.displayText}>{display}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {buttons.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((btn) => (
                            <TouchableOpacity
                                key={btn}
                                style={styles.button}
                                onPress={() => handlePress(btn)}
                            >
                                <Text style={styles.buttonText}>{btn}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#202020' },
    displayContainer: { flex: 1, justifyContent: 'flex-end', padding: 20 },
    displayText: { color: 'white', fontSize: 60, textAlign: 'right' },
    buttonsContainer: { flex: 2, paddingBottom: 20 },
    row: { flex: 1, flexDirection: 'row' },
    button: { flex: 1, justifyContent: 'center', alignItems: 'center', margin: 5, backgroundColor: '#333', borderRadius: 50 },
    buttonText: { color: 'white', fontSize: 30 },
});

export default CalculatorScreen;
