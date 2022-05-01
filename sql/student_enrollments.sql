CREATE TABLE student_enrollments(
	id UUID NOT NULL PRIMARY KEY,
	student_id UUID REFERENCES student(id),
	class_id UUID REFERENCES class(id)
)