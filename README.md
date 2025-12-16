# ⚽ Soccer Quiz App - Front-end

Este é o projeto Front-end desenvolvido para a disciplina **MATA62 -
Engenharia de Software I**. Trata-se de uma aplicação móvel de Quiz
sobre futebol, onde usuários podem testar seus conhecimentos sobre
diferentes times e administradores podem gerenciar o conteúdo.

O projeto foi construído utilizando **React Native (Expo)**,
**TypeScript** e **NativeWind** para estilização.

## 🚀 Tecnologias

-   [React Native](https://reactnative.dev/)
-   [Expo](https://expo.dev/)
-   [NativeWind (Tailwind CSS)](https://www.nativewind.dev/)
-   [Expo Router](https://docs.expo.dev/router/introduction/)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

-   [Node.js](https://nodejs.org/) (Versão LTS recomendada)
-   [Git](https://git-scm.com/)
-   Aplicativo **Expo Go** no seu celular (Android ou iOS) ou um
    emulador configurado.

## 🔧 Passo a Passo para Rodar

1.  **Clone o repositório:**

    ``` bash
    git clone https://github.com/seu-usuario/nome-do-repo.git
    cd nome-do-repo
    ```

2.  **Instale as dependências:**

    ``` bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**

    Crie um arquivo `.env` na raiz do projeto (baseado no exemplo
    abaixo).\
    É **essencial** configurar a URL da API corretamente para que as
    funcionalidades  funcionem.

    ``` env
    # .env
    # Exemplo de URL (se estiver usando ngrok para expor seu backend local)
    EXPO_PUBLIC_API_URL=https://spirituous-kasie.ngrok-free.dev
    ```
    
4.  **Inicie o projeto:**

    ``` bash
    npx expo start
    ```

    -   Pressione `a` para abrir no Emulador Android\
    -   Pressione `i` para abrir no Simulador iOS\
    -   Ou leia o QR Code com o app **Expo Go** no seu celular

## 📦 Build (Gerar APK)

Para gerar o APK instalável para Android (Preview):

1.  Certifique-se de ter o `eas-cli` instalado:

    ``` bash
    npm install -g eas-cli
    ```

2.  Faça login:

    ``` bash
    eas login
    ```

3.  Execute o build:

    ``` bash
    eas build -p android --profile preview
    ```

------------------------------------------------------------------------

Desenvolvido para MATA62.
