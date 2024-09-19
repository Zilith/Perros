import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const PetMedicines = () => {
  const { petId } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:3001/medicines");
      console.log("load all medicines", response.data);
      setAllMedicines(response.data);
    } catch (error) {
      console.error("Error fetching all medicines:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const petResponse = await axios.get(`http://localhost:3001/pets/${petId}`);
      if (petResponse.data.medicines && petResponse.data.medicines.length > 0) {
        const medicineIds = petResponse.data.medicines;
        const medicinePromises = medicineIds.map((medicineId) =>
          axios.get(`http://localhost:3001/medicines/${medicineId}`)
        );
        const medicineResponses = await Promise.all(medicinePromises);
        setMedicines(medicineResponses.map((response) => response.data));
      } else {
        setMedicines([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMedicines();
    fetchMedicines();
  }, [petId]);

  const handleAdd = () => {
    console.log("add");
    const id = prompt("Enter the id of the medicine");

    if (!id || isNaN(id) || typeof id !== "string" || id.trim() === "") {
      alert("Please enter a valid id");
      return;
    }

    const medicineExists = allMedicines.find((medicine) => medicine.id === id);
    if (!medicineExists) {
      alert("The medicine does not exist");
      return;
    }

    const medicineExistsInPet = medicines.find((medicine) => medicine.id === id);
    if (medicineExistsInPet) {
      alert("The medicine is already added");
      return;
    }

    const updatedMedicines = [...medicines, medicineExists];

    axios
      .patch(`http://localhost:3001/pets/${petId}`, {
        medicines: updatedMedicines.map((med) => med.id),
      })
      .then(() => {
        setMedicines(updatedMedicines);
      })
      .catch((error) => console.error("Error adding medicine:", error));
  };

  const handleDelete = (id) => {
    console.log("delete");
    const updatedMedicines = medicines.filter((medicine) => medicine.id !== id);

    axios
      .patch(`http://localhost:3001/pets/${petId}`, {
        medicines: updatedMedicines.map((med) => med.id),
      })
      .then(() => {
        setMedicines(updatedMedicines);
      })
      .catch((error) => console.error("Error deleting medicine:", error));
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  
  console.log("medicines screen", medicines);
  return (
    <div className="container">
      <h1>Medicines for Pet {petId}</h1>
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
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.description}</td>
                <td>
                  <button onClick={() => handleDelete(medicine.id)}>
                    Delete
                  </button>
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
