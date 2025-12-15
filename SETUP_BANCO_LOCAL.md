# 🗄️ Configuração do Banco de Dados Local - Hi UFPE

Guia completo para criar e popular o banco de dados MySQL no Windows com os dados reais da planilha de horários CIn 2025.2.

---

## 📋 Pré-requisitos

- Node.js instalado
- pnpm instalado
- MySQL instalado (veja opções abaixo)

---

## 1️⃣ Instalar MySQL no Windows

### Opção A: MySQL Community Server (Recomendado)

1. **Baixar:**
   - Acesse: https://dev.mysql.com/downloads/mysql/
   - Escolha: "Windows (x86, 64-bit), MSI Installer"
   - Baixe o instalador completo (mysql-installer-community)

2. **Instalar:**
   - Execute o instalador
   - Escolha "Developer Default" ou "Server only"
   - Configure a senha do root: `root123` (ou outra de sua preferência)
   - Porta padrão: `3306`
   - Finalize a instalação

3. **Verificar instalação:**
   ```powershell
   mysql --version

### Opção B: XAMPP (Mais Fácil)

1. **Baixar:**
   - Acesse: https://www.apachefriends.org/
   - Baixe a versão para Windows

2. **Instalar:**
   - Execute o instalador
   - Marque apenas "MySQL" e "phpMyAdmin"
   - Instale em `C:\xampp`

3. **Iniciar MySQL:**
   - Abra o XAMPP Control Panel
   - Clique em "Start" ao lado de MySQL
   - Acesse phpMyAdmin: http://localhost/phpmyadmin

---

## 2️⃣ Criar o Banco de Dados

### Via MySQL Command Line:

```powershell
# Conectar ao MySQL
mysql -u root -p

# Criar banco de dados
CREATE DATABASE hiufpe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verificar
SHOW DATABASES;

# Sair
EXIT;
```

### Via phpMyAdmin (XAMPP):

1. Acesse: http://localhost/phpmyadmin
2. Clique em "Novo" (New)
3. Nome do banco: `hiufpe`
4. Cotejamento: `utf8mb4_unicode_ci`
5. Clique em "Criar"

---

## 3️⃣ Configurar o Projeto

### Criar arquivo `.env`

Crie o arquivo `.env` na raiz do projeto (`hiufpe-app/.env`):

```env
# Banco de Dados Local
# Ajuste a senha se você usou outra
DATABASE_URL=mysql://root:root123@localhost:3306/hiufpe

# JWT Secret
JWT_SECRET=meu-secret-super-secreto-local-dev-2025

# OAuth (modo desenvolvimento)
VITE_APP_ID=dev-local
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000

# App Info
VITE_APP_TITLE=Hi UFPE
VITE_APP_LOGO=/logo.svg

# APIs (modo desenvolvimento)
BUILT_IN_FORGE_API_URL=http://localhost:3000
BUILT_IN_FORGE_API_KEY=dev-key-local

# Owner
OWNER_OPEN_ID=dev-owner
OWNER_NAME=Desenvolvedor Local
```

**⚠️ IMPORTANTE:** Se você usou senha diferente no MySQL, altere `root123` para sua senha!

---

## 4️⃣ Criar as Tabelas

Execute no terminal (na pasta do projeto):

```powershell
# Aplicar schema do banco de dados
pnpm db:push
```

Isso criará todas as tabelas necessárias:
- users
- disciplinas
- professores
- horarios
- matriculas
- comunicados
- conversas
- mensagens
- uploads
- eventos

---

## 5️⃣ Popular com Dados Reais (CIn 2025.2)

Agora vou criar um script especial com os dados da planilha que você forneceu!

Execute:

```powershell
pnpm tsx scripts/seed-cin-2025-2.ts
```

Este script vai popular o banco com:
- ✅ Disciplinas reais do CIn (Período 1 ao 9)
- ✅ Professores reais
- ✅ Horários reais (seg, ter, qua, qui, sex)
- ✅ Salas corretas (E112, E132, Grad05, etc)
- ✅ Usuários de exemplo para teste

---

## 6️⃣ Iniciar o Servidor

```powershell
pnpm dev
```

Acesse: **http://localhost:5173**

---

## 7️⃣ Verificar os Dados

### Via MySQL Command Line:

```sql
# Conectar
mysql -u root -p hiufpe

# Ver disciplinas
SELECT codigo, nome, creditos FROM disciplinas LIMIT 10;

# Ver horários
SELECT d.codigo, d.nome, h.diaSemana, h.horaInicio, h.sala
FROM horarios h
JOIN disciplinas d ON h.disciplinaId = d.id
LIMIT 20;

