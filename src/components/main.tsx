import {
  Button,
  Typography,
  Popconfirm,
  Modal,
  Form,
  Input,
  Checkbox,
  Card,
  type FormProps,
} from "antd";
import { useEffect, useState } from "react";
import { api } from "../api";

interface DataType {
  fname: string;
  lname: string;
  phone: number;
  gender: boolean;
  birthdate: string;
  id: string;
}

type FieldType = {
  fname: string;
  lname: string;
  phone: number;
  gender: boolean;
  birthdate: string;
};

const Main = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [reload, setReload] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      if (editingItem) {
        await api.put(`/Blog/${editingItem.id}`, values);
      } else {
        await api.post("/Blog", values);
      }
      handleCancel();
      setReload((p) => !p);
    } catch (error) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/Blog/${id}`);
      setReload((p) => !p);
    } catch (error) {}
  };

  const handleUpdate = (item: DataType) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    showModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/Blog");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [reload]);

  return (
    <div className="container mx-auto py-6">
      <div className="bg-slate-200 p-4 rounded-lg flex justify-between items-center">
        <Typography.Title level={3}>Blog CRUD</Typography.Title>
        <Button type="primary" onClick={showModal}>
          +
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card
            key={item.id}
            title={`${index + 1}. ${item.fname} ${item.lname}`}
            variant="borderless"
            style={{ width: 300 }}
            extra={
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleUpdate(item)}
                >
                  Update
                </Button>
                <Popconfirm
                  title="Delete record"
                  description="Are you sure you want to delete this record?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            }
          >
            <p>
              <b>Phone:</b> {item.phone}
            </p>
            <p>
              <b>Gender:</b> {item.gender ? "Male" : "Female"}
            </p>
            <p>
              <b>Birthdate:</b> {item.birthdate}
            </p>
          </Card>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Typography.Title level={3}>
          {editingItem ? "Update Blog" : "Create Blog"}
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="First Name"
            name="fname"
            rules={[{ required: true, message: "Enter first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Last Name"
            name="lname"
            rules={[{ required: true, message: "Enter last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Enter phone number" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Gender"
            name="gender"
            valuePropName="checked"
          >
            <Checkbox>Male</Checkbox>
            <Checkbox>Female</Checkbox>
          </Form.Item>

          <Form.Item<FieldType>
            label="Birthdate"
            name="birthdate"
            rules={[{ required: true, message: "Enter birthdate" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingItem ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Main;
