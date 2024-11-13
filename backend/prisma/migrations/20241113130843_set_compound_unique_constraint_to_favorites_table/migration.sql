/*
  Warnings:

  - A unique constraint covering the columns `[user_id,word_id]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_word_id_key" ON "favorites"("user_id", "word_id");
