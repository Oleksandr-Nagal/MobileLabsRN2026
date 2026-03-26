import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    text: string;
}

const NEWS_DATA: NewsItem[] = Array(8).fill(null).map((_, i) => ({
    id: i.toString(),
    title: 'Заголовок новини',
    date: 'Дата новини',
    text: 'Короткий текст новини',
}));

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={NEWS_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: NewsItem }) => (
                    <View style={styles.newsItem}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 10 },
    newsItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee'
    },
    title: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    date: { color: 'gray', fontSize: 12, marginBottom: 5 },
});