
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- CREATE TABLE "Users" (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     firstName VARCHAR(255),
--     lastName VARCHAR(255),
--     email VARCHAR(255) UNIQUE NOT NULL,
--     mobile VARCHAR(10) UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     "deletedAt" TIMESTAMP WITHOUT TIME ZONE
-- );


-- CREATE TABLE "Rooms" (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(255) NOT NULL,
--     creatorid UUID NOT NULL,
--     "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     "deletedAt" TIMESTAMP WITHOUT TIME ZONE,
--     FOREIGN KEY ("creatorid") REFERENCES "Users"(id) ON DELETE CASCADE
-- );


-- CREATE TABLE "Messages" (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     message TEXT NOT NULL,
--     senderid UUID NOT NULL,
--     receiverid UUID,
--     roomid UUID,
--     "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--    "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     "deletedAt" TIMESTAMP WITHOUT TIME ZONE,
--     FOREIGN KEY ("senderid") REFERENCES "Users"(id) ON DELETE CASCADE,
--     FOREIGN KEY ("receiverid") REFERENCES "Users"(id) ON DELETE SET NULL,
--     FOREIGN KEY ("roomid") REFERENCES "Rooms"(id) ON DELETE CASCADE
-- );



-- CREATE TABLE "RoomUsers" (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     userid UUID NOT NULL,
--     roomid UUID NOT NULL,
--     "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
--     "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
--     "deletedAt" TIMESTAMP WITHOUT TIME ZONE,
--     FOREIGN KEY (userid) REFERENCES "Users"(id) ON DELETE CASCADE,
--     FOREIGN KEY (roomid) REFERENCES "Rooms"(id) ON DELETE CASCADE
-- );
