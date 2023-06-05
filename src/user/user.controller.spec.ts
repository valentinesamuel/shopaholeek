import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    expect(controller.create({ name: 'Vally' })).toEqual({
      id: expect.any(Number),
      name: 'Vally',
    });
    expect(mockUserService.create).toHaveBeenCalled();
  });

  it('should update a user', () => {
    const dto = { name: 'Vally' };
    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });
  });
});
