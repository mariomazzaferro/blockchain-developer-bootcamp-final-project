import React, { useState } from 'react';

const SeedPlot = ({seedPlot}) => {
  const [plot, setPlot] = useState(undefined);

  const submit = async (e) => {
    e.preventDefault();
    await seedPlot(plot);
  }

  const updatePlot = (e) => {
    const plot = e.target.value;
    setPlot(plot);
  }

  return (
    <div>
      <h2>Seed a new Plot:</h2>
      <form onSubmit={(e) => submit(e)}>
        <label htmlFor="plot">Plot</label>
        <textarea
          id="plot" name="plot" rows="5" cols="50"
          onChange={e => updatePlot(e)}
        ></textarea>
        <button>Submit Plot</button>
      </form>
    </div>
  )
};

export default SeedPlot;