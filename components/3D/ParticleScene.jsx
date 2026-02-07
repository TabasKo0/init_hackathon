'use client'

import { Sparkles } from '@react-three/drei'

export function ParticleScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#d946ef" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#23e6ff" />
      
      <Sparkles 
        count={500}
        scale={7}
        size={7}
        speed={0.3}
        opacity={0.8}
        color="#f5ff64"
      />
      
      <Sparkles 
        scale={25} 
        count={60} 
        speed={0.3}
        position={[0, -5, 0]}
        color="#ff2fd3"
      />
    </>
  )
}

export function AmbientParticles() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={1.8} color="#ff2fd3" />
      <pointLight position={[-15, -15, -15]} intensity={1.2} color="#23e6ff" />
      <pointLight position={[0, 20, 0]} intensity={0.8} color="#12f7c0" />
      
      <Sparkles 
        count={120}
        scale={20}
        size={4}
        speed={1}
        opacity={0.7}
      />
    </>
  )
}
