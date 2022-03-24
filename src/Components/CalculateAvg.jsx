import { Button } from "@chakra-ui/button";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import UploadedFiles from "./UploadedFiles";

const CalculateAvg = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [prices, setPrices] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileUploadRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) navigate("/login");
        const { accessToken } = JSON.parse(userInfo);
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
        setIsUploading(false);
        if (error.response.status === 401 || error.response.status === 422) {
          navigate("/login");
        }
      }
    };
    fetchFiles();
  }, [navigate]);

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
      const { accessToken } = JSON.parse(localStorage.getItem("userInfo"));
      setIsUploading(true);
      const { data } = await axios.post("/api/calc", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsUploading(false);
      setPrices((prev) => [data, ...prev]);
      setFileName("");
      setFile("");
      fileUploadRef.current.value = "";
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 422) {
        navigate("/login");
      }
    }
  };
  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100vh"
      >
        <VStack bgColor="white" height="100%" w="80%" p={10} pt={5}>
          <Navbar />
          <VStack w="100%" boxShadow="xs" p={8} spacing={8} rounded="md">
            <Text textAlign="left" size="xl">
              Please upload the stock prices as a json file to calculate Sum &
              Average. &nbsp;
              <Link
                color="teal"
                fontWeight="bold"
                href="/stock_prices.json"
                download
              >
                Download Sample Format
              </Link>
            </Text>
            <Flex width="100%" justifyContent="center">
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Flex alignItems="center" mr="50px">
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
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isUploading}
                  isDisabled={!file ? true : false}
                >
                  Upload
                </Button>
              </form>
            </Flex>
          </VStack>
          <Box boxShadow="xs" rounded="md" p={8} minW="100%">
            <Text textAlign="left" fontSize="xl" fontWeight="500" mb={4}>
              Previously uploaded files:
            </Text>
            {prices.length ? (
              <UploadedFiles prices={prices} />
            ) : (
              <Text color="gray.500" fontSize="2xl">
                No Results Found.
              </Text>
            )}
          </Box>
        </VStack>
      </Flex>
    </>
  );
};

export default CalculateAvg;
