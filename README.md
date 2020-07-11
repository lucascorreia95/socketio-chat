# socketio-chat
Um exemplo de aplicação de bate-papo.

### Motivação
Aprender mais sobre desenvolvimento web utilizando ferramentas para comunicação em **real-time**.

### Descrição
Uma simples aplicação para simular uma sala de bate-papo, onde os usuários se conectam ao app informando seu apelido. Os usuários são direcionados para uma sala de bate-papo, onde estão todos os outros usuários conectados no momento, estes que são exibidos em uma lista ao lado das mensagens. Também existe a opção de criar uma sala de bate-papo privada com um dos usuários que estão online no momento.

### Técnologias

[Socket.io](https://socket.io/) - A principal técnologia do projeto, responsável por fazer a comunicação em **real-time** entre o servidor e os **clients** conectados.

[Express](https://expressjs.com/pt-br/) - *Framework* utilizado para responder a rota com a página e os arquivos estáticos.

### Execução

Clone o repositório deste projeto, instale as dependências, usando o **npm install** ou **yarn**, e execute-o com o scritp **start**, depois acesse *http://localhost:3000* em seu navegador.
