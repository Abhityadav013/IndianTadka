import React from 'react';
import { Modal } from 'antd';

const ModalComponent = ({ visible, onCancel, onOk, children, title }) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      {children}  {/* Render the passed children */}
    </Modal>
  );
};

export default ModalComponent;
