-- CreateTable
CREATE TABLE "Error" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "name" TEXT,
    "stack" TEXT,
    "cause" TEXT,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningList" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createrId" TEXT NOT NULL,

    CONSTRAINT "LearningList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningListMaterial" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "learningListId" TEXT NOT NULL,
    "learningMaterialId" TEXT NOT NULL,

    CONSTRAINT "LearningListMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningMaterial" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "publisherName" TEXT NOT NULL,
    "instructors" TEXT[],

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningMaterialLink" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "learningMaterialId" TEXT,

    CONSTRAINT "LearningMaterialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "profileImageUrl" TEXT,
    "clerkId" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_favoriteList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_completedMaterial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningListMaterial_order_learningListId_learningMaterialI_key" ON "LearningListMaterial"("order", "learningListId", "learningMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningMaterial_name_publisherName_instructors_key" ON "LearningMaterial"("name", "publisherName", "instructors");

-- CreateIndex
CREATE UNIQUE INDEX "LearningMaterialLink_url_key" ON "LearningMaterialLink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Person_username_key" ON "Person"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Person_clerkId_key" ON "Person"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "_favoriteList_AB_unique" ON "_favoriteList"("A", "B");

-- CreateIndex
CREATE INDEX "_favoriteList_B_index" ON "_favoriteList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_completedMaterial_AB_unique" ON "_completedMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_completedMaterial_B_index" ON "_completedMaterial"("B");

-- AddForeignKey
ALTER TABLE "LearningList" ADD CONSTRAINT "LearningList_createrId_fkey" FOREIGN KEY ("createrId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningListMaterial" ADD CONSTRAINT "LearningListMaterial_learningListId_fkey" FOREIGN KEY ("learningListId") REFERENCES "LearningList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningListMaterial" ADD CONSTRAINT "LearningListMaterial_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "LearningMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningMaterialLink" ADD CONSTRAINT "LearningMaterialLink_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "LearningMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favoriteList" ADD CONSTRAINT "_favoriteList_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favoriteList" ADD CONSTRAINT "_favoriteList_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_completedMaterial" ADD CONSTRAINT "_completedMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_completedMaterial" ADD CONSTRAINT "_completedMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
