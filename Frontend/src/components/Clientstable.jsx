import axios from "axios";

const ClientsTable = ({ clients, fetchClients }) => {
  const handleAdd = () => {
    console.log("add");
    const document = prompt("Enter the document of the client");

    if (!document || typeof document !== "string" || document.trim() === "") {
      alert("Please enter a valid document");
      return;
    }

    const name = prompt("Enter the name of the client");

    if (!name || typeof name !== "string" || name.trim() === "") {
      alert("Please enter a valid name");
      return;
    }

    const surname = prompt("Enter the surname of the client");

    if (!surname || typeof surname !== "string" || surname.trim() === "") {
      alert("Please enter a valid surname");
      return;
    }

    const address = prompt("Enter the address of the client");

    if (!address || typeof address !== "string" || address.trim() === "") {
      alert("Please enter a valid address");
      return;
    }

    const phone = prompt("Enter the phone number of the client");

    if (!phone || isNaN(phone) || phone.trim() === "") {
      alert("Please enter a valid phone number");
      return;
    }

    axios
      .post("http://localhost:3001/clients", {
        document,
        name,
        surname,
        address,
        phone,
      })
      .then(() => {
        fetchClients();
      });
  };

  const handleEdit = (id) => {
    const document = prompt("Enter the new document of the client");

    if (!document || typeof document !== "string" || document.trim() === "") {
      alert("Please enter a valid document");
      return;
    }

    const name = prompt("Enter the new name of the client");

    if (!name || typeof name !== "string" || name.trim() === "") {
      alert("Please enter a valid name");
      return;
    }

    const surname = prompt("Enter the new surname of the client");

    if (!surname || typeof surname !== "string" || surname.trim() === "") {
      alert("Please enter a valid surname");
      return;
    }

    const address = prompt("Enter the new address of the client");

    if (!address || typeof address !== "string" || address.trim() === "") {
      alert("Please enter a valid address");
      return;
    }

    const phone = prompt("Enter the new phone number of the client");

    if (!phone || isNaN(phone) || phone.trim() === "") {
      alert("Please enter a valid phone number");
      return;
    }

    axios
      .put("http://localhost:3001/clients/" + id, {
        document,
        name,
        surname,
        address,
        phone,
      })
      .then(() => {
        fetchClients();
      });
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:3001/clients/" + id).then(() => {
      fetchClients();
    });
  };

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
                  <button onClick={() => handleDelete(client.id)}>
                    Delete
                  </button>
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
