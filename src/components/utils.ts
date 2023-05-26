import { InputDataType, OutputDataType, FilterType, FILTER_KEYWORD } from './types';
import type { ColumnsType } from 'antd/es/table';

const inputData = require('../mockData/input_data.json');

// Configure the initial table data
export const getOriginTableData = () => {
    const qcMetrics: Array<InputDataType> = inputData["qc-metrics"];
    const originTableData: Array<OutputDataType> = qcMetrics.map((x: InputDataType) => {
        return {
            ...x,
            key: x.id,   // add key property for key and table selection
            is_approved: false,
        }
    });
    return originTableData;
}

//Configure filters for accession_id, run_id and type
const configureFilters = (key: FILTER_KEYWORD): Array<FilterType> => {

    const keyArray: Array<string> = getOriginTableData().map((item: OutputDataType) => item[key]);
    const uniqueKeyArray: Array<string> = keyArray.reduce((accumulator: Array<string>, value: string) => {
        if (!accumulator.includes(value)) {
            accumulator.push(value);
        }
        return accumulator;
    }, []);

    const filters: Array<FilterType> = uniqueKeyArray.map((item: string) => {
        return {
            text: item,
            value: item
        }
    });

    return filters;
}


export const defaultColumns: ColumnsType<OutputDataType> = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('id', a, b),
    },
    {
        title: 'Accession Id',
        dataIndex: 'accession_id',
        filters: configureFilters('accession_id'),
        filterSearch: true,
        onFilter: (value: string | number | boolean, record) => record.accession_id.includes(value.toString()),
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('accession_id', a, b),
    },
    {
        title: 'Type',
        dataIndex: 'type',
        filters: configureFilters('type'),
        filterSearch: true,
        onFilter: (value: string | number | boolean, record) => record.type.includes(value.toString()),
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('type', a, b),
    },
    {
        title: 'Pair Accession',
        dataIndex: 'pair_accession',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('pair_accession', a, b),
    },
    {
        title: 'Percentperfect index',
        dataIndex: 'percent_perfect_index',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_perfect_index', a, b),
    },
    {
        title: 'Percent bases over q30',
        dataIndex: 'percent_bases_over_q30',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_q30', a, b),
    },
    {
        title: 'Mean q score',
        dataIndex: 'mean_q_score',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('mean_q_score', a, b),
    },
    {
        title: 'Percent bases over 1x',
        dataIndex: 'percent_bases_over_1x',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_1x', a, b),
    },
    {
        title: 'percent bases over 10x',
        dataIndex: 'percent_bases_over_10x',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_10x', a, b),
    },
    {
        title: 'percent bases over 20x',
        dataIndex: 'percent_bases_over_20x',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_20x', a, b),
    },
    {
        title: 'percent bases over 50x',
        dataIndex: 'percent_bases_over_50x',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_50x', a, b),
    },
    {
        title: 'percent bases over 100x',
        dataIndex: 'percent_bases_over_100x',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_100x', a, b),
    },
    {
        title: 'percent bases over 150x',
        dataIndex: 'percent_bases_over_150x',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('percent_bases_over_150x', a, b),
    },
    {
        title: 'mean coverage',
        dataIndex: 'mean_coverage',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('mean_coverage', a, b),
    },
    {
        title: 'msi qc',
        dataIndex: 'msi_qc',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('msi_qc', a, b),
    },
    {
        title: 'cnv qc',
        dataIndex: 'cnv_qc',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('cnv_qc', a, b),
    },
    {
        title: 'status',
        dataIndex: 'status',
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('status', a, b),
    },
    {
        title: 'run_id',
        dataIndex: 'run_id',
        filters: configureFilters('run_id'),
        filterSearch: true,
        onFilter: (value: string | number | boolean, record) => record.run_id.includes(value.toString()),
        sorter: (a: OutputDataType, b: OutputDataType) => sortTable('run_id', a, b),
    },
];

const sortTable = (dataIndex: string, leftData: OutputDataType, rightData: OutputDataType) => {
    let comparisonResult: number = 0;
    switch (dataIndex) {
        case 'id':
        case 'percent_perfect_index':
        case 'percent_bases_over_q30':
        case 'mean_q_score':
            //comparison between two numbers
            comparisonResult = leftData[dataIndex] - rightData[dataIndex];
            break;

        case 'accession_id':
        case 'type':
        case 'cnv_qc':
        case 'status':
        case 'run_id':
        case 'msi_qc':
            //comparison between two strings
            comparisonResult = leftData[dataIndex].localeCompare(rightData[dataIndex]);
            break;

        case 'percent_bases_over_1x':
        case 'percent_bases_over_10x':
        case 'percent_bases_over_20x':
        case 'percent_bases_over_50x':
        case 'percent_bases_over_100x':
        case 'percent_bases_over_150x':
        case 'mean_coverage':
            //comparison between two number or null
            comparisonResult = leftData[dataIndex] ?? 0 - (rightData[dataIndex] ?? 0);    // If the value is null, substitute it with 0.
            break;

        case 'pair_accession':
            //comparison between two string or null
            comparisonResult = (leftData[dataIndex] ?? '').localeCompare(rightData[dataIndex] ?? '');    // If the value is null, substitute it with empty string.
            break;


        default:
            comparisonResult = 0;
    }
    return comparisonResult;
}
