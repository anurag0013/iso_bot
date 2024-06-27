"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRef, useEffect, useContext } from "react";
import UsernameContext from "@/app/context/userNameContext";

interface QuestionAnswer {
  question?: string;
  answer?: string;
}

interface ChatProps {
  chat: QuestionAnswer[] | null;
}

const Chat = (props: ChatProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { userName } = useContext(UsernameContext);

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props]);

  return (
    <>
      {props.chat?.map((elem, index) => (
        <React.Fragment key={index}>
          <Grid container spacing={{ md: 2 }} mb={4}>
            <Grid item xs={12} md={2}>
              <Box sx={{ width: 150 }}>
                <Chip avatar={<Avatar />} label={userName} />
              </Box>
            </Grid>
            <Grid item xs={12} md={10} display="flex" alignItems="center" pt={{ xs: 2 }}>
              <Typography variant="body1" fontSize={{ xs: 12, md: 14 }} ml={{ xs: 2 }}>
                {elem.question}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={{ md: 2 }} mb={4}>
            <Grid item xs={12} md={2}>
              <Box sx={{ width: 150 }}>
                <Chip label="ISO bot" />
              </Box>
            </Grid>
            <Grid item xs={12} md={10} display="flex" alignItems="center">
              <Typography variant="body1" fontSize={{ xs: 12, md: 14 }} ml={{ xs: 2 }} pt={{ xs: 2, md: 0 }}>
                {elem.answer === "" ? (
                  <Skeleton count={5} width={200} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: elem.answer || "" }} />
                )}
              </Typography>
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
      <div ref={bottomRef} />
    </>
  );
};

export default Chat;

