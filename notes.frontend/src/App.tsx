import React, { useState } from "react";
import "./App.css";
import InputField from "./components/InputField";
import NotesBoard from "./components/NotesBoard/NotesBoard";
import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { urlGetAll } from "./endpoints";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  // useEffect(() => {
  //   axios.get(urlGetAll).then((response: AxiosResponse<any>) => {
  //     console.log(response.data);
  //   });
  // }, [setDetails, setTodo]);
  return (
    <div className="App">
      <span className="heading">TODO</span>
      <InputField
        todo={todo}
        details={details}
        setTodo={setTodo}
        setDetails={setDetails}
      />

      <NotesBoard />

    </div>
  );
};

export default App;
