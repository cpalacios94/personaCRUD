import Storage from './PlatformStorage'
import { Person } from './types'

const PERSONAS_STORAGE_KEY = '@crud_personas_data'

export class AsyncStorageService {
  // Crea una nueva persona
  static async create(item: Omit<Person, 'id' | 'createdAt'>): Promise<Person> {
    try {
      const existingData = await this.getAll()
      const newId = Date.now().toString()
      const newItem = {
        id: newId,
        ...item,
        createdAt: new Date().toISOString()
      }

      const updatedData = [...existingData, newItem]
      await Storage.setItem(PERSONAS_STORAGE_KEY, JSON.stringify(updatedData))

      return newItem
    } catch (error) {
      console.error('Error creating item:', error)
      throw error
    }
  }

  // Leer todos las personas almacenadas
  static async getAll() {
    try {
      const data = await Storage.getItem(PERSONAS_STORAGE_KEY)
      return data ? (JSON.parse(data) as Person[]) : []
    } catch (error) {
      console.error('Error getting all items:', error)
      return []
    }
  }

  // Leer una persona por ID
  static async getById(id: string): Promise<Person | null> {
    try {
      const data = await this.getAll()
      return data.find((item) => item.id === id) || null
    } catch (error) {
      console.error('Error getting item by ID:', error)
      return null
    }
  }

  // Actualizar una persona
  static async update(
    id: string,
    updatedFields: Partial<Person>
  ): Promise<Person> {
    try {
      const data = await this.getAll()
      const itemIndex = data.findIndex((item) => item.id === id)

      if (itemIndex === -1) {
        throw new Error('Item not found')
      }

      data[itemIndex] = {
        ...data[itemIndex],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      }

      await Storage.setItem(PERSONAS_STORAGE_KEY, JSON.stringify(data))
      return data[itemIndex]
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  // Eliminar una persona
  static async delete(id: string): Promise<boolean> {
    try {
      const data = await this.getAll()
      const filteredData = data.filter((item) => item.id !== id)

      if (data.length === filteredData.length) {
        throw new Error('Item not found')
      }

      await Storage.setItem(PERSONAS_STORAGE_KEY, JSON.stringify(filteredData))
      return true
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }
}
