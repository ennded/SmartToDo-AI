import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Mock API requests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
