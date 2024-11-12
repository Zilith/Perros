import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// Queries y Mutations
const GET_MEDICINES = gql`
  query {
    medicines {
      id
      name
      dosage
      description
    }
  }
`;

const ADD_MEDICINE = gql`
  mutation createMedicine($name: String!, $dosage: String!, $description: String!) {
    createMedicine(name: $name, dosage: $dosage, description: $description) {
      id
      name
      dosage
      description
    }
  }
`;

const EDIT_MEDICINE = gql`
  mutation editMedicine($id: ID!, $name: String!, $dosage: String!, $description: String!) {
    editMedicine(id: $id, name: $name, dosage: $dosage, description: $description) {
      id
      name
      dosage
      description
    }
  }
`;

const DELETE_MEDICINE = gql`
  mutation deleteMedicine($id: ID!) {
    deleteMedicine(id: $id) {
      id
    }
  }
`;

const MedicinesTable = () => {
  const [medicines, setMedicines] = useState([]);

  // UseQuery para obtener los medicamentos
  const { loading, error, data, refetch } = useQuery(GET_MEDICINES);

  // UseMutations para las operaciones de medicamentos
  const [addMedicine] = useMutation(ADD_MEDICINE, {
    onCompleted: () => refetch(),
  });

  const [editMedicine] = useMutation(EDIT_MEDICINE, {
    onCompleted: () => refetch(),
  });

  const [deleteMedicine] = useMutation(DELETE_MEDICINE, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    if (data && data.medicines) {
      setMedicines(data.medicines);
    }
  }, [data]);

  const handleAdd = async () => {
    const name = prompt("Enter the name of the medicine");
    const dosage = prompt("Enter the dosage of the medicine");
    const description = prompt("Enter the description of the medicine");

    if (!name || !dosage || !description) {
      alert("All fields are required");
      return;
    }

    try {
      await addMedicine({
        variables: { name, dosage, description },
      });
    } catch (error) {
      console.error("Error adding medicine", error);
    }
  };

  const handleEdit = async (id) => {
    const name = prompt("Enter the new name of the medicine");
    const dosage = prompt("Enter the new dosage of the medicine");
    const description = prompt("Enter the new description of the medicine");

    if (!name || !dosage || !description) {
      alert("All fields are required");
      return;
    }

    try {
      await editMedicine({
        variables: { id, name, dosage, description },
      });
    } catch (error) {
      console.error("Error editing medicine", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedicine({
        variables: { id },
      });
    } catch (error) {
      console.error("Error deleting medicine", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :c</p>;

  return (
    <>
      <h1>Medicines Information</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Description</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>                
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.description}</td>
                <td>
                  <button onClick={() => handleEdit(medicine.id)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(medicine.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleAdd}>Add Medicine</button>
    </>
  );
};

export default MedicinesTable;
