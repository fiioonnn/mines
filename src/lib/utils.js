export const calculateMultiplier = (revealedTiles, totalTiles, mines) => {
	const safeTiles = totalTiles - mines;

	// Neue Parameter für exaktes Wachstum
	const baseMultiplier = 0.97; // Startwert des Multiplikators
	const growthRate = 1.2; // Wachstum pro Fortschritt
	const scalingFactor = 4.5; // Verstärkt exponentielles Wachstum

	// Fortschritt der sicheren Felder
	const progress = revealedTiles / safeTiles;

	// Wachstumsfunktion
	const multiplier = baseMultiplier * Math.pow(1 + growthRate, progress * scalingFactor);

	return parseFloat(multiplier.toFixed(2)); // Auf zwei Nachkommastellen runden
};
