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
CREATE TABLE "LearningMaterial" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "publisherName" TEXT NOT NULL,

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
    "fullName" TEXT,
    "profileImageUrl" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LearningListToLearningMaterial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LearningMaterialToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LearningListToLearningMaterial_AB_unique" ON "_LearningListToLearningMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_LearningListToLearningMaterial_B_index" ON "_LearningListToLearningMaterial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LearningMaterialToPerson_AB_unique" ON "_LearningMaterialToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_LearningMaterialToPerson_B_index" ON "_LearningMaterialToPerson"("B");

-- AddForeignKey
ALTER TABLE "LearningList" ADD CONSTRAINT "LearningList_createrId_fkey" FOREIGN KEY ("createrId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningMaterialLink" ADD CONSTRAINT "LearningMaterialLink_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "LearningMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningListToLearningMaterial" ADD CONSTRAINT "_LearningListToLearningMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningListToLearningMaterial" ADD CONSTRAINT "_LearningListToLearningMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningMaterialToPerson" ADD CONSTRAINT "_LearningMaterialToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningMaterialToPerson" ADD CONSTRAINT "_LearningMaterialToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
