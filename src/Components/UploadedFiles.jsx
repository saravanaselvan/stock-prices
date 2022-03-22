import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const UploadedFiles = ({ prices }) => {
  const downloadFile = (data, fileName) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  return (
    <Box overflowX="auto" maxWidth="900px">
      <Table variant="simple">
        <Thead>
          <Tr>
            {/* <Th>Created Date</Th> */}
            <Th>Input File</Th>
            <Th>Output File</Th>
            <Th>Begin / End Date</Th>
            {/* <Th>End Date</Th> */}
            <Th>Sum / Average</Th>
            {/* <Th>Average</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {prices.map((price) => (
            <Tr key={price.id}>
              {/* <Td>{price.created_at}</Td> */}
              <Td>{price.original_uploaded_file_name}</Td>
              <Td
                onClick={async () => {
                  const accessToken = JSON.parse(
                    localStorage.getItem("accessToken")
                  );
                  const { data } = await axios.get(
                    `/download_result/${price.id}`,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );
                  downloadFile(data, price.output_file_name);
                }}
              >
                <Text color="blue" cursor="pointer">
                  {price.output_file_name}
                </Text>
              </Td>
              <Td>
                {price.begin_date} / {price.end_date}
              </Td>
              {/* <Td></Td> */}
              <Td>
                {price.sum} / {price.average}
              </Td>
              {/* <Td>{price.average}</Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UploadedFiles;
