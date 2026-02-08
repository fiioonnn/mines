import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { base } from '$app/paths';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return fail(400, { error: true, message: 'Missing username or password' });
		}

		const user = await prisma.user.findUnique({
			where: { username, password }
		});

		if (!user) {
			return fail(401, { error: true, message: 'Invalid username or password' });
		}

		// Create session and set cookie
		const session = await prisma.session.create({
			data: {
				userId: user.id
			}
		});

		cookies.set('session', session.id, {
			path: `${base}/`,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		return {
			status: 200,
			body: { user }
		};
	}
};
