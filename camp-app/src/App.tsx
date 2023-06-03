import { Container, Row, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ApiRequests } from "./types";

function App() {
  const [data, setData] = useState<ApiRequests[]>([])  

  const getRequests = useCallback(async () => {
    try {
      const resp = await axios.get<ApiRequests[]>("http://localhost:3000/requests")
      const sortedData = resp.data.sort((a,b) => b.dateTime - a.dateTime)
      setData(sortedData)
    } catch (error) {
      console.log("OOPS", error)
    }
  }, [])

  useEffect(() => {
    getRequests()
  }, [getRequests])

  return (
    <Container fluid className="h-screen bg-slate-500 m-0 " display="flex" justify="center" alignItems="center">
      {data.map(req => (<Row><Text>{req.dateTime}</Text><Text>Remaining:</Text></Row>))}
    </Container>
  );
}

export default App;
