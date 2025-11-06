import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Query,
  DocumentData
} from 'firebase/firestore'
import { db } from './firebase'
import { MotorcycleFormData } from '@/types/motorcycle'

const MOTORCYCLES_COLLECTION = 'motorcycles'

/**
 * Create a new motorcycle document
 * @param motorcycleData - Motorcycle form data
 * @param userId - ID of the user creating the motorcycle
 * @returns The created motorcycle ID
 */
export async function createMotorcycle(
  motorcycleData: MotorcycleFormData,
  userId: string
): Promise<string> {
  try {
    const motorcyclesRef = collection(db, MOTORCYCLES_COLLECTION)
    const newDocRef = doc(motorcyclesRef)
    
    const motorcycleWithMetadata = {
      ...motorcycleData,
      id: newDocRef.id,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastUpdatedBy: userId,
      lastUpdatedDate: new Date().toISOString()
    }
    
    await setDoc(newDocRef, motorcycleWithMetadata)
    
    return newDocRef.id
  } catch (error) {
    console.error('Error creating motorcycle:', error)
    throw new Error('Failed to create motorcycle')
  }
}

/**
 * Get a single motorcycle by ID
 * @param motorcycleId - Motorcycle document ID
 * @returns Motorcycle data or null if not found
 */
export async function getMotorcycle(motorcycleId: string): Promise<MotorcycleFormData | null> {
  try {
    const motorcycleRef = doc(db, MOTORCYCLES_COLLECTION, motorcycleId)
    const motorcycleSnap = await getDoc(motorcycleRef)
    
    if (motorcycleSnap.exists()) {
      return motorcycleSnap.data() as MotorcycleFormData
    }
    
    return null
  } catch (error) {
    console.error('Error fetching motorcycle:', error)
    throw new Error('Failed to fetch motorcycle')
  }
}

/**
 * Update an existing motorcycle
 * @param motorcycleId - Motorcycle document ID
 * @param motorcycleData - Updated motorcycle data
 * @param userId - ID of the user updating the motorcycle
 */
export async function updateMotorcycle(
  motorcycleId: string,
  motorcycleData: Partial<MotorcycleFormData>,
  userId: string
): Promise<void> {
  try {
    const motorcycleRef = doc(db, MOTORCYCLES_COLLECTION, motorcycleId)
    
    const updateData = {
      ...motorcycleData,
      updatedAt: serverTimestamp(),
      lastUpdatedBy: userId,
      lastUpdatedDate: new Date().toISOString()
    }
    
    await updateDoc(motorcycleRef, updateData)
  } catch (error) {
    console.error('Error updating motorcycle:', error)
    throw new Error('Failed to update motorcycle')
  }
}

/**
 * Delete a motorcycle
 * @param motorcycleId - Motorcycle document ID
 */
export async function deleteMotorcycle(motorcycleId: string): Promise<void> {
  try {
    const motorcycleRef = doc(db, MOTORCYCLES_COLLECTION, motorcycleId)
    await deleteDoc(motorcycleRef)
  } catch (error) {
    console.error('Error deleting motorcycle:', error)
    throw new Error('Failed to delete motorcycle')
  }
}

/**
 * Get all motorcycles with optional filters
 * @param filters - Optional filters (brand, category, status)
 * @param limitCount - Number of motorcycles to return (default: 50)
 * @returns Array of motorcycles
 */
