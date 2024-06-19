"use client";

import React from "react";
import { useAppContext } from "@/app/(context)/AppContext";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import Subtitle from "../Text/Subtitle";

function ModalComponent() {
  const { dispatch, modal } = useAppContext();

  console.log("modal", modal);

  return (
    <Modal
      isOpen={modal.open}
      onClose={() =>
        dispatch({
          type: "SET_MODAL",
          payload: { open: false, header: null, body: null },
        })
      }
      className="w-auto min-w-fit"
      classNames={{
        base: "w-auto min-w-fit",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Subtitle>{modal.header}</Subtitle>
            </ModalHeader>
            <ModalBody>{modal.body}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalComponent;
