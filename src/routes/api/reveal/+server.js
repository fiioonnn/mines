import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { calculateMultiplier } from '$lib/utils';

export const POST = async ({ request, locals }) => {
	const data = await request.json();
	const { user } = locals;
	const { index } = data;

	if (!user) {
		return json({ error: true, message: 'Unauthorized' });
	}

	let gameSession = await prisma.gameSession.findFirst({
		where: { userId: user.id, in_progress: true }
	});

	if (!gameSession) {
		return json({ error: true, message: 'No active game session' });
	}

	const tiles = JSON.parse(gameSession.tiles);
	const minesIndices = JSON.parse(gameSession.mines_indices);
	const tilesSelected = JSON.parse(gameSession.tiles_selected);
	let revealedTiles = getRevealedTiles(tiles) + 1;
	let multiplier = calculateMultiplier(revealedTiles, 25, gameSession.mines);
	let nextMultiplier = calculateMultiplier(revealedTiles + 1, 25, gameSession.mines);
	let profit = 0;

	if (tiles[index].revealed) {
		return json({ error: true, message: 'Tile already revealed' });
	}

	tiles[index].revealed = true;

	if (minesIndices.includes(index)) {
		tiles[index].revealed = true;
		tiles[index].isMine = true;

		tiles.forEach((tile, index) => {
			tile.revealed = true;
			if (minesIndices.includes(index)) {
				tile.isMine = true;
			}
		});

		gameSession = await prisma.gameSession.update({
			where: { id: gameSession.id },
			data: { in_progress: false }
		});

		multiplier = 0;
	}

	if (25 - gameSession.mines === revealedTiles) {
		gameSession = await prisma.gameSession.update({
			where: { id: gameSession.id },
			data: { in_progress: false }
		});

		profit = gameSession.bet * multiplier;

		const newBalance = await prisma.user.update({
			where: { id: user.id },
			data: { balance: user.balance + profit }
		});
	}

	tilesSelected.push(index);

	revealedTiles = getRevealedTiles(tiles);

	gameSession = await prisma.gameSession.update({
		where: { id: gameSession.id },
		data: { tiles: JSON.stringify(tiles), tiles_selected: JSON.stringify(tilesSelected) }
	});

	console.log({ revealedTiles, multiplier });

	return json({ tiles, gameSession, multiplier, nextMultiplier, profit });
};

const getRevealedTiles = (tiles) => {
	return tiles.filter((tile) => tile.revealed).length;
};
