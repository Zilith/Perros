const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Para generar IDs únicos

// Schema Definition
const typeDefs = gql`
  type Pet {
    id: ID!
    name: String!
    breed: String!
    age: Int!
    weight: Int!
    owner: Client!
    medicines: [Medicine]
  }

  type Client {
    id: ID!
    name: String!
    surname: String!
    address: String!
    phone: String!
    document: String!
  }

  type Medicine {
    id: ID!
    name: String!
    dosage: String!
    description: String!
  }

  type Query {
    pets: [Pet]
    pet(id: ID!): Pet
    clients: [Client]
    client(id: ID!): Client
    medicines: [Medicine]
    medicine(id: ID!): Medicine
  }

  type Mutation {
    createPet(
      name: String!
      breed: String!
      age: Int!
      weight: Int!
      ownerDoc: String!
    ): Pet

    editPet(
      id: ID!
      name: String!
      breed: String!
      age: Int!
      weight: Int!
      ownerDoc: String!
      medicines: [ID] # Se añadió este parámetro para asociar medicamentos
    ): Pet

    deletePet(id: ID!): Pet

    # Mutations for Client
    createClient(
      name: String!
      surname: String!
      address: String!
      phone: String!
      document: String!
    ): Client

    editClient(
      id: ID!
      name: String
      surname: String
      address: String
      phone: String
    ): Client

    deleteClient(id: ID!): Client

    # Mutations for Medicine
    createMedicine(
      name: String!
      dosage: String!
      description: String!
    ): Medicine

    editMedicine(
      id: ID!
      name: String
      dosage: String
      description: String
    ): Medicine

    deleteMedicine(id: ID!): Medicine

    # Nueva mutación para actualizar medicamentos de una mascota
    updatePetMedicines(id: ID!, medicines: [ID!]!): Pet
  }
`;

// Resolvers
const resolvers = {
  Query: {
    pets: async () => {
      const response = await axios.get("http://localhost:3001/pets");
      return response.data;
    },
    pet: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3001/pets/${id}`);
      return response.data;
    },
    clients: async () => {
      const response = await axios.get("http://localhost:3001/clients");
      return response.data;
    },
    client: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3001/clients/${id}`);
      return response.data;
    },
    medicines: async () => {
      const response = await axios.get("http://localhost:3001/medicines");
      return response.data;
    },
    medicine: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3001/medicines/${id}`);
      return response.data;
    },
  },

  Mutation: {
    createPet: async (_, { name, breed, age, weight, ownerDoc }) => {
      const ownerResponse = await axios.get(
        `http://localhost:3001/clients?document=${ownerDoc}`
      );
      const owner = ownerResponse.data[0];

      if (!owner) {
        throw new Error("Owner not found");
      }

      const newPet = {
        id: uuidv4(),
        name,
        breed,
        age,
        weight,
        owner: {
          document: owner.document,
          name: owner.name,
          surname: owner.surname,
        },
        medicines: [],
      };

      const petResponse = await axios.post("http://localhost:3001/pets", newPet);
      return petResponse.data;
    },

    editPet: async (_, { id, name, breed, age, weight, ownerDoc, medicines }) => {
      const ownerResponse = await axios.get(
        `http://localhost:3001/clients?document=${ownerDoc}`
      );
      const owner = ownerResponse.data[0];

      if (!owner) {
        throw new Error("Owner not found");
      }

      const editedPet = {
        name,
        breed,
        age,
        weight,
        owner: {
          document: owner.document,
          name: owner.name,
          surname: owner.surname,
        },
        medicines: medicines || [], // Asignar lista de IDs de medicinas
      };

      const petResponse = await axios.put(
        `http://localhost:3001/pets/${id}`,
        editedPet
      );
      return petResponse.data;
    },

    deletePet: async (_, { id }) => {
      const petResponse = await axios.delete(`http://localhost:3001/pets/${id}`);
      return petResponse.data;
    },

    createClient: async (_, { name, surname, address, phone, document }) => {
      const newClient = {
        id: uuidv4(),
        name,
        surname,
        address,
        phone,
        document,
      };
      await axios.post("http://localhost:3001/clients", newClient);
      return newClient;
    },

    editClient: async (_, { id, name, surname, address, phone }) => {
      const editedClient = {
        name,
        surname,
        address,
        phone,
      };
      const clientResponse = await axios.put(
        `http://localhost:3001/clients/${id}`,
        editedClient
      );
      return clientResponse.data;
    },

    deleteClient: async (_, { id }) => {
      const clientResponse = await axios.delete(`http://localhost:3001/clients/${id}`);
      return clientResponse.data;
    },

    createMedicine: async (_, { name, dosage, description }) => {
      const newMedicine = {
        id: uuidv4(),
        name,
        dosage,
        description,
      };
      await axios.post("http://localhost:3001/medicines", newMedicine);
      return newMedicine;
    },

    editMedicine: async (_, { id, name, dosage, description }) => {
      const editedMedicine = {
        name,
        dosage,
        description,
      };
      const medicineResponse = await axios.put(
        `http://localhost:3001/medicines/${id}`,
        editedMedicine
      );
      return medicineResponse.data;
    },

    deleteMedicine: async (_, { id }) => {
      const medicineResponse = await axios.delete(`http://localhost:3001/medicines/${id}`);
      return medicineResponse.data;
    },

    updatePetMedicines: async (_, { id, medicines }) => {
      const petResponse = await axios.get(`http://localhost:3001/pets/${id}`);
      const pet = petResponse.data;

      const updatedPet = {
        ...pet,
        medicines, // Actualizar la lista de medicamentos con los IDs proporcionados
      };

      const response = await axios.put(`http://localhost:3001/pets/${id}`, updatedPet);
      return response.data;
    },
  },

  // Resolver adicional para obtener las medicinas completas desde los IDs en la mascota
  Pet: {
    medicines: async (parent) => {
      const medicineIds = parent.medicines || [];

      const medicines = await Promise.all(
        medicineIds.map(async (id) => {
          const response = await axios.get(`http://localhost:3001/medicines/${id}`);
          return response.data;
        })
      );

      return medicines;
    },
  },
};

// Crear el servidor de Apollo
async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer();

