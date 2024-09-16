import { useState, useEffect } from "react";
import axios from "axios";
import './Style.css';

function App() {
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const fetchPets = () => {
    axios.get("http://localhost:3001/dogs").then((response) => {
      setPets(response.data);
      console.log("pets", response.data);
    });
  };

  const fetchClients = () => {
    axios.get("http://localhost:3001/clients").then((response) => {
      setClients(response.data);
      console.log("clients", response.data);
    });
  };

  const fetchMedicines = () => {
    axios.get("http://localhost:3001/medicines").then((response) => {
      setMedicines(response.data);
      console.log("medicines", response.data);
    });
  };

  useEffect(fetchPets, []);
  useEffect(fetchClients, []);
  useEffect(fetchMedicines, []);

  const handleAdd = () => {
    const name = prompt("Enter the name of the pet");
    const breed = prompt("Enter the breed of the pet");
    const age = prompt("Enter the age of the pet");
    const weight = prompt("Enter the weight of the pet");
    const owner = prompt("Enter the owner of the pet");

    axios
      .post("http://localhost:3001/dogs", {
        name,
        breed,
        age,
        weight,
        owner,
      })
      .then(() => {
        fetchPets();
      });
  };

  const handleEdit = (id) => {
    const name = prompt("Enter the new name of the pet");
    const breed = prompt("Enter the new breed of the pet");
    const age = prompt("Enter the new age of the pet");
    const weight = prompt("Enter the new weight of the pet");
    const owner = prompt("Enter the new owner of the pet");

    axios
      .put("http://localhost:3001/dogs/" + id, {
        name,
        breed,
        age,
        weight,
        owner,
      })
      .then(() => {
        fetchPets();
      });
  }

  const handleDelete = (id) => {
    axios.delete("http://localhost:3001/dogs/" + id).then(() => {
      fetchPets();
    });
  }

  return (
    <>
      <div className="container">
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
                  <a href="">See medicines</a>
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
      <button onClick={() => handleAdd}>Add Pet</button>
      <button>See all clients</button>
      <button>See all medicines</button>
      </div>
    </>
  );
}

export default App;
