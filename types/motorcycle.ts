// Comprehensive Motorcycle Form Data Interface

export interface MotorcycleFormData {
  // System fields
  id?: string
  createdBy?: string
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  
  // 1️⃣ BASIC INFORMATION
  // 1.1 Model Identity
  brand: string
  modelName: string
  variantName: string
  modelYear: string
  category: string
  segment: string
  originCountry: string
  assemblyCountry: string
  status: string
  
  // 1.2 Visual Identity
  coverImage: string
  galleryImages: string[]
  modelVideo: string
  
  // Step Images
  stepImages: StepImages
  
  // 2️⃣ ENGINE SPECIFICATIONS
  // 2.1 Engine Architecture
  engineType: string
  displacement: string
  cylinderCount: string
  valveSystem: string
  valvesPerCylinder: string
  strokeType: string
  boreXStroke: string
  compressionRatio: string
  fuelType: string
  fuelSupplySystem: string
  ignitionType: string
  lubricationSystem: string
  engineCoolingType: string
  radiatorFanType: string
  airFilterType: string
  startType: string
  idleStopSystem: boolean
  
  // 3️⃣ PERFORMANCE METRICS
  // 3.1 Engine Output
  maxPowerHP: string
  maxPowerKW: string
  maxPowerRPM: string
  maxTorqueNm: string
  maxTorqueRPM: string
  powerToWeightRatio: string
  
  // 3.2 Speed & Efficiency
  topSpeed: string
  acceleration0to60: string
  acceleration0to100: string
  mileage: string
  range: string
  revLimiter: string
  engineRedline: string
  ecoModeEfficiency: string
  
  // 4️⃣ TRANSMISSION & DRIVE
  transmissionType: string
  numberOfGears: string
  gearRatio: string
  clutchType: string
  finalDriveType: string
  quickShifter: boolean
  autoBlipper: boolean
  gearIndicator: boolean
  shiftPattern: string
  
  // 5️⃣ ELECTRONICS & CONTROL SYSTEMS
  // 5.1 Emission
  emissionStandard: string
  catalyticConverter: boolean
  obd: string
  
  // 5.2 Ride Technology
  fuelEconomyRideModes: string
  fuelInjectionMapping: string
  throttleResponse: string
  absType: string
  tractionControlSystem: boolean
  launchControl: boolean
  wheelieControl: boolean
  cruiseControl: boolean
  engineBrakingManagement: boolean
  slipperClutchAssist: boolean
  antiStallHillAssist: boolean
  
  // 6️⃣ CHASSIS, FRAME & SUSPENSION
  frameType: string
  swingarmType: string
  frontSuspension: string
  rearSuspension: string
  suspensionTravelFront: string
  suspensionTravelRear: string
  steeringAngle: string
  turningRadius: string
  
  // 7️⃣ BRAKES, WHEELS & TYRES
  // 7.1 Braking System
  frontBrakeType: string
  frontBrakeSize: string
  rearBrakeType: string
  rearBrakeSize: string
  absSupport: string
  brakeCaliperType: string
  cbs: boolean
  
  // 7.2 Wheel & Tyre Setup
  wheelType: string
  frontTyreSize: string
  rearTyreSize: string
  tyreType: string
  tyreBrand: string
  wheelSizeFront: string
  wheelSizeRear: string
  
  // 8️⃣ DIMENSIONS & WEIGHT
  overallLength: string
  overallWidth: string
  overallHeight: string
  wheelbase: string
  groundClearance: string
  seatHeight: string
  kerbWeight: string
  dryWeight: string
  fuelTankCapacity: string
  reserveFuelCapacity: string
  loadCapacity: string
  oilCapacity: string
  batteryCapacity: string
  centerOfGravityHeight: string
  
  // 9️⃣ FEATURES & EQUIPMENT
  // 9.1 Console & Connectivity
  instrumentConsole: string
  displaySize: string
  connectivity: string
  mobileAppIntegration: boolean
  turnByTurnNavigation: boolean
  ridingStatistics: boolean
  
  // 9.2 Lighting & Comfort
  headlightType: string
  drl: boolean
  tailLightType: string
  indicatorType: string
  adjustableWindshield: boolean
  seatType: string
  handleType: string
  footpegPosition: string
  
  // 9.3 Safety & Assist
  sideStandEngineCutoff: boolean
  tpms: boolean
  keylessIgnition: boolean
  immobilizer: boolean
  centralLocking: boolean
  sosCrashDetection: boolean
  adjustableSuspension: boolean
  ridingModes: boolean
  
  // 9.4 Warranty & Service
  warrantyYears: string
  warrantyKm: string
  freeServiceCount: string
  serviceIntervalKm: string
  serviceIntervalMonths: string
  
  // 🔟 PRICING & MARKET DATA
  exShowroomPrice: string
  onRoadPrice: string
  currency: string
  availability: string
  launchDate: string
  marketSegment: string
  competitorModels: string[]
  variants: VariantData[]
  
  // 1️⃣1️⃣ COLOR OPTIONS
  availableColors: string[]
  colorImages: string[][]
  specialEditions: string
  
  // 1️⃣2️⃣ ADDITIONAL INFORMATION
  description: string
  keyHighlights: string[]
  pros: string[]
  cons: string[]
  seoMetaTitle: string
  seoMetaDescription: string
  tags: string[]
  relatedModels: string[]
  adminNotes: string
  
  // 1️⃣3️⃣ REVIEW & VALIDATION (System only)
  dataCompletionPercentage: number
  reviewStatus: string
  lastUpdatedBy: string
  lastUpdatedDate: string
}

export interface VariantData {
  variantName: string
  price: string
  color: string
  status: string
  specialFeatures: string
}

export interface StepImages {
  step1: string[]   // Basic Information
  step2: string[]   // Engine Specifications
  step3: string[]   // Performance Metrics
  step4: string[]   // Transmission & Drive
  step5: string[]   // Electronics & Control
  step6: string[]   // Chassis & Suspension
  step7: string[]   // Brakes, Wheels & Tyres
  step8: string[]   // Dimensions & Weight
  step9: string[]   // Features & Equipment
  step10: string[]  // Pricing & Market
  step11: string[]  // Color Options
  step12: string[]  // Additional Information
}