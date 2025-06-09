import * as tf from "@tensorflow/tfjs"
import * as poseDetection from "@tensorflow-models/pose-detection"

// Define the keypoint interface
export interface Keypoint {
  name: string
  position: {
    x: number
    y: number
  }
  score: number
}

// Define the pose detection result
export interface PoseDetectionResult {
  keypoints: Keypoint[]
  boundingBox?: {
    topLeft: [number, number]
    bottomRight: [number, number]
  }
  score: number
  id?: number // For tracking specific person in multi-person detection
}

// Configuration options for pose detection
export interface PoseDetectionConfig {
  modelType?: "lightning" | "thunder"
  enableSmoothing?: boolean
  multiPerson?: boolean
  minPoseScore?: number
  minKeypointScore?: number
  enableTracking?: boolean
  smoothingWindowSize?: number
  maxPoses?: number
}

// Default configuration
const DEFAULT_CONFIG: PoseDetectionConfig = {
  modelType: "lightning",
  enableSmoothing: true,
  multiPerson: false,
  minPoseScore: 0.25,
  minKeypointScore: 0.4,
  enableTracking: true,
  smoothingWindowSize: 5,
  maxPoses: 2,
}

// Map NFT categories to relevant keypoints with weights
export const categoryToKeypoints: Record<string, { keypoint: string; weight: number }[]> = {
  headwear: [
    { keypoint: "nose", weight: 1.0 },
    { keypoint: "left_eye", weight: 0.8 },
    { keypoint: "right_eye", weight: 0.8 },
    { keypoint: "left_ear", weight: 0.6 },
    { keypoint: "right_ear", weight: 0.6 },
  ],
  eyewear: [
    { keypoint: "left_eye", weight: 1.0 },
    { keypoint: "right_eye", weight: 1.0 },
    { keypoint: "nose", weight: 0.7 },
  ],
  tops: [
    { keypoint: "left_shoulder", weight: 1.0 },
    { keypoint: "right_shoulder", weight: 1.0 },
    { keypoint: "left_elbow", weight: 0.5 },
    { keypoint: "right_elbow", weight: 0.5 },
  ],
  outerwear: [
    { keypoint: "left_shoulder", weight: 1.0 },
    { keypoint: "right_shoulder", weight: 1.0 },
    { keypoint: "left_elbow", weight: 0.7 },
    { keypoint: "right_elbow", weight: 0.7 },
    { keypoint: "left_hip", weight: 0.5 },
    { keypoint: "right_hip", weight: 0.5 },
  ],
  bottoms: [
    { keypoint: "left_hip", weight: 1.0 },
    { keypoint: "right_hip", weight: 1.0 },
    { keypoint: "left_knee", weight: 0.8 },
    { keypoint: "right_knee", weight: 0.8 },
  ],
  footwear: [
    { keypoint: "left_ankle", weight: 1.0 },
    { keypoint: "right_ankle", weight: 1.0 },
    { keypoint: "left_knee", weight: 0.3 },
    { keypoint: "right_knee", weight: 0.3 },
  ],
  accessories: [
    { keypoint: "left_wrist", weight: 1.0 },
    { keypoint: "right_wrist", weight: 1.0 },
  ],
  fullbody: [
    { keypoint: "nose", weight: 0.5 },
    { keypoint: "left_shoulder", weight: 0.8 },
    { keypoint: "right_shoulder", weight: 0.8 },
    { keypoint: "left_hip", weight: 0.8 },
    { keypoint: "right_hip", weight: 0.8 },
    { keypoint: "left_ankle", weight: 0.6 },
    { keypoint: "right_ankle", weight: 0.6 },
  ],
}

// Body proportion constants based on average human proportions
const BODY_PROPORTIONS = {
  HEAD_TO_HEIGHT_RATIO: 0.13, // Head is about 13% of total height
  SHOULDER_WIDTH_TO_HEIGHT_RATIO: 0.259, // Shoulder width is about 25.9% of height
  WAIST_TO_HEIGHT_RATIO: 0.15, // Waist is about 15% of height
  INSEAM_TO_HEIGHT_RATIO: 0.48, // Inseam is about 48% of height
  FOOT_LENGTH_TO_HEIGHT_RATIO: 0.15, // Foot length is about 15% of height
}

// Initialize the detector
let detector: poseDetection.PoseDetector | null = null
let currentConfig: PoseDetectionConfig = DEFAULT_CONFIG

