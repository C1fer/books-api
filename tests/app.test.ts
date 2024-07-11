import request from 'supertest';
import  app  from '../src/app'; 
import { createConnection, getConnection } from 'typeorm';

beforeAll(async () => {
  await createConnection();// Connect to database before running tests
});

afterEach(async () => {
  // Clear all data after each test
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
});

afterAll(async () => {
  await getConnection().close(); 
});

const MOCK_DATA = {
  book: {
    author: "Test Author",
    title: "Test Title",
    genre: "Tragicomedy",
    isbn: "1234567890",
    publisher: "Test Publisher",
    publishedYear: '1999',
    pages: 100,
    edition: "Test Edition"
  }
}

describe('Books API Test', () => {
  test('TC01 - Verify creation of a new book', async () => {
    const response = await request(app)
      .post('/books')
      .send(MOCK_DATA.book);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  test('TC02 - Modify information of an existing book', async () => {
    // Create a book first
    const createResponse = await request(app)
      .post('/books')
      .send(MOCK_DATA.book);
    const bookId = createResponse.body.id;
        
    // Modify created book
    const updateResponse = await request(app)
      .put(`/books`) 
      .send({
        id: bookId,
        publishedYear: '2021',
      });

  
    expect(createResponse.statusCode).toBe(200);
    expect(createResponse.body).toHaveProperty('id', bookId);
    expect(updateResponse.statusCode).toBe(200);
  });

  test('TC03 - Delete an existing book', async () => {
    // Create book first
    let response = await request(app)
      .post('/books')
      .send(MOCK_DATA.book);
    const bookId = response.body.id;

    // Delete book
    response = await request(app)
      .delete(`/books/${bookId}`); 
    expect(response.statusCode).toBe(200);
  });

  test('TC04 - Invalid ISBN handling', async () => {
    const response = await request(app)
      .post('/books')
      .send({
        ...MOCK_DATA.book,
        isbn: '123456789012345' // Invalid ISBN with 15 digits
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('reason', 'Invalid ISBN');
  });

  test('TC05 - Modification of required field', async () => {
    // Create a book first
    const createResponse = await request(app)
      .post('/books')
      .send(MOCK_DATA.book);
    const bookId = createResponse.body.id;
    console.log(bookId);
    
    // Modify created book with empty title
    const updateResponse = await request(app)
      .put(`/books`)
      .send({
        ...MOCK_DATA.book,
        id: bookId,
        title: null, 
      });

    expect(updateResponse.statusCode).toBe(400);
    expect(updateResponse.body).toHaveProperty('reason', 'All fields are required');
  });

  test('TC06 - Delete non-existent book', async () => {
    const nonExistentBookId = 0;

    const response = await request(app)
      .delete(`/books/${nonExistentBookId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('reason', 'Book not found');
  });

  test('TC07 - Register user with username within valid limits', async () => {
    const response = await request(app)
      .post('/users/signup') 
      .send({
        username: 'ValidUser',
        password: 'ValidPass12',
        email: 'user@example.com',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  test('TC08 - Register user with username at the lower limit', async () => {
    const response = await request(app)
      .post('/users/signup') // Ajusta según tus rutas
      .send({
        username: 'ValidU',
        password: 'ValidPass',
        email: 'user@example.com',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  test('TC09 - Register user with username beyond the upper limit', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        username: 'TooLongUsernameHere',
        password: 'TooLongPasswordHere123',
        email: 'user@example.com',
      });
    expect(response.statusCode).toBe(400); 
    expect(response.body).toHaveProperty('reason', 'Username and password length requirements not met');
  });
});
