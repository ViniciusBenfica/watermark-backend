import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuid } from "uuid";

async function main() {
	await prisma.plan.create({
		data: {
			id: uuid(),
			name: "Basic",
			description: "Plan description here",
			price: 25,
			duration: 1,
		},
	});

	await prisma.plan.create({
		data: {
			id: uuid(),
			name: "Standard",
			description: "Plan description here",
			price: 25,
			duration: 1,
		},
	});

	await prisma.plan.create({
		data: {
			id: uuid(),
			name: "Premium",
			description: "Plan description here",
			price: 25,
			duration: 1,
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
