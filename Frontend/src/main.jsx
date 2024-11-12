import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PetMedicines from "./components/PetMedicines.jsx";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/medicines/:petId/:petName" element={<PetMedicines />} />
      </Routes>
    </Router>
    </ApolloProvider>
  </StrictMode>
);
