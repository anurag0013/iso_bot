"use client";
import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { Card, Button } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/navigation";
import instance from "../config";
import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import Chat from "./components/chat";
import Grid from "@mui/material/Grid";
import { Socket, io } from "socket.io-client";

var jwt = require("jsonwebtoken");

type ErrorMessage = {
  msg: String;
};

interface QueAns {
  question: string;
  answer: string;
}

const ChatPage = () => {
  const [query, setQuery] = useState("");
  const [isJwtExpired, setIsJwtExpired] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [text, setText] = useState<QueAns[]>([]);
  const textRef = useRef(text);
  const socketRef = useRef<Socket | null>(null);

  const router = useRouter();
  const [access_token, setAccess_token] = useState("");

  useEffect(() => {
    const access_token = localStorage.getItem("access-token");
    setAccess_token(access_token || "");
  }, []);

  useEffect(() => {
    // Update the reference whenever items changes
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    // create socket connection
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}`, {
      auth: {
        token: `Bearer ${localStorage.getItem("access-token")}`,
      },
    });
    console.log(socket)
    // reference the current socket connection
    socketRef.current = socket;
    // Listen for incoming answer
    if (socket) {
      socket.on("answer", (message) => {
        let conversationArray = [...textRef.current];
        conversationArray[conversationArray.length - 1].answer += message;
        setText(conversationArray);
      });
    }

    // Clean up the socket connection on unmount
    if (socket) {
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const redirectToLogin = (message?: string, icon?: SweetAlertIcon) => {
    if (localStorage.getItem("access-token")) {
      localStorage.removeItem("access-token");
    }
    Swal.fire({
      text: message ?? "Your daily usage has expired!",
      icon: icon ?? "info",
      confirmButtonText: "Okay",
    }).then(() => {
      router.push("/");
    });
  };

  const getJwtExpiryTime = () => {
    let decodedToken = jwt.decode(access_token, { complete: true });
    let expiryTime: number = Number(decodedToken?.payload.exp + "000");

    return expiryTime;
  };

  useEffect(() => {
    // check if jwt has expired
    if (access_token === null) {
      redirectToLogin("Access Denied", "error");
    } else {
      let expiryTime = getJwtExpiryTime();
      let dateNow = new Date();
      if (expiryTime < dateNow.getTime()) {
        redirectToLogin();
      }
    }
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsSubmitClicked(true);
    setText((prevText) => [...prevText, { question: query, answer: "" }]);
    // mutate(query);
    if (socketRef.current) {
      socketRef.current.emit("question", query);
    }
    setQuery("");
  };

  //function to send query when enter is pressed
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleLogout = (event: any) => {
    localStorage.removeItem("access-token");
    router.push("/");
  };

  return (
    <>
      <Box sx={{ paddingLeft: "3em", paddingRight: "3em", marginTop: "3em" }}>
        <Box
          sx={{
            display: "flex",
            height: "93vh",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box sx={{ minHeight: "80%" }}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              <Grid item xs={8}>
                <Image
                  src="/images/iso-9001.avif"
                  width="160"
                  height="160"
                  alt="Logo of ISO-9001"
                />
              </Grid>
              <Grid item xs={3}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    color="error"
                    variant="contained"
                    sx={{ mt: 6, ml: 2 }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Card sx={{ width: "80vw", height: "60vh", overflowY: "auto" }}>
                {" "}
                {/*changed the syntax from minwidth to width.*/}
                <CardContent>
                  <Chat chat={text}></Chat>
                </CardContent>
              </Card>
            </Box>
          </Box>
          <Box width={{ xs: "80vw", md: "60vw" }}>
            <Grid container spacing={{ sx: 2, md: 4 }}>
              <Grid item xs={8} md={10}>
                <TextField
                  id="Query"
                  name="query"
                  variant="filled"
                  multiline
                  maxRows={2}
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    disableUnderline: true,
                  }}
                  fullWidth
                  placeholder={"Enter Your Questions Here.."}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <Button
                  variant="contained"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChatPage;
