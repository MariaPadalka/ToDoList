import React from "react";
import "./styles.css";
import axios, { AxiosResponse } from "axios";
import { urlCreate } from "../endpoints";
import { message } from 'antd';


interface Props {
  todo: string;
  details: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  setDetails: React.Dispatch<React.SetStateAction<string>>;
}
const InputField: React.FC<Props> = ({
  todo,
  details,
  setTodo,
  setDetails,
}: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      title: todo,
      details: details,
    };
        setTodo("");
        setDetails("");
    axios
      .post(urlCreate, requestBody)
      .then((response) => {
        // Handle the response
        messageApi.success('Note created successfully');
        // message.config({
        //   topRight: 10;
        // });
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  return (
    <div className="addNote">
      {contextHolder}
      <form className="title_and_button" onSubmit={handleSubmit}>
        <input
          type="input"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter a task"
          className="input_title"
        />
        <button className="input_submit" type="submit">
          {" "}
          Add{" "}
        </button>
      </form>
      <hr className="divider" />
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Description"
        className="input_details"
      />
    </div>
  );
};

export default InputField;
