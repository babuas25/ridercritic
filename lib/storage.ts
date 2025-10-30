import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

/**
 * Upload a single image to Firebase Storage
 * @param file - The file to upload
 * @param path - Storage path (e.g., 'motorcycles/brand/model')
 * @returns Download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storageRef = ref(storage, `${path}/${fileName}`)
    
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Upload multiple images to Firebase Storage
 * @param files - Array of files to upload
 * @param path - Storage path
 * @returns Array of download URLs
 */
export async function uploadMultipleImages(files: File[], path: string): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, path))
    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw new Error('Failed to upload images')
  }
}

/**
 * Delete an image from Firebase Storage using its URL
 * @param imageUrl - The download URL of the image
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Delete multiple images from Firebase Storage
 * @param imageUrls - Array of image URLs to delete
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<void> {
  try {
    const deletePromises = imageUrls.map(url => deleteImage(url))
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error deleting multiple images:', error)
    throw new Error('Failed to delete images')
  }
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @returns true if valid, throws error if invalid
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.')
  }
  
  const maxSize = maxSizeMB * 1024 * 1024 // Convert MB to bytes
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit.`)
  }
  
  return true
}
