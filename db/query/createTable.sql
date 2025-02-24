
CREATE TABLE "User" (
    "id" VARCHAR(255) PRIMARY KEY,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "mobile" VARCHAR(10) UNIQUE,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "deletedAt" TIMESTAMP NULL
);