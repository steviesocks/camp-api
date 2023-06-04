import axios from "axios";
import express from "express";
import "dotenv/config";
import cors from "cors";
import { ApiRequests, AvailabilityResponse } from "./types";
import twilio from "twilio";

const app = express();
app.use(cors());

const accountSid = "AC5c48c7f840859ad42c7910a11f1dd877";
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  QueryDocumentSnapshot,
  orderBy,
  limit,
} from "firebase/firestore/lite";


// Initialize Firestore through Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "campsite-che.firebaseapp.com",
  projectId: "campsite-che",
  storageBucket: "campsite-che.appspot.com",
  messagingSenderId: "8110544532",
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const converter = {
  toFirestore: (data: ApiRequests) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as ApiRequests,
};

app.all("/", (req, res) => {
  // console.log("Just got a request!")
  res.send("Yooo!");
});

app.get("/cron", async (req, res) => {
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

      const hasAvail = Object.entries(availability).filter((date) => date[1].remaining > 0);

      if (hasAvail.length) {
        const message = `Hey! Stony Indian Lake has availability: ${hasAvail
          .map((date) => date[0] + ": " + date[1].remaining + " remaining sites")
          .join(", ")}`;

        twilioClient.messages
          .create({ body: message, from: "+18668414666", to: "+17163615473" })
          .then((msg) => console.log(msg.sid));
      }
    }
    return res.status(200).send({ dateTime: Date.now(), filteredDates });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

app.get("/requests", async (req, res) => {
  const requestsCol = query(collection(db, "requests").withConverter(converter), orderBy("dateTime", "desc"), limit(100));
  const docs = await getDocs<ApiRequests>(requestsCol);
  const response: ApiRequests[] = [];

  docs.forEach((doc) => response.push(doc.data()));

  return res.status(200).send(response);
});

console.log("RUN!");

app.listen(process.env.PORT || 3000);
