import React, { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;
    const file = e.target[4].files[0];
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName}_${date}`);
  
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
  
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
  
            await setDoc(doc(db, "userChats", res.user.uid), {});
            await setDoc(doc(db, "reminders", res.user.uid), {});
  
            setSuccessMessage("Account created successfully!");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } catch (err) {
            console.error(err);
            setError("Failed to create user profile.");
            setLoading(false);
          }
        });
      });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please try a different email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Failed to register. Please try again later.");
      }
      setLoading(false);
    }
  };
  

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Card className="shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Header className="text-center">
          <Card.Title className="mb-0">Create an Account</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="displayName">
              <Form.Label>Display Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" required />
            </Form.Group>
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert variant="success" className="text-center">
                {successMessage}
              </Alert>
            )}
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <p className="mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login here
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Register;