// Store previous poses for smoothing
let previousPoses: PoseDetectionResult[][] = []

export async function initPoseDetection(
  config: PoseDetectionConfig = DEFAULT_CONFIG,
): Promise<poseDetection.PoseDetector> {
  // If detector exists and config hasn't changed, return existing detector
  if (detector && JSON.stringify(config) === JSON.stringify(currentConfig)) {
    return detector
  }

  // Update current config
  currentConfig = { ...DEFAULT_CONFIG, ...config }

  // Clean up previous detector if it exists
  if (detector) {
    try {
      detector.dispose()
    } catch (e) {
      console.warn("Error disposing previous detector:", e)
    }
    detector = null
  }

  // Make sure TensorFlow.js is ready
  await tf.ready()

  // Configure the detector
  const model = poseDetection.SupportedModels.MoveNet
  const detectorConfig: poseDetection.MoveNetModelConfig = {
    modelType: currentConfig.modelType,
    enableSmoothing: currentConfig.enableSmoothing,
    trackerType: currentConfig.enableTracking ? "boundingBox" : undefined,
    multiPoseMaxDimension: currentConfig.multiPerson ? 256 : undefined,
    enableTracking: currentConfig.enableTracking,
    maxPoses: currentConfig.multiPerson ? currentConfig.maxPoses : 1,
  }

  // Create and return the detector
  detector = await poseDetection.createDetector(model, detectorConfig)

  // Reset smoothing history
  previousPoses = []

  return detector
}

// Apply temporal smoothing to reduce jitter
function smoothPoses(newPoses: PoseDetectionResult[], windowSize = 5): PoseDetectionResult[] {
  if (!previousPoses.length) {
    previousPoses.push(newPoses)
    return newPoses
  }

  // Add new poses to history
  previousPoses.push(newPoses)

  // Keep only the last windowSize frames
  if (previousPoses.length > windowSize) {
    previousPoses.shift()
  }

  // If we don't have enough history yet, return the new poses
  if (previousPoses.length < 2) {
    return newPoses
  }

  // Create a map to track poses across frames by their ID
  const poseMap: Map<number, PoseDetectionResult[]> = new Map()

  // Group poses by ID across frames
  previousPoses.forEach((poses) => {
    poses.forEach((pose) => {
      const id = pose.id || 0
      if (!poseMap.has(id)) {
        poseMap.set(id, [])
      }
      poseMap.get(id)?.push(pose)
    })
  })

  // Smooth each pose
  const smoothedPoses: PoseDetectionResult[] = []

  poseMap.forEach((posesForId, id) => {
    // Only smooth if we have enough poses for this ID
    if (posesForId.length < 2) {
      smoothedPoses.push(posesForId[posesForId.length - 1])
      return
    }

    // Get the most recent pose for this ID
    const latestPose = posesForId[posesForId.length - 1]

    // Create a smoothed pose
    const smoothedPose: PoseDetectionResult = {
      keypoints: [],
      score: latestPose.score,
      id: latestPose.id,
    }

    // Create a map of keypoints by name
    const keypointMap: Map<string, Keypoint[]> = new Map()

    // Group keypoints by name across frames
    posesForId.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        if (!keypointMap.has(keypoint.name)) {
          keypointMap.set(keypoint.name, [])
        }
        keypointMap.get(keypoint.name)?.push(keypoint)
      })
    })

    // Smooth each keypoint
    keypointMap.forEach((keypoints, name) => {
      // Calculate weighted average based on confidence scores
      let sumX = 0,
        sumY = 0,
        sumWeights = 0

      keypoints.forEach((kp, index) => {
        // More recent keypoints get higher weight
        const recencyWeight = (index + 1) / keypoints.length
        const weight = kp.score * recencyWeight

        sumX += kp.position.x * weight
        sumY += kp.position.y * weight
        sumWeights += weight
      })

      // Add smoothed keypoint
      if (sumWeights > 0) {
        smoothedPose.keypoints.push({
          name,
          position: {
            x: sumX / sumWeights,
            y: sumY / sumWeights,
          },
          score: keypoints[keypoints.length - 1].score, // Keep the latest score
        })
      }
    })

    // Calculate bounding box from smoothed keypoints
    if (smoothedPose.keypoints.length > 0) {
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      smoothedPose.keypoints.forEach((kp) => {
        if (kp.score > currentConfig.minKeypointScore!) {
          minX = Math.min(minX, kp.position.x)
          minY = Math.min(minY, kp.position.y)
          maxX = Math.max(maxX, kp.position.x)
          maxY = Math.max(maxY, kp.position.y)
        }
      })

      if (minX !== Number.POSITIVE_INFINITY) {
        smoothedPose.boundingBox = {
          topLeft: [minX, minY],
          bottomRight: [maxX, maxY],
        }
      }
    }

    smoothedPoses.push(smoothedPose)
  })

  return smoothedPoses
}

