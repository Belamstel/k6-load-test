import { check, sleep, group } from "k6";
import http from "k6/http";



const bodyData = 'eyJhbGciOiJHT1NUMzQxMC0yMDEyLTI1NiIsIng1YyI6Ik1JSUVJRENDQTh1Z0F3SUJBZ0lRQWRjcDdXWXFYOEFBQUFBV0FBVUFBVEFNQmdncWhRTUhBUUVEQWdVQU1JSHFNU013SVFZRFZRUU1EQnJRa05DMDBMelF1TkM5MExqUmdkR0MwWURRc05HQzBMN1JnREZFTUVJR0ExVUVDd3c3MEtQUXROQyswWUhSZ3RDKzBMTFF0ZEdBMFkvUmp0R0owTGpRdVNEUXVDRFF1dEM3MFk3Umg5QzEwTExRdnRDNUlOR0cwTFhRdmRHQzBZQXhMekF0QmdOVkJBb01KdENpMExYUmdkR0MwTDdRc3RHTDBMa2cwS1BRcGlEUW1OQzkwWVRRdnRDaTBMWFFtdENoTVV3d1NnWURWUVFEREVQUWtOQzAwTHpRdU5DOTBMalJnZEdDMFlEUXNOR0MwTDdSZ0NEUW90QzEwWUhSZ3RDKzBMTFF2dEN6MEw0ZzBLUFFwaURRbU5DOTBZVFF2dENpMExYUW10Q2hNQjRYRFRJeE1EUXdOVEEzTWprd01Gb1hEVEl4TVRJeE5ESXdOVGsxT1Zvd2dhRXhDekFKQmdOVkJBWVRBbEpWTVNnd0pnWURWUVFxREIvUWxOQzgwTGpSZ3RHQTBMalF1U0RRbnRDNzBMWFFzOUMrMExMUXVOR0hNUjB3R3dZRFZRUUVEQlRRbjlDKzBMM1F2dEM4MExEUmdOR0gwWVBRdWpFWU1CWUdCU3FGQTJRQkVnMHhNREl6TVRBeE16TTVNRE13TVM4d0xRWURWUVFERENiUXFOQzEwTEhRdGRDNjBMalF2ZEdCMExyUXNOR1BJTkNtMEtEUWtTRFFvdEMxMFlIUmdqQm1NQjhHQ0NxRkF3Y0JBUUVCTUJNR0J5cUZBd0lDSXdFR0NDcUZBd2NCQVFJQ0EwTUFCRUR3a0lJZGhubzBWaHBnS083c1hzZFplejVzcm1ycERjQnd4b1hwNzZmT3pDMGwrTHFOTEJOSHZwV2xKU1d0cEsrN1orYmRNM1QxTGtDUW9FWW0zRnRCZ1FrQU1EQXdOVEF3TURHamdnRitNSUlCZWpBT0JnTlZIUThCQWY4RUJBTUNCUEF3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdJR0NDc0dBUVVGQndNRU1CMEdBMVVkRGdRV0JCUVVTTTNUSkU2NW1Qa3FpMjVrQ09UV2pqSzVwekNDQVNnR0ExVWRJd1NDQVI4d2dnRWJnQlNSRWFaeUU5RmtUc1gwNEF0anJieUZnTGswZktHQjhLU0I3VENCNmpFak1DRUdBMVVFREF3YTBKRFF0TkM4MExqUXZkQzQwWUhSZ3RHQTBMRFJndEMrMFlBeFJEQkNCZ05WQkFzTU85Q2owTFRRdnRHQjBZTFF2dEN5MExYUmdOR1AwWTdSaWRDNDBMa2cwTGdnMExyUXU5R08wWWZRdGRDeTBMN1F1U0RSaHRDMTBMM1JndEdBTVM4d0xRWURWUVFLRENiUW90QzEwWUhSZ3RDKzBMTFJpOUM1SU5DajBLWWcwSmpRdmRHRTBMN1FvdEMxMEpyUW9URk1NRW9HQTFVRUF3eEQwSkRRdE5DODBMalF2ZEM0MFlIUmd0R0EwTERSZ3RDKzBZQWcwS0xRdGRHQjBZTFF2dEN5MEw3UXM5QytJTkNqMEtZZzBKalF2ZEdFMEw3UW90QzEwSnJRb1lJUUFkYlNFNW9FYUVBQUFBQVVBQVVBQVRBTUJnZ3FoUU1IQVFFREFnVUFBMEVBU3phc1hBM2FtaDhxOUdWOVowSmFBN01UZFhmdzZHZFh0OURhcms0disrVnVsL3g5Y1h0WUNBUUNsWGUyY29HaWMvZEQxeFZKRjM1UVhXWDh0dmdqTWc9PSIsIng1dCI6IkNEQkI4OTc4NkM0MkZFNkYyOUY0NDAwRjYwNEJDMzY3M0RDRUEwQUMifQ.ew0KICJVaWQiOiAiMjc1YmIzM2MtMzIwNy1lYzExLWE5ZGQtMTIxYTY0OGNkZGI0Ig0KfSA.rNZVCk6vVaElhST1o-G6e4fRcetKXup_OxrfSLcfuYDv6pxgoqLY1_hJzhqg5Vrkzqtl3pnG-SUyzc6emhI1gw';

export function prescriptionList(baseUrl) {
    group('Get PrescriptionList', function () {
        const prescription_list = http.post(baseUrl + '/prescription/list',
            bodyData, {
                headers: {'Content-Type': 'application/jose'}
            });
        let bodyPrescriptionList = prescription_list.body;
        //console.log(bodyPrescription);
        check(prescription_list, {
            'http response prescription_list status code is 200': r => r.status === 200,
        });
        if (prescription_list.status !=200){console.log('!!!ALARM WARNING УВАГА :   '+bodyPrescriptionList+ '' +
            '       !!!RESPONSE STATUS:  ' +prescription_list.status);}

        const prescription_short_list = http.post(baseUrl + '/prescription/short/list',
            bodyData, {
                headers: {'Content-Type': 'application/jose'}
            });
        let bodyPrescriptionShortList = prescription_short_list.body;
        //console.log(bodyPrescriptionShortList);
        check(prescription_short_list, {
            'http response prescription_short_list status code is 200': r => r.status === 200,
        });
        if (prescription_short_list.status !=200){console.log('!!!ALARM WARNING УВАГА :   '+bodyPrescriptionShortList+ '' +
            '      !!!RESPONSE STATUS:  ' +prescription_short_list.status);}
        sleep(0.5);
    });
}