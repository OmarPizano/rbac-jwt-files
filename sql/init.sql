CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_account_role FOREIGN KEY (role_id) REFERENCES role(id)
        ON DELETE RESTRICT
		ON UPDATE RESTRICT
);

CREATE TABLE uploaded_file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL UNIQUE,
    role_id_required INT NOT NULL,
    CONSTRAINT fk_file_role FOREIGN KEY (role_id_required) REFERENCES role(id)
        ON DELETE RESTRICT
		ON UPDATE RESTRICT
);

-- init data
INSERT INTO role (name) VALUES ('admin'), ('user');

INSERT INTO account (username, password, role_id)
VALUES
	('admin', '$2a$12$QFL.kzQPImz.goTF3T.OLeX.QMkWz9ul1wJW2L7ub.h/CvHJE9h36', 1),
	('user', '$2a$12$UWGxjhS6EYmvkuaLmmInOuL1a8IBbuFc0vK6bLGcre0LmaQOH7enC', 2);

INSERT INTO uploaded_file (url, role_id_required)
VALUES
	('classified-document.pdf', 1),
	('generic-document.pdf', 2);