// Select the most prominent person in multi-person detection
function selectMainPerson(poses: PoseDetectionResult[]): PoseDetectionResult | null {
  if (!poses || poses.length === 0) return null
  if (poses.length === 1) return poses[0]

  // Sort by score and size of bounding box
  return poses.sort((a, b) => {
    // First compare by score
    const scoreDiff = (b.score || 0) - (a.score || 0)
    if (Math.abs(scoreDiff) > 0.1) return scoreDiff

    // If scores are similar, compare by size of bounding box
    if (a.boundingBox && b.boundingBox) {
      const aWidth = a.boundingBox.bottomRight[0] - a.boundingBox.topLeft[0]
      const aHeight = a.boundingBox.bottomRight[1] - a.boundingBox.topLeft[1]
      const aSize = aWidth * aHeight

      const bWidth = b.boundingBox.bottomRight[0] - b.boundingBox.topLeft[0]
      const bHeight = b.boundingBox.bottomRight[1] - b.boundingBox.topLeft[1]
      const bSize = bWidth * bHeight

      return bSize - aSize // Larger bounding box is probably closer to camera
    }

    return 0
  })[0]
}

// Detect poses in an image or video frame
export async function detectPose(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  config?: PoseDetectionConfig,
): Promise<PoseDetectionResult | null> {
  // Initialize or update detector if needed
  if (!detector || config) {
    detector = await initPoseDetection(config || currentConfig)
  }

  try {
    // Estimate poses
    const poses = await detector.estimatePoses(imageElement)

    if (!poses || poses.length === 0) {
      return null
    }

    // Convert to our format
    const formattedPoses: PoseDetectionResult[] = poses.map((pose, index) => {
      // Filter keypoints by confidence
      const filteredKeypoints = pose.keypoints
        .filter((kp) => kp.score && kp.score >= (currentConfig.minKeypointScore || 0.4))
        .map((kp) => ({
          name: kp.name || "",
          position: { x: kp.x, y: kp.y },
          score: kp.score || 0,
        }))

      // Calculate bounding box
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      filteredKeypoints.forEach((kp) => {
        minX = Math.min(minX, kp.position.x)
        minY = Math.min(minY, kp.position.y)
        maxX = Math.max(maxX, kp.position.x)
        maxY = Math.max(maxY, kp.position.y)
      })

      const boundingBox =
        minX !== Number.POSITIVE_INFINITY
          ? {
              topLeft: [minX, minY] as [number, number],
              bottomRight: [maxX, maxY] as [number, number],
            }
          : undefined

      return {
        keypoints: filteredKeypoints,
        boundingBox,
        score: pose.score || 0,
        id: pose.id || index,
      }
    })

    // Filter by minimum pose score
    const validPoses = formattedPoses.filter(
      (pose) => pose.score >= (currentConfig.minPoseScore || 0.25) && pose.keypoints.length >= 5, // Require at least 5 valid keypoints
    )

    if (validPoses.length === 0) {
      return null
    }

    // Apply temporal smoothing for video
    const smoothedPoses = currentConfig.enableSmoothing
      ? smoothPoses(validPoses, currentConfig.smoothingWindowSize)
      : validPoses

    // For single person mode, return the most prominent person
    if (!currentConfig.multiPerson) {
      return selectMainPerson(smoothedPoses)
    }

    // For multi-person, return all poses
    return smoothedPoses.length > 0 ? smoothedPoses[0] : null
  } catch (error) {
    console.error("Error detecting pose:", error)
    return null
  }
}

