import { prisma } from '$lib/server/prisma';
import { calculateMultiplier } from '$lib/utils';

export const load = async ({ locals }) => {
	const gameSession = await prisma.gameSession.findFirst({
		where: { userId: locals.user.id, in_progress: true }
	});

	delete gameSession?.mines_indices;

	let multiplier = 0;
	let nextMultiplier = 0;
	let tilesSelected = [];

	if (gameSession) {
		const revealedTiles = JSON.parse(gameSession.tiles).filter((tile) => tile.revealed).length;
		multiplier = calculateMultiplier(revealedTiles, 25, gameSession.mines);
		nextMultiplier = calculateMultiplier(revealedTiles + 1, 25, gameSession.mines);
		tilesSelected = JSON.parse(gameSession.tiles_selected);
	}

	return {
		gameSession,
		multiplier,
		nextMultiplier,
		tilesSelected
	};
};
