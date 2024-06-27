# WFT Chatbot (NEST and NEXT)

This is Langchain implementation using NestJS for backend and NextJS for frontend. 

# Installation Notes

## Frontend

First, run the following command to go to the client directory:

```bash 
cd ./client
```

Now run the following command to install the dependencies:

```bash 
npm i
```

Now set the environment variable in .env file.

```bash
NEXT_PUBLIC_SERVER_URL=(server url)
# 5001 is the socket server port
NEXT_PUBLIC_SOCKET_SERVER_URL=<server_url>:5001

```

To run the development server:

```bash 
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend

First, run the following command to go to the server directory:

```bash 
cd ./server
```
Now run the following command to install the dependencies:

```bash 
npm i
```

Now set the environment variables in .env file. Some of the environment variables are left as default:

```bash
PORT=(port to run the server on)
SOCKET_PORT=(socket port to run socket on)
MONGODB_URL=(mongodb connection url)
JWT_SECRET_KEY=(jwt secret keys)
DEVELOPER_EMAIL=(developers email separated by comma)
OPENAI_API_KEY=(open ai api key)
EMBEDDINGS_MODEL_NAME=text-embedding-ada-002
PERSIST_DIRECTORY=./lancedb
CHAT_MODEL_NAME=gpt-4
CHATBOT_TO_CONNECT_INFINITY_SERVER_STRING=(base64 generated string)
VECTORSTORE_COLLECTION_NAME=(collection name to infer by the ai)
VECTORSTORE_URL=(url to the vectorstore)
```

To run the development server:

```bash 
npm run start:dev
```

The development server will now run on the localhost with the port defined on .env file.