// Detect multiple poses in an image or video frame
export async function detectMultiplePoses(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  config?: PoseDetectionConfig,
): Promise<PoseDetectionResult[]> {
  // Force multi-person mode
  const multiPersonConfig = {
    ...config,
    multiPerson: true,
  }

  // Initialize or update detector if needed
  if (!detector || config) {
    detector = await initPoseDetection(multiPersonConfig)
  }

  try {
    // Estimate poses
    const poses = await detector.estimatePoses(imageElement)

    if (!poses || poses.length === 0) {
      return []
    }

    // Convert to our format
    const formattedPoses: PoseDetectionResult[] = poses.map((pose, index) => {
      // Filter keypoints by confidence
      const filteredKeypoints = pose.keypoints
        .filter((kp) => kp.score && kp.score >= (currentConfig.minKeypointScore || 0.4))
        .map((kp) => ({
          name: kp.name || "",
          position: { x: kp.x, y: kp.y },
          score: kp.score || 0,
        }))

      // Calculate bounding box
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      filteredKeypoints.forEach((kp) => {
        minX = Math.min(minX, kp.position.x)
        minY = Math.min(minY, kp.position.y)
        maxX = Math.max(maxX, kp.position.x)
        maxY = Math.max(maxY, kp.position.y)
      })

      const boundingBox =
        minX !== Number.POSITIVE_INFINITY
          ? {
              topLeft: [minX, minY] as [number, number],
              bottomRight: [maxX, maxY] as [number, number],
            }
          : undefined

      return {
        keypoints: filteredKeypoints,
        boundingBox,
        score: pose.score || 0,
        id: pose.id || index,
      }
    })

    // Filter by minimum pose score
    const validPoses = formattedPoses.filter(
      (pose) => pose.score >= (currentConfig.minPoseScore || 0.25) && pose.keypoints.length >= 5, // Require at least 5 valid keypoints
    )

    // Apply temporal smoothing for video
    const smoothedPoses = currentConfig.enableSmoothing
      ? smoothPoses(validPoses, currentConfig.smoothingWindowSize)
      : validPoses

    return smoothedPoses
  } catch (error) {
    console.error("Error detecting multiple poses:", error)
    return []
  }
}

