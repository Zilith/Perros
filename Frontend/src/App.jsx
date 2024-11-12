import { useState, useEffect } from "react";
import axios from "axios";
import "./Style.css";
import PetsTable from "./components/Petstable";
import ClientsTable from "./components/Clientstable";
import MedicinesTable from "./components/MedicinesTable";


function App() {
  const [clients, setClients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedPets, setSelectedPets] = useState(true);
  const [selectedClients, setSelectedClients] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState(false);
  const baseDevClients = import.meta.env.VITE_DEV_BASE_URL_CLIENTS;
  const baseDevMedicines = import.meta.env.VITE_DEV_BASE_URL_MEDICINES;
  const baseProdClients = import.meta.env.VITE_PROD_BASE_URL_CLIENTS;
  const baseProdMedicines = import.meta.env.VITE_PROD_BASE_URL_MEDICINES;
  const baseClients = import.meta.env.VITE_ENV === "development" ? baseDevClients : baseProdClients;
  const baseMedicines = import.meta.env.VITE_ENV === "development" ? baseDevMedicines : baseProdMedicines;


  const fetchClients = () => {
    axios.get(baseClients).then((response) => {
      setClients(response.data);
      //console.log("clients", response.data);
    });
  };

  const fetchMedicines = () => {
    axios.get(baseMedicines).then((response) => {
      setMedicines(response.data);
      //console.log("medicines", response.data);
    });
  };

  useEffect(fetchClients, []);
  useEffect(fetchMedicines, []);

  const selectPets = () => {
    setSelectedPets(true);
    setSelectedClients(false);
    setSelectedMedicines(false);
  };

  const selectClients = () => {
    setSelectedPets(false);
    setSelectedClients(true);
    setSelectedMedicines(false);
  };

  const selectMedicines = () => {
    setSelectedPets(false);
    setSelectedClients(false);
    setSelectedMedicines(true);
  };

  return (
    <>
      <div className="container">
        {selectedPets && <PetsTable clients={clients} />}
        {selectedClients && <ClientsTable clients={clients} fetchClients={fetchClients}/>}
        {selectedMedicines && <MedicinesTable medicines={medicines} fetchMedicines={fetchMedicines} /> }
        {!selectedPets && <button onClick={selectPets}> See all pets</button>}
        {!selectedClients && (
          <button onClick={selectClients}>See all clients</button>
        )}
        {!selectedMedicines && (
          <button onClick={selectMedicines}>See all medicines</button>
        )}
      </div>
    </>
  );
}

export default App;
