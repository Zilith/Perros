import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [dogs, setDogs] = useState([]);

  const fetchDogs = () => {
    axios.get("http://localhost:3000/dogs").then((response) => {
      setDogs(response.data);
      console.log(response.data);
    });
  };

  useEffect(fetchDogs, []);

  return (
    <>
      <h1>Dogs Information</h1>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>Breed</th>
            <th>age</th>
            <th>weight</th>
            <th>Breed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fido</td>
            <td>Golden Retriever</td>
            <td>3</td>
            <td>65</td>
            <td>Alice</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default App;
