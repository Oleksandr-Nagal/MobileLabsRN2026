import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';

const CONTACTS = [
    { title: 'А', data: ['Андрій', 'Анна', 'Артем', 'Аліна', 'Антон'] },
    { title: 'Б', data: ['Богдан', 'Борис', 'Белла'] },
    { title: 'В', data: ['Вадим', 'Вікторія', 'Віталій', 'Валерія', 'Василь'] },
    { title: 'О', data: ['Олександр', 'Оксана', 'Олег', 'Ольга', 'Остап'] }
];

export default function ContactsScreen() {
    return (
        <View style={styles.container}>
            <SectionList
                sections={CONTACTS}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item}</Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                stickySectionHeadersEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    item: { padding: 15, backgroundColor: '#fff' },
    name: { fontSize: 16 },
    sectionHeader: { backgroundColor: '#f2f2f2', padding: 10 },
    sectionTitle: { fontWeight: 'bold', fontSize: 18, color: '#007AFF' },
    separator: { height: 1, backgroundColor: '#eee' }
});