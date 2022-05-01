CREATE TYPE lang AS ENUM ('Intro Java', 'Intro Python', 'Intermediate Java', 'Intermediate Python');

CREATE TABLE class(
	id UUID NOT NULL PRIMARY KEY,
	teacher_id UUID NOT NULL REFERENCES teacher(id),
	name VARCHAR(100), 
	day VARCHAR(10),
	time VARCHAR(10),
	current_slide SMALLINT,
	week_number SMALLINT, 
	subject lang,
	zoom_link VARCHAR(200),
	replit_link VARCHAR(200)
);