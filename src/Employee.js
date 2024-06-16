import React, { Fragment, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";

const dataText = [
  {
    id: 1,
    name: "Joe",
    age: 45,
    isActive: 1,
  },
];

const Employee = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    age: 0,
    isActive: 0,
  });
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: "",
    age: 0,
    isActive: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setData(dataText);
    }, 1000);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (employee) => {
    setEditFormData(employee);
    setShow(true);
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData({
      ...addFormData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const isAddFormValid = () => {
    return addFormData.name.length >= 2 && addFormData.age >= 0;
  };

  const isEditFormValid = () => {
    return editFormData.name.length >= 2 && editFormData.age >= 0;
  };

  const handleAddSubmit = () => {
    if (isAddFormValid()) {
      const newEmployee = { ...addFormData, id: data.length + 1 };
      setData([...data, newEmployee]);
      setAddFormData({ name: "", age: 0, isActive: 0 });
    }
  };

  const handleEditSubmit = () => {
    if (isEditFormValid()) {
      const updatedData = data.map((item) =>
        item.id === editFormData.id ? editFormData : item
      );
      setData(updatedData);
      handleClose();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    }
  };

  return (
    <Fragment>
      <Container>
        <Row className="mb-3">
          <Col xs={4}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              value={addFormData.name}
              onChange={handleAddFormChange}
              required
            />
          </Col>
          <Col xs={3}>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Age"
              name="age"
              value={addFormData.age}
              onChange={handleAddFormChange}
              min={0}
              required
            />
          </Col>
          <Col
            xs={3}
            className="d-flex align-items-center justify-content-end pe-4"
          >
            <input
              type="checkbox"
              name="isActive"
              checked={addFormData.isActive === 1}
              onChange={handleAddFormChange}
              className="me-2"
            />
            <label className="mb-0">IsActive</label>
          </Col>
          <Col xs={2}>
            <Button
              className="btn btn-primary"
              onClick={handleAddSubmit}
              disabled={!isAddFormValid()}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
      <br />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.isActive === 1 ? "Yes" : "No"}</td>
                <td>
                  <Button
                    onClick={() => handleShow(item)}
                    className="btn btn-primary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                minLength={2}
                required
              />
            </Col>
            <Col>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Age"
                name="age"
                value={editFormData.age}
                onChange={handleEditFormChange}
                min={0}
                required
              />
            </Col>
            <Col className="d-flex align-items-center justify-content-end pe-4">
              <input
                type="checkbox"
                name="isActive"
                checked={editFormData.isActive === 1}
                onChange={handleEditFormChange}
                className="me-2"
              />
              <label className="mb-0">IsActive</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={!isEditFormValid()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Employee;
