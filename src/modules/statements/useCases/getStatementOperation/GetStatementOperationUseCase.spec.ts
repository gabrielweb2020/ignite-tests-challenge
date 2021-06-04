import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able verify user exists", () => {
    expect(async () => {
      const user_id = "123e4567-e89b-12d3-a456-426614174000";
      const statement_id = "123e4567-e89b-12d3-a456-426614174000";

      await getStatementOperationUseCase.execute({ user_id, statement_id });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it("should be able to not fount one statement", async () => {
    expect(async () => {
      const { id: user_id } = await inMemoryUsersRepository.create({
        name: "User Test",
        email: "user@test.com",
        password: "password"
      });

      const statement_id = "123e4567-e89b-12d3-a456-426614174000";

      await getStatementOperationUseCase.execute({ user_id, statement_id });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });

  it("should be able to return one statement", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "user@test.com",
      password: "password"
    });

    const { id: statement_id } = await inMemoryStatementsRepository.create({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test"
    })

    const statement = await getStatementOperationUseCase.execute({ user_id, statement_id });

    expect(statement).toHaveProperty("id")
    expect(statement.amount).toBe(100)
  });
});
