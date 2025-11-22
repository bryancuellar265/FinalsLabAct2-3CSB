import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, reorderCount: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  // This function generates generic product data
  const generateData = () => {
    setIsAnalyzing(true); // Show loading state


    // Simulate a small delay so it feels like a real "Calculation"
    setTimeout(() => {
      const tempProducts = [];
      let reorderNeededCount = 0;


      for (let i = 1; i <= 100; i++) {
        // Random Stats Generation
        const currentInventory = Math.floor(Math.random() * 100);
        const avgSalesPerWeek = Math.floor(Math.random() * 50) + 5;
        const leadTimeDays = Math.floor(Math.random() * 14) + 2;


        // --- CALCULATIONS ---
       
        // 1. Sales per day (Week / 7)
        const salesPerDay = avgSalesPerWeek / 7;


        // 2. Days of Supply (Inventory / Daily Sales)
        // How long until we run out?
        const daysOfSupply = (currentInventory / salesPerDay).toFixed(1);


        // 3. Safety Stock / Reorder Point
        // (Daily Sales * Lead Time) -> We need this much to survive the wait time
        const safetyStock = Math.ceil(salesPerDay * leadTimeDays);


        // 4. The Prediction Logic
        const shouldReorder = currentInventory <= safetyStock;
       
        if (shouldReorder) reorderNeededCount++;


        tempProducts.push({
          id: i,
          name: `ITEM ${i}`, // Generic Name
          inventory: currentInventory,
          avgSales: avgSalesPerWeek,
          leadTime: leadTimeDays,
          daysOfSupply: daysOfSupply,
          safetyStock: safetyStock,
          status: shouldReorder ? "Reorder" : "Hold"
        });
      }


      setProducts(tempProducts);
      setStats({ total: 100, reorderCount: reorderNeededCount });
      setIsAnalyzing(false); // Hide loading state
    }, 800); // 0.8 second delay for effect
  };


  // Run once when the app loads
  useEffect(() => {
    generateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="dashboard-container">
     
      {/* HEADER SECTION */}
      <header className="top-bar">
        <div>
          <h1>Inventory Forecast System</h1>
          <p className="subtitle">General Stock Analytics Dashboard</p>
        </div>
        <button
          className="analyze-btn"
          onClick={generateData}
          disabled={isAnalyzing}
          style={{ opacity: isAnalyzing ? 0.7 : 1, cursor: isAnalyzing ? 'wait' : 'pointer' }}
        >
          {isAnalyzing ? "Running Analysis..." : "Run Forecast Analysis"}
        </button>
      </header>


      {/* CARDS SECTION */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>Total SKU Count</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Immediate Reorder Needed</h3>
          <div className="stat-value reorder-text">{stats.reorderCount}</div>
        </div>
        <div className="stat-card">
          <h3>System Status</h3>
          <div className="stat-value status-text">
            {isAnalyzing ? "Calculating..." : "Analysis Complete"}
          </div>
        </div>
      </div>


      {/* TABLE SECTION */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>PRODUCT NAME</th>
              <th>INVENTORY (UNITS)</th>
              <th>AVG SALES/WK</th>
              <th>LEAD TIME</th>
              <th>DAYS OF SUPPLY</th>
              <th>SAFETY STOCK</th>
              <th>PREDICTION</th>
            </tr>
          </thead>
          <tbody style={{ opacity: isAnalyzing ? 0.5 : 1, transition: 'opacity 0.3s' }}>
            {products.map((item) => (
              <tr key={item.id} className={item.status === "Reorder" ? "row-warning" : ""}>
                <td className="product-name" style={{ fontWeight: 'bold', color: '#555' }}>
                  {item.name}
                </td>
               
                <td className={item.inventory < 10 ? "low-stock" : "stock-ok"}>
                  {item.inventory} units
                </td>
               
                <td>{item.avgSales} / wk</td>
                <td>{item.leadTime} days</td>
               
                <td>{item.daysOfSupply} days</td>
                <td>{item.safetyStock} units</td>
               
                <td>
                  <span className={`badge ${item.status === "Reorder" ? "badge-reorder" : "badge-hold"}`}>
                    {item.status === "Reorder" ? "Reorder" : "Hold"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default App;
