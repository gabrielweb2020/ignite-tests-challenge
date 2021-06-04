import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able not to locate the user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@test.com.br",
        password: "testPassword"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be able not to locate a password the user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "userpassword@test.com",
        password: "passwordTest"
      });

      await authenticateUserUseCase.execute({
        email: "userpassword@test.com",
        password: "1234568"
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be able authenticate user", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "passwordTest"
    });

    const result = await authenticateUserUseCase.execute({
      email: "user@test.com",
      password: "passwordTest"
    });

    expect(result).toHaveProperty("token");
  })
})
