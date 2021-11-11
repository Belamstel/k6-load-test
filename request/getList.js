import { check, sleep, group } from "k6";
import http from "k6/http";
import { bodyDataList } from "./data.js";


export function prescriptionList(baseUrl) {
    group('Get PrescriptionList', function () {
        const prescription_list = http.post(baseUrl + '/prescription/list',
            bodyDataList, {
                headers: {'Content-Type': 'application/jose'}
            });
        let bodyPrescriptionList = prescription_list.body;
        //console.log(bodyPrescription);
        check(prescription_list, {
            'http response prescription_list status code is 200': r => r.status === 200,
        });
        if (prescription_list.status !==200){console.log('!!!ALARM WARNING УВАГА :   '+bodyPrescriptionList+ '' +
            '       !!!RESPONSE STATUS:  ' +prescription_list.status);}

        const prescription_short_list = http.post(baseUrl + '/prescription/short/list',
            bodyDataList, {
                headers: {'Content-Type': 'application/jose'}
            });
        let bodyPrescriptionShortList = prescription_short_list.body;
        //console.log(bodyPrescriptionShortList);
        check(prescription_short_list, {
            'http response prescription_short_list status code is 200': r => r.status === 200,
        });
        if (prescription_short_list.status !==200){console.log('!!!ALARM WARNING УВАГА :   '+bodyPrescriptionShortList+ '' +
            '      !!!RESPONSE STATUS:  ' +prescription_short_list.status);}
        sleep(0.5);
    });
}