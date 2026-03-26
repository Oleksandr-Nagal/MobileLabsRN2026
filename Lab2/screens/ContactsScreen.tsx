import React from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView } from 'react-native';

const CONTACTS = [
    { title: 'А', data: ['Андрій', 'Анна', 'Артем', 'Аліна', 'Антон'] },
    { title: 'Б', data: ['Богдан', 'Борис', 'Белла'] },
    { title: 'В', data: ['Вадим', 'Вікторія', 'Віталій', 'Валерія', 'Василь'] },
    { title: 'Г', data: ['Гліб', 'Ганна', 'Григорій'] },
    { title: 'Д', data: ['Дмитро', 'Дарина', 'Денис', 'Діана'] },
    { title: 'Е', data: ['Едуард', 'Емма', 'Евеліна'] },
    { title: 'З', data: ['Зінаїда', 'Захар', 'Зоряна'] },
    { title: 'І', data: ['Іван', 'Ірина', 'Ігор', 'Інна'] },
    { title: 'К', data: ['Катерина', 'Кирило', 'Костянтин', 'Крістіна'] },
    { title: 'М', data: ['Максим', 'Марія', 'Микола', 'Мирослава'] },
    { title: 'Н', data: ['Назар', 'Наталія', 'Ніна'] },
    { title: 'О', data: ['Олександр', 'Оксана', 'Олег', 'Ольга', 'Остап'] },
    { title: 'П', data: ['Петро', 'Поліна', 'Павло'] },
    { title: 'Р', data: ['Роман', 'Руслан', 'Раїса'] },
    { title: 'С', data: ['Сергій', 'Світлана', 'Степан', 'Софія'] },
    { title: 'Т', data: ['Тарас', 'Тетяна', 'Тимур'] },
    { title: 'Ю', data: ['Юрій', 'Юлія', 'Юліана'] },
    { title: 'Я', data: ['Ярослав', 'Яна', 'Яків'] }
];

export default function ContactsScreen() {
    return (
        <SafeAreaView style={styles.container}>
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
                // Додаємо відступи знизу для кращого вигляду
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    listContent: {
        paddingBottom: 20,
    },
    item: {
        padding: 15,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 16,
        color: '#333',
    },
    sectionHeader: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#007AFF',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    }
});