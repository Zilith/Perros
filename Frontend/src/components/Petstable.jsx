import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// Queries and mutations
const GET_PETS = gql`
  query {
    pets {
      id
      name
      breed
      age
      weight
      owner {
        name
        surname
      }
    }
  }
`;

const ADD_PET = gql`
  mutation createPet(
    $name: String!
    $breed: String!
    $age: Int!
    $weight: Int!
    $ownerDoc: String!
  ) {
    createPet(
      name: $name
      breed: $breed
      age: $age
      weight: $weight
      ownerDoc: $ownerDoc
    ) {
      id
      name
      breed
      age
      weight
      owner {
        name
        surname
      }
    }
  }
`;
const EDIT_PET = gql`
  mutation editPet(
    $id: ID!
    $name: String!
    $breed: String!
    $age: Int!
    $weight: Int!
    $ownerDoc: String!
  ) {
    editPet(
      id: $id
      name: $name
      breed: $breed
      age: $age
      weight: $weight
      ownerDoc: $ownerDoc
    ) {
      id
      name
      breed
      age
      weight
      owner {
        name
        surname
      }
    }
  }
`;
const DELETE_PET = gql`
  mutation deletePet($id: ID!) {
    deletePet(id: $id) {
      id
    }
  }
`;

const PetsTable = ({ clients }) => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  // UseQuery fot fetching pets
  const { loading, error, data, refetch } = useQuery(GET_PETS);
  console.log(loading, error, data);


  // UseMutation
  const [addPet] = useMutation(ADD_PET, {
    onCompleted: () => refetch(),
  });

  const [editPet] = useMutation(EDIT_PET, {
    onCompleted: () => refetch(),
  });

  const [deletePet] = useMutation(DELETE_PET, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    console.log(loading, error, data);
    if (data && data.pets) {
      setPets(data.pets);
    }
  }, [data]);

  const handleSeeMedicines = (petId, petName) => {
    const encodedPetName = encodeURIComponent(petName);
    navigate(`/medicines/${petId}/${encodedPetName}`);
  };

  const handleAdd = async () => {
    const name = prompt("Enter the name of the pet");
    const breed = prompt("Enter the breed of the pet");
    const age = prompt("Enter the age of the pet");
    const weight = prompt("Enter the weight of the pet");
    const owner = prompt("Enter the owner of the pet");

    const ownerExists = clients.find((client) => client.document === owner);
    if (!ownerExists) {
      alert("Owner does not exist");
      return;
    }

    try {
      await addPet({
        variables: {
          name,
          breed,
          age: parseInt(age),
          weight: parseInt(weight),
          ownerDoc: owner,
        },
      });
    } catch (error) {
      console.error("Errir adding pet", error);
    }
  };

  const handleEdit = async (id) => {
    const name = prompt("Enter the new name of the pet");
    const breed = prompt("Enter the new breed of the pet");
    const age = parseInt(prompt("Enter the new age of the pet"));
    const weight = parseInt(prompt("Enter the new weight of the pet"));
    const owner = prompt("Enter the new owner of the pet");

    const ownerExists = clients.find((client) => client.document === owner);
    if (!ownerExists) {
      alert("Owner does not exist");
      return;
    }

    try {
      await editPet({
        variables: {
          id,
          name,
          breed,
          age,
          weight,
          ownerDoc: owner,
        },
      });
    } catch (error) {
      console.error("Error editing pet", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePet({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting pet", error);
    }
  };


  console.log(loading, error, data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :c</p>;

  return (
    <>
      <h1>Pets Information</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Weight (Kg)</th>
              <th>Owner</th>
              <th>Medicines</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => {
              return (
                <tr key={pet.id}>
                  <td>{pet.name}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.age}</td>
                  <td>{pet.weight}</td>
                  <td>
                    {pet.owner
                      ? pet.owner.name + " " + pet.owner.surname
                      : "No owner found"}
                  </td>
                  <td>
                    <a onClick={() => handleSeeMedicines(pet.id, pet.name)}>
                      See medicines
                    </a>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(pet.id)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(pet.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={handleAdd}>Add Pet</button>
    </>
  );
};

export default PetsTable;
