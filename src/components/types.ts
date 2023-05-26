import type { CheckboxValueType } from 'antd/es/checkbox/Group';

export interface InputDataType {
    accession_id: string,
    cnv_qc: string,
    id: number,
    mean_coverage: null | number,
    mean_q_score: number,
    msi_qc: string,
    pair_accession: null | string,
    percent_bases_over_1x: null | number,
    percent_bases_over_10x: null | number,
    percent_bases_over_20x: null | number,
    percent_bases_over_50x: null | number,
    percent_bases_over_100x: null | number,
    percent_bases_over_150x: null | number,
    percent_bases_over_q30: number,
    percent_perfect_index: number,
    run_id: string,
    status: string,
    type: string,
}

export interface OutputDataType extends InputDataType {
    key: number,
    is_approved: boolean,
}

export interface FilterType {
    text: string,
    value: string
}

export interface RowClasses {
    [key: number]: string;
}

export interface CheckBoxStatus {
    [key: number]: Array<CheckboxValueType>;
}

export type FILTER_KEYWORD = 'accession_id' | 'run_id' | 'type';