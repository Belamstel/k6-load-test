import { check, sleep } from "k6";
import http from "k6/http";
import { group } from 'k6';
import { bodyReleaseToSign } from "./data.js";

export function release(baseUrl) {
    group('register release', function () {
        const SignToJwsRelease = http.post('http://109.95.224.42:8082/SignService3/api/crypto/Jws?numCert=01d70ab697b5d2000000001600050001',
            JSON.stringify(bodyReleaseToSign), {
                headers: {'Content-Type': 'application/json'}
            });
        check(SignToJwsRelease, {
            'http response SignToJwsRelease status code is 200': r => r.status === 200,
        });
        let bodySignToJwsRelease = JSON.parse(SignToJwsRelease.body);
        let bodySignRelease =  bodySignToJwsRelease['data'];
        if (SignToJwsRelease.status !==200){console.log('!!!ALARM WARNING УВАГА :   '+bodySignToJwsRelease['message']+ '' +
            '       !!!RESPONSE STATUS:  ' +bodySignToJwsRelease.status);}
        //console.log(JSON.stringify(bodySignToJwsRelease));
        //console.log(JSON.stringify(bodySignRelease));

        const registerRelease = http.post(baseUrl+'/release',
            bodySignRelease, {
                headers: {'Content-Type': 'application/jose'}
            });
        let bodyRelease = registerRelease.body;
        //console.log(bodyRelease);
        check(registerRelease, {
            'http response registerRelease status code is 200': r => r.status === 200,
        });
        if (registerRelease.status !==200){console.log('!!!ALARM WARNING УВАГА :   '+bodyRelease+ '' +
            '       !!!RESPONSE STATUS:  ' +registerRelease.status);}
        sleep(1);
    });
}