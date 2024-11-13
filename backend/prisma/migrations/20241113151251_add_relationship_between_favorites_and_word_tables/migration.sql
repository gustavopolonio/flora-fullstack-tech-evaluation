-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "favorites_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_favorites" ("created_at", "id", "user_id", "word_id") SELECT "created_at", "id", "user_id", "word_id" FROM "favorites";
DROP TABLE "favorites";
ALTER TABLE "new_favorites" RENAME TO "favorites";
CREATE UNIQUE INDEX "favorites_user_id_word_id_key" ON "favorites"("user_id", "word_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
