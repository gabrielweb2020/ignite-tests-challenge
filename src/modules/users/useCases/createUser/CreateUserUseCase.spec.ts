import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com.br",
      password: "passwordTest"
    });

    expect(user).toHaveProperty("id");
  })

  it("should be able to return an error when trying to register two users with the same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com.br",
        password: "passwordTest"
      });

      await createUserUseCase.execute({
        name: "User Test Two",
        email: "user@test.com.br",
        password: "passwordTest"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
