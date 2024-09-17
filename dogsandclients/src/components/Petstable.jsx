import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PetsTable = ({ clients }) => {
  const [pets, setPets] = useState([]);
  const [ownerExists, setOwnerExists] = useState(false);
  const navigate = useNavigate();

  const fetchPets = () => {
    axios.get("http://localhost:3001/pets").then((response) => {
      setPets(response.data);
      console.log("pets", response.data);
    });
  };

  const handleSeeMedicines = (petId) => {
    navigate(`/medicines/${petId}`);
  };

  const handleAdd = () => {
    console.log("add");
    const name = prompt("Enter the name of the pet");

    if (!name || typeof name !== "string" || name.trim() === "") {
      alert("Please enter a valid pet name");
      return;
    }

    const breed = prompt("Enter the breed of the pet");

    if (!breed || typeof breed !== "string" || breed.trim() === "") {
      alert("Please enter a valid breed");
      return;
    }

    const age = prompt("Enter the age of the pet");

    if (!age || isNaN(age) || age <= 0 || age.trim() === "") {
      alert("Please enter a valid age");
      return;
    }

    const weight = prompt("Enter the weight of the pet");

    if (!weight || isNaN(weight) || weight <= 0 || weight.trim() === "") {
      alert("Please enter a valid weight");
      return;
    }

    const owner = prompt("Enter the owner of the pet");

    if (!owner || typeof owner !== "string" || owner.trim() === "") {
      alert("Please enter a valid owner name");
      return;
    }

    clients.map((client) => {
      if (client.document === owner) {
        setOwnerExists("true")
      }
    });

    if (!ownerExists) {
      alert("Owner does not exist");
      return;
    }

    axios
      .post("http://localhost:3001/pets", {
        name,
        breed,
        age,
        weight,
        owner,
      })
      .then(() => {
        fetchPets();
        setOwnerExists(false);
      });
  };

  const handleEdit = (id) => {
    const name = prompt("Enter the new name of the pet");

    if (!name || typeof name !== "string" || name.trim() === "") {
      alert("Please enter a valid pet name");
      return;
    }

    const breed = prompt("Enter the new breed of the pet");

    if (!breed || typeof breed !== "string" || breed.trim() === "") {
      alert("Please enter a valid breed");
      return;
    }

    const age = prompt("Enter the new age of the pet");

    if (!age || isNaN(age) || age <= 0 || age.trim() === "") {
      alert("Please enter a valid age");
      return;
    }

    const weight = prompt("Enter the new weight of the pet");

    if (!weight || isNaN(weight) || weight <= 0 || weight.trim() === "") {
      alert("Please enter a valid weight");
      return;
    }

    const owner = prompt("Enter the new owner of the pet");

    if (!owner || typeof owner !== "string" || owner.trim() === "") {
      alert("Please enter a valid owner name");
      return;
    }

    clients.map((client) => {
      if (client.document === owner) {
        setOwnerExists("true")
      }
    });

    if (!ownerExists) {
      alert("Owner does not exist");
      return;
    }

    axios
      .put("http://localhost:3001/pets/" + id, {
        name,
        breed,
        age,
        weight,
        owner,
      })
      .then(() => {
        fetchPets();
        setOwnerExists(false);
      });
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:3001/pets/" + id).then(() => {
      fetchPets();
    });
  };

  useEffect(fetchPets, []);

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
              <th>Weight</th>
              <th>Owner</th>
              <th>Medicines</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => {
              const client = clients.find((client) => client.id === pet.owner);
              return (
                <tr key={pet.id}>
                  <td>{pet.name}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.age}</td>
                  <td>{pet.weight}</td>
                  <td>
                    {client
                      ? client.name + " " + client.surname
                      : "No owner found"}
                  </td>
                  <td>
                    <a onClick={() => handleSeeMedicines(pet.id)}>See medicines</a>
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
