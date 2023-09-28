// src/UserManagement.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Table, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const getUsers = async () => {
    // Make a GraphQL query to get users
};

const deleteUser = async (id: string) => {
    // Make a GraphQL mutation to delete a user by id
};

interface User {
    _id: string;
    name: string;
    email: string;
    isActive: string;
}

const Home: React.FC = () => {

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <span>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type='primary' icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    const handleEdit = (user: User) => {
        // Handle edit action
    };

    const handleDelete = (id: string) => {
        // mutation.mutate({ id });
    };

    return (
        <>
            <Button type="primary">
                Add User
            </Button>
            <Table dataSource={[{
                name:"Hello",
                email:"sss@mas.ss"
            }]} columns={columns} />
        </>
    );
};

export default Home;
