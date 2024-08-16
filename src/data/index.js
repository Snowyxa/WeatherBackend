const { PrismaClient } = require("@prisma/client");
const { getLogger } = require("../core/logging");
const config = require("config");

const prisma = new PrismaClient();

async function initializeData() {
    const logger = getLogger();
    logger.info("Initializing connection to database");

    try {
        await prisma.$connect();
    } catch (error) {
        logger.info(error);
        shutdownData();
    }

    
    // //run migrations
    // try {
    //     execSync("npx prisma migrate dev --name init --preview-feature");
    // } catch (error) {
    //     logger.info(error);
    //     shutdownData();
    // }

    

    //test connection
    try {
        await prisma.$queryRaw`SELECT 1+1 AS result`;
    } catch (error) {
        logger.info(error);
        shutdownData();
    }

    logger.info("Connection to database established");

    return prisma;
}

//get prisma instance
function getData() {
    if (!prisma) throw new Error("Please initialize instance before using it.");
    return prisma;
}

//ShutdownData
async function shutdownData() {
    const logger = getLogger();
    logger.info("disconnecting from database");

    try {
        await prisma.$disconnect();
    } catch (error) {
        logger.info(error);
        await prisma.$disconnect();
        process.exit(1);
    }

    logger.info("Database disconnected");
}

module.exports = {
    initializeData,
    getData,
    shutdownData,
};