export async function getAllMotorcycles(
  filters?: {
    brand?: string
    category?: string
    status?: string
  },
  limitCount: number = 50
): Promise<MotorcycleFormData[]> {
  try {
    const motorcyclesRef = collection(db, MOTORCYCLES_COLLECTION)
    let q: Query<DocumentData>
    
    // If filtering by status with other filters or ordering, we need an index
    // For now, use simpler queries until index is built
    if (filters?.status && !filters?.brand && !filters?.category) {
      // Simple status filter with ordering - requires index
      q = query(
        motorcyclesRef,
        where('status', '==', filters.status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    } else if (filters?.status) {
      // Multiple filters - get all by status first, then filter in memory
      q = query(
        motorcyclesRef,
        where('status', '==', filters.status),
        limit(limitCount * 2) // Get more to account for filtering
      )
    } else {
      // No status filter - simple query
      q = query(motorcyclesRef, orderBy('createdAt', 'desc'), limit(limitCount))
      
      // Apply other filters
      if (filters?.brand) {
        q = query(q, where('brand', '==', filters.brand))
      }
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category))
      }
    }
    
    const querySnapshot = await getDocs(q)
    let motorcycles: MotorcycleFormData[] = []
    
    querySnapshot.forEach((doc) => {
      motorcycles.push(doc.data() as MotorcycleFormData)
    })
    
    // Apply additional filters in memory if needed
    if (filters?.brand && filters?.status) {
      motorcycles = motorcycles.filter(m => m.brand === filters.brand)
    }
    if (filters?.category && filters?.status) {
      motorcycles = motorcycles.filter(m => m.category === filters.category)
    }
    
    // Sort by createdAt if we filtered in memory
    if (filters?.status && (filters?.brand || filters?.category)) {
      motorcycles.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as string | Date).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt as string | Date).getTime() : 0
        return dateB - dateA
      })
    }
    
    // Limit results
    return motorcycles.slice(0, limitCount)
  } catch (error) {
    console.error('Error fetching motorcycles:', error)
    throw new Error('Failed to fetch motorcycles')
  }
}

/**
 * Get motorcycles by brand
 * @param brand - Brand name
 * @returns Array of motorcycles for the specified brand
 */
export async function getMotorcyclesByBrand(brand: string): Promise<MotorcycleFormData[]> {
  return getAllMotorcycles({ brand })
}

/**
 * Get motorcycles by category
 * @param category - Category name
 * @returns Array of motorcycles in the specified category
 */
export async function getMotorcyclesByCategory(category: string): Promise<MotorcycleFormData[]> {
  return getAllMotorcycles({ category })
}

/**
 * Save draft motorcycle
 * @param draftData - Draft motorcycle data
 * @param userId - User ID
 * @param draftId - Optional draft ID (for updating existing draft)
 * @returns Draft ID
 */
export async function saveDraft(
  draftData: Partial<MotorcycleFormData>,
  userId: string,
  draftId?: string
): Promise<string> {
  try {
    const draftsRef = collection(db, 'motorcycle_drafts')
    const docRef = draftId ? doc(draftsRef, draftId) : doc(draftsRef)
    
    const draftWithMetadata = {
      ...draftData,
      id: docRef.id,
      userId,
      updatedAt: serverTimestamp(),
      lastSaved: new Date().toISOString()
    }
    
    await setDoc(docRef, draftWithMetadata, { merge: true })
    
    return docRef.id
  } catch (error) {
    console.error('Error saving draft:', error)
    throw new Error('Failed to save draft')
  }
}

/**
 * Get user's drafts
 * @param userId - User ID
 * @returns Array of draft motorcycles
 */
