"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
var lite_1 = require("firebase/firestore/lite");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCHn5Hc3YSyFDPIkJAuagznlOY_T-5936w",
//   authDomain: "campsite-che.firebaseapp.com",
//   projectId: "campsite-che",
//   storageBucket: "campsite-che.appspot.com",
//   messagingSenderId: "8110544532",
//   appId: "1:8110544532:web:c8f811b42d0c7c160f4681"
// };
// Initialize Firebase
// Initialize Firestore through Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCHn5Hc3YSyFDPIkJAuagznlOY_T-5936w",
    authDomain: "campsite-che.firebaseapp.com",
    projectId: "campsite-che",
    storageBucket: "campsite-che.appspot.com",
    messagingSenderId: "8110544532",
    appId: "1:8110544532:web:c8f811b42d0c7c160f4681",
};
var firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, lite_1.getFirestore)(firebaseApp);
setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, filteredDates, availability_1, requests, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, axios_1.default.get("https://www.recreation.gov/api/permititinerary/4675321/division/4675321007/availability/month?month=8&year=2023")];
            case 1:
                response = _a.sent();
                filteredDates = Object.entries(response.data.payload.quota_type_maps.ConstantQuotaUsageDaily).filter(function (entry) {
                    return ["2023-08-11", "2023-08-12"].includes(entry[0]);
                });
                if (!filteredDates.length) return [3 /*break*/, 3];
                console.log("AVAILABILITY", filteredDates);
                availability_1 = {};
                filteredDates.forEach(function (date) {
                    availability_1[date[0]] = { total: date[1].total, remaining: date[1].remaining };
                });
                requests = (0, lite_1.collection)(db, "requests");
                return [4 /*yield*/, (0, lite_1.addDoc)(requests, { dateTime: Date.now(), availability: availability_1 })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); }, 60000);
// const RIDB_API_KEY = "0247a97d-3793-409b-9fad-bde619422120";
// interface RIDBRequestHeaders extends AxiosRequestHeaders {
//   'apikey': string;
// }
// scrape();
app.all("/", function (req, res) {
    // console.log("Just got a request!")
    res.send("Yo!");
});
app.get("/requests", function (req, res) {
    var requests = (0, lite_1.collection)(db, "requests");
    console.log("GET REQUESTS", requests);
});
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
