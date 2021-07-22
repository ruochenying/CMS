import { Button } from "antd";
import Modal from "antd/lib/modal";
import React from "react";

export default function ModalForm(props: React.PropsWithChildren<any>) {
  const { children, cancel, ...others } = props;

  return (
    <Modal
      {...others}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={cancel}
      footer={[
        <Button key="cancel" onClick={cancel}>
          Cancel
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
}
