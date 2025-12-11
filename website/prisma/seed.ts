import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@/utils/prisma";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Seeding database...");

	// Clear existing todos
	await prisma.user.deleteMany();

	// Create example todos

	const users = await prisma.user.createMany({
		data: [
			{ email: "test@gmail.com", password: await hashPassword("test@123") },
			{ email: "admin@gmail.com", password: await hashPassword("admin@123") },
		],
	});

	console.log(`✅ Created ${users.count} users`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
