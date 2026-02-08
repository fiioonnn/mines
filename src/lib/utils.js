export const calculateMultiplier = (revealedTiles, totalTiles, mines) => {
	let multiplier = 1;
	for (let i = 0; i < revealedTiles; i++) {
		const remainingTiles = totalTiles - i;
		const remainingSafe = remainingTiles - mines;
		multiplier *= remainingTiles / remainingSafe;
	}
	return parseFloat(multiplier.toFixed(2));
};
