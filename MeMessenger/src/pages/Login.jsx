import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Card className="shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Header className="text-center">
          <Card.Title className="mb-0">Login to Your Account</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="name@example.com" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                required 
              />
            </Form.Group>
            {err && (
              <Alert variant="danger" className="text-center">
                Invalid email or password
              </Alert>
            )}
            <Button type="submit" variant="primary" className="w-100">
              Sign In
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <p className="mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary">
              Register here
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Login;