import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuid } from "uuid";

async function main() {
	await prisma.plan.create({
		data: {
			id: uuid(),
			name: "Mensal",
			description: "Plan description here",
			price: 250,
			duration: 1,
		},
	});

	await prisma.plan.create({
		data: {
			id: uuid(),
			name: "Semestral",
			description: "Plan description here",
			price: 130,
			duration: 1,
		},
	});

	await prisma.plan.create({
		data: {
			id: uuid(),
			name: "Anual",
			description: "Plan description here",
			price: 230,
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
