import React, { useState } from "react";
import { Button, Modal } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

interface ConfirmModalProps {
  question: string;
  message?:string;
  buttonTitle: string;
  handleOk: () => void;
  handleCancel: () => void;
  isOpen: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  question,
  message,
  buttonTitle,
  handleOk,
  handleCancel,
  isOpen,
}) => {
  return (
    <>
      <Modal
        centered
        title={question}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={buttonTitle}
        okButtonProps={{ style: { "backgroundColor": '#b83312' } }} 
        bodyStyle={{ backgroundColor: 'rgba(0, 0, 0, 5)' }}
      >
        <p>{message}</p>

      </Modal>
    </>
  );
};

export default ConfirmModal;
