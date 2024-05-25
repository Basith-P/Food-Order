import { AuthPayload } from "../src/dto/";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload | null;
    }
  }
}
