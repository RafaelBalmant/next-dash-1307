# Next.js Chat com OpenAI

Este projeto é uma aplicação de chat construída com Next.js, React e integração com a API da OpenAI. O objetivo é permitir que usuários conversem com um assistente de IA de forma simples e intuitiva.

## Funcionalidades

- Interface de chat responsiva
- Envio de mensagens via botão ou tecla Enter
- Respostas automáticas utilizando a API OpenAI
- Scroll automático para a última mensagem
- Feedback visual de carregamento
- Validação de mensagens vazias

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (para estilos)
- [OpenAI API](https://platform.openai.com/docs/api-reference)

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/RafaelBalmant/next-dash-1307.git
   cd next-dash-1307
   ```
2. Instale as dependências:
   ```sh
   npm install
   # ou
   yarn install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione sua chave da OpenAI:
     ```env
     OPENAI_API_KEY=sua-chave-aqui
     ```
4. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   # ou
   yarn dev
   ```

Acesse [http://localhost:3000/chat](http://localhost:3000/chat) para usar o chat.

## Estrutura Principal

- `src/app/chat/page.tsx`: Página principal do chat
- `src/components/ui/`: Componentes reutilizáveis de UI
- `pages/api/openai.ts`: Endpoint para comunicação com a OpenAI

## Licença

Este projeto é open-source e está sob a licença MIT.
