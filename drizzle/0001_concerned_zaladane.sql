CREATE TABLE `comunicados` (
	`id` varchar(64) NOT NULL,
	`titulo` varchar(300) NOT NULL,
	`conteudo` text NOT NULL,
	`autor` varchar(200),
	`autorId` varchar(64),
	`tipo` enum('geral','academico','administrativo','evento','urgente') NOT NULL DEFAULT 'geral',
	`prioridade` enum('baixa','media','alta') NOT NULL DEFAULT 'media',
	`publico` boolean NOT NULL DEFAULT true,
	`dataPublicacao` timestamp DEFAULT (now()),
	`dataExpiracao` timestamp,
	`anexos` text,
	`visualizacoes` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `comunicados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversas` (
	`id` varchar(64) NOT NULL,
	`usuarioId` varchar(64) NOT NULL,
	`titulo` varchar(200),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `conversas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disciplinas` (
	`id` varchar(64) NOT NULL,
	`codigo` varchar(20) NOT NULL,
	`nome` varchar(200) NOT NULL,
	`descricao` text,
	`creditos` int,
	`departamento` varchar(100),
	`ementa` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `disciplinas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventos` (
	`id` varchar(64) NOT NULL,
	`titulo` varchar(300) NOT NULL,
	`descricao` text,
	`tipo` enum('prova','trabalho','feriado','evento','prazo') NOT NULL,
	`dataInicio` timestamp NOT NULL,
	`dataFim` timestamp,
	`local` varchar(200),
	`disciplinaId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `eventos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `horarios` (
	`id` varchar(64) NOT NULL,
	`disciplinaId` varchar(64) NOT NULL,
	`professorId` varchar(64) NOT NULL,
	`diaSemana` enum('Segunda','Terça','Quarta','Quinta','Sexta','Sábado') NOT NULL,
	`horaInicio` varchar(5) NOT NULL,
	`horaFim` varchar(5) NOT NULL,
	`sala` varchar(50) NOT NULL,
	`periodo` varchar(10),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `horarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matriculas` (
	`id` varchar(64) NOT NULL,
	`alunoId` varchar(64) NOT NULL,
	`disciplinaId` varchar(64) NOT NULL,
	`periodo` varchar(10) NOT NULL,
	`nota1` int,
	`nota2` int,
	`nota3` int,
	`notaFinal` int,
	`frequencia` int,
	`status` enum('cursando','aprovado','reprovado','trancado') NOT NULL DEFAULT 'cursando',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `matriculas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mensagens` (
	`id` varchar(64) NOT NULL,
	`conversaId` varchar(64) NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`conteudo` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `mensagens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professores` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(200) NOT NULL,
	`email` varchar(320),
	`departamento` varchar(100),
	`sala` varchar(50),
	`telefone` varchar(20),
	`lattes` varchar(500),
	`foto` varchar(500),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `professores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(300) NOT NULL,
	`tipo` enum('planilha_horarios','planilha_notas','planilha_alunos','documento','outro') NOT NULL,
	`url` varchar(500) NOT NULL,
	`tamanho` int,
	`mimeType` varchar(100),
	`uploadPor` varchar(64) NOT NULL,
	`processado` boolean NOT NULL DEFAULT false,
	`erros` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `uploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','professor','secgrad') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `matricula` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `curso` varchar(200);--> statement-breakpoint
ALTER TABLE `users` ADD `periodo` int;