// App.jsx
import React from "react";

const ProductCard = ({ name, price, inStock }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "12px",
        width: "220px",
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{name}</h2>
      <p style={{ fontSize: "16px", color: "#555" }}>Price: ${price}</p>
      <p
        style={{
          color: inStock ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {inStock ? "In Stock" : "Out of Stock"}
      </p>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>ProductCard Component Using Props</h1>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        <ProductCard name="Laptop" price={750} inStock={true} />
        <ProductCard name="Smartphone" price={500} inStock={false} />
        <ProductCard name="Headphones" price={120} inStock={true} />
        <ProductCard name="Keyboard" price={80} inStock={true} />
      </div>
    </div>
  );
};

export default App;
