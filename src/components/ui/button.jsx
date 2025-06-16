export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 16px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
      {children}
    </button>
  );
}

