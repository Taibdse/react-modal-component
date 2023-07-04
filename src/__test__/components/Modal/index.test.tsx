import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Modal, { ModalProps } from '../../../components/Modal';
import userEvent  from '@testing-library/user-event'


const modalTitleText = 'Modal title';
const modalContentText = 'Modal content';
const okBtnText = 'Ok?';
const cancelBtnText = 'Cancel?';
const modalChildrenText = 'Modal children';

const modalProps: ModalProps = {
  open: true,
  width: 500,
  zIndex: 1200,
  bodyStyle: { background: 'red', marginBottom: '10px' },
  title: <h3 id='modal-title'>{modalTitleText}</h3>,
  content: <h3 id='modal-content'>{modalContentText}</h3>,
  afterClose: () => {},
  closable: true,
  closeIcon: <span id='close-icon-x'>X</span>,
  okText: <span>{okBtnText}</span>,
  cancelText: <span>{cancelBtnText}</span>,
  mask: true,
  maskClosable: true,
  className: 'className',
  maskStyle: { color: 'black', fontSize: 14 },
  style: { color: 'green', fontSize: 16 },
  wrapClassName: 'wrapper-className',
  // footer={null}
  // centered={true}
  onOk: () => {},
  onCancel: () => {},
  destroyOnClose: false
}

