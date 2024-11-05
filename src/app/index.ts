import cors from "cors";
import express from "express";
import { env } from "./env";
import planRoute from "./routes/plan/plan.route";
import userRoute from "./routes/user/user.route";

interface IServer {
	app: express.Application;
	port: number | string;
}

class Server implements IServer {
	app: express.Application;
	port: number | string;

	constructor() {
		this.app = express();
		this.port = env.SERVER_PORT || 4000;
		this.middlewares();
		this.routes();
		this.startServer();
	}

	startServer() {
		this.app.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}

	routes() {
		this.app.use(userRoute);
		this.app.use(planRoute);
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
	}
}

new Server();
