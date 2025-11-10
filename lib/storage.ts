import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'

/**
 * Sanitize storage path by replacing spaces and special characters
 * @param path - The path to sanitize
 * @returns Sanitized path
 */
export function sanitizeStoragePath(path: string): string {
  console.log('Original path:', path);
  const sanitized = path
    .split('/')
    .map(segment => {
      // Replace spaces with hyphens instead of underscores for better readability
      // Keep alphanumeric characters, dots, and hyphens
      return segment.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    })
    .join('/');
  console.log('Sanitized path:', sanitized);
  return sanitized;
}

/**
 * Upload a single image to Firebase Storage
 * @param file - The file to upload
 * @param path - Storage path (e.g., 'motorcycles/brand/model')
 * @returns Download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    console.log('Uploading image to path:', path); // Debug log
    console.log('File name:', file.name); // Debug log
    const timestamp = Date.now()
    // Use hyphens instead of underscores for consistency
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    console.log('Generated file name:', fileName); // Debug log
    const storageRef = ref(storage, `${path}/${fileName}`)
    console.log('Storage reference path:', storageRef.toString()); // Debug log
    
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    console.log('Download URL:', downloadURL); // Debug log
    
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
 * List all image download URLs under a storage folder
 * @param path - Storage folder path
 * @returns Array of download URLs
 */
export async function listFolderImages(path: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, path)
    const res = await listAll(folderRef)
    const urlPromises = res.items.map(itemRef => getDownloadURL(itemRef))
    const urls = await Promise.all(urlPromises)
    // Keep only plausible image URLs
    return urls.filter(Boolean)
  } catch (error) {
    console.error('Error listing folder images:', error)
    return []
  }
}

/**
 * List images from multiple folders beneath a basePath.
 * Returns a flat list preserving the provided folder order.
 */
export async function listImagesFromFolders(basePath: string, folders: string[]): Promise<string[]> {
  try {
    const results = await Promise.all(
      folders.map(folder => listFolderImages(`${basePath}/${folder}`))
    )
    return results.flat().filter(Boolean)
  } catch (error) {
    console.error('Error listing images from folders:', error)
    return []
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
