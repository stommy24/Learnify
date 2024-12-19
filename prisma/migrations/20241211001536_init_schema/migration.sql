-- AlterTable
ALTER TABLE "_ConceptToTopic" ADD CONSTRAINT "_ConceptToTopic_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ConceptToTopic_AB_unique";

-- AlterTable
ALTER TABLE "_DependencyToTopic" ADD CONSTRAINT "_DependencyToTopic_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DependencyToTopic_AB_unique";

-- AlterTable
ALTER TABLE "_LevelToTopic" ADD CONSTRAINT "_LevelToTopic_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LevelToTopic_AB_unique";

-- AlterTable
ALTER TABLE "_MistakeToTopic" ADD CONSTRAINT "_MistakeToTopic_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MistakeToTopic_AB_unique";
