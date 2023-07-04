import React, { useContext, useState, ReactNode, useMemo, useRef } from 'react';
import Modal, { ModalProps } from '../../components/Modal';

export interface IModalInstance {
  open: () => void,
  close: () => void,
  destroy: () => void,
  update: (options: ModalProps) => void,
}

export interface IModalContext {
  create: (options: ModalProps) => IModalInstance,
  destroyAll: () => void
}

const ModalContext = React.createContext<IModalContext>({
  create: () => ({
    update: () => {},
    close: () => {},
    open: () => {},
    destroy: () => {},
  }),
  destroyAll: () => {},
});

export default function ModalProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [modals, setModals] = useState<{ options: ModalProps, key: number }[]>([]);
  const modalsRef = useRef<{ options: ModalProps, key: number }[]>([]);

  const updateModalInstance = (key: number, newOptions: ModalProps, shouldDestroy: boolean = false) => {
    console.log({ modals })
    if (shouldDestroy) {
      modalsRef.current = modalsRef.current.filter(m => m.key !== key);
    } else {
      modalsRef.current = modalsRef.current.map(m => m.key === key ? ({ ...m, options: { ...m.options, ...newOptions } }) : m);
    }
    setModals([...modalsRef.current])
  };

  const close = (key: number) => {
    updateModalInstance(key, { open: false });
  }

  const destroy = (key: number) => {
    updateModalInstance(key, { open: false }, true);
  }

  const update = (key: number, options: ModalProps) => {
    updateModalInstance(key, options);
  }

  const open = (key: number) => {
    updateModalInstance(key, { open: true });
  }

  const create = (options: ModalProps) => {
    const key = Math.random();
    modalsRef.current = [...modalsRef.current, { options, key }];
    setModals([...modalsRef.current]);
    return {
      open: () => open(key),
      close: () => close(key),
      destroy: () => destroy(key),
      update: (options: ModalProps) => update(key, options),
    };
  }

  const destroyAll = () => {
    modalsRef.current = [];
    setModals([]);
  }

  // const value = useMemo(() => ({ create, update, destroy, close, open }), [modals, updateModalInstance]);
  const value = useMemo(() => ({ create, destroyAll }), [modals, modalsRef.current]);

  return (
    <ModalContext.Provider value={value}>
      {modals.map(modal => (
        <Modal key={modal.key} {...modal.options} />
      ))}
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  return useContext(ModalContext);
}
