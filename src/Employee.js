import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Spinner,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employee = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [currentFormData, setCurrentFormData] = useState({
    id: null,
    name: "",
    age: "",
    isActive: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1000);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (employee) => {
    setCurrentFormData(employee);
    setShow(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

    if (name === "age") {
      newValue = Math.min(parseInt(newValue, 10), 120);
    }

    setCurrentFormData({
      ...currentFormData,
      [name]: newValue,
    });
  };

  const getData = () => {
    axios
      .get(`https://localhost:7239/api/Employee`)
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleAddSubmit = () => {
    const url = `https://localhost:7239/api/Employee`;
    const newEmployee = {
      name: currentFormData.name,
      age: parseInt(currentFormData.age, 10),
      isActive: currentFormData.isActive,
    };

    axios
      .post(url, newEmployee)
      .then((result) => {
        console.log(result.data);
        toast.success("Employee has been added!");
        getData();
        setCurrentFormData({ id: null, name: "", age: "", isActive: 0 });
      })
      .catch((error) => {
        console.error(
          "There was an error adding the employee!",
          error.response.data
        );
      });
  };

  const handleEditSubmit = () => {
    const url = `https://localhost:7239/api/Employee/${currentFormData.id}`;
    const updatedEmployee = {
      ...currentFormData,
      age: parseInt(currentFormData.age, 10),
    };

    axios
      .put(url, updatedEmployee)
      .then((result) => {
        console.log("Updated Employee:", updatedEmployee);
        toast.success("Employee has been updated!");
        getData();
        handleClose();
        setCurrentFormData({ id: null, name: "", age: "", isActive: 0 });
      })
      .catch((error) => {
        console.error(
          "There was an error updating the employee!",
          error.response.data
        );
      });
  };

  const handleDelete = (id) => {
    const url = `https://localhost:7239/api/Employee/${id}`;
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(url)
        .then((result) => {
          console.log("Deleted Employee ID:", id);
          toast.success("Employee has been deleted!");
          getData();
        })
        .catch((error) => {
          console.error(
            "There was an error deleting the employee!",
            error.response.data
          );
        });
    }
  };

  const isFormValid = () => {
    return currentFormData.name.length >= 2 && currentFormData.age >= 0;
  };
  return (
    <Container>
      <ToastContainer />
      <Row className="mb-3">
        <Col xs={4}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name"
            name="name"
            value={currentFormData.name}
            onChange={handleFormChange}
            required
          />
        </Col>
        <Col xs={3}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Age"
            name="age"
            value={currentFormData.age}
            onChange={handleFormChange}
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
            checked={currentFormData.isActive === 1}
            onChange={handleFormChange}
            className="me-2"
          />
          <label className="mb-0">IsActive</label>
        </Col>
        <Col xs={2}>
          <Button
            className="btn btn-primary"
            onClick={handleAddSubmit}
            disabled={!isFormValid()}
          >
            Submit
          </Button>
        </Col>
      </Row>
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
          {loading ? (
            <tr>
              <td colSpan="5">
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.isActive === 1 ? "Yes" : "No"}</td>
                <td>
                  <Button
                    onClick={() => handleShow(item)}
                    className="btn btn-primary me-2"
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
              <td colSpan="5" className="text-center">
                No data available
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
                value={currentFormData.name}
                onChange={handleFormChange}
                required
              />
            </Col>
            <Col>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Age"
                name="age"
                value={currentFormData.age}
                onChange={handleFormChange}
                min={0}
                max={120}
                required
              />
            </Col>
            <Col className="d-flex align-items-center justify-content-end pe-4">
              <input
                type="checkbox"
                name="isActive"
                checked={currentFormData.isActive === 1}
                onChange={handleFormChange}
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
            disabled={!isFormValid()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Employee;
