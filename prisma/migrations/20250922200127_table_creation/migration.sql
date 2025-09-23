-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Compras" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Compras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "public"."Usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."Compras" ADD CONSTRAINT "Compras_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
