// src/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Input, Form } from 'antd';
import useGraphQLQuery from '../../hooks/reactQuery';

const Home: React.FC = () => {
    const [form] = Form.useForm(); // Create a form instance
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [editingKey, setEditingKey] = useState('');


    const { data, isLoading } = useGraphQLQuery(`
        query GetAllUser {
            users {
              _id
              name
              email
            }
          }
  `);

    const isEditing = (record: any) => record._id === editingKey;

    const edit = (record: any) => {
        form.setFieldsValue(record); // Populate form fields with current record
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record:any) => ({
            name: record._id,
        }),
    };
    const hasSelected = selectedRowKeys.length > 0;

    const save = async (recordKey: React.Key) => {
        try {
            const row = await form.validateFields(); // Validate form fields
            // Handle save logic with the updated row values
            setEditingKey('');
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="name"
                        initialValue={record.name}
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input />
                    </Form.Item>
                ) : (
                    record.name
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            editable: true,
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="email"
                        initialValue={record.email}
                        rules={[{ required: true, message: 'Email is required' }]}
                    >
                        <Input />
                    </Form.Item>
                ) : (
                    record.email
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a onClick={() => save(record._id)}>Save</a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <a onClick={() => edit(record)}>Edit</a>
                );
            },
        },
    ];

  

    return (
        <>
            <Button type="primary">Add User</Button>
            <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
            <Form form={form} component={false}>
                <Table
                    rowSelection={rowSelection}
                    dataSource={data?.data?.users}
                    columns={columns}
                    pagination={false}
                    loading={isLoading}
                    bordered
                />
            </Form>
        </>
    );
};

export default Home;
