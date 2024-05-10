-- CreateTable
CREATE TABLE "TodoList" (
    "id" TEXT NOT NULL,
    "todo" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);
