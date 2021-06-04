import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able verify user exists", () => {
    expect(async () => {
      const user_id = "123e4567-e89b-12d3-a456-426614174000";
      let type: OperationType.WITHDRAW;

      await createStatementUseCase.execute({ user_id, type, amount: 10, description: "Test" });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should be able return insufficient funds", () => {
    expect(async () => {
      const { id: user_id } = await inMemoryUsersRepository.create({
        name: "User Test Insufficient",
        email: "userinsufficient@test.com",
        password: "password"
      });

      await createStatementUseCase.execute({ user_id, type: OperationType.DEPOSIT, amount: 100, description: "Test Deposit" });

      await createStatementUseCase.execute({ user_id, type: OperationType.WITHDRAW, amount: 150, description: "Test Withdraw" });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

  it("should be able create deposit ", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "User Test Create",
      email: "usercreate@test.com",
      password: "password"
    });

    const createStatement = await createStatementUseCase.execute({ user_id, type: OperationType.DEPOSIT, amount: 100, description: "Test" });

    expect(createStatement).toHaveProperty("id");
  });

  it("should be able create withdraw", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "User Test Insufficient",
      email: "userinsufficient@test.com",
      password: "password"
    });

    await createStatementUseCase.execute({ user_id, type: OperationType.DEPOSIT, amount: 100, description: "Test Deposit" });

    const withdraw = await createStatementUseCase.execute({ user_id, type: OperationType.WITHDRAW, amount: 50, description: "Test Withdraw" });

    expect(withdraw.amount).toBe(50);
  });
})
