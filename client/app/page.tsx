"use client";
import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import instance from "./config";
import Swal from "sweetalert2";
import UsernameContext from "./context/userNameContext";

var jwt = require("jsonwebtoken");

const LoginForm = () => {
  const router = useRouter();
  const [access_token, setAccess_token] = useState("");
  useEffect(() => {
    const access_token = localStorage.getItem("access-token");
    setAccess_token(access_token || "");
  }, []);
  const { setUserName } = useContext(UsernameContext);
  const [loginDetails, setLoginDetails] = useState({
    name: "",
    // email: "",
    // phone_number: "",
  });

  const handleChange = (event: any) => {
    setLoginDetails({
      ...loginDetails,
      [event.target.name]: event.target.value,
    });
  };
  const loginRegister = async () => {
    try {
      const response = await instance.post("/api/v1/auth", {
        // email: loginDetails.email,
        // phone_number: loginDetails.phone_number,
        name: loginDetails.name,
      });
      if (response?.data.error) {
        Swal.fire({
          text: response?.data.msg,
          icon: "error",
        });
      } else {
        window.localStorage.setItem(
          "access-token",
          response?.data.access_token
        );
        setUserName(loginDetails.name);

        router.push("/chat");
      }
    } catch (error: any) {
      throw new Error(
        error || "Failed to authenticate. Please try again later"
      );
    }
  };

  const getJwtExpiryTime = () => {
    let decodedToken = jwt.decode(access_token, { complete: true });
    let expiryTime: number = Number(decodedToken?.payload.exp + "000");

    return expiryTime;
  };

  useEffect(() => {
    if (access_token != null) {
      let expiryTime = getJwtExpiryTime();
      let dateNow = new Date();
      if (expiryTime > dateNow.getTime()) {
        router.push("/chat");
      }
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform login/authentication logic here
    loginRegister();
  };

  return (
    <div style={{ minHeight: "93vh", padding: "6em" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box>
          <Image
            src="/images/iso-9001.avif"
            width="300"
            height="300"
            alt="Logo of ISO-9001"
          />
        </Box>
        <Box sx={{ textAlign: "center", fontWeight: "Regular" }}>
          <Typography variant="h4">Welcome To ISO</Typography>
        </Box>
        <Box sx={{ textAlign: "center", fontWeight: "Regular" }}>
          <Typography variant="h6">
            {" "}
            An AI-assisted Chat System for ISO-9001.
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextField
              id="Name"
              label="Name"
              variant="filled"
              margin="normal"
              name="name"
              onChange={handleChange}
            />
          </Box>
          <Box mt={2} ml={8}>
            <Button type="submit" variant="outlined">
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default LoginForm;
