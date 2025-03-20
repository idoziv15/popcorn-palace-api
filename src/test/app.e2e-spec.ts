import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('App End-to-End Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AppController (e2e)', () => {
    it('should return "Welcome to Popcorn Palace API"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Welcome to Popcorn Palace API');
    });
  });
});
