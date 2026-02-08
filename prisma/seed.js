import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('Seeding database...');

	// Create demo user
	await prisma.user.upsert({
		where: { username: 'demo' },
		update: { balance: 1000 },
		create: {
			username: 'demo',
			password: 'demo',
			balance: 1000
		}
	});

	// Create some codes
	const codes = [
		{ code: 'WELCOME100', amount: 100 },
		{ code: 'BONUS200', amount: 200 },
		{ code: 'EXTRA50', amount: 50 }
	];

	for (const codeData of codes) {
		await prisma.code.upsert({
			where: { code: codeData.code },
			update: {},
			create: codeData
		});
	}

	console.log('Seeding completed.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
