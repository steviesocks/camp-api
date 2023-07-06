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
import { getFirestore, collection, getDocs, addDoc, query, QueryDocumentSnapshot, orderBy, limit } from "firebase/firestore/lite";

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
  console.log("CRON!");
  const response: {
    [key: string]: {
      dateTime: number;
      filteredDates: [
        string,
        {
          total: number;
          remaining: number;
          show_walkup: boolean;
          is_hidden: boolean;
          season_type: string;
        }
      ][];
    };
  } = {};
  try {
    // STONEY INDIAN
    try {
      const STO = await axios.get<AvailabilityResponse>(
        "https://www.recreation.gov/api/permititinerary/4675321/division/4675321007/availability/month?month=8&year=2023"
      );

      const filteredDates = Object.entries(STO.data.payload.quota_type_maps.ConstantQuotaUsageDaily).filter((entry) =>
        ["2023-08-11", "2023-08-12"].includes(entry[0])
      );
      if (filteredDates.length) {
        const availability: { [date: string]: { total: number; remaining: number } } = {};
        filteredDates.forEach((date) => {
          availability[date[0]] = { total: date[1].total, remaining: date[1].remaining };
        });

        const requests = collection(db, "STO");
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
      response.STO = { dateTime: Date.now(), filteredDates };
    } catch (error) {
      console.log("STO error", error);
    }

    // ELF REQUEST
    try {
      const ELF = await axios.get<AvailabilityResponse>(
        "https://www.recreation.gov/api/permititinerary/4675321/division/4675321020/availability/month?month=8&year=2023"
      );

      const filteredDates = Object.entries(ELF.data.payload.quota_type_maps.ConstantQuotaUsageDaily).filter((entry) =>
        ["2023-08-09", "2023-08-10"].includes(entry[0])
      );
      if (filteredDates.length) {
        const availability: { [date: string]: { total: number; remaining: number } } = {};
        filteredDates.forEach((date) => {
          availability[date[0]] = { total: date[1].total, remaining: date[1].remaining };
        });

        const requests = collection(db, "ELF");
        await addDoc(requests, { dateTime: Date.now(), availability });

        const hasAvail = Object.entries(availability).filter((date) => date[1].remaining > 0);

        if (hasAvail.length) {
          const message = `Hey! Elizabeth Lake Foot has availability: ${hasAvail
            .map((date) => date[0] + ": " + date[1].remaining + " remaining sites")
            .join(", ")}`;

          twilioClient.messages
            .create({ body: message, from: "+18668414666", to: "+17163615473" })
            .then((msg) => console.log(msg.sid));
        }
      }
      response.ELF = { dateTime: Date.now(), filteredDates };
    } catch (error) {
      console.log("ELF error", error);
    }

    // ELH REQUEST
    try {
      const ELH = await axios.get<AvailabilityResponse>(
        "https://www.recreation.gov/api/permititinerary/4675321/division/4675321021/availability/month?month=8&year=2023"
      );

      const filteredDates = Object.entries(ELH.data.payload.quota_type_maps.ConstantQuotaUsageDaily).filter((entry) =>
        ["2023-08-09", "2023-08-10"].includes(entry[0])
      );
      if (filteredDates.length) {
        const availability: { [date: string]: { total: number; remaining: number } } = {};
        filteredDates.forEach((date) => {
          availability[date[0]] = { total: date[1].total, remaining: date[1].remaining };
        });

        const requests = collection(db, "ELH");
        await addDoc(requests, { dateTime: Date.now(), availability });

        const hasAvail = Object.entries(availability).filter((date) => date[1].remaining > 0);

        if (hasAvail.length) {
          const message = `Hey! Elizabeth Lake Head has availability: ${hasAvail
            .map((date) => date[0] + ": " + date[1].remaining + " remaining sites")
            .join(", ")}`;

          // twilioClient.messages
          //   .create({ body: message, from: "+18668414666", to: "+17163615473" })
          //   .then((msg) => console.log(msg.sid));
        }
      }
      response.ELH = { dateTime: Date.now(), filteredDates };
    } catch (error) {
      console.log("ELH error", error);
    }

    // GAB REQUEST
    try {
      const GAB = await axios.get<AvailabilityResponse>(
        "https://www.recreation.gov/api/permititinerary/4675321/division/4675321022/availability/month?month=8&year=2023"
      );

      const filteredDates = Object.entries(GAB.data.payload.quota_type_maps.ConstantQuotaUsageDaily).filter((entry) =>
        ["2023-08-09"].includes(entry[0])
      );
      if (filteredDates.length) {
        const availability: { [date: string]: { total: number; remaining: number } } = {};
        filteredDates.forEach((date) => {
          availability[date[0]] = { total: date[1].total, remaining: date[1].remaining };
        });

        const requests = collection(db, "GAB");
        await addDoc(requests, { dateTime: Date.now(), availability });

        const hasAvail = Object.entries(availability).filter((date) => date[1].remaining > 0);

        if (hasAvail.length) {
          const message = `Hey! Gable Creek has availability: ${hasAvail
            .map((date) => date[0] + ": " + date[1].remaining + " remaining sites")
            .join(", ")}`;

          // twilioClient.messages
          //   .create({ body: message, from: "+18668414666", to: "+17163615473" })
          //   .then((msg) => console.log(msg.sid));
        }
      }
      response.GAB = { dateTime: Date.now(), filteredDates };
    } catch (error) {
      console.log("GAB error", error);
    }

    console.log("CRON RESP", response);

    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

app.get("/requests", async (req, res) => {
  try {
    const STOCol = query(collection(db, "STO").withConverter(converter), orderBy("dateTime", "desc"), limit(100));
    const STOdocs = await getDocs<ApiRequests>(STOCol);

    const ELFCol = query(collection(db, "ELF").withConverter(converter), orderBy("dateTime", "desc"), limit(100));
    const ELFdocs = await getDocs<ApiRequests>(ELFCol);

    const ELHCol = query(collection(db, "ELH").withConverter(converter), orderBy("dateTime", "desc"), limit(100));
    const ELHdocs = await getDocs<ApiRequests>(ELHCol);

    const GABCol = query(collection(db, "GAB").withConverter(converter), orderBy("dateTime", "desc"), limit(100));
    const GABdocs = await getDocs<ApiRequests>(GABCol);

    const response: { [key: string]: ApiRequests[] } = { STO: [], ELF: [], ELH: [], GAB: [] };

    STOdocs.forEach((doc) => response.STO.push(doc.data()));
    ELFdocs.forEach((doc) => response.ELF.push(doc.data()));
    ELHdocs.forEach((doc) => response.ELH.push(doc.data()));
    GABdocs.forEach((doc) => response.GAB.push(doc.data()));
    console.log("/requests response", response);
    return res.status(200).send(response);
  } catch (error) {
    console.log("/REQUESTS error:", error);
  }
});

console.log("RUN!");

app.listen(process.env.PORT || 3000);
