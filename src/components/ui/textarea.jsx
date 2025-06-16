export function Textarea(props) {
  return (
    <textarea
      {...props}
      style={{
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "100%",
        minHeight: "100px",
        resize: "vertical"
      }}
    />
  );
}
