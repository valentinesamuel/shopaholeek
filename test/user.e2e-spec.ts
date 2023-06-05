import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUsers = [{ id: 1, name: 'Marius' }];

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect(mockUsers);
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ name: 'Marius' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'Marius',
        });
      });
  });
});
