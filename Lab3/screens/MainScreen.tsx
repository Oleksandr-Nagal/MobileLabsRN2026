import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const INITIAL_DATA = [
    { id: '1', title: 'Новина 1', description: 'Опис першої новини...', image: 'https://picsum.photos/200' },
    { id: '2', title: 'Новина 2', description: 'Опис другої новини...', image: 'https://picsum.photos/201' },
    { id: '3', title: 'Новина 3', description: 'Опис третьої новини...', image: 'https://picsum.photos/202' },
];

export default function MainScreen({ navigation }: any) {
    const [data, setData] = useState(INITIAL_DATA);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false); // Додано стан завантаження

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setData(INITIAL_DATA);
            setRefreshing(false);
        }, 2000);
    };

    const loadMore = () => {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            const newData = [
                ...data,
                {
                    id: Math.random().toString(),
                    title: `Нова новина ${data.length + 1}`,
                    description: 'Додатковий опис...',
                    image: `https://picsum.photos/200?sig=${Math.random()}`
                },
            ];
            setData(newData);
            setLoading(false);
        }, 1500);
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', item)}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text numberOfLines={2}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data} // Виправлено: була помилка 'news'
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                // Параметри оптимізації (п. 2.3 методички)
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                ListHeaderComponent={<Text style={styles.headerText}>Останні новини</Text>}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#007AFF" /> : null}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    headerText: { fontSize: 22, fontWeight: 'bold', padding: 15, textAlign: 'center' }, // Додано стиль
    card: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', marginHorizontal: 10, borderRadius: 8 },
    image: { width: 80, height: 80, borderRadius: 8 },
    info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    separator: { height: 10 },
});