import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuid } from "uuid";

async function main() {
	await prisma.plan.create({
		data: {
			id: "prod_RpoY14xLtgK47D",
			name: "Mensal",
			description: "Plan description here",
			price: 1500,
			duration: 1,
		},
	});

	await prisma.plan.create({
		data: {
			id: "prod_RpoZMz2Gn8pj3B",
			name: "Semestral",
			description: "Plan description here",
			price: 7500,
			duration: 6,
		},
	});

	await prisma.plan.create({
		data: {
			id: "prod_RpobnxxDMgX9Pa",
			name: "Anual",
			description: "Plan description here",
			price: 13000,
			duration: 12,
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
