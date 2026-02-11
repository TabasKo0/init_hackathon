'use client'
import { QR } from 'react-qr-rounded'

import DashboardLayout from '@/components/DashboardLayout'
import { Canvas } from '@react-three/fiber'
import { AmbientParticles } from '@/components/3D/ParticleScene'

export default function TracksClient({ user }) {
	if (!user) return null

	return (
		<DashboardLayout user={user}>
			{/* 3D Background */}
			<div className="fixed inset-0 -z-10 h-full w-full opacity-25 pointer-events-none">
				<Canvas camera={{ position: [0, 0, 6] }}>
					<AmbientParticles />
				</Canvas>
			</div>

			<div className="min-h-screen p-4 md:p-8 lg:p-12">
				{/* Header */}
				<div className="mb-8 ml-12 md:ml-0">
					<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ff2fd3] to-[#23e6ff] bg-clip-text text-transparent mb-2">
						For Attendance
					</h1>
					<p className="text-slate-400">Show this while entering hall.</p>
				</div>

				<div className="flex items-center bg-black/60 p-6 rounded-xl justify-center gap-2">
					<QR color="#a864e4" className="h-[60vh]" rounding={100}>
						{user.id}
					</QR>
				</div>
			</div>
		</DashboardLayout>
	)
}
