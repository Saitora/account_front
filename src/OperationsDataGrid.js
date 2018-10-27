import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './OperationsDataGrid.css';
import axios from 'axios';
import moment from 'moment';

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
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(page = this.state.page, sizePerPage = this.state.sizePerPage) {
        axios.get(`http://localhost:8080/operation?method=get_operations_page&page_size=${sizePerPage}&page_num=${page - 1}`)
            .then(res => {
                console.log(res);
                this.setState({ items: res.data.items, totalSize: res.data.amount, page, sizePerPage });
            });
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
                    <TableHeaderColumn dataField="id" isKey dataAlign="center">Id</TableHeaderColumn>
                    <TableHeaderColumn dataField="created" dataAlign="center" dataFormat={dateFormatter}>Время проведения операции</TableHeaderColumn>
                    <TableHeaderColumn dataField="toAccountId" dataAlign="center">Номер счета</TableHeaderColumn>
                    <TableHeaderColumn dataField="operationType" dataAlign="center">Тип операции</TableHeaderColumn>
                    <TableHeaderColumn dataField="value" dataAlign="center">Сумма</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default AccountDataGrid;