// Get the recommended position for an NFT based on its category
export function getRecommendedPosition(
  poseResult: PoseDetectionResult,
  category: string,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number; scale: number; rotation?: number } | null {
  if (!poseResult || !poseResult.keypoints || poseResult.keypoints.length === 0) {
    return null
  }

  // Get relevant keypoints for the category
  const relevantKeypointConfig = categoryToKeypoints[category] || categoryToKeypoints.fullbody

  // Find the keypoints that match our configuration
  const matchedKeypoints = relevantKeypointConfig
    .map((config) => {
      const keypoint = poseResult.keypoints.find((kp) => kp.name === config.keypoint)
      return keypoint ? { ...keypoint, weight: config.weight } : null
    })
    .filter((kp) => kp !== null) as (Keypoint & { weight: number })[]

  if (matchedKeypoints.length === 0) {
    return null
  }

  // Calculate weighted center position
  let sumX = 0,
    sumY = 0,
    totalWeight = 0

  matchedKeypoints.forEach((kp) => {
    // Weight by both confidence score and predefined weight
    const weight = kp.score * kp.weight
    sumX += kp.position.x * weight
    sumY += kp.position.y * weight
    totalWeight += weight
  })

  if (totalWeight === 0) {
    return null
  }

  const centerX = sumX / totalWeight
  const centerY = sumY / totalWeight

  // Calculate recommended scale and rotation based on category
  let recommendedScale = 100 // default scale percentage
  let recommendedRotation = 0 // default rotation in degrees

  // Get body measurements if available
  const nose = poseResult.keypoints.find((kp) => kp.name === "nose")
  const leftShoulder = poseResult.keypoints.find((kp) => kp.name === "left_shoulder")
  const rightShoulder = poseResult.keypoints.find((kp) => kp.name === "right_shoulder")
  const leftHip = poseResult.keypoints.find((kp) => kp.name === "left_hip")
  const rightHip = poseResult.keypoints.find((kp) => kp.name === "right_hip")
  const leftAnkle = poseResult.keypoints.find((kp) => kp.name === "left_ankle")
  const rightAnkle = poseResult.keypoints.find((kp) => kp.name === "right_ankle")

  // Estimate body height if we have enough keypoints
  let estimatedHeight = 0
  if (nose && ((leftAnkle && leftHip) || (rightAnkle && rightHip))) {
    // Use the side with higher confidence scores
    const useLeft = (leftAnkle?.score || 0) + (leftHip?.score || 0) > (rightAnkle?.score || 0) + (rightHip?.score || 0)

    const ankle = useLeft ? leftAnkle : rightAnkle
    const hip = useLeft ? leftHip : rightHip

    if (ankle && hip) {
      // Estimate full height: from nose to ankle plus 15% for feet
      const noseToAnkle = Math.abs(ankle.position.y - nose.position.y)
      estimatedHeight = noseToAnkle / 0.85 // Adjust for feet
    }
  }

  // Calculate shoulder width if available
  let shoulderWidth = 0
  if (leftShoulder && rightShoulder) {
    shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.position.x - leftShoulder.position.x, 2) +
        Math.pow(rightShoulder.position.y - leftShoulder.position.y, 2),
    )

    // Calculate shoulder angle for rotation
    if (category === "tops" || category === "outerwear") {
      const dx = rightShoulder.position.x - leftShoulder.position.x
      const dy = rightShoulder.position.y - leftShoulder.position.y
      recommendedRotation = Math.atan2(dy, dx) * (180 / Math.PI)
    }
  }

  // Adjust scale based on category and body measurements
  switch (category) {
    case "headwear": {
      // For head items, use about 60% of head width
      if (leftShoulder && rightShoulder && nose) {
        // Estimate head width as 2/3 of shoulder width
        const headWidth = shoulderWidth * 0.4
        recommendedScale = (headWidth / canvasWidth) * 300
      } else {
        recommendedScale = 30
      }
      break
    }
    case "eyewear": {
      // For eyewear, use about 40% of head width
      if (leftShoulder && rightShoulder) {
        // Estimate head width as 2/3 of shoulder width
        const headWidth = shoulderWidth * 0.3
        recommendedScale = (headWidth / canvasWidth) * 300
      } else {
        recommendedScale = 20
      }
      break
    }
    case "tops":
    case "outerwear": {
      // For tops, use shoulder width
      if (shoulderWidth > 0) {
        // Add 20% padding on each side
        recommendedScale = ((shoulderWidth * 1.4) / canvasWidth) * 200
      } else if (estimatedHeight > 0) {
        // Fallback to estimated height
        recommendedScale = ((estimatedHeight * BODY_PROPORTIONS.SHOULDER_WIDTH_TO_HEIGHT_RATIO) / canvasWidth) * 200
      } else {
        recommendedScale = 80
      }
      break
    }
    case "bottoms": {
      // For bottoms, use hip width
      if (leftHip && rightHip) {
        const hipWidth = Math.sqrt(
          Math.pow(rightHip.position.x - leftHip.position.x, 2) + Math.pow(rightHip.position.y - leftHip.position.y, 2),
        )
        recommendedScale = ((hipWidth * 1.2) / canvasWidth) * 200
      } else if (shoulderWidth > 0) {
        // Fallback to shoulder width
        recommendedScale = ((shoulderWidth * 0.9) / canvasWidth) * 200
      } else {
        recommendedScale = 70
      }
      break
    }
    case "footwear": {
      // For footwear, use ankle width
      if (leftAnkle && rightAnkle) {
        const ankleWidth = Math.sqrt(
          Math.pow(rightAnkle.position.x - leftAnkle.position.x, 2) +
            Math.pow(rightAnkle.position.y - leftAnkle.position.y, 2),
        )
        recommendedScale = ((ankleWidth * 0.8) / canvasWidth) * 150
      } else if (estimatedHeight > 0) {
        // Fallback to estimated height
        recommendedScale = ((estimatedHeight * BODY_PROPORTIONS.FOOT_LENGTH_TO_HEIGHT_RATIO) / canvasWidth) * 150
      } else {
        recommendedScale = 40
      }
      break
    }
    case "accessories": {
      // For accessories, use a smaller scale
      recommendedScale = 30
      break
    }
    default: {
      // For other categories, use a moderate scale
      if (poseResult.boundingBox) {
        const [minX, minY] = poseResult.boundingBox.topLeft
        const [maxX, maxY] = poseResult.boundingBox.bottomRight
        const boxWidth = maxX - minX
        recommendedScale = (boxWidth / canvasWidth) * 100
      } else {
        recommendedScale = 60
      }
    }
  }

  // Convert to percentage of canvas
  const x = (centerX / canvasWidth) * 100
  const y = (centerY / canvasHeight) * 100

  return {
    x,
    y,
    scale: Math.max(20, Math.min(200, recommendedScale)), // Clamp between 20% and 200%
    rotation: category === "tops" || category === "outerwear" ? recommendedRotation : undefined,
  }
}

// Calculate body measurements from pose data
export function calculateBodyMeasurements(
  poseResult: PoseDetectionResult,
  heightInCm?: number, // Optional real height for scaling
): {
  shoulderWidth: number
  chestWidth: number
  waistWidth: number
  hipWidth: number
  inseam: number
  totalHeight: number
  scale?: number // Pixels to cm scale if heightInCm is provided
} | null {
  if (!poseResult || !poseResult.keypoints || poseResult.keypoints.length < 10) {
    return null
  }

  // Extract key points
  const nose = poseResult.keypoints.find((kp) => kp.name === "nose")
  const leftShoulder = poseResult.keypoints.find((kp) => kp.name === "left_shoulder")
  const rightShoulder = poseResult.keypoints.find((kp) => kp.name === "right_shoulder")
  const leftElbow = poseResult.keypoints.find((kp) => kp.name === "left_elbow")
  const rightElbow = poseResult.keypoints.find((kp) => kp.name === "right_elbow")
  const leftHip = poseResult.keypoints.find((kp) => kp.name === "left_hip")
  const rightHip = poseResult.keypoints.find((kp) => kp.name === "right_hip")
  const leftKnee = poseResult.keypoints.find((kp) => kp.name === "left_knee")
  const rightKnee = poseResult.keypoints.find((kp) => kp.name === "right_knee")
  const leftAnkle = poseResult.keypoints.find((kp) => kp.name === "left_ankle")
  const rightAnkle = poseResult.keypoints.find((kp) => kp.name === "right_ankle")

  // Check if we have enough keypoints
  if (!nose || !leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return null
  }

  // Calculate distances
  const getDistance = (p1: Keypoint, p2: Keypoint) => {
    return Math.sqrt(Math.pow(p2.position.x - p1.position.x, 2) + Math.pow(p2.position.y - p1.position.y, 2))
  }

  // Shoulder width
  const shoulderWidth = getDistance(leftShoulder, rightShoulder)

  // Estimate chest width (slightly wider than shoulders)
  const chestWidth = shoulderWidth * 1.1

  // Waist width (between hips, but slightly narrower)
  const hipDistance = getDistance(leftHip, rightHip)
  const waistWidth = hipDistance * 0.9

  // Hip width
  const hipWidth = hipDistance

  // Inseam (hip to ankle)
  let inseam = 0
  if (leftAnkle && leftHip) {
    inseam = getDistance(leftHip, leftAnkle)
  } else if (rightAnkle && rightHip) {
    inseam = getDistance(rightHip, rightAnkle)
  }

  // Total height (nose to ankle plus estimated foot height)
  let totalHeight = 0
  if (nose) {
    if (leftAnkle) {
      totalHeight = Math.abs(nose.position.y - leftAnkle.position.y) * 1.15 // Add 15% for feet
    } else if (rightAnkle) {
      totalHeight = Math.abs(nose.position.y - rightAnkle.position.y) * 1.15 // Add 15% for feet
    } else if (leftKnee && rightKnee) {
      // Estimate from knee if ankles aren't visible
      const kneeY = (leftKnee.position.y + rightKnee.position.y) / 2
      totalHeight = Math.abs(nose.position.y - kneeY) * 1.9 // Knees are roughly at 53% of height
    }
  }

  // Calculate scale if real height is provided
  let scale
  if (heightInCm && totalHeight > 0) {
    scale = heightInCm / totalHeight
  }

  return {
    shoulderWidth,
    chestWidth,
    waistWidth,
    hipWidth,
    inseam,
    totalHeight,
    scale,
  }
}