describe('<Modal />', () => {
  test('Modal should render properly when open', async () => {
    const user = userEvent.setup();
    const onCancelMock = vi.fn();
    const onOkMock = vi.fn();
    const afterCloseMock = vi.fn();
    const wrapper = render(<Modal
      {...modalProps}
      onCancel={onCancelMock}
      onOk={onOkMock}
    >
      <h3 id='modal-children'>{modalChildrenText}</h3>
    </Modal>)
    expect(wrapper).toBeTruthy();


    const modalTransitionWrapper = screen.getByTestId('modal-transition-wrapper');
    const modalMask = screen.getByTestId('modal-mask');
    const modalWrapper = screen.getByTestId('modal-wrapper');
    const modal = screen.getByTestId('modal');
    const modalBody = screen.getByTestId('modal-body');
    const modalHeader = screen.getByTestId('modal-header');
    const modalFooter = screen.getByTestId('modal-footer');
    const modalClose = screen.getByTestId('modal-close-btn');
    const modalOkBtn = screen.getByTestId('modal-ok-btn');
    const modalCancelBtn = screen.getByTestId('modal-cancel-btn');
    const modalTitle = modalHeader.querySelector('h3#modal-title');
    const modalBodyContent = modalBody.querySelector('h3#modal-content');
    const modalChildren = modalBody.querySelector('h3#modal-children');

    expect(modalTransitionWrapper).toBeInTheDocument();
    expect(modalMask).toBeInTheDocument();
    expect(modalWrapper).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(modalBody).toBeInTheDocument();
    expect(modalHeader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
    expect(modalClose).toBeInTheDocument();
    expect(modalOkBtn).toBeInTheDocument();
    expect(modalCancelBtn).toBeInTheDocument();
    expect(modalTitle).toBeInTheDocument();
    expect(modalBodyContent).toBeInTheDocument();
    expect(modalChildren).toBeInTheDocument();

    expect(modalWrapper).not.toHaveClass('d-none');
    expect(modalWrapper).toHaveClass(modalProps.wrapClassName!);
    expect(modalMask).not.toHaveClass('d-none');
    expect(modalMask).toHaveStyle({ ...modalProps.maskStyle });

    expect(modalClose.querySelector('#close-icon-x')).toBeInTheDocument();
    expect(modalTitle).toHaveTextContent(modalTitleText);
    expect(modalBodyContent).toHaveTextContent(modalContentText);
    expect(modalChildren).toHaveTextContent(modalChildrenText);
    expect(modalOkBtn.querySelector('span')).toHaveTextContent(okBtnText);
    expect(modalCancelBtn.querySelector('span')).toHaveTextContent(cancelBtnText);
    expect(modal).toHaveStyle({ 'zIndex': modalProps.zIndex, width: `${modalProps.width}px` })
    expect(modal).toHaveStyle({ ...modalProps.style });
    expect(modal).toHaveClass(modalProps.className!);
    expect(modalBody).toHaveStyle({ ...modalProps.bodyStyle });

    await user.click(modalWrapper);
    expect(onCancelMock).toBeCalledTimes(1);

    await user.click(modalClose);
    expect(onCancelMock).toBeCalledTimes(2);

    await user.click(modalOkBtn);
    expect(onOkMock).toBeCalledTimes(1);

    // call after close when open is false
    render(<Modal
      {...modalProps}
      open={false}
      afterClose={afterCloseMock}
    />, { container: wrapper.container });

    expect(afterCloseMock).toBeCalledTimes(1);
  });

  test('Modal should render properly when open and footer is null', async () => {
    const wrapper = render(<Modal {...modalProps} footer={null} />)
    expect(wrapper).toBeTruthy();
    const modalFooter = screen.queryByTestId('modal-footer');
    const modalOkBtn = screen.queryByTestId('modal-ok-btn');
    const modalCancelBtn = screen.queryByTestId('modal-cancel-btn');
    expect(modalFooter).not.toBeInTheDocument();
    expect(modalOkBtn).not.toBeInTheDocument();
    expect(modalCancelBtn).not.toBeInTheDocument();
  });

  test('Modal should render properly when open and footer has value', async () => {
    const wrapper = render(<Modal {...modalProps} footer={<div data-testid='footer-content'></div>} />)
    expect(wrapper).toBeTruthy();
    const modalFooter = screen.queryByTestId('modal-footer');
    const modalOkBtn = screen.queryByTestId('modal-ok-btn');
    const modalCancelBtn = screen.queryByTestId('modal-cancel-btn');
    expect(modalFooter).not.toBeInTheDocument();
    expect(modalOkBtn).not.toBeInTheDocument();
    expect(modalCancelBtn).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer-content')).toBeInTheDocument();
  });

  test('Modal should render properly when open and cannot be closable', async () => {
    const wrapper = render(<Modal {...modalProps} closable={false} />)
    expect(wrapper).toBeTruthy();
    const modalClose = screen.queryByTestId('modal-close-btn');
    expect(modalClose).not.toBeInTheDocument();
  });

  test('Modal should render properly when open and mask is not enabled', async () => {
    const wrapper = render(<Modal {...modalProps} mask={false} />)
    expect(wrapper).toBeTruthy();
    const modalMask = screen.queryByTestId('modal-maskk');
    expect(modalMask).not.toBeInTheDocument();
  });

  test('Modal should render properly when open and cannot be maskClosable', async () => {
    const onCancelMock = vi.fn();
    const user = userEvent.setup();
    const wrapper = render(<Modal {...modalProps} maskClosable={false} onCancel={onCancelMock} />)
    expect(wrapper).toBeTruthy();
    const modalWrapper = screen.queryByTestId('modal-wrapper');
    expect(modalWrapper).toBeInTheDocument();

    await user.click(modalWrapper!);
    expect(onCancelMock).toBeCalledTimes(0);
  });

  test('Modal should render properly when close without destroy', async () => {
    const wrapper = render(<Modal {...modalProps} open={false} />)
    expect(wrapper).toBeTruthy();

    const modalTransitionWrapper = screen.getByTestId('modal-transition-wrapper');
    const modalMask = screen.getByTestId('modal-mask');
    const modalWrapper = screen.getByTestId('modal-wrapper');
    const modal = screen.getByTestId('modal');
    const modalBody = screen.getByTestId('modal-body');
    const modalHeader = screen.getByTestId('modal-header');
    const modalFooter = screen.getByTestId('modal-footer');
    const modalClose = screen.getByTestId('modal-close-btn');
    const modalOkBtn = screen.getByTestId('modal-ok-btn');
    const modalCancelBtn = screen.getByTestId('modal-cancel-btn');
    const modalTitle = modalHeader.querySelector('h3#modal-title');

    expect(modalTransitionWrapper).toBeInTheDocument();
    expect(modalMask).toBeInTheDocument();
    expect(modalWrapper).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(modalBody).toBeInTheDocument();
    expect(modalHeader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
    expect(modalClose).toBeInTheDocument();
    expect(modalOkBtn).toBeInTheDocument();
    expect(modalCancelBtn).toBeInTheDocument();
    expect(modalTitle).toBeInTheDocument();

    expect(modalWrapper).toHaveClass('d-none');
    expect(modalMask).toHaveClass('d-none');
  })

  test('Modal should render properly when close and destroy', async () => {
    const wrapper = render(<Modal {...modalProps} open={false} destroyOnClose />)
    expect(wrapper).toBeTruthy();

    const modalTransitionWrapper = screen.queryByTestId('modal-transition-wrapper');
    const modalMask = screen.queryByTestId('modal-mask');
    const modalWrapper = screen.queryByTestId('modal-wrapper');
    const modal = screen.queryByTestId('modal');
    const modalBody = screen.queryByTestId('modal-body');
    const modalHeader = screen.queryByTestId('modal-header');
    const modalFooter = screen.queryByTestId('modal-footer');
    const modalClose = screen.queryByTestId('modal-close-btn');
    const modalOkBtn = screen.queryByTestId('modal-ok-btn');
    const modalCancelBtn = screen.queryByTestId('modal-cancel-btn');

    expect(modalTransitionWrapper).not.toBeInTheDocument();
    expect(modalMask).not.toBeInTheDocument();
    expect(modalWrapper).not.toBeInTheDocument();
    expect(modal).not.toBeInTheDocument();
    expect(modalBody).not.toBeInTheDocument();
    expect(modalHeader).not.toBeInTheDocument();
    expect(modalFooter).not.toBeInTheDocument();
    expect(modalClose).not.toBeInTheDocument();
    expect(modalOkBtn).not.toBeInTheDocument();
    expect(modalCancelBtn).not.toBeInTheDocument();
  })
});
