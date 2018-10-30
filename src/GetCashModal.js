import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#content-inside');

class GetCashModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false
        };

        this.parent = props.parent;

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Пополнить счет"
            >
                <button onClick={this.closeModal}>Закрыть</button>
                <h2 ref={subtitle => this.subtitle = subtitle}>Снятие со счета</h2>
                <div>Сумма, руб.</div>
                <input type="text" id="modal_get_cash" value={this.parent.state.modal_get_cash_value} onChange={(event) => this.parent.setState({modal_get_cash_value: event.target.value})}/>
                <button id="modal_get_cash_btn" onClick={this.parent.handleGetCash}>Снять</button>
            </Modal>
        );
    }
}

export default GetCashModal;