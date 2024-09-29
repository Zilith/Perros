import axios from "axios";

const MedicinesTable = ({ medicines, fetchMedicines }) => {
  const handleAdd = () => {
    console.log("add");
    const name = prompt("Enter the name of the medicine");

    if (!name || typeof name !== "string" || name.trim() === "") {
      alert("Please enter a valid medicine name");
      return;
    }

    const dosage = prompt("Enter the dosage of the medicine");

    if (!dosage || typeof name !== "string" || dosage.trim() === "") {
      alert("Please enter a valid dosage");
      return;
    }

    const description = prompt("Enter the description of the medicine");

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      alert("Please enter a valid description");
      return;
    }

    axios
      .post("http://localhost:3001/medicines", {
        name,
        dosage,
        description,
      })
      .then(() => {
        fetchMedicines();
      });
  };

  const handleEdit = (id) => {
    const name = prompt("Enter the new name of the medicine");
    const dosage = prompt("Enter the new dosage of the medicine");
    const description = prompt("Enter the new description of the medicine");

    // Validaciones
    if (!name || typeof name !== "string" || name.trim() === "") {
      alert("Please enter a valid medicine name");
      return;
    }

    // Verificar que la dosis no esté vacía y sea un número positivo
    if (!dosage || isNaN(dosage) || dosage <= 0 || dosage.trim() === "") {
      alert("Please enter a valid dosage");
      return;
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      alert("Please enter a valid description");
      return;
    }

    axios
      .put("http://localhost:3001/medicines/" + id, {
        name,
        dosage,
        description,
      })
      .then(() => {
        fetchMedicines();
      });
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:3001/medicines/" + id).then(() => {
      fetchMedicines();
    });
  };

  return (
    <>
      <h1>Medicines Information</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{medicine.id}</td>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.description}</td>
                <td>
                  <button onClick={() => handleEdit(medicine.id)}>Edit</button>
                </td>
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
      <button onClick={handleAdd}>Add Medicine</button>
    </>
  );
};

export default MedicinesTable;
