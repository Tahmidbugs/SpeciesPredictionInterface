import React, { useState, useEffect } from "react";
import { app } from "./firebase";
import { ref, get } from "firebase/database";
import { getDatabase } from "firebase/database";

import "./style.css";

const App = () => {
  const [species, setSpecies] = useState(""); // State for selected species
  const [trap, settrap] = useState("trap005"); // State for selected species

  const [mosquitoes, setMosquitoes] = useState([]); // State for mosquito images
  console.log("mosquitoes", mosquitoes);

  useEffect(() => {
    const database = getDatabase(app);

    // Fetch data from firebase realtime
    const fetchData = async () => {
      const dbRef = ref(database, "/trap_images");
      console.log("dbRef", dbRef);
      const snapshot = await get(dbRef);
      const data = snapshot.val();

      const mosquitoesArray = Object.values(data);

      // Sort mosquitoes by created date time
      mosquitoesArray.sort((a, b) => {
        const dateA = new Date(a.created_date_time);
        const dateB = new Date(b.created_date_time);
        return dateB - dateA;
      });

      // Filter mosquitoes by species and trap
      if (species) {
        const filteredMosquitoes = mosquitoesArray.filter(
          (mosquito) =>
            mosquito.predicted_class === species && mosquito.trap_id === trap
        );
        setMosquitoes(filteredMosquitoes);
      } else {
        // Filter mosquitoes by trap
        const filteredMosquitoes = mosquitoesArray.filter(
          (mosquito) => mosquito.trap_id === trap
        );
        setMosquitoes(filteredMosquitoes);
      }
    };

    fetchData();
  }, [species, trap]);

  return (
    <div className="pageContainer">
      <h1 style={{ textAlign: "center" }}>Who is in your trap?</h1>

      <div>
        <label htmlFor="trap-select">Select a trap:</label>
        <select
          id="trap-select"
          value={trap}
          onChange={(e) => {
            settrap(e.target.value);
          }}
        >
          <option value="trap001">trap001</option>
          <option value="trap002">trap002</option>
          <option value="trap003">trap003</option>
          <option value="trap004">trap004</option>
          <option value="trap005">trap005</option>
          <option value="trap006">trap006</option>
        </select>
      </div>

      <div>
        <label htmlFor="species-select">Select a species:</label>
        <select
          id="species-select"
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value);
          }}
        >
          <option value="">All Species</option>
          <option value="Not Anopheles stephensi">
            Not Anopheles stephensi
          </option>
          <option value="Anopheles stephensi">Anopheles stephensi</option>
          <option value="Culex">Culex</option>
        </select>
      </div>
      <div>
        <table className="mosquito-table">
          <thead>
            <tr>
              <th>Species</th>
              <th>Probability</th>
              <th>Created Date Time</th>
              <th>Original Image</th>
              <th>Processed Image</th>
            </tr>
          </thead>
          <tbody>
            {mosquitoes.length === 0 && (
              <tr>
                <td colSpan="5">No mosquitoes found</td>
              </tr>
            )}

            {mosquitoes.map((mosquito, index) => (
              <tr key={index}>
                <td>{mosquito.predicted_class}</td>
                <td>{mosquito.predicted_probability}</td>
                <td>{new Date(mosquito.created_date_time).toLocaleString()}</td>
                <td>
                  <img
                    src={mosquito.original_image_url}
                    style={{ height: 100, width: 150, borderRadius: "10px" }}
                    alt={mosquito.original_image_url}
                  />
                </td>
                <td>
                  <img
                    src={mosquito.cam_image_url}
                    style={{ height: 100, width: 150, borderRadius: "10px" }}
                    alt={mosquito.cam_image_url}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
