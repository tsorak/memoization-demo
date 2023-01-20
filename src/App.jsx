import { createContext, useMemo, useState, useContext, memo, useEffect } from "react";
import "./App.css";

const MyContext = createContext();

function App() {
  const [count, setCount] = useState(3);
  const [textInput, setTextInput] = useState("");

  const [rerenderCount, setRerenderCount] = useState(0);
  //bad practise, dont use useEffect for updating state
  useEffect(() => {
    setRerenderCount((prev) => prev + 1);
  }, [count, textInput]);
  useEffect(() => {
    setRerenderCount(1);
  }, []);

  return (
    <div className="App">
      <h1>Memoization Demo</h1>
      <div>
        <button
          onClick={() => {
            console.log("Inc");
            setCount((prev) => prev + 1);
          }}>
          inc
        </button>
        <button
          onClick={() => {
            console.log("Dec");
            setCount((prev) => prev - 1);
          }}>
          dec
        </button>
      </div>
      <div>
        <input type="text" placeholder="Typing here rerenders parent" value={textInput} onInput={(e) => setTextInput(e.target.value)} style={{ width: "200px" }} />
      </div>

      <MyContext.Provider value={{ count }}>
        <NumberViewerContext />
      </MyContext.Provider>
      <NumberViewerProps count={count} />
      <NumberViewerMemo count={count} />

      <h3>App component rerender count: {rerenderCount}</h3>
    </div>
  );
}

function NumberViewerContext() {
  const importedContext = useContext(MyContext);

  const memod = useMemo(() => {
    const color = `hsl(${Math.round(Math.random() * 360)},100%,35%)`;
    return { count: importedContext.count, color };
  }, [importedContext.count]);

  return <p style={{ color: memod.color }}>(Context) count: {memod.count}</p>;
}

function NumberViewerProps({ count }) {
  const memod = useMemo(() => {
    const color = `hsl(${Math.round(Math.random() * 360)},100%,35%)`;
    return { count, color };
  }, [count]);

  useEffect(() => {
    console.log("New updated value!");
  }, [memod]);

  return <p style={{ color: memod.color }}>(Props) count: {memod.count}</p>;
}

const NumberViewerMemo = memo(function NumberViewerMemo({ count }) {
  return <p style={{ color: `hsl(${Math.round(Math.random() * 360)},100%,35%)` }}>(Memo) count: {count}</p>;
});

export default App;
