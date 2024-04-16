import { Button, Form, Select, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { useState } from 'react'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils'
import * as ItemService from '../../services/ItemService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminItem = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        name: "",
        price: "",
        component: "",
        availability: "",
        ID: "",
        image: "",
        importDate: "",
    })
    const [stateItem, setStateItem] = useState(inittial())
    const [stateItemDetails, setStateItemDetails] = useState(inittial())

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const { name,
                price,
                component,
                availability,
                ID,
                importDate,
                image,
            } = data
            const res = ItemService.createItem({
                name,
                price,
                component,
                availability,
                ID,
                importDate,
                image
            })
            return res
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = ItemService.updateItem(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                token,
            } = data
            const res = ItemService.deleteItem(
                id,
                token)
            return res
        },
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = ItemService.deleteManyItems(
                ids,
                token)
            return res
        },
    )

    const getAllItems = async () => {
        const res = await ItemService.getAllItem()
        return res
    }

    const fetchGetDetailsItem = async (rowSelected) => {
        const res = await ItemService.getDetailsItem(rowSelected)
        if (res?.data) {
            setStateItemDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                component: res?.data?.component,
                availability: res?.data?.availability,
                ID: res?.data?.ID,
                importDate: res?.data?.importDate,
                image: res?.data?.image,
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateItemDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateItemDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsItem(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsItem = () => {
        setIsOpenDrawer(true)
    }

    const handleDelteManyItems = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryItem.refetch()
            }
        })
    }

    const fetchAllTypeItem = async () => {
        const res = await ItemService.getAllTypeItem()
        return res
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany


    const queryItem = useQuery({ queryKey: ['items'], queryFn: getAllItems })
    const typeItem = useQuery({ queryKey: ['type-item'], queryFn: fetchAllTypeItem })
    const { isLoading: isLoadingItems, data: items } = queryItem
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsItem} />
            </div>
        )
    }


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<=',
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50
                }
                return record.price <= 50
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 3',
                    value: '>=',
                },
                {
                    text: '<= 3',
                    value: '<=',
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return Number(record.rating) >= 3
                }
                return Number(record.rating) <= 3
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = items?.data?.length && items?.data?.map((item) => {
        return { ...item, key: item._id }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDelectedMany])

    useEffect(() => {
        if (isSuccessDelected && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDelected])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateItemDetails({
            name: "",
            price: "",
            component: "",
            availability: "",
            ID: "",
            importDate: "",     
            image: "",
            
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }


    const handleDeleteItem = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryItem.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateItem({
            name: "",
            price: "",
            component: "",
            availability: "",
            ID: "",
            importDate: "",
            image: "",
        })
        form.resetFields()
    };

    const onFinish = () => {
        const params = {
            name: stateItem.name,
            price: stateItem.price,
            component: stateItem.component,
            availability: stateItem.availability,
            ID: stateItem.ID,
            type: stateItem.type === 'add_type' ? stateItem.newType : stateItem.type,
            importDate: stateItem.importDate,
            image: stateItem.image
            // discount: stateItem.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryItem.refetch()
            }
        })
    }

    const handleOnchange = (e) => {
        setStateItem({
            ...stateItem,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateItemDetails({
            ...stateItemDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateItem({
            ...stateItem,
            image: file.preview
        })
    }

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateItemDetails({
            ...stateItemDetails,
            image: file.preview
        })
    }
    const onUpdateItem = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateItemDetails }, {
            onSettled: () => {
                queryItem.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateItem({
            ...stateItem,
            type: value
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button 
                style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "6px",
                    borderStyle: "dashed",
                }}
                onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '30px' }} /></Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDelteMany={handleDelteManyItems} columns={columns} isLoading={isLoadingItems} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>

                    <Form name="basic" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} autoComplete="on" form={form}>
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                            <InputComponent value={stateItem['name']} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        {/* <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateItem.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeItem?.data?.data)}
                />
            </Form.Item>
            {stateItem.type === 'add_type' && (
              <Form.Item
                label='New type'
                name="newType"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
                <InputComponent value={stateItem.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )} */}
                        {/* <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateItem.countInStock} onChange={handleOnchange} name="countInStock" />
            </Form.Item> */}
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateItem.price} onChange={handleOnchange} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Component"
                            name="component"
                            rules={[{ required: true, message: 'Please input your component!' }]}
                        >
                            <InputComponent value={stateItem.component} onChange={handleOnchange} name="component" />
                        </Form.Item>
                        <Form.Item
                            label="Availability"
                            name="availability"
                            rules={[{ required: true, message: 'Please input your availability!' }]}
                        >
                            <InputComponent value={stateItem.availability} onChange={handleOnchange} name="availability" />
                        </Form.Item>
                        <Form.Item
                            label="ID"
                            name="id"
                            rules={[{ required: true, message: 'Please input your id!' }]}
                        >
                            <InputComponent value={stateItem.id} onChange={handleOnchange} name="id" />
                        </Form.Item>
                        <Form.Item
                            label="ImportDate"
                            name="importDate"
                            rules={[{ required: true, message: 'Please input your date' }]}
                        >
                            <InputComponent value={stateItem.importDate} onChange={handleOnchange} name="importDate" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button >Select File</Button>
                                {stateItem?.image && (
                                    <img src={stateItem?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>

                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateItem}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateItemDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        {/* 
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <InputComponent value={stateItemDetails['type']} onChange={handleOnchangeDetails} name="type" />
            </Form.Item> */}
                        <Form.Item
                            label="ImportDate"
                            name="importDate"
                            rules={[{ required: true, message: 'Please input your importDate!' }]}
                        >
                            <InputComponent value={stateItemDetails.importDate} onChange={handleOnchangeDetails} name="importDate" />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateItemDetails.price} onChange={handleOnchangeDetails} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Component"
                            name="component"
                            rules={[{ required: true, message: 'Please input your component!' }]}
                        >
                            <InputComponent value={stateItemDetails.component} onChange={handleOnchangeDetails} name="component" />
                        </Form.Item>
                        <Form.Item
                            label="Availability"
                            name="availability"
                            rules={[{ required: true, message: 'Please input your availability!' }]}
                        >
                            <InputComponent value={stateItemDetails.availability} onChange={handleOnchangeDetails} name="availability" />
                        </Form.Item>
                        <Form.Item
                            label="ID"
                            name="id"
                            rules={[{ required: true, message: 'Please input your id!' }]}
                        >
                            <InputComponent value={stateItemDetails.id} onChange={handleOnchangeDetails} name="id" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button >Select File</Button>
                                {stateItemDetails?.image && (
                                    <img src={stateItemDetails?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteItem}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminItem;