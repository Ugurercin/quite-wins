import React from 'react'
import { Canvas } from '@shopify/react-native-skia'
import { PreviewCanvasProps } from '@/scenes/types'
import GardenBackground from './GardenBackground'

// Background-only preview — never imports PlantNode or any plant component.
const PreviewCanvas = ({ width, height, colors }: PreviewCanvasProps) => (
  <Canvas style={{ width, height }}>
    <GardenBackground width={width} height={height} colors={colors} />
  </Canvas>
)

export default PreviewCanvas
