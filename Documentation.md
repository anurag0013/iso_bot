
<h3 align="center">Naasa Chatbot</h3>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 

</div>

---

<p align="center"> Naasa Chatbot is an AI chatbot implemented using Langchain, NEST.js and NEXT.js. It is created for the purpose of customer interaction for NAASA Securities.
    <br> 
</p>

## Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [API Endpoints](#api_endpoints)
- [Built Using](#built-using)

## About <a name = "about"></a>
Naasa Chatbot is an AI chatbot created for helping the customers on their queries. It is a smart chatbot that can answer any queries related to the Naasa Securities using the knowledge from the vector-store. The vector-store used is LanceDB. 

The ingest script to create the vectorstore called `lancedb_ingest.py` is available in the following [repository](https://github.com/saketasteriskt/naasa-chatbot/tree/v1.2/server).

## Getting Started <a name = "getting_started"></a>
To start using this project first clone this Github reposito

### Prerequisites
Before running the project, make sure that `Node(greater or equal to version 18)` and `NPM(greater or equal to version 9)` are installed on the machine. 

To install node on your machine, go to the following [link](https://nodejs.org/en). NPM is installed alongside with node.


The frontend application of this project can also be run using Docker. To install docker on your machine, go to the following [link](https://www.docker.com).

### Installing

#### Frontend

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

To run the frontend application:

```bash 
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##### Frontend using Docker

To run the client-side application using Docker, first make sure port 3012 is open. Now, run the following command:

```bash
cd client && docker build -t <container_name> .
```

The above command will build the docker image. Now, to run the container:

```bash
docker run -dp 127.0.0.1:3000:3012 <container_name>
```

The frontend application will now run on [127.0.0.1:3000](127.0.0.1:3000).

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

## API Endpoints <a name = "api_endpoints"></a>

The following are the API endpoints available:

#### /api/v1/auth (POST)
    Request Body
        - name - string

    The above endpoint is used to authenticate as well as register the user.

    Response

    The response from the above endpoint is either an HttpException or a JSON Object of format {msg(string), error(boolean)}

#### /api/v1/chat/:session_id (GET)
    Params
    - session_id -string

    The above endpoint is used to get the chats of a particular session of the user. The session is of socket session not server session. This endpoint is guarded and requires custom header to be passed on request to access it.
    The format of the custom header is:

    ```bash
    chatbot-to-connect-infinity-token: CHATBOT_SERVER_TO_CONNECT_INFINITY <base64_string>
    ```

    Response

    The response from the above endpoin is either ForbiddenException, BadRequestException, JSON Object of format {msg(string), error(boolean)} or document.


## Built Using <a name = "built_using"></a>
- [MongoDB](https://www.mongodb.com/) - Database
- [NestJs](https://nestjs.com/) - Server Framework
- [NextJs](https://nextjs.org/) - Web Framework
- [LangchainJs](https://js.langchain.com/docs/get_started/introduction/) - AI Framework
