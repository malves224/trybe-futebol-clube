# Trybe futebol clube 

## Sobre o projeto :soccer:
O Projeto foi fornecido pela escola de desenvolvimento Trybe com objetivo de avaliar Dockerização, Modelagem de dados com **MySql** através do **Sequelize**, Construção de **API REST** utilizando **Typescript**.

Em trybe futebol clube é possível acompanhar partidas em andamento, consultar classificação dos clubes e também criar partidas e alterar placar caso o usuário seja um administrador.

## Habilidades desenvolvidas :computer:
O frontend da aplicação já estava pronto então desenvolvi apenas o backend, principais desafios foram:

 - Conectar serviços utilizando docker (frontend, backend e o banco de dados).
 - Aplicar os padrões REST para os endpoints da API.
 - Testes de integração automatizados dos endpoints.
 - Utilizar Typescript com node e express.
 - Criação de camadas utilizando conceitos de POO.

## Aplicação funcionando :rocket:

### A aplicação ta on :eyes:
Acesse agora pelo link >>>> http://ec2-3-85-118-10.compute-1.amazonaws.com:3000/

### Rode na sua maquina com docker :whale2:

#### 1º Clone o repositório:
	

Rode o seguinte comando em seu terminal:

    git clone git@github.com:malves224/trybe-futebol-clube.git && cd trybe-futebol-clube

#### 2º Monte os contêineres utilizando docker compose:
:warning: ATENÇÃO: As portas 3000, 3001, e 3002 devem estar livre. :warning:

Rode o seguinte comando em seu terminal ```npm run compose:up``` isso irá rodar o arquivo docker-compose que orquestra todos os 3 serviços (backend, frontend, e banco de dados).
Após a conclusão acesse em seu navegador http://localhost:3000/ para acessar o frontend da aplicação.
Para "desmontar" os serviços basta rodar ```npm run compose:down```.


### 3º Insira o usuario e senha:
Usuario: admin@admin.com
Senha: secret_admin

## Autor

**Matheus Alves de Oliveira**

Linkedin:  [https://www.linkedin.com/in/mthsalves](https://www.linkedin.com/in/mthsalves)

Email:  [malves224@gmail.com](mailto:malves224@gmail.com)
