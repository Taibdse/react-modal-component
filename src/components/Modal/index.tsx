import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { RiCloseLine } from "react-icons/ri";
import { createPortal } from 'react-dom';
import { Transition, TransitionStatus } from 'react-transition-group';

export interface ModalProps {
  afterClose?: Function;
  onCancel?: Function;
  onOk?: Function;
  open?: boolean;
  title?: ReactNode;
  cancelText?: ReactNode;
  centered?: boolean;
  closable?: boolean;
  closeIcon?: ReactNode;
  okText?: ReactNode;
  width?: number;
  zIndex?: number;
  bodyStyle?: CSSProperties;
  style?: CSSProperties;
  maskStyle?: CSSProperties;
  footer?: ReactNode;
  content?: ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  children?: ReactNode,
  className?: string;
  wrapClassName?: string
}

const transitionStyles: { [k in TransitionStatus]?: { opacity: number } } = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const duration = 500;

function Modal(props: ModalProps) {
  const {
    afterClose = () => { },
    open = false,
    title = null,
    cancelText = "Cancel",
    closable = true,
    okText = "OK",
    width = 250,
    zIndex = 1000,
    onCancel = () => { },
    onOk = () => { },
    bodyStyle = {},
    centered = true,
    footer,
    mask = true,
    maskClosable = true,
    closeIcon = null,
    destroyOnClose = false,
    maskStyle = {},
    style = {},
    children = null,
    className = '',
    wrapClassName = '',
    content
  } = props;

  const [visible, setVisible] = useState(false);
  const modalId = Math.random().toString();

  const handleClickOnMask = (e: any) => {
    if (maskClosable && onCancel) {
      onCancel(e);
    }
  }

  const handleClickOnWrapper = (e: any) => {
    if (e.target.id === modalId || document.getElementById(modalId)?.contains(e.target)) return;
    if (maskClosable && onCancel) {
      onCancel(e);
    }
  }

  const handleClickCancelButton = (e: any) => {
    if (onCancel) onCancel(e);
  }

  const handleClickOkButton = (e: any) => {
    if (onOk) onOk(e);
  }

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (!visible && afterClose) afterClose();
  }, [visible]);

  return createPortal(
    <Transition in={visible} timeout={duration} unmountOnExit={destroyOnClose}>
      {(state: TransitionStatus) => {
        const hideElement = !visible && state === 'exited';
        return (
          <div
            style={{
              transition: `opacity ${duration}ms ease-in-out`,
              opacity: 0,
              ...transitionStyles[state],
              // display: state === 'exited' ? 'none' : undefined
            }}
            data-testid="modal-transition-wrapper"
          >
            {mask && <div data-testid="modal-mask" className={`${styles.mask} ${hideElement ? 'd-none' : ''}`} onClick={handleClickOnMask} style={maskStyle} />}
            <div data-testid="modal-wrapper" className={`${styles.wrapper} ${wrapClassName} ${hideElement ? 'd-none' : ''}`} onClick={handleClickOnWrapper}>
              <div
                aria-modal="true"
                role='dialog'
                aria-labelledby=":r1:"
                id={modalId}
                className={`${styles.modal} ${className} ${hideElement && 'd-none'}`}
                style={{ ...style, width, zIndex, top: centered ? '50%' : '20%' }}
                data-testid="modal"
              >
                <div className={styles.modalHeader} data-testid="modal-header">
                  {title}
                </div>
                {closable && (
                  <button data-testid="modal-close-btn" aria-label="Close" className={styles.closeBtn} onClick={handleClickCancelButton}>
                    {closeIcon ? closeIcon : <RiCloseLine style={{ marginBottom: "-3px" }} />}
                  </button>
                )}
                <div data-testid="modal-body" className={styles.modalContent} style={bodyStyle}>
                  {children}
                  {content}
                </div>
                {footer === undefined ? (
                  <div data-testid="modal-footer" className={styles.modalActions}>
                    <div className={styles.actionsContainer}>
                      <button data-testid="modal-ok-btn" className={styles.okBtn} onClick={handleClickOkButton}>
                        {okText}
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={handleClickCancelButton}
                        data-testid="modal-cancel-btn"
                      >
                        {cancelText}
                      </button>
                    </div>
                  </div>
                ) : footer}
              </div>
            </div>
          </div>
        )
      }}
    </Transition>,
    document.body
  )
}

export default Modal;
