import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
    const fields = ['Електронна пошта', 'Пароль', 'Пароль (ще раз)', 'Прізвище', 'Ім\'я'];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Реєстрація</Text>
            {fields.map((label) => (
                <View key={label} style={styles.inputGroup}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={label.includes('Пароль') ? true : false}
                    />
                </View>
            ))}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Зареєструватися</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, backgroundColor: '#f9f9f9', flexGrow: 1 },
    header: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#333' },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, color: '#666', marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        fontSize: 16
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center'
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});