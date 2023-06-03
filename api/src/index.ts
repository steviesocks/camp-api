import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import express from "express";
import cors from "cors";
import { ApiRequests, AvailabilityResponse } from "./types";
const app = express();
app.use(cors());

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, getDoc, addDoc, QuerySnapshot, QueryDocumentSnapshot } from "firebase/firestore/lite";

// Initialize Firestore through Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHn5Hc3YSyFDPIkJAuagznlOY_T-5936w",
  authDomain: "campsite-che.firebaseapp.com",
  projectId: "campsite-che",
  storageBucket: "campsite-che.appspot.com",
  messagingSenderId: "8110544532",
  appId: "1:8110544532:web:c8f811b42d0c7c160f4681",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const converter = {
  toFirestore: (data: ApiRequests) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as ApiRequests
}

app.all("/", (req, res) => {
  // console.log("Just got a request!")
  res.send("Yo!");
});

app.get("/chron", async (req, res) => {
  try {
    const response = await axios.get<AvailabilityResponse>(
      "https://www.recreation.gov/api/permititinerary/4675321/division/4675321007/availability/month?month=8&year=2023"
    );

    const filteredDates = Object.entries(response.data.payload.quota_type_maps.ConstantQuotaUsageDaily).filter((entry) =>
      ["2023-08-11", "2023-08-12"].includes(entry[0])
    );
    if (filteredDates.length) {
      const availability: { [date: string]: { total: number; remaining: number } } = {};
      filteredDates.forEach((date) => {
        availability[date[0]] = { total: date[1].total, remaining: date[1].remaining };
      });

      const requests = collection(db, "requests");
      await addDoc(requests, { dateTime: Date.now(), availability });
    }
  } catch (error) {
    console.error(error);
  }
})

app.get("/requests", async (req, res) => {
  const requestsCol = collection(db, "requests").withConverter(converter);;
  const docs = await getDocs<ApiRequests>(requestsCol);
  const response: ApiRequests[] = [];

  docs.forEach(doc => response.push(doc.data()))
  
  console.log("REQUESTS", response)
  return res.status(200).send(response)
})
// app.get('/recareas', async (req, res) => {
//     try {
//         const r = await axios.get("https://ridb.recreation.gov/api/v1/recareas?query=glacier%20national%20park", {
//           headers: {
//             apikey: "0247a97d-3793-409b-9fad-bde619422120",
//             Accept: "application/json"
//           }
//         })
//         if (r.status === 200) {
//           return res.status(200).send(r.data)
//         }
//         return res.status(500).send("request error")
//     } catch (e) {
//       if (e instanceof AxiosError) {
//         //  console.log(e.request)
//          return res.status(e.status).send(e.message)
//       }
//      return res.status(500).send("server error")
//     }
// })
app.listen(process.env.PORT || 3000);
