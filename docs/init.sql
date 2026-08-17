-- Schéma MLD DataShare (exécuté au premier démarrage PostgreSQL Docker)
-- Correspond au MCD : UTILISATEUR / FICHIER / TAG

CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file (
    file_id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    size BIGINT,
    path VARCHAR(255),
    access_password VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP WITH TIME ZONE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tag (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS file_tag (
    file_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (file_id, tag_id),
    FOREIGN KEY (file_id) REFERENCES file(file_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(tag_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_file_user_id ON file(user_id);
CREATE INDEX IF NOT EXISTS idx_file_tag_file_id ON file_tag(file_id);
CREATE INDEX IF NOT EXISTS idx_file_tag_tag_id ON file_tag(tag_id);
CREATE INDEX IF NOT EXISTS idx_file_token ON file(token);
CREATE INDEX IF NOT EXISTS idx_file_expire_at ON file(expire_at);
