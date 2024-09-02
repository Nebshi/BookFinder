const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Book = require('./src/models/Book'); // Ensure this path points to your Book model
require('dotenv').config(); // Load your MongoDB connection string from a .env file

const generateMockBooks = async (numBooks) => {
	const books = [];

	for (let i = 0; i < numBooks; i++) {
		const book = {
			title: faker.lorem.words(3),
			author: `${faker.person.firstName()} ${faker.person.lastName()}`,
			genre: faker.helpers.arrayElement(['Fiction', 'Non-fiction', 'Mystery', 'Fantasy', 'Biography', 'Science Fiction']),
			publicationDate: faker.date.past({ years: 10, refDate: new Date() }),
			rating: faker.number.float({ multipleOf: 0.1 }),
		};
		books.push(book);
	}

	return books;
};

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		const mockBooks = await generateMockBooks(100); // Generate 100 mock books
		await Book.insertMany(mockBooks);

		console.log('Mock data inserted successfully');
		mongoose.connection.close();
	} catch (error) {
		console.error('Error seeding database:', error);
	}
};

seedDatabase();
