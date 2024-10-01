import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// Queries and mutations
const GET_CLIENTS = gql`
  query {
    clients {
      id
      document
      name
      surname
      address
      phone
    }
  }
`;

const ADD_CLIENT = gql`
  mutation createClient(
    $document: String!
    $name: String!
    $surname: String!
    $address: String!
    $phone: String!
  ) {
    createClient(
      document: $document
      name: $name
      surname: $surname
      address: $address
      phone: $phone
    ) {
      id
      document
      name
      surname
      address
      phone
    }
  }
`;

const EDIT_CLIENT = gql`
  mutation editClient(
    $id: ID!
    $document: String!
    $name: String!
    $surname: String!
    $address: String!
    $phone: String!
  ) {
    editClient(
      id: $id
      document: $document
      name: $name
      surname: $surname
      address: $address
      phone: $phone
    ) {
      id
      document
      name
      surname
      address
      phone
    }
  }
`;

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
    }
  }
`;

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  
  // UseQuery to fetch clients
  const { loading, error, data, refetch } = useQuery(GET_CLIENTS);

  // UseMutation for client operations
  const [addClient] = useMutation(ADD_CLIENT, {
    onCompleted: () => refetch(),
  });

  const [editClient] = useMutation(EDIT_CLIENT, {
    onCompleted: () => refetch(),
  });

  const [deleteClient] = useMutation(DELETE_CLIENT, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    if (data && data.clients) {
      setClients(data.clients);
    }
  }, [data]);

  const handleAdd = async () => {
    const document = prompt("Enter the document of the client");
    const name = prompt("Enter the name of the client");
    const surname = prompt("Enter the surname of the client");
    const address = prompt("Enter the address of the client");
    const phone = prompt("Enter the phone number of the client");

    if (!document || !name || !surname || !address || !phone) {
      alert("All fields are required");
      return;
    }

    try {
      await addClient({
        variables: { document, name, surname, address, phone },
      });
    } catch (error) {
      console.error("Error adding client", error);
    }
  };

  const handleEdit = async (id) => {
    const document = prompt("Enter the new document of the client");
    const name = prompt("Enter the new name of the client");
    const surname = prompt("Enter the new surname of the client");
    const address = prompt("Enter the new address of the client");
    const phone = prompt("Enter the new phone number of the client");

    if (!document || !name || !surname || !address || !phone) {
      alert("All fields are required");
      return;
    }

    try {
      await editClient({
        variables: { id, document, name, surname, address, phone },
      });
    } catch (error) {
      console.error("Error editing client", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient({
        variables: { id },
      });
    } catch (error) {
      console.error("Error deleting client", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :c</p>;

  return (
    <>
      <h1>Clients Information</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Address</th>
              <th>Phone</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.document}</td>
                <td>{client.name}</td>
                <td>{client.surname}</td>
                <td>{client.address}</td>
                <td>{client.phone}</td>
                <td>
                  <button onClick={() => handleEdit(client.id)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(client.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleAdd}>Add Client</button>
    </>
  );
};

export default ClientsTable;
