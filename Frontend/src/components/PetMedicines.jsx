import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// Definición de Queries y Mutations
const GET_ALL_MEDICINES = gql`
  query {
    medicines {
      id
      name
      dosage
      description
    }
  }
`;

const GET_PET_MEDICINES = gql`
  query getPet($id: ID!) {
    pet(id: $id) {
      id
      name
      medicines {
        id
        name
        dosage
        description
      }
    }
  }
`;

const UPDATE_PET_MEDICINES = gql`
  mutation updatePetMedicines($id: ID!, $medicines: [ID!]!) {
    updatePetMedicines(id: $id, medicines: $medicines) {
      id
      medicines {
        id
        name
        dosage
        description
      }
    }
  }
`;

const PetMedicines = () => {
  const { petId, petName } = useParams();
  const navigate = useNavigate();
  const [allMedicines, setAllMedicines] = useState([]);

  // Consultas para obtener todos los medicamentos y los medicamentos de la mascota
  const { loading: loadingAllMedicines, error: errorAllMedicines, data: allMedicinesData } = useQuery(GET_ALL_MEDICINES);
  const { loading: loadingPetMedicines, error: errorPetMedicines, data: petMedicinesData, refetch } = useQuery(GET_PET_MEDICINES, {
    variables: { id: petId },
  });

  // Mutación para actualizar los medicamentos de la mascota
  const [updatePetMedicines] = useMutation(UPDATE_PET_MEDICINES, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    if (allMedicinesData && allMedicinesData.medicines) {
      setAllMedicines(allMedicinesData.medicines);
    }
  }, [allMedicinesData]);

  const handleAdd = () => {
    const id = prompt("Enter the id of the medicine");

    // Validaciones
    if (!id || isNaN(id) || typeof id !== "string" || id.trim() === "") {
      alert("Please enter a valid id");
      return;
    }

    const medicineExists = allMedicines.find((medicine) => medicine.id === id);
    if (!medicineExists) {
      alert("The medicine does not exist");
      return;
    }

    const medicineExistsInPet = petMedicinesData.pet.medicines.find((medicine) => medicine.id === id);
    if (medicineExistsInPet) {
      alert("The medicine is already added");
      return;
    }

    const updatedMedicines = [...petMedicinesData.pet.medicines, { id }];

    updatePetMedicines({
      variables: { id: petId, medicines: updatedMedicines.map((med) => med.id) },
    });
  };

  const handleDelete = (id) => {
    const updatedMedicines = petMedicinesData.pet.medicines.filter((medicine) => medicine.id !== id);

    updatePetMedicines({
      variables: { id: petId, medicines: updatedMedicines.map((med) => med.id) },
    });
  };

  if (loadingAllMedicines || loadingPetMedicines) {
    return <p>Loading...</p>;
  }

  if (errorAllMedicines || errorPetMedicines) {
    return <p>Error loading medicines</p>;
  }

  return (
    <div className="container">
      <h1>Medicines for {decodeURIComponent(petName)}</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {petMedicinesData.pet.medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.description}</td>
                <td>
                  <button onClick={() => handleDelete(medicine.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate('/')}>Back</button>
      <button onClick={handleAdd}>Add Medicine</button>
    </div>
  );
};

export default PetMedicines;
