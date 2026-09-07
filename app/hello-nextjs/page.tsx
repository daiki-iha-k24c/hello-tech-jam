export default function HelloNextjs() {
  const message: string = "Hello, Next.js!";  // わざと型エラーを起こす
 
  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}