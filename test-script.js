
import { release } from "./request/release.js";
import { prescription } from "./request/prescription.js";
import { prescriptionList } from "./request/getList.js";
import { scenario } from "./scenario.js";


const baseUrl = 'http://192.168.7.238/dev/erp/erpApi';
//const baseUrl = 'http://192.168.7.44:56749/demo/erp/erpApi';

export const options = scenario;

export default function () {

    prescription(baseUrl);
    prescriptionList(baseUrl)
    release(baseUrl);
}