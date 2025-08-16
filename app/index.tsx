import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { AsyncStorageService } from '@/services/storage/AsyncStorageService'
import { Person } from '@/services/storage/types'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useState } from 'react'
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PersonasScreen() {
  const [personas, setPersonas] = useState<Person[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPerson, setCurrentPerson] = useState<Partial<Person> | null>(
    null
  )
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [photoUri, setPhotoUri] = useState('')
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()

  const loadPersonas = async () => {
    const allPersonas = await AsyncStorageService.getAll()
    setPersonas(allPersonas)
  }

  useFocusEffect(
    useCallback(() => {
      loadPersonas()
    }, [])
  )

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Por favor, otorgue permisos para subir una foto.'
      )
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Por favor, otorgue permisos para tomar una foto.'
      )
      return
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri)
    }
  }

  const handleAddPerson = () => {
    setCurrentPerson(null)
    setName('')
    setSurname('')
    setPhotoUri('')
    setModalVisible(true)
  }

  const handleEditPerson = (person: Person) => {
    setCurrentPerson(person)
    setName(person.name)
    setSurname(person.surname)
    setPhotoUri(person.photoUri || '')
    setModalVisible(true)
  }

  const handleDeletePerson = async (id: string) => {
    Alert.alert(
      'Borrar Persona',
      '¿Estás seguro de querer borrar esta persona?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Borrar',
          onPress: async () => {
            await AsyncStorageService.delete(id)
            loadPersonas()
          },
          style: 'destructive'
        }
      ]
    )
  }

  const handleSavePerson = async () => {
    if (!name || !surname) {
      Alert.alert('Error', 'Nombre y apellido son requeridos.')
      return
    }

    const personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      surname,
      photoUri: photoUri || undefined
    }

    if (currentPerson && currentPerson.id) {
      await AsyncStorageService.update(currentPerson.id, personData)
    } else {
      await AsyncStorageService.create(personData)
    }

    setModalVisible(false)
    loadPersonas()
  }

  const handleRemovePhoto = () => {
    setPhotoUri('')
  }

  const renderItem = ({ item }: { item: Person }) => (
    <TouchableOpacity style={styles.personItem}>
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.photo} />
      ) : (
        <Image
          source={require('../assets/images/user.png')}
          style={styles.photo}
        />
      )}
      <View style={styles.personInfo}>
        <ThemedText style={styles.personName}>
          {item.name} {item.surname}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <Button title="Actualizar" onPress={() => handleEditPerson(item)} />
        <Button
          title="Eliminar"
          onPress={() => handleDeletePerson(item.id)}
          color="red"
        />
      </View>
    </TouchableOpacity>
  )

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText style={styles.title}>Personas CRUD</ThemedText>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPerson}>
        <ThemedText style={styles.addButtonText}>Agregar Persona</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={personas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView
            style={[
              styles.modalContent,
              { backgroundColor: Colors[colorScheme ?? 'light'].background }
            ]}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                marginBottom: 20,
                textAlign: 'center',
                color: colorScheme === 'dark' ? 'white' : 'black',
                zIndex: 999
              }}
            >
              {currentPerson ? 'Editar Persona' : 'Agregar Persona'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={surname}
              onChangeText={setSurname}
            />
            <View style={styles.imagePickerButtons}>
              <Button title="Elegir una foto" onPress={pickImage} />
              <Button title="Tome una foto" onPress={takePhoto} />
            </View>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.previewPhoto} />
            ) : null}
            {photoUri ? (
              <Button
                title="Remover foto"
                onPress={handleRemovePhoto}
                color="orange"
              />
            ) : null}
            <View style={styles.modalButtons}>
              <Button title="Guardar" onPress={handleSavePerson} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    paddingTop: 20
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  listContent: {
    paddingBottom: 20
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#eee'
  },
  noPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    //backgroundImage: require('../../assets/images/default_user.png')
    backgroundColor: '#ccc'
  },
  personInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexWrap: 'wrap'
  },
  actions: {
    flexDirection: 'row',
    gap: 10
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: 'black'
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 3
  },
  previewPhoto: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#eee'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  }
})