export async function getUserDrafts(userId: string): Promise<Partial<MotorcycleFormData>[]> {
  try {
    const draftsRef = collection(db, 'motorcycle_drafts')
    const q = query(draftsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const drafts: Partial<MotorcycleFormData>[] = []
    
    querySnapshot.forEach((doc) => {
      drafts.push(doc.data() as Partial<MotorcycleFormData>)
    })
    
    return drafts
  } catch (error) {
    console.error('Error fetching drafts:', error)
    throw new Error('Failed to fetch drafts')
  }
}

/**
 * Delete a draft
 * @param draftId - Draft document ID
 */
export async function deleteDraft(draftId: string): Promise<void> {
  try {
    const draftRef = doc(db, 'motorcycle_drafts', draftId)
    await deleteDoc(draftRef)
  } catch (error) {
    console.error('Error deleting draft:', error)
    throw new Error('Failed to delete draft')
  }
}

/**
 * Export all motorcycles as CSV
 * @returns CSV string with all motorcycle data
 */
export async function exportMotorcyclesToCSV(): Promise<string> {
  try {
    const motorcycles = await getAllMotorcycles()
    
    if (motorcycles.length === 0) {
      return ''
    }
    
    // Define the fields to export (excluding functions and complex objects)
    const fields = [
      'id',
      'brand',
      'modelName',
      'variantName',
      'modelYear',
      'category',
      'segment',
      'originCountry',
      'assemblyCountry',
      'status',
      'coverImage',
      'modelVideo',
      'engineType',
      'displacement',
      'cylinderCount',
      'valveSystem',
      'valvesPerCylinder',
      'strokeType',
      'boreXStroke',
      'compressionRatio',
      'fuelType',
      'fuelSupplySystem',
      'ignitionType',
      'lubricationSystem',
      'engineCoolingType',
      'radiatorFanType',
      'airFilterType',
      'startType',
      'idleStopSystem',
      'maxPowerHP',
      'maxPowerKW',
      'maxPowerRPM',
      'maxTorqueNm',
      'maxTorqueRPM',
      'powerToWeightRatio',
      'topSpeed',
      'acceleration0to60',
      'acceleration0to100',
      'mileage',
      'range',
      'revLimiter',
      'engineRedline',
      'ecoModeEfficiency',
      'transmissionType',
      'numberOfGears',
      'gearRatio',
      'clutchType',
      'finalDriveType',
      'shiftPattern',
      'quickShifter',
      'autoBlipper',
      'gearIndicator',
      'emissionStandard',
      'catalyticConverter',
      'obd',
      'fuelEconomyRideModes',
      'fuelInjectionMapping',
      'throttleResponse',
      'absType',
      'tractionControlSystem',
      'launchControl',
      'wheelieControl',
      'cruiseControl',
      'engineBrakingManagement',
      'slipperClutchAssist',
      'antiStallHillAssist',
      'frameType',
      'swingarmType',
      'frontSuspension',
      'rearSuspension',
      'suspensionTravelFront',
      'suspensionTravelRear',
      'steeringAngle',
      'turningRadius',
      'frontBrakeType',
      'frontBrakeSize',
      'rearBrakeType',
      'rearBrakeSize',
      'absSupport',
      'brakeCaliperType',
      'cbs',
      'wheelType',
      'frontTyreSize',
      'rearTyreSize',
      'tyreType',
      'tyreBrand',
      'wheelSizeFront',
      'wheelSizeRear',
      'overallLength',
      'overallWidth',
      'overallHeight',
      'wheelbase',
      'groundClearance',
      'seatHeight',
      'kerbWeight',
      'dryWeight',
      'fuelTankCapacity',
      'reserveFuelCapacity',
      'loadCapacity',
      'oilCapacity',
      'batteryCapacity',
      'centerOfGravityHeight',
      'instrumentConsole',
      'displaySize',
      'connectivity',
      'mobileAppIntegration',
      'turnByTurnNavigation',
      'ridingStatistics',
      'headlightType',
      'drl',
      'tailLightType',
      'indicatorType',
      'adjustableWindshield',
      'seatType',
      'handleType',
      'footpegPosition',
      'sideStandEngineCutoff',
      'tpms',
      'keylessIgnition',
      'immobilizer',
      'centralLocking',
      'sosCrashDetection',
      'adjustableSuspension',
      'ridingModes',
      'warrantyYears',
      'warrantyKm',
      'freeServiceCount',
      'serviceIntervalKm',
      'serviceIntervalMonths',
      'exShowroomPrice',
      'onRoadPrice',
      'currency',
      'availability',
      'launchDate',
      'marketSegment',
      'specialEditions',
      'description',
      'seoMetaTitle',
      'seoMetaDescription',
      'adminNotes',
      'dataCompletionPercentage',
      'reviewStatus',
      'lastUpdatedBy',
      'lastUpdatedDate'
    ]
    
    // Create CSV header
    const csvHeader = fields.join(',')
    
    // Create CSV rows
    const csvRows = motorcycles.map(motorcycle => {
      return fields.map(field => {
        const value = motorcycle[field as keyof MotorcycleFormData]
        if (value === undefined || value === null) {
          return ''
        }
        // Handle arrays - convert to JSON string
        if (Array.isArray(value)) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }
        // Handle booleans - convert to string
        if (typeof value === 'boolean') {
          return value.toString()
        }
        // Handle strings - escape quotes and wrap in quotes
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`
        }
        // Handle other values
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    })
    
    return [csvHeader, ...csvRows].join('\n')
  } catch (error) {
    console.error('Error exporting motorcycles to CSV:', error)
    throw new Error('Failed to export motorcycles')
  }
}

/**
 * Import motorcycles from CSV data
 * @param csvData - CSV string with motorcycle data
 * @param userId - ID of the user importing the motorcycles
 * @returns Array of imported motorcycle IDs
 */
export async function importMotorcyclesFromCSV(csvData: string, userId: string): Promise<string[]> {
  try {
    const lines = csvData.split('\n').filter(line => line.trim() !== '')
    if (lines.length < 2) {
      throw new Error('Invalid CSV format')
    }
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    
    // Parse rows
    const importedIds: string[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => {
        // Remove surrounding quotes and unescape
        return v.replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
      })
      
      // Create motorcycle object
      const motorcycleData: Record<string, unknown> = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        if (value === undefined) return
        
        // Handle special fields
        if (header === 'galleryImages' || header === 'competitorModels' || header === 'availableColors' || header === 'colorImages' || header === 'keyHighlights' || header === 'pros' || header === 'cons' || header === 'tags' || header === 'relatedModels' || header === 'variants') {
          // Parse JSON arrays
          try {
            motorcycleData[header] = JSON.parse(value)
          } catch {
            motorcycleData[header] = []
          }
        } else if (header === 'idleStopSystem' || header === 'catalyticConverter' || header === 'mobileAppIntegration' || header === 'turnByTurnNavigation' || header === 'ridingStatistics' || header === 'drl' || header === 'adjustableWindshield' || header === 'sideStandEngineCutoff' || header === 'tpms' || header === 'keylessIgnition' || header === 'immobilizer' || header === 'centralLocking' || header === 'sosCrashDetection' || header === 'adjustableSuspension' || header === 'ridingModes' || header === 'tractionControlSystem' || header === 'launchControl' || header === 'wheelieControl' || header === 'cruiseControl' || header === 'engineBrakingManagement' || header === 'slipperClutchAssist' || header === 'antiStallHillAssist' || header === 'quickShifter' || header === 'autoBlipper' || header === 'gearIndicator' || header === 'cbs') {
          // Parse booleans
          motorcycleData[header] = value.toLowerCase() === 'true'
        } else if (header === 'dataCompletionPercentage') {
          // Parse numbers
          motorcycleData[header] = parseInt(value) || 0
        } else {
          // Keep as string
          motorcycleData[header] = value
        }
      })
      
      // Skip if essential fields are missing
      if (!motorcycleData.brand || !motorcycleData.modelName || !motorcycleData.modelYear) {
        console.warn(`Skipping row ${i} due to missing required fields`)
        continue
      }
      
      // Remove ID if present to create a new motorcycle
      delete motorcycleData.id
      
      // Create the motorcycle
      const motorcycleId = await createMotorcycle(motorcycleData as unknown as MotorcycleFormData, userId)
      importedIds.push(motorcycleId)
    }
    
    return importedIds
  } catch (error) {
    console.error('Error importing motorcycles from CSV:', error)
    throw new Error('Failed to import motorcycles')
  }
}

/**
 * Export a single motorcycle as JSON
 * @param motorcycleId - Motorcycle ID to export
 * @returns JSON string with motorcycle data
 */
export async function exportMotorcycleToJSON(motorcycleId: string): Promise<string> {
  try {
    const motorcycle = await getMotorcycle(motorcycleId)
    if (!motorcycle) {
      throw new Error('Motorcycle not found')
    }
    
    return JSON.stringify(motorcycle, null, 2)
  } catch (error) {
    console.error('Error exporting motorcycle to JSON:', error)
    throw new Error('Failed to export motorcycle')
  }
}

/**
 * Export a single motorcycle as CSV
 * @param motorcycleId - Motorcycle ID to export
 * @returns CSV string with motorcycle data
 */
export async function exportMotorcycleToCSV(motorcycleId: string): Promise<string> {
  try {
    const motorcycle = await getMotorcycle(motorcycleId)
    if (!motorcycle) {
      throw new Error('Motorcycle not found')
    }
    
    // Define the fields to export
    const fields = [
      'id',
      'brand',
      'modelName',
      'variantName',
      'modelYear',
      'category',
      'segment',
      'originCountry',
      'assemblyCountry',
      'status',
      'coverImage',
      'modelVideo',
      'engineType',
      'displacement',
      'cylinderCount',
      'valveSystem',
      'valvesPerCylinder',
      'strokeType',
      'boreXStroke',
      'compressionRatio',
      'fuelType',
      'fuelSupplySystem',
      'ignitionType',
      'lubricationSystem',
      'engineCoolingType',
      'radiatorFanType',
      'airFilterType',
      'startType',
      'idleStopSystem',
      'maxPowerHP',
      'maxPowerKW',
      'maxPowerRPM',
      'maxTorqueNm',
      'maxTorqueRPM',
      'powerToWeightRatio',
      'topSpeed',
      'acceleration0to60',
      'acceleration0to100',
      'mileage',
      'range',
      'revLimiter',
      'engineRedline',
      'ecoModeEfficiency',
      'transmissionType',
      'numberOfGears',
      'gearRatio',
      'clutchType',
      'finalDriveType',
      'shiftPattern',
      'quickShifter',
      'autoBlipper',
      'gearIndicator',
      'emissionStandard',
      'catalyticConverter',
      'obd',
      'fuelEconomyRideModes',
      'fuelInjectionMapping',
      'throttleResponse',
      'absType',
      'tractionControlSystem',
      'launchControl',
      'wheelieControl',
      'cruiseControl',
      'engineBrakingManagement',
      'slipperClutchAssist',
      'antiStallHillAssist',
      'frameType',
      'swingarmType',
      'frontSuspension',
      'rearSuspension',
      'suspensionTravelFront',
      'suspensionTravelRear',
      'steeringAngle',
      'turningRadius',
      'frontBrakeType',
      'frontBrakeSize',
      'rearBrakeType',
      'rearBrakeSize',
      'absSupport',
      'brakeCaliperType',
      'cbs',
      'wheelType',
      'frontTyreSize',
      'rearTyreSize',
      'tyreType',
      'tyreBrand',
      'wheelSizeFront',
      'wheelSizeRear',
      'overallLength',
      'overallWidth',
      'overallHeight',
      'wheelbase',
      'groundClearance',
      'seatHeight',
      'kerbWeight',
      'dryWeight',
      'fuelTankCapacity',
      'reserveFuelCapacity',
      'loadCapacity',
      'oilCapacity',
      'batteryCapacity',
      'centerOfGravityHeight',
      'instrumentConsole',
      'displaySize',
      'connectivity',
      'mobileAppIntegration',
      'turnByTurnNavigation',
      'ridingStatistics',
      'headlightType',
      'drl',
      'tailLightType',
      'indicatorType',
      'adjustableWindshield',
      'seatType',
      'handleType',
      'footpegPosition',
      'sideStandEngineCutoff',
      'tpms',
      'keylessIgnition',
      'immobilizer',
      'centralLocking',
      'sosCrashDetection',
      'adjustableSuspension',
      'ridingModes',
      'warrantyYears',
      'warrantyKm',
      'freeServiceCount',
      'serviceIntervalKm',
      'serviceIntervalMonths',
      'exShowroomPrice',
      'onRoadPrice',
      'currency',
      'availability',
      'launchDate',
      'marketSegment',
      'specialEditions',
      'description',
      'seoMetaTitle',
      'seoMetaDescription',
      'adminNotes',
      'dataCompletionPercentage',
      'reviewStatus',
      'lastUpdatedBy',
      'lastUpdatedDate'
    ]
    
    // Create CSV header
    const csvHeader = fields.join(',')
    
    // Create CSV row
    const csvRow = fields.map(field => {
      const value = motorcycle[field as keyof MotorcycleFormData]
      if (value === undefined || value === null) {
        return ''
      }
      // Handle arrays - convert to JSON string
      if (Array.isArray(value)) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      // Handle booleans - convert to string
      if (typeof value === 'boolean') {
        return value.toString()
      }
      // Handle strings - escape quotes and wrap in quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`
      }
      // Handle other values
      return `"${String(value).replace(/"/g, '""')}"`
    }).join(',')
    
    return [csvHeader, csvRow].join('\n')
  } catch (error) {
    console.error('Error exporting motorcycle to CSV:', error)
    throw new Error('Failed to export motorcycle')
  }
}

/**
 * Import a single motorcycle from JSON data
 * @param jsonData - JSON string with motorcycle data
 * @param userId - ID of the user importing the motorcycle
 * @returns Imported motorcycle ID
 */
export async function importMotorcycleFromJSON(jsonData: string, userId: string): Promise<string> {
  try {
    const motorcycleData = JSON.parse(jsonData) as MotorcycleFormData
    
    // Validate required fields
    if (!motorcycleData.brand || !motorcycleData.modelName || !motorcycleData.modelYear) {
      throw new Error('Missing required fields: brand, modelName, or modelYear')
    }
    
    // Remove ID if present to create a new motorcycle
    delete motorcycleData.id
    
    // Create the motorcycle
    const motorcycleId = await createMotorcycle(motorcycleData, userId)
    return motorcycleId
  } catch (error) {
    console.error('Error importing motorcycle from JSON:', error)
    throw new Error('Failed to import motorcycle')
  }
}

/**
 * Import a single motorcycle from CSV data
 * @param csvData - CSV string with motorcycle data
 * @param userId - ID of the user importing the motorcycle
 * @returns Imported motorcycle ID
 */
export async function importMotorcycleFromCSV(csvData: string, userId: string): Promise<string> {
  try {
    const lines = csvData.split('\n').filter(line => line.trim() !== '')
    if (lines.length < 2) {
      throw new Error('Invalid CSV format')
    }
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    
    // Parse first row (should be only one for single motorcycle)
    const values = lines[1].split(',').map(v => {
      // Remove surrounding quotes and unescape
      return v.replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
    })
    
    // Create motorcycle object
    const motorcycleData: Record<string, unknown> = {}
    
    headers.forEach((header, index) => {
      const value = values[index]
      if (value === undefined) return
      
      // Handle special fields
      if (header === 'galleryImages' || header === 'competitorModels' || header === 'availableColors' || header === 'colorImages' || header === 'keyHighlights' || header === 'pros' || header === 'cons' || header === 'tags' || header === 'relatedModels' || header === 'variants') {
        // Parse JSON arrays
        try {
          motorcycleData[header] = JSON.parse(value)
        } catch {
          motorcycleData[header] = []
        }
      } else if (header === 'idleStopSystem' || header === 'catalyticConverter' || header === 'mobileAppIntegration' || header === 'turnByTurnNavigation' || header === 'ridingStatistics' || header === 'drl' || header === 'adjustableWindshield' || header === 'sideStandEngineCutoff' || header === 'tpms' || header === 'keylessIgnition' || header === 'immobilizer' || header === 'centralLocking' || header === 'sosCrashDetection' || header === 'adjustableSuspension' || header === 'ridingModes' || header === 'tractionControlSystem' || header === 'launchControl' || header === 'wheelieControl' || header === 'cruiseControl' || header === 'engineBrakingManagement' || header === 'slipperClutchAssist' || header === 'antiStallHillAssist' || header === 'quickShifter' || header === 'autoBlipper' || header === 'gearIndicator' || header === 'cbs') {
        // Parse booleans
        motorcycleData[header] = value.toLowerCase() === 'true'
      } else if (header === 'dataCompletionPercentage') {
        // Parse numbers
        motorcycleData[header] = parseInt(value) || 0
      } else {
        // Keep as string
        motorcycleData[header] = value
      }
    })
    
    // Validate required fields
    if (!motorcycleData.brand || !motorcycleData.modelName || !motorcycleData.modelYear) {
      throw new Error('Missing required fields: brand, modelName, or modelYear')
    }
    
    // Remove ID if present to create a new motorcycle
    delete motorcycleData.id
    
    // Create the motorcycle
    const motorcycleId = await createMotorcycle(motorcycleData as unknown as MotorcycleFormData, userId)
    return motorcycleId
  } catch (error) {
    console.error('Error importing motorcycle from CSV:', error)
    throw new Error('Failed to import motorcycle')
  }
}