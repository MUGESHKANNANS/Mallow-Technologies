import { useState } from 'react';
import reactLogo from './assets/react.svg'; 
import viteLogo from '/vite.svg';
import './App.css';


function Filter() {
  const [search, setSearch] = useState("");
  const value = [
    { name: "Banana" },
    { name: "Apple" },
    { name: "Orange" },
    { name: "Mango" },
    { name: "Pineapple" },
    { name: "Watermelon" },
  ];

  const filteredList = value.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className='container'>
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {filteredList.length > 0 ? (
          <ul>
            {filteredList.map((item, index) => (
              <li key={index} className='list'>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p className='notfound'>No data found for "{search}"</p> 
        )}
      </div>
    </>
  );
}
function App() { 
  return (
    <>
      <div>
        <Filter />
      </div>
    </>
  );
}

export default App;
