-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxCapacity" INTEGER,
ADD COLUMN     "performers" TEXT,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "soldTickets" INTEGER DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'scheduled',
ADD COLUMN     "ticketUrl" TEXT,
ADD COLUMN     "venue" TEXT;