// Estimate clothing sizes based on body measurements
export function estimateClothingSizes(measurements: {
  shoulderWidth: number
  chestWidth: number
  waistWidth: number
  hipWidth: number
  inseam: number
  totalHeight: number
  scale?: number
}): {
  topSize: string
  bottomSize: string
  shoeSize: string
  hatSize: string
} | null {
  if (!measurements || !measurements.scale) {
    return null
  }

  // Convert pixel measurements to cm
  const scale = measurements.scale
  const shoulderWidthCm = measurements.shoulderWidth * scale
  const chestWidthCm = measurements.chestWidth * scale
  const waistWidthCm = measurements.waistWidth * scale
  const hipWidthCm = measurements.hipWidth * scale
  const inseamCm = measurements.inseam * scale
  const heightCm = measurements.totalHeight * scale

  // Estimate top size (based on chest)
  let topSize = "M"
  if (chestWidthCm < 90) topSize = "XS"
  else if (chestWidthCm < 95) topSize = "S"
  else if (chestWidthCm < 105) topSize = "M"
  else if (chestWidthCm < 115) topSize = "L"
  else if (chestWidthCm < 125) topSize = "XL"
  else topSize = "XXL"

  // Estimate bottom size (based on waist and hip)
  let bottomSize = "M"
  const avgLowerWidth = (waistWidthCm + hipWidthCm) / 2
  if (avgLowerWidth < 80) bottomSize = "XS"
  else if (avgLowerWidth < 90) bottomSize = "S"
  else if (avgLowerWidth < 100) bottomSize = "M"
  else if (avgLowerWidth < 110) bottomSize = "L"
  else if (avgLowerWidth < 120) bottomSize = "XL"
  else bottomSize = "XXL"

  // Estimate shoe size (based on height)
  let shoeSize = "US 9"
  const footLengthCm = heightCm * BODY_PROPORTIONS.FOOT_LENGTH_TO_HEIGHT_RATIO
  if (footLengthCm < 23) shoeSize = "US 6"
  else if (footLengthCm < 24) shoeSize = "US 7"
  else if (footLengthCm < 25) shoeSize = "US 8"
  else if (footLengthCm < 26) shoeSize = "US 9"
  else if (footLengthCm < 27) shoeSize = "US 10"
  else if (footLengthCm < 28) shoeSize = "US 11"
  else shoeSize = "US 12+"

  // Estimate hat size (based on height)
  let hatSize = "M"
  const headCircumferenceCm = heightCm * BODY_PROPORTIONS.HEAD_TO_HEIGHT_RATIO * Math.PI
  if (headCircumferenceCm < 54) hatSize = "XS"
  else if (headCircumferenceCm < 56) hatSize = "S"
  else if (headCircumferenceCm < 58) hatSize = "M"
  else if (headCircumferenceCm < 60) hatSize = "L"
  else hatSize = "XL"

  return {
    topSize,
    bottomSize,
    shoeSize,
    hatSize,
  }
}

// Get pose confidence score for specific body regions
export function getPoseConfidenceByRegion(poseResult: PoseDetectionResult): {
  overall: number
  face: number
  upperBody: number
  lowerBody: number
} {
  if (!poseResult || !poseResult.keypoints || poseResult.keypoints.length === 0) {
    return { overall: 0, face: 0, upperBody: 0, lowerBody: 0 }
  }

  // Group keypoints by body region
  const faceKeypoints = poseResult.keypoints.filter((kp) =>
    ["nose", "left_eye", "right_eye", "left_ear", "right_ear"].includes(kp.name),
  )

  const upperBodyKeypoints = poseResult.keypoints.filter((kp) =>
    ["left_shoulder", "right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist"].includes(kp.name),
  )

  const lowerBodyKeypoints = poseResult.keypoints.filter((kp) =>
    ["left_hip", "right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle"].includes(kp.name),
  )

  // Calculate average confidence for each region
  const calculateAvgConfidence = (keypoints: Keypoint[]) => {
    if (keypoints.length === 0) return 0
    return keypoints.reduce((sum, kp) => sum + kp.score, 0) / keypoints.length
  }

  const faceConfidence = calculateAvgConfidence(faceKeypoints)
  const upperBodyConfidence = calculateAvgConfidence(upperBodyKeypoints)
  const lowerBodyConfidence = calculateAvgConfidence(lowerBodyKeypoints)

  // Calculate overall confidence (weighted average)
  const overall = faceConfidence * 0.2 + upperBodyConfidence * 0.4 + lowerBodyConfidence * 0.4

  return {
    overall,
    face: faceConfidence,
    upperBody: upperBodyConfidence,
    lowerBody: lowerBodyConfidence,
  }
}

// Dispose the detector and free resources
export function disposePoseDetector() {
  if (detector) {
    try {
      detector.dispose()
      detector = null
      previousPoses = []
    } catch (e) {
      console.warn("Error disposing pose detector:", e)
    }
  }
}
