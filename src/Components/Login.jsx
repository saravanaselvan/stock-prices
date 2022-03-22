import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Container, Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useState } from "react";
import stocksLogo from "../stocks.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/login", { email, password });
      localStorage.setItem("accessToken", JSON.stringify(data.access_token));
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container maxW="xl" display="flex" h="100%" alignItems="center">
      <Box
        bg="#fff"
        w="100%"
        p={16}
        borderRadius="lg"
        color="#000"
        borderWidth="1px"
        pt={8}
        boxShadow="dark-lg"
      >
        <VStack spacing="5px">
          <Image src={stocksLogo} w="55px" mb={6} />
          <HStack alignSelf="flex-start">
            <Text fontSize="2xl" color="#000" mb={6} fontWeight="semibold">
              Login to your account
            </Text>
          </HStack>
          <form onSubmit={submitHandler} style={{ width: "100%" }}>
            <FormControl id="email" isRequired mb={6}>
              <FormLabel mb={4} color="gray.600">
                Email
              </FormLabel>
              <Input
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired mb={6}>
              <FormLabel mb={4} color="gray.600">
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={hidePassword ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setHidePassword(!hidePassword)}
                  >
                    {hidePassword ? "Show" : "Hide"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}
              type="submit"
            >
              Login
            </Button>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
