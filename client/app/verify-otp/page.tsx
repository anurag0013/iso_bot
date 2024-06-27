"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import instance from "../config";
import Swal from "sweetalert2";
import UsernameContext from "../context/userNameContext";

var jwt = require("jsonwebtoken");

const OTPVerificationForm = () => {
  const router = useRouter();
  const [access_token, setAccess_token] = useState("");
	useEffect(() => {
  const access_token = localStorage.getItem("access-token");
  setAccess_token(access_token || "");
	}, []);
  const [otpDetails, setOTPDetails] = useState({
    otp: "",
  });

  const handleChange = (event: any) => {
    setOTPDetails({
      ...otpDetails,
      [event.target.name]: event.target.value,
    });
  };
  const verifyOTP = async () => {
    try {
      const response = await instance.post(
        "/api/v1/verify-otp",
        {
          otp: otpDetails.otp,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      if (response?.data[0].error) {
        Swal.fire({
          text: response?.data[0].msg,
          icon: "error",
        });
      } else {
        window.localStorage.removeItem("isVerified");
        window.localStorage.setItem(
          "access-token",
          response?.data[0].access_token
        );
        router.push("/chat");
      }
    } catch (error: any) {
      throw new Error(
        error || "Failed to authenticate. Please try again later"
      );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform login/authentication logic here
    verifyOTP();
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
            src="/images/NAASA.jpg"
            width="300"
            height="300"
            alt="Logo of NAASA Securities"
          />
        </Box>
        <Box sx={{ textAlign: "center", fontWeight: "Regular" }}>
          <Typography variant="h4">Welcome to NAASA Securities.</Typography>
        </Box>
        <Box>
          <Typography variant="h6">
            {" "}
            A Chat System for NAASA Securities.
          </Typography>
        </Box>
        <Box>
          <Typography mt={2}>
            An OTP has been sent to your email. Please enter the OTP below.
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextField
              required
              id="otp"
              label="OTP"
              name="otp"
              variant="filled"
              margin="normal"
              onChange={handleChange}
            />
          </Box>
          <Box mt={2} ml={4}>
            <Button type="submit" variant="outlined">
              Verify Account
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default OTPVerificationForm;
