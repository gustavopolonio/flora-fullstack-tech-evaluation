/*
  Warnings:

  - A unique constraint covering the columns `[user_id,word_id]` on the table `histories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "histories_user_id_word_id_key" ON "histories"("user_id", "word_id");
