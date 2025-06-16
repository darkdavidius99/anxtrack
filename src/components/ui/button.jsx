export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#f2f2f2",
        cursor: "pointer",
        fontSize: "16px",
        minHeight: "44px",
        width: "100%",
      }}
    >
      {children}
    </button>
  );
}
