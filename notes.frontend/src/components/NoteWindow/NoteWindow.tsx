// import React, { useState } from 'react';
// import axios from 'axios';
// import Note from '../NotesBoard/NotesBoard'


// interface NoteWindowProps {
//   title: string;
//   details: string;
//   creationDate: string;
//   onClose: () => void;
// }

// const NoteWindow: React.FC<NoteWindowProps> = ({
//   title,
//   details,
//   creationDate,
//   onClose,
// }) => {
//   return (
//     <div className="noteWindow">
//       <h2>{title}</h2>
//       <p>{details}</p>
//       <p>Creation Date: {creationDate}</p>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default NoteWindow;

import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import {Note} from "../NotesBoard/NotesBoard"

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: Note) => void;
  initialValues: Note | undefined;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <Modal
      visible={visible}
      title={initialValues?.title}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="Title"
          label="Propert"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="property2"
          label="Property 2"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        {/* Add more form items for other properties */}
      </Form>
    </Modal>
  );
};

export default EditModal;

