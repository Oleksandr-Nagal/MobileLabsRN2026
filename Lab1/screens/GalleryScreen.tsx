import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

interface PhotoItem {
    id: string;
}

const PHOTOS: PhotoItem[] = Array(12).fill(null).map((_, i) => ({ id: i.toString() }));

export default function GalleryScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={PHOTOS}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={() => <View style={styles.photoBox} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', padding: 5 },
    photoBox: {
        backgroundColor: '#e0e0e0',
        height: 150,
        flex: 1,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});