import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { calculateMultiplier } from '$lib/utils';

export const POST = async ({ request, locals }) => {
	const { bet, mines } = await request.json();
	const { user } = locals;

	if (!user) {
		return json({ error: true, message: 'Unauthorized' });
	}

	if (mines < 1 || mines > 24) {
		return json({ error: true, message: 'Invalid number of mines' });
	}

	if (bet <= 0 || bet > user.balance) {
		return json({ error: true, message: 'Invalid bet amount' });
	}

	let gameSession = await prisma.gameSession.findFirst({
		where: { userId: user.id, in_progress: true }
	});

	if (gameSession) {
		return json({ error: true, message: 'You already have an active game session' });
	}

	gameSession = await prisma.gameSession.create({
		data: {
			userId: user.id,
			bet,
			tiles: JSON.stringify(generateTiles()),
			mines_indices: JSON.stringify(generateMinesIndices(mines)),
			tiles_selected: JSON.stringify([]),
			mines,
			in_progress: true
		}
	});

	const revealedTiles = JSON.parse(gameSession.tiles).filter((tile) => tile.revealed).length;
	let multiplier = calculateMultiplier(revealedTiles, 25, gameSession.mines) || 0;
	let nextMultiplier = calculateMultiplier(revealedTiles + 1, 25, gameSession.mines) || 0;

	const newBalance = await updateBalance(user.id, user.balance - bet);

	delete gameSession.mines_indices;

	return json({ gameSession, newBalance, multiplier, nextMultiplier });
};

const updateBalance = async (userId, newBalance) => {
	newBalance = Math.round(newBalance * 100) / 100;

	const user = await prisma.user.update({
		where: { id: userId },
		data: { balance: newBalance }
	});

	return user.balance;
};

const generateTiles = () => {
	return Array(25)
		.fill()
		.map(() => ({
			isMine: false,
			revealed: false
		}));
};

const generateMinesIndices = (mines) => {
	const minesIndices = new Set();
	while (minesIndices.size < mines) {
		minesIndices.add(Math.floor(Math.random() * 25));
	}
	return Array.from(minesIndices);
};
