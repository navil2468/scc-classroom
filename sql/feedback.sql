CREATE TABLE feedback(
	id UUID NOT NULL PRIMARY KEY,
	teacher_id UUID NOT NULL REFERENCES teacher(id),
	class_id UUID NOT NULL REFERENCES class(id),
	message VARCHAR(1000),
	class_date DATE,
	slide_number SMALLINT
);