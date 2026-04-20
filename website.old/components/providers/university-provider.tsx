"use client";

import { useEffect, useState } from "react";
import { UniversitySelectorModal } from "@/components/layout/university-selector-modal";
import { useUniversityStore } from "@/lib/stores/university-store";
import { useAuth } from "@/hooks/queries/useAuth";

export function UniversityProvider({ children }: { children: React.ReactNode }) {
	const { selectedUniversity } = useUniversityStore();
	const { isAuthenticated } = useAuth();
	const [showModal, setShowModal] = useState(false);
	const [hasChecked, setHasChecked] = useState(false);

	useEffect(() => {
		// Only show modal for unauthenticated users who haven't selected a university
		if (!isAuthenticated && !selectedUniversity && !hasChecked) {
			// Small delay to ensure smooth page load
			const timer = setTimeout(() => {
				setShowModal(true);
				setHasChecked(true);
			}, 1000);

			return () => clearTimeout(timer);
		} else {
			setHasChecked(true);
		}
	}, [isAuthenticated, selectedUniversity, hasChecked]);

	return (
		<>
			{children}
			{!isAuthenticated && (
				<UniversitySelectorModal open={showModal} onOpenChange={setShowModal} />
			)}
		</>
	);
}

