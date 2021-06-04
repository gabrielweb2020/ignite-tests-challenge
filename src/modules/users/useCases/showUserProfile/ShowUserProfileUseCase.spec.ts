import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able verify user exists", () => {
    expect(async () => {
      const user_id = "123e4567-e89b-12d3-a456-426614174000";

      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  });

  it("should be able return at information user", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "user@test.com",
      password: "password"
    });

    const user = await showUserProfileUseCase.execute(user_id);

    expect(user).toHaveProperty("id");
  })
})
