CREATE TABLE `avaliacoes` (
	`id` varchar(64) NOT NULL,
	`metodoAvaliacaoId` varchar(64) NOT NULL,
	`nome` varchar(200) NOT NULL,
	`tipo` enum('prova','trabalho','ap','projeto','seminario','exercicio','outro') NOT NULL DEFAULT 'prova',
	`peso` decimal(5,2) NOT NULL,
	`notaObtida` decimal(5,2),
	`notaMaxima` decimal(5,2) NOT NULL DEFAULT '10.00',
	`dataAvaliacao` date,
	`observacoes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `avaliacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metodos_avaliacao` (
	`id` varchar(64) NOT NULL,
	`matriculaId` varchar(64) NOT NULL,
	`nome` varchar(200) NOT NULL,
	`descricao` text,
	`formula` text NOT NULL,
	`tipo` enum('media_simples','media_ponderada','media_com_substituicao','personalizado') NOT NULL DEFAULT 'media_ponderada',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `metodos_avaliacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registro_faltas` (
	`id` varchar(64) NOT NULL,
	`matriculaId` varchar(64) NOT NULL,
	`data` date NOT NULL,
	`justificada` boolean NOT NULL DEFAULT false,
	`justificativa` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `registro_faltas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `disciplinas` MODIFY COLUMN `codigo` varchar(20);--> statement-breakpoint
ALTER TABLE `horarios` MODIFY COLUMN `professorId` varchar(64);--> statement-breakpoint
ALTER TABLE `horarios` MODIFY COLUMN `diaSemana` enum('Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado') NOT NULL;--> statement-breakpoint
ALTER TABLE `horarios` MODIFY COLUMN `sala` varchar(50);--> statement-breakpoint
ALTER TABLE `matriculas` MODIFY COLUMN `nota1` decimal(5,2);--> statement-breakpoint
ALTER TABLE `matriculas` MODIFY COLUMN `nota2` decimal(5,2);--> statement-breakpoint
ALTER TABLE `matriculas` MODIFY COLUMN `nota3` decimal(5,2);--> statement-breakpoint
ALTER TABLE `matriculas` MODIFY COLUMN `notaFinal` decimal(5,2);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `periodo` varchar(10);--> statement-breakpoint
ALTER TABLE `disciplinas` ADD `cargaHoraria` int;--> statement-breakpoint
ALTER TABLE `disciplinas` ADD `professorId` varchar(64);--> statement-breakpoint
ALTER TABLE `disciplinas` ADD `criadoPor` varchar(64);--> statement-breakpoint
ALTER TABLE `disciplinas` ADD `oficial` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `horarios` ADD `criadoPor` varchar(64);--> statement-breakpoint
ALTER TABLE `horarios` ADD `matriculaId` varchar(64);--> statement-breakpoint
ALTER TABLE `matriculas` ADD `metodoAvaliacaoId` varchar(64);--> statement-breakpoint
ALTER TABLE `matriculas` ADD `mediaCalculada` decimal(5,2);--> statement-breakpoint
ALTER TABLE `matriculas` ADD `mediaMinima` decimal(5,2) DEFAULT '5.00';--> statement-breakpoint
ALTER TABLE `matriculas` ADD `frequenciaMinima` int DEFAULT 75;--> statement-breakpoint
ALTER TABLE `matriculas` ADD `media` decimal(5,2);--> statement-breakpoint
ALTER TABLE `matriculas` ADD `faltas` int DEFAULT 0;