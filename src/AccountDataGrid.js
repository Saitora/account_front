import React, {Component} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import './AccountDataGrid.css';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-modal';
import AddCashModal from './AddCashModal';
import GetCashModal from './GetCashModal';
import TransferCashModal from './TransferCashModal'
import { withAlert } from 'react-alert'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

function dateFormatter(cell: any) {
    if (!cell) {
        return "";
    }
    return moment(cell).format("DD-MM-YYYY HH:mm:ss");
}

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

class AccountDataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            totalSize: 0,
            page: 1,
            sizePerPage: 10,
            selected: [],
            modalIsOpen: false,
            dataUrl: props.url
        };

        this.bootTable = React.createRef();
        this.addCashModal = React.createRef();
        this.getCashModal = React.createRef();
        this.transferCashModal = React.createRef();

        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSizePerPageChange = this.handleSizePerPageChange.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.handleSelection = this.handleSelection.bind(this);

        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.openAddCashModal = this.openAddCashModal.bind(this);
        this.handleAddCash = this.handleAddCash.bind(this);

        this.openGetCashModal = this.openGetCashModal.bind(this);
        this.handleGetCash = this.handleGetCash.bind(this);

        this.openTransferCashModal = this.openTransferCashModal.bind(this);
        this.handleTransferCash = this.handleTransferCash.bind(this);

    }

    openAddCashModal() {
        this.addCashModal.current.openModal();
    }

    handleAddCash() {
        if (this.state.selected) {
            axios.post(`${this.state.dataUrl}/account?method=add&account_num=${this.state.selected}&cash=${this.state.modal_add_cash_value}`)
                .then(
                    res => {
                        this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
                        this.addCashModal.current.closeModal();
                    }
                );
        }
    }

    openGetCashModal() {
        this.getCashModal.current.openModal();
    }

    handleGetCash() {
        if (this.state.selected) {
            axios.post(`${this.state.dataUrl}/account?method=get&account_num=${this.state.selected}&cash=${this.state.modal_get_cash_value}`)
                .then(
                    res => {
                        if (res.status === 200 && res.data.error === 0) {
                            this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
                            this.getCashModal.current.closeModal();
                        } else {
                            this.props.alert.show(res.data.error_message, {type: 'error'})
                        }
                    }
                );
        }
    }

    openTransferCashModal() {
        this.transferCashModal.current.openModal();
    }

    handleTransferCash() {
        if (this.state.selected.length > 0) {
            axios.post(`${this.state.dataUrl}/account?method=transfer&from_account_num=${this.state.selected}&to_account_num=${this.state.modal_transfer_account_number}&cash=${this.state.modal_transfer_cash_value}`)
                .then(
                    res => {
                        if (res.status === 200 && res.data.error === 0) {
                            this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
                            this.transferCashModal.current.closeModal();
                        } else {
                            this.props.alert.show(res.data.error_message, {type: 'error'})
                        }
                    }
                );
        }
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

    componentDidMount() {
        this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
    }

    handleDeleteRow() {
        if (this.state.selected) {
            axios.post(`${this.state.dataUrl}/account?method=delete&account_num=${this.state.selected}`)
                .then(
                    res => {
                        this.setState({selected: []});
                        this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
                    }
                );
        }
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {
        let url = '';
        if (filters && Object.keys(filters).length !== 0 && filters.constructor === Object) {
            url =`${this.state.dataUrl}/account?method=get_acc_page&page_size=${sizePerPage}&page_num=${page - 1}&account_num_filter=${filters.accountNumber.filterVal}`;
        } else {
            url =`${this.state.dataUrl}/account?method=get_acc_page&page_size=${sizePerPage}&page_num=${page - 1}`;
        }
        console.log(url);
        axios.get(url)
            .then(res => {
                try {
                    this.setState({
                        items: res.data.items,
                        totalSize: res.data.amount,
                        page: page,
                        sizePerPage: sizePerPage
                    }, () => console.log(this.state));
                    if (res.data.amount > 0 && (this.state.selected.length === 0 || (filters && Object.keys(filters).length !== 0))) {
                        this.setState({selected: [res.data.items[0].accountNumber]});
                    } else {
                        if (this.state.selected.length !== 0) {
                            this.bootTable.current.selectionContext.handleRowSelect(this.state.selected[0]);
                        }
                    }
                } catch(err) {
                    console.log(err);
                    console.log(res);
                    console.trace();
                }
            });
    };

    handlePageChange(page, sizePerPage) {
        this.handleTableChange('pagination', {page: page, sizePerPage: sizePerPage});
    }

    handleSizePerPageChange(sizePerPage, page) {
        this.handleTableChange('pagination', {page: page, sizePerPage: sizePerPage});
    }

    handleCreateAccount() {
        axios.post(`${this.state.dataUrl}/account?method=create&account_num=${this.state.modal_account_number}`)
            .then(res => {
                console.log(res);
                if (res.status === 200 && res.data.error === 0) {
                    try {
                        this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
                        this.closeModal();
                    } catch(err) {
                        console.log(err);
                        console.trace();
                    }
                }
            });
    }

    handleSelection(row, isSelect, rowIndex, e) {
        console.log(row);
        console.log(rowIndex);
        this.setState({selected: [row.accountNumber]});
    }

    render() {
        const selectRowProp = {
            mode: 'radio',
            bgColor: '#FFB',
            hideSelectColumn: true,
            clickToSelect: true,
            selected: this.state.selected,
            onSelect: this.handleSelection
        };

        const pagination = paginationFactory({
            page: this.state.page,
            sizePerPage: this.state.sizePerPage,
            totalSize: this.state.totalSize,
            onSizePerPageChange: this.handleSizePerPageChange,
            onPageChange: this.handlePageChange,
            sizePerPageList: [
                {
                    text: '10',
                    value: 10
                },
                {
                    text: '20',
                    value: 20
                },
                {
                    text:'50',
                    value: 50
                }
            ]
        });

        const columns = [{
                dataField: 'accountNumber',
                text: 'Номер счета',
                filter: textFilter()
            }, {
                dataField: 'created',
                text: 'Дата создания',
                formatter: dateFormatter
            }, {
                dataField: 'cash',
                text: 'Остаток на счете'
            }
        ];

        return (
            <div className="data_grid_table">
                <button id="create_account_btn" onClick={ this.openModal }>Создать</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <button onClick={this.closeModal}>Закрыть</button>
                    <h2 ref={subtitle => this.subtitle = subtitle}>Создание счета</h2>
                    <div>Номер счета</div>
                    <input type="text" id="modal_create_account_number" value={this.state.modal_account_number} onChange={(event) => this.setState({modal_account_number: event.target.value})}/>
                    <button id="modal_create_account_btn" onClick={this.handleCreateAccount}>Создать</button>
                </Modal>
                <button id="delete_account_btn" onClick={ this.handleDeleteRow }>Удалить</button>
                <button id="add_cash_btn" onClick={ this.openAddCashModal }>Пополнить</button>
                <AddCashModal
                    parent={this}
                    ref={this.addCashModal}
                />
                <button id="get_cash_btn" onClick={ this.openGetCashModal }>Снять</button>
                <GetCashModal
                    parent={this}
                    ref={this.getCashModal}
                />
                <button id="transfer_cash_btn" onClick={ this.openTransferCashModal }>Перевести</button>
                <TransferCashModal
                    parent={this}
                    ref={this.transferCashModal}
                />
                <BootstrapTable
                    keyField = 'accountNumber'
                    data = { this.state.items }
                    columns = { columns }
                    pagination = { pagination }
                    selectRow = { selectRowProp }
                    onTableChange={ this.handleTableChange }
                    remote={{filter: true, pagination: true}}
                    filter={ filterFactory() }
                    ref={this.bootTable}
                />
            </div>
        );
    }
}

Modal.setAppElement('#content-inside');

export default withAlert(AccountDataGrid);