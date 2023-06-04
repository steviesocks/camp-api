import { Container, Row, Table, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ApiRequests } from "./types";

function App() {
  const [data, setData] = useState<ApiRequests[]>([]);

  const getRequests = useCallback(async () => {
    try {
      const resp = await axios.get<ApiRequests[]>("http://localhost:3000/requests");
      const sortedData = resp.data.sort((a, b) => b.dateTime - a.dateTime);
      setData(sortedData);
    } catch (error) {
      console.log("OOPS", error);
    }
  }, []);

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  console.log("DATa", data[0].availability["2023-08-11"])

  return (
    <Container fluid className="h-screen bg-slate-500 m-0 " display="flex" justify="center" alignItems="center">
      <div className="max-w-[600px] min-w-[400px] mt-40">
        <Row className="w-full" justify="space-between">
          <Text color="white" weight="bold">
            DateTime
          </Text>
          <Row fluid={false} justify="space-between" className="w-auto space-x-6">
            <Text color="white" weight="bold">
            08/11/2023
          </Text>
          <Text color="white" weight="bold">
            08/12/2023
          </Text>
          </Row>
          
        </Row>
        <div className="max-h-[400px] overflow-y-auto bg-slate-50">
          {data.map((req) => (
            <Row key={req.dateTime} className="w-full p-2" justify="space-between">
              <Text className="grow-[2]">{(new Date(req.dateTime)).toLocaleString()}</Text>
              <Row fluid={false} justify="space-between" className="grow-2"><Text className="grow">{req.availability["2023-08-11"]?.remaining}</Text><Text>{req.availability["2023-08-12"]?.remaining}</Text></Row>
              
            </Row>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default App;
