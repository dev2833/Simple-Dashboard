import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Table, Checkbox, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import _ from 'lodash';
import { OutputDataType, RowClasses, CheckBoxStatus } from './types';
import { getOriginTableData, defaultColumns } from './utils';

const CheckboxGroup = Checkbox.Group;
const plainOptions = [''];

const styles = {
  container: {
    padding: 24
  },
  top: {
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between'
  },
  search: {
    margin: '0 0 0 auto',
    width: 200
  },
  buttonGroup: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 20,
  },
  reset: {
    color: '#000',
    backgroundColor: '#fff'
  }
}

export default function Dashboard() {

  const [data, setData] = useState<Array<OutputDataType>>([]);
  const [selectedItems, setSelectedItems] = useState<Array<number>>([]);    // list of selected item's id
  const [rowClasses, setRowClasses] = useState<RowClasses>({});
  const [checkedList, setCheckedList] = useState<CheckBoxStatus>({});

  useEffect(() => {
    initializeData();
  }, []);

  // whenever the data is updated, update the style of the table.
  useEffect(() => {
    updateRowClasses();
  }, [data]);

  // Initialize the table data.
  const initializeData = () => {
    const originTableData: Array<OutputDataType> = getOriginTableData();
    setData([...originTableData]);
    setSelectedItems([]);

    // initialize the checkbox statuses.
    const statusList: CheckBoxStatus = {};
    originTableData.forEach(record => {
      statusList[record.id] = [];
    });
    setCheckedList(statusList);
  }

  const columns: ColumnsType<OutputDataType> = [
    ...defaultColumns,
    {
      title: 'Approved?',
      dataIndex: 'is_approved',
      render: (_, record: OutputDataType, selectedRowNumber: number) =>
        <CheckboxGroup options={plainOptions} value={checkedList[record.id]} onChange={(checkedValue: CheckboxValueType[]) => handleApprovedChange(checkedValue, record)} />
    },
  ];

  // toggling the approved status
  const handleApprovedChange = (list: CheckboxValueType[], record: OutputDataType) => {

    const targetIndex: number = selectedItems.findIndex(item => item === record.id);
    let tempSelectedItems: Array<number> = selectedItems;

    if (targetIndex === -1) {
      // Number doesn't exist in the array, then add it
      tempSelectedItems.push(record.id);
    } else {
      // already approved, then remove it from array.
      tempSelectedItems.splice(targetIndex, 1);
    }

    const statusList: CheckBoxStatus = { ...checkedList };
    statusList[record.id] = list;
    setCheckedList(statusList);
  };

  const handleApproveSamples = () => {
    const updatedData: Array<OutputDataType> = [...data];
    selectedItems.map((value: number) => {
      const targetIndex: number = updatedData.findIndex((item: OutputDataType) => item.id === value);
      if (targetIndex !== -1) {
        updatedData[targetIndex]['is_approved'] = !updatedData[targetIndex]['is_approved'];
      } else {
        console.log("Item not found");
      }
    });
    setData([...updatedData]);
    setSelectedItems([]);
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const originTableData: Array<OutputDataType> = getOriginTableData();
    const keyword: string = e.target.value;
    const searchData: Array<OutputDataType> = originTableData.filter(item => item['type'].includes(keyword) || item['accession_id'].includes(keyword) || item['run_id'].includes(keyword));
    setData([...searchData]);
  };

  const rowClassName = (record: OutputDataType) => {
    return rowClasses[record.id];
  };

  const updateRowClasses = () => {
    const newClasses: RowClasses = {};
    data.forEach(record => {
      if (record.is_approved) {
        newClasses[record.id] = 'highlighted-row';
      } else {
        newClasses[record.id] = '';
      }
    });
    setRowClasses(newClasses);
  };

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <Input style={styles.search} placeholder="Search..." addonAfter={<SearchOutlined />} onChange={handleSearch} />
        <div style={styles.buttonGroup}>
          <Button type="primary" onClick={handleApproveSamples}>
            Approve Samples
          </Button>
          <Button type="default" onClick={initializeData} style={styles.reset}>
            Reset
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowClassName={rowClassName}
        scroll={{ x: true }}
        size='small'
      />
    </div>
  );
}
