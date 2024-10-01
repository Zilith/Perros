const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Para generar IDs únicos

// schema definition
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
  }
`;

// resolvers
const resolvers = {
  Query: {
    pets: async () => {
      const response = await axios.get("http://localhost:3001/pets");
      return response.data; // Asegúrate de devolver solo los datos
    },
    pet: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3001/pets/${id}`);
      return response.data; // Solo los datos
    },
    clients: async () => {
      const response = await axios.get("http://localhost:3001/clients");
      return response.data; // Solo los datos
    },
    client: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3001/clients/${id}`);
      return response.data; // Solo los datos
    },
    medicines: async () => {
      const response = await axios.get("http://localhost:3001/medicines");
      return response.data; // Solo los datos
    },
    medicine: async (_, { id }) => {
      const response = await axios.get(`http://localhost:3001/medicines/${id}`);
      return response.data; // Solo los datos
    },
  },

  Mutation: {
    createPet: async (_, { name, breed, age, weight, ownerDoc }) => {
      console.log("noew pet", name, breed, age, weight, ownerDoc);
      // Busca al dueño por su documento
      const ownerResponse = await axios.get(
        `http://localhost:3001/clients?document=${ownerDoc}`
      );

      // Obtiene los datos del cliente (el dueño)
      const owner = ownerResponse.data[0]; // Verifica que no sea undefined

      if (!owner) {
        throw new Error("Owner not found");
      }

      // Crea un nuevo objeto para la mascota
      const newPet = {
        id: uuidv4(), // Usa una ID única temporal
        name,
        breed,
        age,
        weight,
        owner: {
          document: owner.document, // Solo pasa las propiedades necesarias
          name: owner.name,
          surname: owner.surname,
        },
        medicines: [],
      };

      // Guarda la nueva mascota en el servidor de JSON Server
      const petResponse = await axios.post(
        "http://localhost:3001/pets",
        newPet
      );

      // Retorna los datos sin metadatos de la respuesta
      return petResponse.data; // Solo accede a `data`
    },

    editPet: async (_, { id, name, breed, age, weight, ownerDoc }) => {
      // Busca al dueño por su documento
      const ownerResponse = await axios.get(
        `http://localhost:3001/clients?document=${ownerDoc}`
      );

      // Obtiene los datos del cliente (el dueño)
      const owner = ownerResponse.data[0]; // Verifica que no sea undefined

      if (!owner) {
        throw new Error("Owner not found");
      }

      // Crea un nuevo objeto para la mascota
      const editedPet = {
        name,
        breed,
        age,
        weight,
        owner: {
          document: owner.document, // Solo pasa las propiedades necesarias
          name: owner.name,
          surname: owner.surname,
        },
      };

      // Guarda la nueva mascota en el servidor de JSON Server
      const petResponse = await axios.put(
        `http://localhost:3001/pets/${id}`,
        editedPet
      );

      // Retorna los datos sin metadatos de la respuesta
      return petResponse.data; // Solo accede a `data`
    },

    deletePet: async (_, { id }) => {
        // Elimina la mascota del servidor de JSON Server
        const petResponse = await axios.delete(`http://localhost:3001/pets/${id}`);
    
        // Retorna los datos sin metadatos de la respuesta
        return petResponse.data; // Solo accede a `data`
        },

        createClient: async (_, { name, surname, address, phone, document }) => {
          try {
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
          } catch (error) {
            throw new Error("Failed to create client");
          }
        },
      
        editClient: async (_, { id, name, surname, address, phone, document }) => {
          try {
            const editedClient = {
              name,
              surname,
              address,
              phone,
              document,
            };
            const clientResponse = await axios.put(
              `http://localhost:3001/clients/${id}`,
              editedClient
            );
            return clientResponse.data;
          } catch (error) {
            throw new Error("Failed to edit client");
          }
        },
      
        deleteClient: async (_, { id }) => {
          try {
            const clientResponse = await axios.delete(
              `http://localhost:3001/clients/${id}`
            );
            return clientResponse.data;
          } catch (error) {
            throw new Error("Failed to delete client");
          }
        },
      
        createMedicine: async (_, { name, dosage, description }) => {
          try {
            const newMedicine = {
              id: uuidv4(),
              name,
              dosage,
              description,
            };
            await axios.post("http://localhost:3001/medicines", newMedicine);
            return newMedicine;
          } catch (error) {
            throw new Error("Failed to create medicine");
          }
        },
      
        editMedicine: async (_, { id, name, dosage, description }) => {
          try {
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
          } catch (error) {
            throw new Error("Failed to edit medicine");
          }
        },
      
        deleteMedicine: async (_, { id }) => {
          try {
            const medicineResponse = await axios.delete(
              `http://localhost:3001/medicines/${id}`
            );
            return medicineResponse.data;
          } catch (error) {
            throw new Error("Failed to delete medicine");
          }
        },
      },
};

// Create Apollo Server
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
