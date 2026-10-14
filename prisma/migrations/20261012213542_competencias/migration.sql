-- CreateTable
CREATE TABLE "CompetenciaTitulado" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tituladoId" TEXT NOT NULL,
    "nombreCompetencia" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nivelAdquirido" INTEGER NOT NULL,
    "nivelRequerido" INTEGER NOT NULL,
    "brecha" INTEGER NOT NULL,

    CONSTRAINT "CompetenciaTitulado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompetenciaTitulado_tituladoId_idx" ON "CompetenciaTitulado"("tituladoId");

-- AddForeignKey
ALTER TABLE "CompetenciaTitulado" ADD CONSTRAINT "CompetenciaTitulado_tituladoId_fkey" FOREIGN KEY ("tituladoId") REFERENCES "GraduateSurvey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
