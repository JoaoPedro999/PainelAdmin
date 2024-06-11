-- CreateTable
CREATE TABLE `Cadastros` (
    `id` VARCHAR(191) NOT NULL,
    `CNPJ` VARCHAR(191) NOT NULL,
    `Gestor` VARCHAR(191) NOT NULL,
    `Empresa` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Cadastros_CNPJ_key`(`CNPJ`),
    UNIQUE INDEX `Cadastros_Empresa_key`(`Empresa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
