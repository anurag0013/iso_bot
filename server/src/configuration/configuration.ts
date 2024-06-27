export default () => ({
    port: parseInt(process.env.PORT, 10),
    socketPort: parseInt(process.env.SOCKET_PORT, 10),
    database: {
        host: process.env.MONGODB_URL,
    },
    jwtSecret: process.env.JWT_SECRET_KEY,
    developerEmail: process.env.DEVELOPER_EMAIL,
    openAiApiKey: process.env.OPENAI_API_KEY,
    embeddingModel: process.env.EMBEDDINGS_MODEL_NAME,
    persistDirectory: process.env.PERSIST_DIRECTORY,
    targetSourceChunks: process.env.TARGET_SOURCE_CHUNKS,
    chatModelName: process.env.CHAT_MODEL_NAME,
    connectInfinityServerConnectionString:
        process.env.CHATBOT_TO_CONNECT_INFINITY_SERVER_STRING,
    vectorstoreCollectionName: process.env.VECTORSTORE_COLLECTION_NAME,
    vectorstoreURL: process.env.VECTORSTORE_URL
});
