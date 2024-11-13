-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_histories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "histories_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_histories" ("created_at", "id", "user_id", "word_id") SELECT "created_at", "id", "user_id", "word_id" FROM "histories";
DROP TABLE "histories";
ALTER TABLE "new_histories" RENAME TO "histories";
CREATE UNIQUE INDEX "histories_user_id_word_id_key" ON "histories"("user_id", "word_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
