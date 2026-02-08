import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	const pathname = event.url.pathname;

	if (!session && pathname !== '/login') {
		return redirect(302, '/login');
	}

	if (session && pathname === '/login') {
		return redirect(302, '/');
	}

	const user = await validateSession(session);

	if (!user && pathname !== '/login') {
		event.cookies.delete('session', {
			path: '/'
		});
		return redirect(302, '/login');
	}

	if (user) {
		delete user.password;
		event.locals.user = user;
	}

	return resolve(event);
};

const validateSession = async (sessionId) => {
	const session = await prisma.session.findUnique({
		where: { id: sessionId || '' },
		include: { user: true }
	});

	return session?.user;
};
