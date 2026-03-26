import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';

const generateData = (count: number, startId: number) => {
    return Array(count).fill(null).map((_, i) => ({
        id: (startId + i).toString(),
        title: `Новина №${startId + i}`,
        description: 'Це детальний опис новини для лабораторної роботи №2, де ми тестуємо FlatList.',
        image: `https://picsum.photos/200/300?random=${startId + i}`
    }));
};

export default function MainScreen({ navigation }: any) {
    const [data, setData] = useState(generateData(10, 1));
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setData(generateData(10, 1));
            setRefreshing(false);
        }, 2000);
    }, []);

    const loadMore = () => {
        if (loadingMore) return;
        setLoadingMore(true);
        setTimeout(() => {
            setData(prev => [...prev, ...generateData(10, prev.length + 1)]);
            setLoadingMore(false);
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
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={() => <Text style={styles.header}>Останні новини</Text>}
            ListFooterComponent={() => loadingMore ? <ActivityIndicator size="large" color="#007AFF" /> : <View style={{height: 20}}/>}
        />
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', padding: 15, backgroundColor: '#fff' },
    image: { width: 80, height: 80, borderRadius: 8 },
    info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    separator: { height: 1, backgroundColor: '#eee' },
    header: { fontSize: 20, fontWeight: 'bold', padding: 15, textAlign: 'center', backgroundColor: '#fff' }
});