import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Text, VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import UploadedFiles from "./UploadedFiles";

const CalculateAvg = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [prices, setPrices] = useState([]);
  const fileUploadRef = useRef();
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      if (accessToken) {
        const { data } = await axios.get("/api/uploaded_stocks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPrices(data.prices);
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const jsonUploadHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFileName(pickedFile.name);
      setFile(pickedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append("file", file);
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      const response = await axios.post("/api/calc", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchFiles();
      setFileName("");
      setFile("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Flex alignItems="center" justifyContent="center" h="100vh">
      <VStack bgColor="white" height="100%" w="80%" p={10}>
        <VStack w="100%">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              alignItems: "center",
            }}
          >
            <Flex alignItems="center">
              <input
                type="file"
                accept="application/json"
                onChange={jsonUploadHandler}
                id="jsonUploadButton"
                style={{ display: "none" }}
                ref={fileUploadRef}
              />
              <Button
                type="button"
                onClick={() => fileUploadRef.current.click()}
              >
                Browse
              </Button>
              <Text ml={4}>{fileName || "No file chosen"}</Text>
            </Flex>
            <Button type="submit" colorScheme="blue">
              Upload
            </Button>
          </form>
          <UploadedFiles prices={prices} />
        </VStack>
      </VStack>
    </Flex>
  );
};

export default CalculateAvg;
