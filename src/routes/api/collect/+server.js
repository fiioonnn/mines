import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { calculateMultiplier } from '$lib/utils';

export const GET = async ({ request, locals }) => {
	const { user } = locals;

	const gameSession = await prisma.gameSession.findFirst({
		where: { userId: user.id, in_progress: true }
	});

	if (!gameSession) {
		return json({ error: true, message: 'No active game session' });
	}

	const totalMines = JSON.parse(gameSession.tiles);
	const realRevealedTiles = totalMines.filter((tile) => tile.revealed).length;
	const revealedTiles = totalMines.filter((tile) => tile.revealed).length || 1;
	const multiplier = calculateMultiplier(revealedTiles, 25, gameSession.mines);
	let profit = gameSession.bet * multiplier;
	console.log({ revealedTiles, realRevealedTiles });
	if (realRevealedTiles < 1) {
		return json({ error: true, message: 'No tiles revealed' });
	}

	await prisma.gameSession.update({
		where: { id: gameSession.id },
		data: { in_progress: false }
	});

	await prisma.user.update({
		where: { id: user.id },
		data: { balance: user.balance + profit }
	});

	console.log(`User ${user.username} won ${profit.toFixed(2)}`);

	return json({ profit });
};
