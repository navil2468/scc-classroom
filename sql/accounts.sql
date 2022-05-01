CREATE TYPE account AS ENUM ('student', 'teacher', 'admin');

CREATE TABLE accounts(
	id UUID NOT NULL PRIMARY KEY, 
	email VARCHAR(100) NOT NULL UNIQUE,
	account_type account
);