import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Typography } from "antd";
import moment from "moment";

const { TextArea } = Input;
const { Text } = Typography;

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues: any;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Update initialValues prop when selectedNote changes
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedNote = {
          id: initialValues.id,
          title: values.title,
          details: values.details,
          status: initialValues.status,
        };
        onSave(updatedNote);
        form.resetFields();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <Modal
      okButtonProps={{ style: { backgroundColor: "#b83312" } }}
      visible={visible}
      title="Edit Note"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          style={{ backgroundColor: "#414e96", borderColor: "#112599" }}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="details" label="Details">
          <TextArea rows={4} />
        </Form.Item>
        {initialValues?.editDate && (
          <Text style={{ textAlign: "right", color: "gray" }}>
          Edit Date: {moment(initialValues.editDate).format("MMM DD, YYYY h:mm A")}
        </Text>
        )}
      </Form>
    </Modal>
  );
};

export default EditModal;
