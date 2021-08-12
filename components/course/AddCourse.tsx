import Form from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import {
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Spin,
  DatePicker,
  Button,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  CloseCircleOutlined,
  InboxOutlined,
  KeyOutlined,
} from "@ant-design/icons";

import moment from "moment";

import { validateMessages } from "../../lib/constant/config";
import React, { useEffect, useState } from "react";
import {
  addCourse,
  getCourseCode,
  getCourseType,
  getTeachers,
  updateCourse,
} from "../../lib/services/api-service";
import { AddCourseRequest, Course, CourseType, Teacher } from "../../lib/model";
import NumberWithUnitInput from "../common/NumberWithUnitInput";
import styles from "./AddCourse.module.css";
import styled from "styled-components";
import { DurationUnit } from "../../lib/constant";

interface AddCourseFormProps {
  course?: Course;
  onSuccess?: (course: Course) => void;
}

const UploadItem = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 30px;
    bottom: 25px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const AddCourse = ({
  onSuccess,
  course,
}: React.PropsWithChildren<AddCourseFormProps>) => {
  const [form] = useForm();
  const [isAdd, setIsAdd] = useState(course === null);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTeacherSearching, setIsTeacherSearching] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const type = await getCourseType();
      !!type && setCourseTypes(type);
      if (isAdd) {
        const code = await getCourseCode();

        !!code && form.setFieldsValue({ uid: code });
      }
    })();
  }, [form, isAdd]);

  useEffect(() => {
    if (!!course) {
      const formValues = {
        ...course,
        type: course.type.map((item) => item.id),
        teacherId: course.teacherName,
        startTime: moment(course.startTime),
        duration: { number: course.duration, unit: course.durationUnit },
      };
      setIsAdd(false);

      form.setFieldsValue(formValues);
      setFileList([{ name: "Cover Image", url: course.cover }]);
    }
  }, [course, form]);

  const onFinish = (values: any) => {
    const req: AddCourseRequest = {
      ...values,
      duration: +values.duration.number,
      startTime: values.startTime.format("YYYY-MM-DD"),
      teacherId: +values.teacherId || +course.teacherId,
      durationUnit: +DurationUnit[values.duration.unit] || values.duration.unit,
    };

    isAdd
      ? addCourse(req).then((resp) => onSuccess(resp))
      : updateCourse({ ...req, id: course.id }).then((resp) => {
          !!onSuccess && onSuccess(resp);
        });
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <Form
      labelCol={{ offset: 1 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      layout="vertical"
      validateMessages={validateMessages}
      onFinish={onFinish}
    >
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Row gutter={[6, 16]}>
            <Col span={8}>
              <Form.Item
                label="Teacher"
                name="teacherId"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select teacher"
                  showSearch
                  filterOption={false}
                  notFoundContent={
                    isTeacherSearching ? <Spin size="small" /> : null
                  }
                  onSearch={(query: string) => {
                    setIsTeacherSearching(true);
                    getTeachers({ query }).then((resp) => {
                      if (resp) {
                        setTeachers(resp.teachers);
                      }
                    });
                    setIsTeacherSearching(false);
                  }}
                >
                  {teachers.map((teacher) => (
                    <Select.Option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                <Select mode="multiple" allowClear>
                  {courseTypes?.map((type) => (
                    <Select.Option value={type.id} key={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Course Code"
                name="uid"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="course code" disabled />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => {
                return current.valueOf() < moment().valueOf();
              }}
            />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber<number>
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => +value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Student limit"
            name="maxStudents"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true }]}
          >
            <NumberWithUnitInput
              options={[
                { unit: 1, label: "year" },
                { unit: 2, label: "month" },
                { unit: 3, label: "day" },
                { unit: 4, label: "week" },
                { unit: 5, label: "hour" },
              ]}
              defaultUnit={"month"}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Description"
            name="detail"
            rules={[
              { required: true },
              {
                min: 100,
                max: 1000,
                message:
                  "Description length must between 100 - 1000 characters.",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Course description"
              style={{ height: "290px" }}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ position: "relative" }}>
          <UploadItem label="Cover" name="cover">
            <ImgCrop rotate aspect={16 / 9}>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList, file }) => {
                  const { status } = file;

                  if (file?.response) {
                    const { url } = file.response;

                    form.setFieldsValue({ cover: url });
                  }

                  setIsUploading(status === "uploading");
                  setFileList(newFileList);
                }}
                onPreview={onPreview}
              >
                {fileList.length >= 1 ? null : (
                  <div className={styles.uploadInner}>
                    <InboxOutlined />
                    <p>Click or drag file to this area to upload</p>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </UploadItem>
        </Col>
        {isUploading && (
          <CloseCircleOutlined
            onClick={() => {
              setIsUploading(false);
              setFileList([]);
            }}
          />
        )}
      </Row>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isUploading}>
              {isAdd ? "Create Course" : "Update Course"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddCourse;
