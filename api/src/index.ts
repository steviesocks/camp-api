import axios from "axios";
import express from "express";
import "dotenv/config";
import cors from "cors";
import { ApiRequests, AvailabilityResponse, Campsite, RequestsHistoryRepsonse } from "./types";
import twilio from "twilio";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, QueryDocumentSnapshot, orderBy, limit } from "firebase/firestore/lite";
import { PERMIT_ITINERARY, DATE_RANGE, FROM_PHONE, TO_PHONE, CAMPSITES } from "./constants";

const app = express();
app.use(cors());

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioClient = twilio(accountSid, authToken);

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

async function checkAvailability(site: Campsite) {
  const availResp = await axios.get<AvailabilityResponse>(
    `https://www.recreation.gov/api/permititinerary/${PERMIT_ITINERARY}/division/${site.division}/availability/${DATE_RANGE}`
  );
  const filteredDates = Object.entries(availResp.data.payload.quota_type_maps.QuotaUsageBySiteDaily).filter((entry) =>
    site.dates.includes(entry[0])
  );
  if (filteredDates.length) {
    const availability: { [date: string]: { total: number; remaining: number } } = {};
    filteredDates.forEach((date) => {
      availability[date[0]] = { total: date[1].total, remaining: date[1].remaining };
    });

    const requests = collection(db, site.shortName);
    await addDoc(requests, { dateTime: Date.now(), availability });

    const hasAvail = Object.entries(availability).filter((date) => date[1].remaining > 0);

    if (hasAvail.length) {
      const message = `Hey! ${site.name} has availability: ${hasAvail
        .map((date) => date[0] + ": " + date[1].remaining + " remaining sites")
        .join(", ")}`;

      twilioClient.messages.create({ body: message, from: FROM_PHONE, to: TO_PHONE }).then((msg) => console.log(msg.sid));
    }
  }
  return filteredDates;
}

app.get("/cron", async (req, res) => {
  const response: RequestsHistoryRepsonse = {};
  try {
    for (let site of CAMPSITES) {
      const filteredDates = await checkAvailability(site);
      response[site.shortName] = { dateTime: Date.now(), filteredDates };
    }

    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

async function getDocsForSite(shortName: string) {
  const col = query(collection(db, shortName).withConverter(converter), orderBy("dateTime", "desc"), limit(50));
  const docs = await getDocs<ApiRequests>(col);
  return docs;
}

app.get("/requests", async (req, res) => {
  try {
    const response: { [key: string]: ApiRequests[] } = {};

    for (let site of CAMPSITES) {
      response[site.shortName] = [];
      const docs = await getDocsForSite(site.shortName);
      docs.forEach((doc) => response[site.shortName].push(doc.data()));
    }
    console.log("/requests response", response);
    return res.status(200).send(response);
  } catch (error) {
    console.log("/requests error:", error);
  }
});

console.log("Listen!");

app.listen(process.env.PORT || 3000);
