import { Container, Grid, Row, Text } from "@nextui-org/react";
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

  console.log("DATa", data[0]?.availability["2023-08-11"]);

  return (
    <Container fluid className="h-screen bg-slate-500 m-0 " display="flex" justify="center" alignItems="center">
      <div className="max-w-[600px] min-w-[400px] mt-40">
        <Grid.Container>
          <Grid xs={6}>
            <Text color="white" weight="bold">
              DateTime
            </Text>
          </Grid>
          <Grid xs={3} justify="center">
            <Text color="white" weight="bold">
              8/11/23
            </Text>
          </Grid>
          <Grid xs={3} justify="center">
            <Text color="white" weight="bold">
              8/12/23
            </Text>
          </Grid>
        </Grid.Container>
        <div className="max-h-[400px] overflow-y-auto bg-slate-50">
          <Grid.Container gap={2}>
            {data.map((req) => (
              <React.Fragment key={req.dateTime}>
                <Grid xs={6} className="p-2" justify="space-between">
                  <Text className="">{new Date(req.dateTime).toLocaleString()}</Text>
                </Grid>
                <Grid xs={3} justify="center">
                  {req.availability["2023-08-11"].remaining}
                </Grid>
                <Grid xs={3} justify="center">
                  {req.availability["2023-08-12"].remaining}
                </Grid>
              </React.Fragment>
            ))}
          </Grid.Container>
        </div>
      </div>
    </Container>
  );
}

export default App;
