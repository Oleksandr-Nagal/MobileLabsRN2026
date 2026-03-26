import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function DetailsScreen({ route }: any) {
    const { title, description, image } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: image }} style={styles.fullImage} />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{description}</Text>
                <Text style={styles.text}>...</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    fullImage: { width: '100%', height: 300 },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    desc: { fontSize: 18, color: '#444', marginBottom: 10 },
    text: { fontSize: 16, lineHeight: 24, color: '#666' }
});