# Ver professores
SELECT nome, email, departamento FROM professores;
```

### Via phpMyAdmin:

1. Acesse: http://localhost/phpmyadmin
2. Selecione o banco `hiufpe`
3. Navegue pelas tabelas
4. Clique em "Visualizar" para ver os dados

---

## 8️⃣ Usuários de Teste

Após popular o banco, você terá estes usuários:

| Usuário | Senha | Tipo |
|---------|-------|------|
| admin@ufpe.br | admin123 | Administrador |
| joao.silva@ufpe.br | senha123 | Aluno |
| maria.santos@ufpe.br | senha123 | Aluno |

**⚠️ Nota:** Como estamos em modo local, o login OAuth não funcionará. Você precisará adaptar o código para usar login simples ou acessar diretamente as páginas.

---

## 9️⃣ Comandos Úteis

### Resetar o Banco de Dados

**Dica:** Pare o servidor (`Ctrl + C`) antes de rodar estes comandos para evitar erros de conexão.

```powershell
# Conectar ao MySQL
mysql -u root -p

# Dropar e recriar
DROP DATABASE IF EXISTS hiufpe;
CREATE DATABASE hiufpe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Recriar tabelas
pnpm db:push

# Popular novamente (Script atualizado)
pnpm tsx scripts/seed-cin-2025-2.ts
```

### Backup do Banco

```powershell
# Fazer backup
mysqldump -u root -p hiufpe > backup_hiufpe.sql

# Restaurar backup
mysql -u root -p hiufpe < backup_hiufpe.sql
```

### Ver Logs do MySQL

```powershell
# No XAMPP
C:\xampp\mysql\data\mysql_error.log

# No MySQL Community
C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
```

---

## 🔧 Troubleshooting

### ❌ "Access denied for user 'root'@'localhost'"

**Solução:**
```powershell
# Resetar senha do root
mysql -u root

# No MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
FLUSH PRIVILEGES;
```

### ❌ "Can't connect to MySQL server"

**Solução:**
1. Verifique se o MySQL está rodando
2. No XAMPP: inicie o MySQL no Control Panel
3. No Windows Services: inicie o serviço "MySQL80"

### ❌ "Unknown database 'hiufpe'"

**Solução:**
```sql
CREATE DATABASE hiufpe;
```

### ❌ "Table doesn't exist"

**Solução:**
```powershell
pnpm db:push
```

---

## 📊 Estrutura dos Dados

### Disciplinas (baseadas na planilha CIn 2025.2)

**Período 1:**
- CIN0130 - SISTEMAS DIGITAIS
- CIN0131 - CONCEPÇÃO DE ARTEFATOS DIGITAIS
- CIN0132 - MATEMÁTICA DISCRETA
- CIN0133 - INTRODUÇÃO À PROGRAMAÇÃO

**Período 2:**
- CIN0134 - ARQUITETURA DE COMPUTADORES E SISTEMAS OPERACIONAIS
- CIN0135 - ESTRUTURAS DE DADOS ORIENTADAS A OBJETOS
- CIN0136 - DESENVOLVIMENTO DE SOFTWARE
- MA026 - CÁLCULO DIFERENCIAL E INTEGRAL 1
- FI582 - FÍSICA PARA COMPUTAÇÃO

**Período 3:**
- CIN0137 - BANCO DE DADOS
- CIN0138 - ÁLGEBRA VETORIAL E LINEAR PARA COMPUTAÇÃO
- CIN0139 - INTEGRAÇÃO E EVOLUÇÃO DE SISTEMAS DE INFORMAÇÃO
- CIN0140 - ALGORITMOS
- IF679 - INFORMÁTICA E SOCIEDADE
- IF678 - INFRA-ESTRUTURA DE COMUNICAÇÃO
- IF674 - INFRA-ESTRUTURA DE HARDWARE
- LE530 - INGLÊS PARA COMPUTAÇÃO

E assim por diante até o Período 9...

### Professores Reais

- Stefan Blawid
- Alex Sandro Gomes
- Rodrigo Gabriel Ferreira Soares
- Márcio Lopes Cornélio
- Ricardo Massa Ferreira Lima
- Andson Balieiro
- Paulo Fonseca
- Fabio Silva
- Paola Rodrigues de Godoy Accioly
- E muitos outros...

---

## 🎯 Próximos Passos

1. ✅ MySQL instalado e rodando
2. ✅ Banco `hiufpe` criado
3. ✅ Arquivo `.env` configurado
4. ✅ Tabelas criadas (`pnpm db:push`)
5. ✅ Dados populados (`pnpm tsx scripts/seed-cin-2025-2.ts`)
6. ✅ Servidor rodando (`pnpm dev`)
7. ✅ Acessar http://localhost:5173

---

## 📝 Resumo dos Comandos

```powershell
# 1. Criar banco (MySQL)
mysql -u root -p
CREATE DATABASE hiufpe;
EXIT;

# 2. Configurar projeto
cd hiufpe-app
# Criar arquivo .env (veja seção 3)

# 3. Criar tabelas
pnpm db:push

# 4. Popular dados
pnpm tsx scripts/seed-fixed.ts

# 5. Iniciar servidor
pnpm dev

# 6. Acessar
# http://localhost:5173
```

---

**Pronto! Seu banco de dados local está configurado com os dados reais do CIn 2025.2! 🎉**

