const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../core/jwt");
const ServiceError = require("../core/ServiceError");

const prisma = new PrismaClient();

const getUserById = async (id) => {
  try {
    const userId = parseInt(id); 
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw ServiceError.notFound(`User with id ${id} not found`);
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to retrieve user by ID");
  }
};

const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });

    const token = generateJWT(user);

    return { user, token };
  } catch (error) {
    console.error("Error creating user:", error);
    throw ServiceError.internal("Failed to create user");
  }
};

const updateUserContactDetails = async (id, { firstName, lastName, email }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
      },
    });
    if (!updatedUser) {
      throw new Error("User not found or could not be updated");
    }
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

const updateUserPassword = async (id, userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        password: hashedPassword,
      },
    });
    if (!updatedUser) {
      throw new Error("User not found or could not be updated");
    }
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to retrieve user by email");
  }
};

const login = async (email, password) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw ServiceError.unauthorized("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw ServiceError.unauthorized("Invalid email or password");
    }

    const token = await generateJWT(user);
    return { user, token };
  } catch (error) {
    console.error("Error during login:", error);
    throw ServiceError.internal("Internal server error");
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUserPassword,
  getUserByEmail,
  login,
  updateUserContactDetails,
};
