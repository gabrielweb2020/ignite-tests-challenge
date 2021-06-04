import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able verify user exists", () => {
    expect(async () => {
      const user_id = "123e4567-e89b-12d3-a456-426614174000";

      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError)
  });

  it("should be able return balance at user", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "user@test.com",
      password: "password"
    });

    const balanceUser = await getBalanceUseCase.execute({ user_id });

    expect(balanceUser.balance).toBe(0);
    expect(balanceUser.statement.length).toBe(0);
  })
})
