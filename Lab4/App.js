import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const ROOT_DIR = FileSystem.documentDirectory;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp);
  return d.toLocaleDateString('uk-UA') + ' ' + d.toLocaleTimeString('uk-UA');
}

function getFileExtension(name) {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function getFileTypeLabel(ext) {
  const types = {
    txt: 'Текст',
    json: 'JSON',
    js: 'JavaScript',
    ts: 'TypeScript',
    html: 'HTML',
    css: 'CSS',
    md: 'Markdown',
    png: 'Зображення PNG',
    jpg: 'Зображення JPEG',
    jpeg: 'Зображення JPEG',
    gif: 'Зображення GIF',
    pdf: 'Документ PDF',
    xml: 'XML',
  };
  return types[ext] || (ext ? ext.toUpperCase() : 'Невідомий');
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(ROOT_DIR);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);

  // Modals
  const [createFolderVisible, setCreateFolderVisible] = useState(false);
  const [createFileVisible, setCreateFileVisible] = useState(false);
  const [viewFileVisible, setViewFileVisible] = useState(false);
  const [fileInfoVisible, setFileInfoVisible] = useState(false);

  // Input states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [viewContent, setViewContent] = useState('');
  const [viewFileName, setViewFileName] = useState('');
  const [selectedFileInfo, setSelectedFileInfo] = useState(null);

  // Rename states
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [renameName, setRenameName] = useState('');

  const loadDirectory = useCallback(async (path) => {
    setLoading(true);
    try {
      const contents = await FileSystem.readDirectoryAsync(path);
      const detailed = await Promise.all(
        contents.map(async (name) => {
          const uri = path + name;
          try {
            const info = await FileSystem.getInfoAsync(uri);
            return {
              name,
              uri,
              isDirectory: info.isDirectory,
              size: ('size' in info ? info.size : 0) || 0,
              modificationTime: 'modificationTime' in info ? info.modificationTime : undefined,
              exists: info.exists,
            };
          } catch {
            return { name, uri, isDirectory: false, size: 0, exists: true };
          }
        })
      );
      detailed.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      setItems(detailed);
    } catch (e) {
      Alert.alert('Помилка', 'Неможливо прочитати директорію: ' + String(e));
    }
    setLoading(false);
  }, []);

  const loadStorageInfo = useCallback(async () => {
    try {
      const free = await FileSystem.getFreeDiskStorageAsync();
      const total = await FileSystem.getTotalDiskCapacityAsync();
      setStorageInfo({ total, free, used: total - free });
    } catch {
      setStorageInfo(null);
    }
  }, []);

  useEffect(() => {
    void loadDirectory(currentPath);
    void loadStorageInfo();
  }, [currentPath, loadDirectory, loadStorageInfo]);

  const navigateTo = (path) => {
    setCurrentPath(path.endsWith('/') ? path : path + '/');
  };

  const goUp = () => {
    if (currentPath === ROOT_DIR) return;
    const parts = currentPath.slice(0, -1).split('/');
    parts.pop();
    const parent = parts.join('/') + '/';
    if (parent.length >= ROOT_DIR.length) {
      setCurrentPath(parent);
    }
  };

  const getBreadcrumb = () => {
    if (!currentPath || !ROOT_DIR) return '/';
    const relative = currentPath.replace(ROOT_DIR, '');
    return '/' + (relative || '');
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть назву папки.');
      return;
    }
    try {
      await FileSystem.makeDirectoryAsync(currentPath + newFolderName.trim(), {
        intermediates: true,
      });
      setNewFolderName('');
      setCreateFolderVisible(false);
      await loadDirectory(currentPath);
    } catch (e) {
      Alert.alert('Помилка', 'Неможливо створити папку: ' + String(e));
    }
  };

  // Create file
  const handleCreateFile = async () => {
    let name = newFileName.trim();
    if (!name) {
      Alert.alert('Помилка', 'Будь ласка, введіть назву файлу.');
      return;
    }
    if (!name.endsWith('.txt')) name += '.txt';
    try {
      await FileSystem.writeAsStringAsync(currentPath + name, newFileContent);
      setNewFileName('');
      setNewFileContent('');
      setCreateFileVisible(false);
      await loadDirectory(currentPath);
    } catch (e) {
      Alert.alert('Помилка', 'Неможливо створити файл: ' + String(e));
    }
  };

  // View file
  const openFile = async (item) => {
    const ext = getFileExtension(item.name);
    if (ext !== 'txt') {
      Alert.alert('Інфо', 'Лише файли .txt можна відкрити для читання.');
      return;
    }
    try {
      const content = await FileSystem.readAsStringAsync(item.uri);
      setViewContent(content);
      setViewFileName(item.name);
      setViewFileVisible(true);
    } catch (e) {
      Alert.alert('Помилка', 'Неможливо прочитати файл: ' + String(e));
    }
  };

  // Delete
  const handleDelete = (item) => {
    Alert.alert(
      'Підтвердити видалення',
      `Ви дійсно хочете видалити "${item.name}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.uri);
              await loadDirectory(currentPath);
            } catch (e) {
              Alert.alert('Помилка', 'Неможливо видалити: ' + String(e));
            }
          },
        },
      ]
    );
  };

  // Rename file/folder
  const startRename = (item) => {
    setRenameItem(item);
    setRenameName(item.name);
    setRenameVisible(true);
  };

  const handleRename = async () => {
    const name = renameName.trim();
    if (!name) {
      Alert.alert('Помилка', 'Будь ласка, введіть нову назву.');
      return;
    }
    if (name === renameItem.name) {
      setRenameVisible(false);
      return;
    }
    const newUri = currentPath + name;
    try {
      // Check if target already exists
      const existing = await FileSystem.getInfoAsync(newUri);
      if (existing.exists) {
        Alert.alert('Помилка', 'Файл або папка з такою назвою вже існує.');
        return;
      }
      await FileSystem.moveAsync({ from: renameItem.uri, to: newUri });
      setRenameVisible(false);
      setRenameItem(null);
      setRenameName('');
      await loadDirectory(currentPath);
    } catch (e) {
      Alert.alert('Помилка', 'Неможливо перейменувати: ' + String(e));
    }
  };

  // File info
  const showFileInfo = async (item) => {
    try {
      const info = await FileSystem.getInfoAsync(item.uri, { size: true });
      const ext = getFileExtension(item.name);
      setSelectedFileInfo({
        name: item.name,
        type: item.isDirectory ? 'Папка' : getFileTypeLabel(ext),
        extension: ext || (item.isDirectory ? '-' : 'Немає'),
        size: item.isDirectory ? '-' : formatBytes(('size' in info ? info.size : 0) || 0),
        modified: ('modificationTime' in info && info.modificationTime)
          ? formatDate(info.modificationTime * 1000)
          : 'N/A',
        uri: item.uri,
      });
      setFileInfoVisible(true);
    } catch (e) {
      Alert.alert('Помилка', 'Неможливо отримати інформацію: ' + String(e));
    }
  };

  const renderItem = ({ item }) => {
    const ext = getFileExtension(item.name);
    const icon = item.isDirectory ? '📁' : ext === 'txt' ? '📄' : '📎';

    return (
      <View style={styles.itemRow}>
        <TouchableOpacity
          style={styles.itemMain}
          onPress={() => {
            if (item.isDirectory) {
              navigateTo(item.uri);
            } else {
              void openFile(item);
            }
          }}
        >
          <Text style={styles.itemIcon}>{icon}</Text>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemMeta}>
              {item.isDirectory ? 'Папка' : formatBytes(item.size)}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => showFileInfo(item)}
          >
            <Text style={styles.actionText}>ℹ️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => startRename(item)}
          >
            <Text style={styles.actionText}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Файловий менеджер</Text>
      </View>

      {/* Storage Info */}
      {storageInfo && (
        <View style={styles.storageBar}>
          <Text style={styles.storageTitle}>Пам'ять пристрою</Text>
          <View style={styles.storageRow}>
            <View style={styles.storageItem}>
              <Text style={styles.storageLabel}>Загальна</Text>
              <Text style={styles.storageValue}>
                {formatBytes(storageInfo.total)}
              </Text>
            </View>
            <View style={styles.storageItem}>
              <Text style={styles.storageLabel}>Використано</Text>
              <Text style={styles.storageValue}>
                {formatBytes(storageInfo.used)}
              </Text>
            </View>
            <View style={styles.storageItem}>
              <Text style={styles.storageLabel}>Вільно</Text>
              <Text style={styles.storageValue}>
                {formatBytes(storageInfo.free)}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={StyleSheet.flatten([
                styles.progressBarFill,
                {
                  width:
                    (storageInfo.used / storageInfo.total) * 100 + '%',
                },
              ])}
            />
          </View>
        </View>
      )}

      {/* Breadcrumb / Navigation */}
      <View style={styles.breadcrumb}>
        {currentPath !== ROOT_DIR && (
          <TouchableOpacity onPress={goUp} style={styles.backBtn}>
            <Text style={styles.backBtnText}>⬆️ Назад</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.breadcrumbText} numberOfLines={1}>
          {getBreadcrumb()}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setCreateFolderVisible(true)}
        >
          <Text style={styles.createBtnText}>+ Папка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setCreateFileVisible(true)}
        >
          <Text style={styles.createBtnText}>+ Файл .txt</Text>
        </TouchableOpacity>
      </View>

      {/* File list */}
      {loading ? (
        <ActivityIndicator size="large" color="#4A90D9" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ця папка порожня</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal: Create Folder */}
      <Modal visible={createFolderVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Нова папка</Text>
            <TextInput
              style={styles.input}
              placeholder="Назва папки"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setCreateFolderVisible(false);
                  setNewFolderName('');
                }}
              >
                <Text style={styles.modalCancelText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleCreateFolder}
              >
                <Text style={styles.modalConfirmText}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Create File */}
      <Modal visible={createFileVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новий файл .txt</Text>
            <TextInput
              style={styles.input}
              placeholder="Назва файлу"
              value={newFileName}
              onChangeText={setNewFileName}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Початковий вміст (необов'язково)"
              value={newFileContent}
              onChangeText={setNewFileContent}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setCreateFileVisible(false);
                  setNewFileName('');
                  setNewFileContent('');
                }}
              >
                <Text style={styles.modalCancelText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleCreateFile}
              >
                <Text style={styles.modalConfirmText}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: View File */}
      <Modal visible={viewFileVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.modalLarge]}>
            <Text style={styles.modalTitle}>{viewFileName}</Text>
            <ScrollView style={styles.fileContentBox}>
              <Text style={styles.fileContentText} selectable>{viewContent}</Text>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => setViewFileVisible(false)}
              >
                <Text style={styles.modalConfirmText}>Закрити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Rename */}
      <Modal visible={renameVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Перейменувати</Text>
            <TextInput
              style={styles.input}
              placeholder="Нова назва"
              value={renameName}
              onChangeText={setRenameName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setRenameVisible(false);
                  setRenameItem(null);
                  setRenameName('');
                }}
              >
                <Text style={styles.modalCancelText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleRename}
              >
                <Text style={styles.modalConfirmText}>Зберегти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: File Info */}
      <Modal visible={fileInfoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Інформація</Text>
            {selectedFileInfo && (
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ім'я:</Text>
                  <Text style={styles.infoValue}>{selectedFileInfo.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Тип:</Text>
                  <Text style={styles.infoValue}>{selectedFileInfo.type}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Розширення:</Text>
                  <Text style={styles.infoValue}>{selectedFileInfo.extension}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Розмір:</Text>
                  <Text style={styles.infoValue}>{selectedFileInfo.size}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Змінено:</Text>
                  <Text style={styles.infoValue}>{selectedFileInfo.modified}</Text>
                </View>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => setFileInfoVisible(false)}
              >
                <Text style={styles.modalConfirmText}>Закрити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#4A90D9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  storageBar: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storageItem: {
    alignItems: 'center',
    flex: 1,
  },
  storageLabel: {
    fontSize: 11,
    color: '#888',
  },
  storageValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 3,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  backBtn: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#EBF2FA',
    borderRadius: 6,
  },
  backBtnText: {
    fontSize: 13,
    color: '#4A90D9',
    fontWeight: '600',
  },
  breadcrumbText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  createBtn: {
    backgroundColor: '#4A90D9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemMeta: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
  actionText: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalLarge: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '600',
  },
  modalConfirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4A90D9',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  fileContentBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
    marginBottom: 12,
  },
  fileContentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  infoList: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    width: 90,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
});
