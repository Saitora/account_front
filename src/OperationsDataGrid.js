import React, {Component} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
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

class OperationsDataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            totalSize: 0,
            page: 1,
            sizePerPage: 10,
            selected: [],
            dataUrl: props.url
        };

        this.bootTable = React.createRef();

        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSizePerPageChange = this.handleSizePerPageChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    componentDidMount() {
        this.handleTableChange('pagination', {page: this.state.page, sizePerPage: this.state.sizePerPage});
    }

    handleTableChange(type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
        axios.get(`${this.state.dataUrl}/operation?method=get_operations_page&page_size=${sizePerPage}&page_num=${page - 1}`)
            .then(res => {
                console.log(res);
                this.setState({ items: res.data.items, totalSize: res.data.amount, page: page, sizePerPage: sizePerPage });
                if (res.data.amount > 0 && this.state.selected.length === 0) {
                    this.setState({selected: [res.data.items[0].accountNumber]});
                } else {
                    if (this.state.selected.length !== 0) {
                        this.bootTable.current.selectionContext.handleRowSelect(this.state.selected[0]);
                    }
                }
            });
    }

    handlePageChange(page, sizePerPage) {
        this.handleTableChange('pagination', {page: page, sizePerPage: sizePerPage});
    }

    handleSizePerPageChange(sizePerPage, page) {
        this.handleTableChange('pagination', {page: page, sizePerPage: sizePerPage});
    }

    render() {
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
                dataField: 'id',
                text: 'Id'
            }, {
                dataField: 'created',
                text: 'Время проведения операции',
                formatter: dateFormatter
            }, {
                dataField: 'fromAccount.accountNumber',
                text: 'Номер основного счета'
            }, {
                dataField: 'toAccount.accountNumber',
                text: 'Номер дополнительного счета'
            }, {
                dataField: 'operationType',
                text: 'Тип операции'
            }, {
                dataField: 'value',
                text: 'Сумма'
            }
        ];

        return (
            <div className="data_grid_table">
                <BootstrapTable
                    keyField = 'id'
                    data = { this.state.items }
                    columns = { columns }
                    pagination = { pagination }
                    onTableChange={ this.handleTableChange }
                    remote
                    ref={this.bootTable}
                />
            </div>
        );
    }
}

export default OperationsDataGrid;