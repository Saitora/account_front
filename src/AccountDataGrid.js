import React, {Component} from 'react';
//import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {BootstrapTable} from 'react-bootstrap-table-next';
import './AccountDataGrid.css';
import axios from 'axios';
import moment from 'moment';
//import _ from 'lodash';

//const dataTable = _.range(1, 60).map(x => ({id: x, name: `Name ${x}`, surname: `Surname ${x}`}));

// Simulates the call to the server to get the data
/*const fakeDataFetcher = {
    fetch(page, size) {
        return new Promise((resolve, reject) => {
            resolve({items: _.slice(dataTable, (page-1)*size, ((page-1)*size) + size), total: dataTable.length});
        });
    }
};*/

function dateFormatter(cell: any) {
    if (!cell) {
        return "";
    }
    //return `${moment(cell).format("DD-MM-YYYY")? moment(cell).format("DD-MM-YYYY"):moment(cell).format("DD-MM-YYYY") }`;
    return moment(cell).format("DD-MM-YYYY HH:mm:ss");
}

class AccountDataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            totalSize: 0,
            page: 1,
            sizePerPage: 10,
        };
        this.loadData = this.loadData.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSizePerPageChange = this.handleSizePerPageChange.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(page = this.state.page, sizePerPage = this.state.sizePerPage) {
        axios.get(`http://localhost:8080/account?method=get_acc_page&page_size=${sizePerPage}&page_num=${page - 1}`)
            .then(res => {
                console.log(res);
                this.setState({ items: res.data.items, totalSize: res.data.amount, page, sizePerPage });
            });
    }

    handleDeleteRow(row) {
        console.log(row);
        axios.post(`http://localhost:8080/account?method=delete&account_num=${row[0]}`)
            .then(
                res => {
                    this.loadData();
                }
            );
    }

    handlePageChange(page, sizePerPage) {
        this.loadData(page, sizePerPage);
    }

    handleSizePerPageChange(sizePerPage) {
        // When changing the size per page always navigating to the first page
        this.loadData(1, sizePerPage);
    }

    render() {
        const options = {
            onPageChange: this.handlePageChange,
            onSizePerPageList: this.handleSizePerPageChange,
            onDeleteRow: this.handleDeleteRow,
            page: this.state.page,
            sizePerPage: this.state.sizePerPage,
        };

        const selectRowProp = {
            mode: 'radio',
            bgColor: 'green',
            hideSelectColumn: true,
            clickToSelect: true
        };

        return (
            <div className="data_grid_table">
                <BootstrapTable
                    data={this.state.items}
                    options={options}
                    fetchInfo={{dataTotalSize: this.state.totalSize}}
                    remote
                    pagination
                    striped
                    hover
                    condensed
                    selectRow={selectRowProp}
                    insertRow={true}
                    deleteRow
                >
                    <TableHeaderColumn dataField="accountNumber" dataAlign="center" isKey={true}>Номер счета</TableHeaderColumn>
                    <TableHeaderColumn dataField="created" dataAlign="center" dataFormat={dateFormatter}>Дата создания</TableHeaderColumn>
                    <TableHeaderColumn dataField="cash" dataAlign="center">Остаток на счете</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default AccountDataGrid;