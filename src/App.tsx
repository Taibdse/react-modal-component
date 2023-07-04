import { useState } from 'react'
import './App.css'
import Modal from './components/Modal'
import { useModal } from './providers/ModalProvider';

function App() {
  const [open, setOpen] = useState(false);
  const modal = useModal();

  const handleOpenModalUsingHook = () => {
    const instance = modal.create({
      open: true,
      width: 500,
      title: <h2>Modal title using custom hook</h2>,
      onCancel: () => {
        instance.close()
      },
      closable: true,
      content: <h3>Content will be changed after 2 seconds</h3>
    });
    setTimeout(() => {
      instance.update({ open: true, content: <h3>Content changed!!</h3> })
    }, 2000);
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Modal component demo</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setOpen(true)}>Show modal</button>
        <button onClick={handleOpenModalUsingHook}>Show modal using provider and custom hook </button>
        <button onClick={() => modal.destroyAll()}>Destroy all modals using provider and custom hook </button>
      </div>
      <Modal
        open={open}
        width={500}
        zIndex={1200}
        bodyStyle={{ background: 'red', marginBottom: '10px' }}
        title={<h3>Modal title</h3>}
        afterClose={() => console.log('after close')}
        closable
        closeIcon={null}
        okText="Ok?"
        cancelText="Cancel?"
        mask
        maskClosable
        // footer={null}
        // centered={true}
        onOk={() => console.log('onOk')}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
        <h3>Custom modal</h3>
      </Modal>
    </div>
  )
}

export default App
