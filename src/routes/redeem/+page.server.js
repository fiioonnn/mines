import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const actions = {
	default: async ({ request, cookies, locals }) => {
		const formData = await request.formData();
		const code = formData.get('code');
		const { user } = locals;

		// generateCodes(300);

		if (!user) {
			return fail(401, { error: true, message: 'Unauthorized' });
		}

		if (!code) {
			return fail(400, { error: true, message: 'Missing code' });
		}

		if (code === 'FREE10') {
			await prisma.user.update({
				where: { id: user.id },
				data: { balance: user.balance + 10 }
			});

			return {
				error: false,
				message: 'Code redeemed successfully'
			};
		}

		const redeem = await prisma.code.findFirst({
			where: { code }
		});

		if (!redeem) {
			return fail(404, { error: true, message: 'Invalid code' });
		}

		if (redeem.used) {
			return fail(400, { error: true, message: 'Code already used' });
		}

		await prisma.code.update({
			where: { code },
			data: { used: true }
		});

		await prisma.user.update({
			where: { id: user.id },
			data: { balance: user.balance + redeem.amount }
		});

		return {
			error: false,
			message: 'Code redeemed successfully'
		};
	}
};

const generateCodes = async (amount) => {
	const codes = [];

	for (let i = 0; i < amount; i++) {
		const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
		const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
		const part3 = Math.random().toString(36).substring(2, 6).toUpperCase();

		codes.push({
			code: `${part1}-${part2}-${part3}`,
			amount: 10,
			used: false
		});
	}

	await prisma.code.createMany({
		data: codes
	});
};
