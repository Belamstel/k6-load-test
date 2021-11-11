import { check, sleep } from "k6";
import http from "k6/http";
import { group } from 'k6';

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
const bodyPrescriptionToSign = '{' +
    '\"uid\": \"'+guid()+'\",' +
    '\"prescribedMedicationGuid\": \"850ab421-3173-418c-bb5e-9da72f1cac86\",' +
    '\"series\": \"T1421\",' +
    '\"number\": \"1001953\",' +
    '\"dateCreate\": \"2021-09-02T16:01:11+04:00\",' +
    '\"dateEnd\": \"2021-09-25T12:31:39.097\",' +
    '\"isChronic\": false,' +
    '\"formType\": \"Frm1481U04\",' +
    '\"isPaper\": false,' +
    '\"patient\": {' +
    '\"localId\": \"2634673\",' +
    '\"surname\": \"Иванов\",' +
    '\"name\": \"Иван\",' +
    '\"patronymic\": \"Иванович\",' +
    '\"birthday\": \"2000-07-21\",' +
    '\"gender\": 0,' +
    '\"snils\": \"03181459436\",' +
    '\"mPhone\": \"89511514566\"' +
    '},' +
    '\"organization\": {' +
    '\"shortName\": \"Шебекинская ЦРБ Тест\",' +
    '\"fullName\": \"Шебекинская ЦРБ Тест\",' +
    '\"ogrn\": \"1023101339030\",' +
    '\"inn\": \"1023101339030\",' +
    '\"directorFullName\": \"Советкин Иван Петрович\",' +
    '\"directorPhone\": \"82722568956\",' +
    '\"oid\": \"1.2.643.5.1.13.13.12.2.31.2847\",' +
    '\"address\": \"БЕЛГОРОДСКАЯ ОБЛ., ЯКОВЛЕВСКИЙ Р-Н., СТРОИТЕЛЬ Г. ЛЕНИНА УЛ 19, КОРП. А, СТР. 1 КВ. 56\"' +
    '},' +
    '\"doctor\": {' +
    '\"localId\": \"275C57C6-662C-4935-A9B2-EB64AFE78537\",' +
    '\"birthDate\": \"1971-12-11\",' +
    '\"positionCode\": \"91\",' +
    '\"specialityCode\": \"30\",' +
    '\"departmentCode\": \"1.2.643.5.1.13.13.12.2.31.2834\",' +
    '\"surname\": \"Безкруглова\",' +
    '\"name\": \"Ирина\",' +
    '\"patronymic\": \"Константиновна\",' +
    '\"snils\": \"06950154572\",' +
    '\"phone\": null' +
    '},' +
    '\"chairman\": null,' +
    '\"medication\": {' +
    '\"prescriptionName\": \"Метформин, табл. пролонг., 750 мг\",' +
    '\"signa\": \"Принимать 1 шт перорально 1 раз в день в течение 1 дня\",' +
    '\"precondition\": null,' +
    '\"numberDose\": 1.0,' +
    '\"type\": 0,' +
    '\"smnnCode\": \"21.20.10.119-000001-1-00093-0000000000000\",' +
    '\"isTrn\": false,' +
    '\"latinPrescriptionName\": \"Metformini\",' +
    '\"latinDosageForm\": \"Tabl.\"' +
    '},' +
    '\"okatoCode\": \"14256\",' +
    '\"dispencePeriod\": null,' +
    '\"schemeUid\": \"a4ab7065-d478-4ec1-8c3e-8447c208789c\",' +
    '\"representativeSnils\": null,' +
    '\"representativeMPhone\": null,' +
    '\"mkbCode\": \"I09.2\",' +
    '\"tag\": null,' +
    '\"commissionDate\": null,' +
    '\"commissionNumber\": null,' +
    '\"softwareName\": \"MIS-API\",' +
    '\"state\": \"Registered\",' +
    '\"semdData\": {' +
    '\"localUid\": \"'+guid()+'\",' +
    '\"version\": 1,' +
    '\"number\": \"26810\",' +
    '\"departmentCode\": \"1.2.643.5.1.13.13.12.2.31.2847.0.112753\",' +
    '\"departmentName\": \"Диспансеризация взрослые\",' +
    '\"createDateTime\": \"2021-07-05T11:32:24.247\",' +
    '\"data\": \"PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPD94bWwtc3R5bGVzaGVldCB0eXBlPSJ0ZXh0L3hzbCIgaHJlZj0iRWxlY3Ryb25pY19wcmVzY3JpcHRpb24ueHNsIj8+CjxDbGluaWNhbERvY3VtZW50IHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhtbG5zOnhzZD0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOmZpYXM9InVybjpobDctcnU6ZmlhcyIgeG1sbnM6aWRlbnRpdHk9InVybjpobDctcnU6aWRlbnRpdHkiIG1vb2RDb2RlPSJFVk4iIHhzaTpzY2hlbWFMb2NhdGlvbj0idXJuOmhsNy1vcmc6djMgaHR0cDovL3RlY2gtaWVtay5lZ2lzei5yb3NtaW56ZHJhdi5ydS90ZWNoL2Rvd25sb2FkL2luZnJhc3RydWN0dXJlLzM3L0NEQS54c2QiIHhtbG5zPSJ1cm46aGw3LW9yZzp2MyI+CiA8cmVhbG1Db2RlIGNvZGU9IlJVIiAvPgogPHR5cGVJZCByb290PSIyLjE2Ljg0MC4xLjExMzg4My4xLjMiIGV4dGVuc2lvbj0iUE9DRF9IRDAwMDA0MCIgLz4KIDx0ZW1wbGF0ZUlkIHJvb3Q9IjEuMi42NDMuNS4xLjEzLjEzLjE0LjM3LjMiIC8+CiA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMTMuMTIuMi4zMS4yODQ3LjEwMC4xLjEuNTEiIGV4dGVuc2lvbj0iOWFiMDk0NmUtNTAwNi1lYzExLWE5ZmYtMDAxYTY0OGNkZGI0IiAvPgogPGNvZGUgY29kZT0iMzciIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuMTk1IiBjb2RlU3lzdGVtTmFtZT0i0JLQuNC00Ysg0LzQtdC00LjRhtC40L3RgdC60LjRhSDQtNC+0LrRg9C80LXQvdGC0L7QsiIgY29kZVN5c3RlbVZlcnNpb249IjQuMjEiIGRpc3BsYXlOYW1lPSLQm9GM0LPQvtGC0L3Ri9C5INGA0LXRhtC10L/RgiDQvdCwINC70LXQutCw0YDRgdGC0LLQtdC90L3Ri9C5INC/0YDQtdC/0LDRgNCw0YIsINC40LfQtNC10LvQuNC1INC80LXQtNC40YbQuNC90YHQutC+0LPQviDQvdCw0LfQvdCw0YfQtdC90LjRjyDQuCDRgdC/0LXRhtC40LDQu9C40LfQuNGA0L7QstCw0L3QvdGL0Lkg0L/RgNC+0LTRg9C60YIg0LvQtdGH0LXQsdC90L7Qs9C+INC/0LjRgtCw0L3QuNGPIiAvPgogPHRpdGxlPtCb0YzQs9C+0YLQvdGL0Lkg0YDQtdGG0LXQv9GCINC90LAg0LvQtdC60LDRgNGB0YLQstC10L3QvdGL0Lkg0L/RgNC10L/QsNGA0LDRgiwg0LjQt9C00LXQu9C40LUg0LzQtdC00LjRhtC40L3RgdC60L7Qs9C+INC90LDQt9C90LDRh9C10L3QuNGPINC4INGB0L/QtdGG0LjQsNC70LjQt9C40YDQvtCy0LDQvdC90YvQuSDQv9GA0L7QtNGD0LrRgiDQu9C10YfQtdCx0L3QvtCz0L4g0L/QuNGC0LDQvdC40Y88L3RpdGxlPgogPGVmZmVjdGl2ZVRpbWUgdmFsdWU9IjIwMjEwODI2MTIzMSswMzAwIiAvPgogPGNvbmZpZGVudGlhbGl0eUNvZGUgY29kZT0iTiIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4yODUiIGNvZGVTeXN0ZW1OYW1lPSLQo9GA0L7QstC10L3RjCDQutC+0L3RhNC40LTQtdC90YbQuNCw0LvRjNC90L7RgdGC0Lgg0LzQtdC00LjRhtC40L3RgdC60L7Qs9C+INC00L7QutGD0LzQtdC90YLQsCIgY29kZVN5c3RlbVZlcnNpb249IjEuMSIgZGlzcGxheU5hbWU9ItCe0LHRi9GH0L3Ri9C5IiAvPgogPGxhbmd1YWdlQ29kZSBjb2RlPSJydS1SVSIgLz4KIDxzZXRJZCByb290PSIxLjIuNjQzLjUuMS4xMy4xMy4xMi4yLjMxLjI4NDcuMTAwLjEuMS41MCIgZXh0ZW5zaW9uPSI5YWIwOTQ2ZS01MDA2LWVjMTEtYTlmZi0wMDFhNjQ4Y2RkYjQiIC8+CiA8dmVyc2lvbk51bWJlciB2YWx1ZT0iMSIgLz4KIDxyZWNvcmRUYXJnZXQ+CiAgPHBhdGllbnRSb2xlPgogICA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMTMuMTIuMi4zMS4yODQ3LjEwMC4xLjEuMTAiIGV4dGVuc2lvbj0iMTYwMmNlMWYtNWMwNi00N2M5LWIxOTMtZmU5NDdiNGIyMDk5IiAvPgogICA8aWQgcm9vdD0iMS4yLjY0My4xMDAuMyIgZXh0ZW5zaW9uPSIwMzE4MTQ1OTQzNiIgLz4KICAgPGlkZW50aXR5OklkZW50aXR5RG9jIG51bGxGbGF2b3I9Ik5JIiAvPgogICA8YWRkciBudWxsRmxhdm9yPSJOSSIgdXNlPSJIIiAvPgogICA8dGVsZWNvbSB2YWx1ZT0idGVsOjc5OTk1ODQxMjEyIiAvPgogICA8dGVsZWNvbSB2YWx1ZT0idGVsOjc5OTk1ODQxMjEyIiB1c2U9Ik1DIiAvPgogICA8dGVsZWNvbSB2YWx1ZT0idGVsOjMyMzEyMyIgdXNlPSJXUCIgLz4KICAgPHRlbGVjb20gdmFsdWU9Im1haWx0bzpra0BleGFtcGxlLmNvbSIgLz4KICAgPHBhdGllbnQ+CiAgICA8bmFtZT4KICAgICA8ZmFtaWx5PlRlc3RvdjwvZmFtaWx5PgogICAgIDxnaXZlbj7QotC10YHRgjwvZ2l2ZW4+CiAgICAgPGdpdmVuPtCi0LXRgdGC0L7QstC40Yc8L2dpdmVuPgogICAgPC9uYW1lPgogICAgPGFkbWluaXN0cmF0aXZlR2VuZGVyQ29kZSBjb2RlPSIxIiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy4xMS4xMDQwIiBjb2RlU3lzdGVtTmFtZT0i0J/QvtC7INC/0LDRhtC40LXQvdGC0LAiIGNvZGVTeXN0ZW1WZXJzaW9uPSIyLjEiIGRpc3BsYXlOYW1lPSLQnNGD0LbRgdC60L7QuSIgLz4KICAgIDxiaXJ0aFRpbWUgdmFsdWU9IjIwMDAwNzIxIiAvPgogICA8L3BhdGllbnQ+CiAgIDxwcm92aWRlck9yZ2FuaXphdGlvbj4KICAgIDxpZCByb290PSIxLjIuNjQzLjUuMS4xMy4xMy4xMi4yLjMxLjI4NDciIC8+CiAgICA8aWRlbnRpdHk6T2dybiB4c2k6dHlwZT0iU1QiPjEwMjMxMDEzMzkwMzA8L2lkZW50aXR5Ok9ncm4+CiAgICA8aWRlbnRpdHk6T2dybmlwIHhzaTp0eXBlPSJTVCIgbnVsbEZsYXZvcj0iTkEiIC8+CiAgICA8bmFtZT7QqNC10LHQtdC60LjQvdGB0LrQsNGPINCm0KDQkSDQotC10YHRgjwvbmFtZT4KICAgIDx0ZWxlY29tIHZhbHVlPSJ0ZWw6KzcoMjcyMik1Njg5NTYiIC8+CiAgICA8YWRkcj4KICAgICA8c3RyZWV0QWRkcmVzc0xpbmU+0JHQldCb0JPQntCg0J7QlNCh0JrQkNCvINCe0JHQmy4sINCv0JrQntCS0JvQldCS0KHQmtCY0Jkg0KAt0J0uLCDQodCi0KDQntCY0KLQldCb0Kwg0JMuINCb0JXQndCY0J3QkCDQo9CbIDE5LCDQmtCe0KDQny4g0JAsINCh0KLQoC4gMSDQmtCSLiA1Njwvc3RyZWV0QWRkcmVzc0xpbmU+CiAgICAgPHN0YXRlPjc3PC9zdGF0ZT4KICAgICA8ZmlhczpBZGRyZXNzIG51bGxGbGF2b3I9Ik5JIiAvPgogICAgPC9hZGRyPgogICA8L3Byb3ZpZGVyT3JnYW5pemF0aW9uPgogIDwvcGF0aWVudFJvbGU+CiA8L3JlY29yZFRhcmdldD4KIDxhdXRob3I+CiAgPHRpbWUgdmFsdWU9IjIwMjEwODI2MTM1NyswMzAwIiAvPgogIDxhc3NpZ25lZEF1dGhvcj4KICAgPGlkIHJvb3Q9IjEuMi42NDMuNS4xLjEzLjEzLjEyLjIuMzEuMjg0Ny4xMDAuMS4xLjcwIiBleHRlbnNpb249IjI3NWM1N2M2LTY2MmMtNDkzNS1hOWIyLWViNjRhZmU3ODUzNyIgLz4KICAgPGlkIHJvb3Q9IjEuMi42NDMuMTAwLjMiIGV4dGVuc2lvbj0iMDY5NTAxNTQ1NzIiIC8+CiAgIDxjb2RlIGNvZGU9IjEwMCIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuMTEuMTAwMiIgY29kZVN5c3RlbU5hbWU9ItCU0L7Qu9C20L3QvtGB0YLQuCDRgNCw0LHQvtGC0L3QuNC60L7QsiDQvtGA0LPQsNC90LjQt9Cw0YbQuNC5INC80LXQtNC40YbQuNC90YHQutC+0LPQviDQuCDRhNCw0YDQvNCw0YbQtdCy0YLQuNGH0LXRgdC60L7Qs9C+INC/0YDQvtGE0LjQu9GPIiBjb2RlU3lzdGVtVmVyc2lvbj0iNS4xIiBkaXNwbGF5TmFtZT0i0LLRgNCw0Yct0YHRgtC+0LzQsNGC0L7Qu9C+0LMiIC8+CiAgIDxhc3NpZ25lZFBlcnNvbj4KICAgIDxuYW1lPgogICAgIDxmYW1pbHk+0JHQtdC30LrRgNGD0LPQu9C+0LLQsDwvZmFtaWx5PgogICAgIDxnaXZlbj7QmNGA0LjQvdCwPC9naXZlbj4KICAgICA8Z2l2ZW4+0JrQvtC90YHRgtCw0L3RgtC40L3QvtCy0L3QsDwvZ2l2ZW4+CiAgICA8L25hbWU+CiAgIDwvYXNzaWduZWRQZXJzb24+CiAgIDxyZXByZXNlbnRlZE9yZ2FuaXphdGlvbiBjbGFzc0NvZGU9Ik9SRyI+CiAgICA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMTMuMTIuMi4zMS4yODQ3IiAvPgogICAgPG5hbWU+0KjQtdCx0LXQutC40L3RgdC60LDRjyDQptCg0JEg0KLQtdGB0YI8L25hbWU+CiAgICA8dGVsZWNvbSB2YWx1ZT0idGVsOis3KDI3MjIpNTY4OTU2IiAvPgogICAgPGFkZHI+CiAgICAgPHN0cmVldEFkZHJlc3NMaW5lPtCR0JXQm9CT0J7QoNCe0JTQodCa0JDQryDQntCR0JsuLCDQr9Ca0J7QktCb0JXQktCh0JrQmNCZINCgLdCdLiwg0KHQotCg0J7QmNCi0JXQm9CsINCTLiDQm9CV0J3QmNCd0JAg0KPQmyAxOSwg0JrQntCg0J8uINCQLCDQodCi0KAuIDEg0JrQki4gNTY8L3N0cmVldEFkZHJlc3NMaW5lPgogICAgIDxzdGF0ZT43Nzwvc3RhdGU+CiAgICAgPGZpYXM6QWRkcmVzcyBudWxsRmxhdm9yPSJOSSIgLz4KICAgIDwvYWRkcj4KICAgPC9yZXByZXNlbnRlZE9yZ2FuaXphdGlvbj4KICA8L2Fzc2lnbmVkQXV0aG9yPgogPC9hdXRob3I+CiA8Y3VzdG9kaWFuPgogIDxhc3NpZ25lZEN1c3RvZGlhbj4KICAgPHJlcHJlc2VudGVkQ3VzdG9kaWFuT3JnYW5pemF0aW9uPgogICAgPGlkIHJvb3Q9IjEuMi42NDMuNS4xLjEzLjEzLjEyLjIuMzEuMjg0NyIgLz4KICAgIDxuYW1lPtCo0LXQsdC10LrQuNC90YHQutCw0Y8g0KbQoNCRINCi0LXRgdGCPC9uYW1lPgogICAgPHRlbGVjb20gdmFsdWU9InRlbDorNygyNzIyKTU2ODk1NiIgLz4KICAgIDxhZGRyPgogICAgIDxzdHJlZXRBZGRyZXNzTGluZT7QkdCV0JvQk9Ce0KDQntCU0KHQmtCQ0K8g0J7QkdCbLiwg0K/QmtCe0JLQm9CV0JLQodCa0JjQmSDQoC3QnS4sINCh0KLQoNCe0JjQotCV0JvQrCDQky4g0JvQldCd0JjQndCQINCj0JsgMTksINCa0J7QoNCfLiDQkCwg0KHQotCgLiAxINCa0JIuIDU2PC9zdHJlZXRBZGRyZXNzTGluZT4KICAgICA8c3RhdGU+Nzc8L3N0YXRlPgogICAgIDxmaWFzOkFkZHJlc3MgbnVsbEZsYXZvcj0iTkkiIC8+CiAgICA8L2FkZHI+CiAgIDwvcmVwcmVzZW50ZWRDdXN0b2RpYW5Pcmdhbml6YXRpb24+CiAgPC9hc3NpZ25lZEN1c3RvZGlhbj4KIDwvY3VzdG9kaWFuPgogPGluZm9ybWF0aW9uUmVjaXBpZW50PgogIDxpbnRlbmRlZFJlY2lwaWVudD4KICAgPHJlY2VpdmVkT3JnYW5pemF0aW9uPgogICAgPGlkIHJvb3Q9IjEuMi42NDMuNS4xLjEzIiAvPgogICAgPG5hbWU+0JzQuNC90LjRgdGC0LXRgNGB0YLQstC+INC30LTRgNCw0LLQvtC+0YXRgNCw0L3QtdC90LjRjyDQoNC+0YHRgdC40LnRgdC60L7QuSDQpNC10LTQtdGA0LDRhtC40LggKNCY0K3QnNCaKTwvbmFtZT4KICAgPC9yZWNlaXZlZE9yZ2FuaXphdGlvbj4KICA8L2ludGVuZGVkUmVjaXBpZW50PgogPC9pbmZvcm1hdGlvblJlY2lwaWVudD4KIDxsZWdhbEF1dGhlbnRpY2F0b3I+CiAgPHRpbWUgdmFsdWU9IjIwMjEwODI2MTM1NyswMzAwIiAvPgogIDxzaWduYXR1cmVDb2RlIGNvZGU9IlMiIC8+CiAgPGFzc2lnbmVkRW50aXR5PgogICA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMTMuMTIuMi4zMS4yODQ3LjEwMC4xLjEuNzAiIGV4dGVuc2lvbj0iMjc1YzU3YzYtNjYyYy00OTM1LWE5YjItZWI2NGFmZTc4NTM3IiAvPgogICA8aWQgcm9vdD0iMS4yLjY0My4xMDAuMyIgZXh0ZW5zaW9uPSIwNjk1MDE1NDU3MiIgLz4KICAgPGNvZGUgY29kZT0iMTAwIiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy4xMS4xMDAyIiBjb2RlU3lzdGVtTmFtZT0i0JTQvtC70LbQvdC+0YHRgtC4INGA0LDQsdC+0YLQvdC40LrQvtCyINC+0YDQs9Cw0L3QuNC30LDRhtC40Lkg0LzQtdC00LjRhtC40L3RgdC60L7Qs9C+INC4INGE0LDRgNC80LDRhtC10LLRgtC40YfQtdGB0LrQvtCz0L4g0L/RgNC+0YTQuNC70Y8iIGNvZGVTeXN0ZW1WZXJzaW9uPSI1LjEiIGRpc3BsYXlOYW1lPSLQstGA0LDRhy3RgdGC0L7QvNCw0YLQvtC70L7QsyIgLz4KICAgPGFzc2lnbmVkUGVyc29uPgogICAgPG5hbWU+CiAgICAgPGZhbWlseT7QkdC10LfQutGA0YPQs9C70L7QstCwPC9mYW1pbHk+CiAgICAgPGdpdmVuPtCY0YDQuNC90LA8L2dpdmVuPgogICAgIDxnaXZlbj7QmtC+0L3RgdGC0LDQvdGC0LjQvdC+0LLQvdCwPC9naXZlbj4KICAgIDwvbmFtZT4KICAgPC9hc3NpZ25lZFBlcnNvbj4KICAgPHJlcHJlc2VudGVkT3JnYW5pemF0aW9uIGNsYXNzQ29kZT0iT1JHIj4KICAgIDxpZCByb290PSIxLjIuNjQzLjUuMS4xMy4xMy4xMi4yLjMxLjI4NDciIC8+CiAgICA8bmFtZT7QqNC10LHQtdC60LjQvdGB0LrQsNGPINCm0KDQkSDQotC10YHRgjwvbmFtZT4KICAgIDx0ZWxlY29tIHZhbHVlPSJ0ZWw6KzcoMjcyMik1Njg5NTYiIC8+CiAgICA8YWRkcj4KICAgICA8c3RyZWV0QWRkcmVzc0xpbmU+0JHQldCb0JPQntCg0J7QlNCh0JrQkNCvINCe0JHQmy4sINCv0JrQntCS0JvQldCS0KHQmtCY0Jkg0KAt0J0uLCDQodCi0KDQntCY0KLQldCb0Kwg0JMuINCb0JXQndCY0J3QkCDQo9CbIDE5LCDQmtCe0KDQny4g0JAsINCh0KLQoC4gMSDQmtCSLiA1Njwvc3RyZWV0QWRkcmVzc0xpbmU+CiAgICAgPHN0YXRlPjc3PC9zdGF0ZT4KICAgICA8ZmlhczpBZGRyZXNzIG51bGxGbGF2b3I9Ik5JIiAvPgogICAgPC9hZGRyPgogICA8L3JlcHJlc2VudGVkT3JnYW5pemF0aW9uPgogIDwvYXNzaWduZWRFbnRpdHk+CiA8L2xlZ2FsQXV0aGVudGljYXRvcj4KIDxwYXJ0aWNpcGFudCB0eXBlQ29kZT0iSExEIj4KICA8YXNzb2NpYXRlZEVudGl0eSBjbGFzc0NvZGU9IlBPTEhPTEQiPgogICA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMi43LjEwMC4yIiBleHRlbnNpb249IjMxMjUyMzQxNzU5MjgzNTIiIC8+CiAgIDxjb2RlIGNvZGU9IlNFTEYiIGNvZGVTeXN0ZW09IjIuMTYuODQwLjEuMTEzODgzLjUuMTExIiAvPgogICA8c2NvcGluZ09yZ2FuaXphdGlvbj4KICAgIDxpZCByb290PSIxLjIuNjQzLjUuMS4xMy4yLjEuMS42MzUiIGV4dGVuc2lvbj0iNzkiIC8+CiAgICA8bmFtZT7QkdCV0JvQk9Ce0KDQntCU0KHQmtCY0Jkg0KTQmNCb0JjQkNCbINCe0J7QniAmcXVvdDvQnNCh0JogJnF1b3Q70JjQndCa0J4t0JzQldCUJnF1b3Q7PC9uYW1lPgogICAgPHRlbGVjb20gdmFsdWU9InRlbDo4LTQ3MjItMjAyODc2IiAvPgogICAgPGFkZHI+CiAgICAgPHN0cmVldEFkZHJlc3NMaW5lPtCS0J7QoNCe0J3QldCWINCTLCDQn9Cb0JDQotCe0J3QntCS0JAg0KPQmywgMTTQlDwvc3RyZWV0QWRkcmVzc0xpbmU+CiAgICAgPHN0YXRlPjMxPC9zdGF0ZT4KICAgICA8ZmlhczpBZGRyZXNzIG51bGxGbGF2b3I9Ik5JIiAvPgogICAgPC9hZGRyPgogICA8L3Njb3BpbmdPcmdhbml6YXRpb24+CiAgPC9hc3NvY2lhdGVkRW50aXR5PgogPC9wYXJ0aWNpcGFudD4KIDxjb21wb25lbnRPZj4KICA8ZW5jb21wYXNzaW5nRW5jb3VudGVyPgogICA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMTMuMTIuMi4zMS4yODQ3LjEwMC4xLjEuMTUiIGV4dGVuc2lvbj0iYTRhYjcwNjUtZDQ3OC00ZWMxLThjM2UtODQ0N2MyMDg3ODljIiAvPgogICA8aWQgcm9vdD0iMS4yLjY0My41LjEuMTMuMTMuMTIuMi4zMS4yODQ3LjEwMC4xLjEuMTciIGV4dGVuc2lvbj0iMjYzNDY3MyIgLz4KICAgPGVmZmVjdGl2ZVRpbWU+CiAgICA8bG93IHZhbHVlPSIyMDIxMDgyNjAwMDArMDMwMCIgLz4KICAgPC9lZmZlY3RpdmVUaW1lPgogIDwvZW5jb21wYXNzaW5nRW5jb3VudGVyPgogPC9jb21wb25lbnRPZj4KIDxjb21wb25lbnQ+CiAgPHN0cnVjdHVyZWRCb2R5PgogICA8Y29tcG9uZW50PgogICAgPHNlY3Rpb24+CiAgICAgPGNvZGUgY29kZT0iRE9DSU5GTyIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xOTciIGNvZGVTeXN0ZW1OYW1lPSLQodC10LrRhtC40Lgg0Y3Qu9C10LrRgtGA0L7QvdC90YvRhSDQvNC10LTQuNGG0LjQvdGB0LrQuNGFINC00L7QutGD0LzQtdC90YLQvtCyIiBjb2RlU3lzdGVtVmVyc2lvbj0iMS41IiBkaXNwbGF5TmFtZT0i0KHQstC10LTQtdC90LjRjyDQviDQtNC+0LrRg9C80LXQvdGC0LUiIC8+CiAgICAgPHRpdGxlPtCh0LLQtdC00LXQvdC40Y8g0L7QsSDRjdC70LXQutGC0YDQvtC90L3QvtC8INGA0LXRhtC10L/RgtC1PC90aXRsZT4KICAgICA8dGV4dD4KICAgICAgPGNvbnRlbnQgSUQ9IkRPQ18xIj7QodC10YDQuNGPINGA0LXRhtC10L/RgtCwOiBUMTQyMTwvY29udGVudD4KICAgICAgPGJyIC8+CiAgICAgIDxjb250ZW50IElEPSJET0NfMiI+0J3QvtC80LXRgCDRgNC10YbQtdC/0YLQsDogMTAwMTk1MzwvY29udGVudD4KICAgICAgPGJyIC8+CiAgICAgIDxjb250ZW50IElEPSJET0NfMyI+0KHRgNC+0Log0LTQtdC50YHRgtCy0LjRjyDRgNC10YbQtdC/0YLQsDogMzAg0LTQvdC10Lk8L2NvbnRlbnQ+CiAgICAgIDxiciAvPgogICAgICA8Y29udGVudCBJRD0iRE9DXzQiPtCU0LDRgtCwINC+0LrQvtC90YfQsNC90LjRjyDQtNC10LnRgdGC0LLQuNGPINGA0LXRhtC10L/RgtCwOiAyNS4wOS4yMDIxPC9jb250ZW50PgogICAgICA8YnIgLz4KICAgICAgPGNvbnRlbnQgSUQ9IkRPQ181Ij7Qn9C+INGB0L/QtdGG0LjQsNC70YzQvdC+0LzRgyDQvdCw0LfQvdCw0YfQtdC90LjRjiAo0J7RgtC80LXRgtC60LApOiDQvdC10YI8L2NvbnRlbnQ+CiAgICAgIDxiciAvPgogICAgICA8Y29udGVudCBJRD0iRE9DXzYiPtCd0LDQu9C40YfQuNC1INGF0YDQvtC90LjRh9C10YHQutC40YUg0LfQsNCx0L7Qu9C10LLQsNC90LjQuTog0L3QtdGCPC9jb250ZW50PgogICAgICA8YnIgLz4KICAgICAgPGNvbnRlbnQgSUQ9IkRPQ183Ij7QqNC40YTRgCDQv9C+INCc0JrQkS0xMDogSTA5LjIgLSDQpdGA0L7QvdC40YfQtdGB0LrQuNC5INGA0LXQstC80LDRgtC40YfQtdGB0LrQuNC5INC/0LXRgNC40LrQsNGA0LTQuNGCPC9jb250ZW50PgogICAgIDwvdGV4dD4KICAgICA8ZW50cnk+CiAgICAgIDxvYnNlcnZhdGlvbiBjbGFzc0NvZGU9Ik9CUyIgbW9vZENvZGU9IkVWTiI+CiAgICAgICA8Y29kZSBjb2RlPSI2MDAxIiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy45OS4yLjE2NiIgY29kZVN5c3RlbU5hbWU9ItCa0L7QtNC40YDRg9C10LzRi9C1INC/0L7Qu9GPIENEQSDQtNC+0LrRg9C80LXQvdGC0L7QsiIgY29kZVN5c3RlbVZlcnNpb249IjEuNDciIGRpc3BsYXlOYW1lPSLQodC10YDQuNGPINGA0LXRhtC10L/RgtCwIiAvPgogICAgICAgPHRleHQ+CiAgICAgICAgPHJlZmVyZW5jZSB2YWx1ZT0iI0RPQ18xIiAvPgogICAgICAgPC90ZXh0PgogICAgICAgPHZhbHVlIHhzaTp0eXBlPSJTVCI+VDE0MjE8L3ZhbHVlPgogICAgICA8L29ic2VydmF0aW9uPgogICAgIDwvZW50cnk+CiAgICAgPGVudHJ5PgogICAgICA8b2JzZXJ2YXRpb24gY2xhc3NDb2RlPSJPQlMiIG1vb2RDb2RlPSJFVk4iPgogICAgICAgPGNvZGUgY29kZT0iNjAwMiIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xNjYiIGNvZGVTeXN0ZW1OYW1lPSLQmtC+0LTQuNGA0YPQtdC80YvQtSDQv9C+0LvRjyBDREEg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjQ3IiBkaXNwbGF5TmFtZT0i0J3QvtC80LXRgCDRgNC10YbQtdC/0YLQsCIgLz4KICAgICAgIDx0ZXh0PgogICAgICAgIDxyZWZlcmVuY2UgdmFsdWU9IiNET0NfMiIgLz4KICAgICAgIDwvdGV4dD4KICAgICAgIDx2YWx1ZSB4c2k6dHlwZT0iU1QiPjEwMDE5NTM8L3ZhbHVlPgogICAgICA8L29ic2VydmF0aW9uPgogICAgIDwvZW50cnk+CiAgICAgPGVudHJ5PgogICAgICA8b2JzZXJ2YXRpb24gY2xhc3NDb2RlPSJPQlMiIG1vb2RDb2RlPSJFVk4iPgogICAgICAgPGNvZGUgY29kZT0iNjAwNCIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xNjYiIGNvZGVTeXN0ZW1OYW1lPSLQmtC+0LTQuNGA0YPQtdC80YvQtSDQv9C+0LvRjyBDREEg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjQ3IiBkaXNwbGF5TmFtZT0i0KHRgNC+0Log0LTQtdC50YHRgtCy0LjRjyDRgNC10YbQtdC/0YLQsCIgLz4KICAgICAgIDx2YWx1ZSB4c2k6dHlwZT0iQ0QiIGNvZGU9IjIiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuNjA4IiBjb2RlU3lzdGVtTmFtZT0i0KHRgNC+0Log0LTQtdC50YHRgtCy0LjRjyDRgNC10YbQtdC/0YLQsCIgY29kZVN5c3RlbVZlcnNpb249IjEuMiIgZGlzcGxheU5hbWU9IjMwINC00L3QtdC5Ij4KICAgICAgICA8b3JpZ2luYWxUZXh0PgogICAgICAgICA8cmVmZXJlbmNlIHZhbHVlPSIjRE9DXzMiIC8+CiAgICAgICAgPC9vcmlnaW5hbFRleHQ+CiAgICAgICA8L3ZhbHVlPgogICAgICA8L29ic2VydmF0aW9uPgogICAgIDwvZW50cnk+CiAgICAgPGVudHJ5PgogICAgICA8b2JzZXJ2YXRpb24gY2xhc3NDb2RlPSJPQlMiIG1vb2RDb2RlPSJFVk4iPgogICAgICAgPGNvZGUgY29kZT0iNjAwNSIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xNjYiIGNvZGVTeXN0ZW1OYW1lPSLQmtC+0LTQuNGA0YPQtdC80YvQtSDQv9C+0LvRjyBDREEg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjQ3IiBkaXNwbGF5TmFtZT0i0JTQsNGC0LAg0L7QutC+0L3Rh9Cw0L3QuNGPINC00LXQudGB0YLQstC40Y8g0YDQtdGG0LXQv9GC0LAiIC8+CiAgICAgICA8dGV4dD4KICAgICAgICA8cmVmZXJlbmNlIHZhbHVlPSIjRE9DXzQiIC8+CiAgICAgICA8L3RleHQ+CiAgICAgICA8dmFsdWUgeHNpOnR5cGU9IlRTIiB2YWx1ZT0iMjAyMTA5MjUiIC8+CiAgICAgIDwvb2JzZXJ2YXRpb24+CiAgICAgPC9lbnRyeT4KICAgICA8ZW50cnk+CiAgICAgIDxvYnNlcnZhdGlvbiBjbGFzc0NvZGU9Ik9CUyIgbW9vZENvZGU9IkVWTiI+CiAgICAgICA8Y29kZSBjb2RlPSI2MDA2IiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy45OS4yLjE2NiIgY29kZVN5c3RlbU5hbWU9ItCa0L7QtNC40YDRg9C10LzRi9C1INC/0L7Qu9GPIENEQSDQtNC+0LrRg9C80LXQvdGC0L7QsiIgY29kZVN5c3RlbVZlcnNpb249IjEuNDciIGRpc3BsYXlOYW1lPSLQn9C+INGB0L/QtdGG0LjQsNC70YzQvdC+0LzRgyDQvdCw0LfQvdCw0YfQtdC90LjRjiAo0J7RgtC80LXRgtC60LApIiAvPgogICAgICAgPHRleHQ+CiAgICAgICAgPHJlZmVyZW5jZSB2YWx1ZT0iI0RPQ181IiAvPgogICAgICAgPC90ZXh0PgogICAgICAgPHZhbHVlIHhzaTp0eXBlPSJCTCIgdmFsdWU9ImZhbHNlIiAvPgogICAgICA8L29ic2VydmF0aW9uPgogICAgIDwvZW50cnk+CiAgICAgPGVudHJ5PgogICAgICA8b2JzZXJ2YXRpb24gY2xhc3NDb2RlPSJPQlMiIG1vb2RDb2RlPSJFVk4iPgogICAgICAgPGNvZGUgY29kZT0iMTEwMDEiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuMTY2IiBjb2RlU3lzdGVtTmFtZT0i0JrQvtC00LjRgNGD0LXQvNGL0LUg0L/QvtC70Y8gQ0RBINC00L7QutGD0LzQtdC90YLQvtCyIiBjb2RlU3lzdGVtVmVyc2lvbj0iMS40NyIgZGlzcGxheU5hbWU9ItCd0LDQu9C40YfQuNC1INGF0YDQvtC90LjRh9C10YHQutC40YUg0LfQsNCx0L7Qu9C10LLQsNC90LjQuSIgLz4KICAgICAgIDx0ZXh0PgogICAgICAgIDxyZWZlcmVuY2UgdmFsdWU9IiNET0NfNiIgLz4KICAgICAgIDwvdGV4dD4KICAgICAgIDx2YWx1ZSB4c2k6dHlwZT0iQkwiIHZhbHVlPSJmYWxzZSIgLz4KICAgICAgPC9vYnNlcnZhdGlvbj4KICAgICA8L2VudHJ5PgogICAgIDxlbnRyeT4KICAgICAgPG9ic2VydmF0aW9uIGNsYXNzQ29kZT0iT0JTIiBtb29kQ29kZT0iRVZOIj4KICAgICAgIDxjb2RlIGNvZGU9IjgwOSIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xNjYiIGNvZGVTeXN0ZW1OYW1lPSLQmtC+0LTQuNGA0YPQtdC80YvQtSDQv9C+0LvRjyBDREEg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjQ3IiBkaXNwbGF5TmFtZT0i0KjQuNGE0YAg0L/QviDQnNCa0JEtMTAiIC8+CiAgICAgICA8dGV4dD4KICAgICAgICA8cmVmZXJlbmNlIHZhbHVlPSIjRE9DXzciIC8+CiAgICAgICA8L3RleHQ+CiAgICAgICA8dmFsdWUgeHNpOnR5cGU9IkNEIiBjb2RlPSJJMDkuMiIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuMTEuMTAwNSIgY29kZVN5c3RlbU5hbWU9ItCc0LXQttC00YPQvdCw0YDQvtC00L3QsNGPINC60LvQsNGB0YHQuNGE0LjQutCw0YbQuNGPINCx0L7Qu9C10LfQvdC10Lkg0Lgg0YHQvtGB0YLQvtGP0L3QuNC5LCDRgdCy0Y/Qt9Cw0L3QvdGL0YUg0YHQviDQt9C00L7RgNC+0LLRjNC10LwgMTAg0L/QtdGA0LXRgdC80L7RgtGA0LAuINCS0LXRgNGB0LjRjyA0IiBkaXNwbGF5TmFtZT0i0KXRgNC+0L3QuNGH0LXRgdC60LjQuSDRgNC10LLQvNCw0YLQuNGH0LXRgdC60LjQuSDQv9C10YDQuNC60LDRgNC00LjRgiIgLz4KICAgICAgPC9vYnNlcnZhdGlvbj4KICAgICA8L2VudHJ5PgogICAgPC9zZWN0aW9uPgogICA8L2NvbXBvbmVudD4KICAgPGNvbXBvbmVudD4KICAgIDxzZWN0aW9uPgogICAgIDxjb2RlIGNvZGU9IkJFTkVGSVRTIiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy45OS4yLjE5NyIgY29kZVN5c3RlbU5hbWU9ItCh0LXQutGG0LjQuCDRjdC70LXQutGC0YDQvtC90L3Ri9GFINC80LXQtNC40YbQuNC90YHQutC40YUg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjUiIGRpc3BsYXlOYW1lPSLQm9GM0LPQvtGC0YsiIC8+CiAgICAgPHRpdGxlPtCa0L7QtNGLINC70YzQs9C+0YI8L3RpdGxlPgogICAgIDx0ZXh0PgogICAgICA8Y29udGVudCBJRD0iQkVOXzEiPtCb0YzQs9C+0YLQvdCw0Y8g0LrQsNGC0LXQs9C+0YDQuNGPOiDQmNC90LLQsNC70LjQtNGLIElJINCz0YDRg9C/0L/RizwvY29udGVudD4KICAgICAgPGJyIC8+CiAgICAgIDxjb250ZW50IElEPSJCRU5fMiI+0JjRgdGC0L7Rh9C90LjQuiDQsdGO0LTQttC10YLQvdC+0LPQviDRhNC40L3QsNC90YHQuNGA0L7QstCw0L3QuNGPOiDQpNC10LTQtdGA0LDQu9GM0L3Ri9C5INCx0Y7QtNC20LXRgjwvY29udGVudD4KICAgICAgPGJyIC8+CiAgICAgIDxjb250ZW50IElEPSJCRU5fMyI+0KDQsNC30LzQtdGAINC70YzQs9C+0YLRiyAo0LrQvtC0KTogMTAwPC9jb250ZW50PgogICAgICA8YnIgLz4KICAgICAgPGNvbnRlbnQgSUQ9IkJFTl80Ij7QoNCw0LfQvNC10YAg0LvRjNCz0L7RgtGLICjQt9C90LDRh9C10L3QuNC1INCyINC/0YDQvtGG0LXQvdGC0LDRhSk6IDEwMCAlPC9jb250ZW50PgogICAgIDwvdGV4dD4KICAgICA8ZW50cnk+CiAgICAgIDxvYnNlcnZhdGlvbiBjbGFzc0NvZGU9Ik9CUyIgbW9vZENvZGU9IkVWTiI+CiAgICAgICA8Y29kZSBjb2RlPSI4MTEiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuMTY2IiBjb2RlU3lzdGVtTmFtZT0i0JrQvtC00LjRgNGD0LXQvNGL0LUg0L/QvtC70Y8gQ0RBINC00L7QutGD0LzQtdC90YLQvtCyIiBjb2RlU3lzdGVtVmVyc2lvbj0iMS40NyIgZGlzcGxheU5hbWU9ItCb0YzQs9C+0YLQvdCw0Y8g0LrQsNGC0LXQs9C+0YDQuNGPIiAvPgogICAgICAgPHZhbHVlIHhzaTp0eXBlPSJDRCIgY29kZT0iMS4wMDAwMC4wMjE3IiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy45OS4yLjU0MSIgY29kZVN5c3RlbU5hbWU9ItCb0YzQs9C+0YLQvdGL0LUg0LrQsNGC0LXQs9C+0YDQuNC4INCz0YDQsNC20LTQsNC9IiBjb2RlU3lzdGVtVmVyc2lvbj0iNi4xNCIgZGlzcGxheU5hbWU9ItCY0L3QstCw0LvQuNC00YsgSUkg0LPRgNGD0L/Qv9GLIj4KICAgICAgICA8b3JpZ2luYWxUZXh0PgogICAgICAgICA8cmVmZXJlbmNlIHZhbHVlPSIjQkVOXzEiIC8+CiAgICAgICAgPC9vcmlnaW5hbFRleHQ+CiAgICAgICA8L3ZhbHVlPgogICAgICA8L29ic2VydmF0aW9uPgogICAgIDwvZW50cnk+CiAgICAgPGVudHJ5PgogICAgICA8b2JzZXJ2YXRpb24gY2xhc3NDb2RlPSJPQlMiIG1vb2RDb2RlPSJFVk4iPgogICAgICAgPGNvZGUgY29kZT0iNjAwOCIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xNjYiIGNvZGVTeXN0ZW1OYW1lPSLQmtC+0LTQuNGA0YPQtdC80YvQtSDQv9C+0LvRjyBDREEg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjQ3IiBkaXNwbGF5TmFtZT0i0JjRgdGC0L7Rh9C90LjQuiDQsdGO0LTQttC10YLQvdC+0LPQviDRhNC40L3QsNC90YHQuNGA0L7QstCw0L3QuNGPIiAvPgogICAgICAgPHZhbHVlIHhzaTp0eXBlPSJDRCIgY29kZT0iMSIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi41NDEiIGNvZGVTeXN0ZW1OYW1lPSLQm9GM0LPQvtGC0L3Ri9C1INC60LDRgtC10LPQvtGA0LjQuCDQs9GA0LDQttC00LDQvSIgY29kZVN5c3RlbVZlcnNpb249IjYuMTQiIGRpc3BsYXlOYW1lPSLQpNC10LTQtdGA0LDQu9GM0L3Ri9C5INCx0Y7QtNC20LXRgiI+CiAgICAgICAgPG9yaWdpbmFsVGV4dD4KICAgICAgICAgPHJlZmVyZW5jZSB2YWx1ZT0iI0JFTl8yIiAvPgogICAgICAgIDwvb3JpZ2luYWxUZXh0PgogICAgICAgPC92YWx1ZT4KICAgICAgPC9vYnNlcnZhdGlvbj4KICAgICA8L2VudHJ5PgogICAgIDxlbnRyeT4KICAgICAgPG9ic2VydmF0aW9uIGNsYXNzQ29kZT0iT0JTIiBtb29kQ29kZT0iRVZOIj4KICAgICAgIDxjb2RlIGNvZGU9IjYwMDkiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuMTY2IiBjb2RlU3lzdGVtTmFtZT0i0JrQvtC00LjRgNGD0LXQvNGL0LUg0L/QvtC70Y8gQ0RBINC00L7QutGD0LzQtdC90YLQvtCyIiBjb2RlU3lzdGVtVmVyc2lvbj0iMS40NyIgZGlzcGxheU5hbWU9ItCg0LDQt9C80LXRgCDQu9GM0LPQvtGC0YsgKNC60L7QtCkiIC8+CiAgICAgICA8dmFsdWUgeHNpOnR5cGU9IkNEIiBjb2RlPSI0NDciIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuNjA1IiBjb2RlU3lzdGVtTmFtZT0i0JLQuNC00Ysg0L/RgNC10LTQvtGB0YLQsNCy0LvRj9C10LzRi9GFINC70YzQs9C+0YIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIzLjIiIGRpc3BsYXlOYW1lPSIxMDAiPgogICAgICAgIDxvcmlnaW5hbFRleHQ+CiAgICAgICAgIDxyZWZlcmVuY2UgdmFsdWU9IiNCRU5fMyIgLz4KICAgICAgICA8L29yaWdpbmFsVGV4dD4KICAgICAgIDwvdmFsdWU+CiAgICAgIDwvb2JzZXJ2YXRpb24+CiAgICAgPC9lbnRyeT4KICAgICA8ZW50cnk+CiAgICAgIDxvYnNlcnZhdGlvbiBjbGFzc0NvZGU9Ik9CUyIgbW9vZENvZGU9IkVWTiI+CiAgICAgICA8Y29kZSBjb2RlPSI2MDEwIiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy45OS4yLjE2NiIgY29kZVN5c3RlbU5hbWU9ItCa0L7QtNC40YDRg9C10LzRi9C1INC/0L7Qu9GPIENEQSDQtNC+0LrRg9C80LXQvdGC0L7QsiIgY29kZVN5c3RlbVZlcnNpb249IjEuNDciIGRpc3BsYXlOYW1lPSLQoNCw0LfQvNC10YAg0LvRjNCz0L7RgtGLICjQt9C90LDRh9C10L3QuNC1INCyINC/0YDQvtGG0LXQvdGC0LDRhSkiIC8+CiAgICAgICA8dGV4dD4KICAgICAgICA8cmVmZXJlbmNlIHZhbHVlPSIjQkVOXzQiIC8+CiAgICAgICA8L3RleHQ+CiAgICAgICA8dmFsdWUgeHNpOnR5cGU9IlBRIiB2YWx1ZT0iMTAwIiB1bml0PSIlIj4KICAgICAgICA8dHJhbnNsYXRpb24gY29kZT0iNTMiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjExLjEzNTgiIGNvZGVTeXN0ZW1OYW1lPSLQldC00LjQvdC40YbRiyDQuNC30LzQtdGA0LXQvdC40Y8iIGNvZGVTeXN0ZW1WZXJzaW9uPSIyLjgiIGRpc3BsYXlOYW1lPSLQn9GA0L7RhtC10L3RgiIgdmFsdWU9IjEwMCIgLz4KICAgICAgIDwvdmFsdWU+CiAgICAgIDwvb2JzZXJ2YXRpb24+CiAgICAgPC9lbnRyeT4KICAgIDwvc2VjdGlvbj4KICAgPC9jb21wb25lbnQ+CiAgIDxjb21wb25lbnQ+CiAgICA8c2VjdGlvbj4KICAgICA8dGl0bGU+0J3QsNC30L3QsNGH0LXQvdC40LUg0LvQtdC60LDRgNGB0YLQstC10L3QvdC+0LPQviDQv9GA0LXQv9Cw0YDQsNGC0LBc0YHQv9C10YbQuNCw0LvQuNC30LjRgNC+0LLQsNC90L3QvtCz0L4g0L/RgNC+0LTRg9C60YLQsCDQu9C10YfQtdCx0L3QvtCz0L4g0L/QuNGC0LDQvdC40Y88L3RpdGxlPgogICAgIDx0ZXh0PgogICAgICA8dGFibGU+CiAgICAgICA8dGJvZHk+CiAgICAgICAgPHRyPgogICAgICAgICA8dGg+0J3QsNC30L3QsNGH0LXQvdC+PC90aD4KICAgICAgICAgPHRoPtCf0YDQuNC10Lw8L3RoPgogICAgICAgICA8dGg+0J7RgdC+0LHRi9C1INGD0LrQsNC30LDQvdC40Y88L3RoPgogICAgICAgICA8dGg+0JrQvtC70LjRh9C10YHRgtCy0L4g0L3QsNC30L3QsNGH0LXQvdC90YvRhSDQtNC+0Lc8L3RoPgogICAgICAgIDwvdHI+CiAgICAgICAgPHRyPgogICAgICAgICA8dGQ+0JzQldCi0KTQntCg0JzQmNCdINCi0JDQkdCb0JXQotCa0Jgg0J/QoNCe0JvQntCd0JPQmNCg0J7QktCQ0J3QndCe0JPQniDQlNCV0JnQodCi0JLQmNCvIDc1MCDQvNCzPC90ZD4KICAgICAgICAgPHRkPjEg0YjRgi4gKNGC0LDQsdC70LXRgtC60LApIDEg0YDQsNC3KNCwKSDQsiDQtNC10L3RjCDQsiDRgtC10YfQtdC90LjQuCAxINC00L3RjyjQtdC5KQrRgdC/0L7RgdC+0LEg0LLQstC10LTQtdC90LjRjzog0JTQu9GPINC/0YDQuNC10LzQsCDQstC90YPRgtGA0Yw8L3RkPgogICAgICAgICA8dGQ+0J/RgNC40L3QuNC80LDRgtGMIDEg0YjRgiDQv9C10YDQvtGA0LDQu9GM0L3QviAxINGA0LDQtyDQsiDQtNC10L3RjCDQsiDRgtC10YfQtdC90LjQtSAxINC00L3RjzwvdGQ+CiAgICAgICAgIDx0ZD4xPC90ZD4KICAgICAgICA8L3RyPgogICAgICAgPC90Ym9keT4KICAgICAgPC90YWJsZT4KICAgICA8L3RleHQ+CiAgICAgPGVudHJ5PgogICAgICA8c3Vic3RhbmNlQWRtaW5pc3RyYXRpb24gY2xhc3NDb2RlPSJTQkFETSIgbW9vZENvZGU9IlJRTyI+CiAgICAgICA8Y29kZSBjb2RlPSIxIiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy45OS4yLjY1MSIgY29kZVN5c3RlbU5hbWU9ItCi0LjQvyDQvdCw0LfQvdCw0YfQtdC90LjQuSDQu9GM0LPQvtGC0L3QvtCz0L4g0YDQtdGG0LXQv9GC0LAiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjIiIGRpc3BsYXlOYW1lPSLQoNC10YbQtdC/0YIg0L3QsCDQu9C10LrQsNGA0YHRgtCy0LXQvdC90YvQuSDQv9GA0LXQv9Cw0YDQsNGCIiAvPgogICAgICAgPHRleHQ+CiAgICAgICAgPHJlZmVyZW5jZSB2YWx1ZT0iI1JFQ18xIiAvPgogICAgICAgPC90ZXh0PgogICAgICAgPGVmZmVjdGl2ZVRpbWUgeHNpOnR5cGU9IklWTF9UUyI+CiAgICAgICAgPHdpZHRoIHZhbHVlPSIxIiB1bml0PSJkIj4KICAgICAgICAgPHRyYW5zbGF0aW9uIGNvZGU9IjI0IiBjb2RlU3lzdGVtPSIxLjIuNjQzLjUuMS4xMy4xMy4xMS4xMzU4IiBjb2RlU3lzdGVtTmFtZT0i0JXQtNC40L3QuNGG0Ysg0LjQt9C80LXRgNC10L3QuNGPIiBjb2RlU3lzdGVtVmVyc2lvbj0iMi44IiBkaXNwbGF5TmFtZT0i0JTQtdC90YwiIHZhbHVlPSIxIiAvPgogICAgICAgIDwvd2lkdGg+CiAgICAgICA8L2VmZmVjdGl2ZVRpbWU+CiAgICAgICA8cm91dGVDb2RlIGNvZGU9IjIiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjExLjE0NjgiIGNvZGVTeXN0ZW1OYW1lPSLQn9GD0YLQuCDQstCy0LXQtNC10L3QuNGPINC70LXQutCw0YDRgdGC0LLQtdC90L3Ri9GFINC/0YDQtdC/0LDRgNCw0YLQvtCyLCDQsiDRgtC+0Lwg0YfQuNGB0LvQtSDQtNC70Y8g0LvRjNCz0L7RgtC90L7Qs9C+INC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LPRgNCw0LbQtNCw0L0g0LvQtdC60LDRgNGB0YLQstC10L3QvdGL0LzQuCDRgdGA0LXQtNGB0YLQstCw0LzQuCIgY29kZVN5c3RlbVZlcnNpb249IjEuMiIgZGlzcGxheU5hbWU9ItCU0LvRjyDQv9GA0LjQtdC80LAg0LLQvdGD0YLRgNGMIiAvPgogICAgICAgPGNvbnN1bWFibGUgdHlwZUNvZGU9IkNTTSI+CiAgICAgICAgPG1hbnVmYWN0dXJlZFByb2R1Y3QgY2xhc3NDb2RlPSJNQU5VIj4KICAgICAgICAgPG1hbnVmYWN0dXJlZE1hdGVyaWFsIGNsYXNzQ29kZT0iTU1BVCIgZGV0ZXJtaW5lckNvZGU9IktJTkQiPgogICAgICAgICAgPGNvZGUgY29kZT0iMjEuMjAuMTAuMTE5LTAwMDAwMS0xLTAwMDkzLTAwMDAwMDAwMDAwMDAiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjk5LjIuNjExIiBjb2RlU3lzdGVtTmFtZT0i0KPQt9C70Ysg0KHQnNCd0J0uINCV0KHQmtCb0J8iIGRpc3BsYXlOYW1lPSLQnNCV0KLQpNCe0KDQnNCY0J0g0KLQkNCR0JvQldCi0JrQmCDQn9Cg0J7Qm9Ce0J3Qk9CY0KDQntCS0JDQndCd0J7Qk9CeINCU0JXQmdCh0KLQktCY0K8gNzUwINC80LMiIC8+CiAgICAgICAgIDwvbWFudWZhY3R1cmVkTWF0ZXJpYWw+CiAgICAgICAgPC9tYW51ZmFjdHVyZWRQcm9kdWN0PgogICAgICAgPC9jb25zdW1hYmxlPgogICAgICAgPGVudHJ5UmVsYXRpb25zaGlwIHR5cGVDb2RlPSJDT01QIj4KICAgICAgICA8c3Vic3RhbmNlQWRtaW5pc3RyYXRpb24gY2xhc3NDb2RlPSJTQkFETSIgbW9vZENvZGU9IlJRTyI+CiAgICAgICAgIDxlZmZlY3RpdmVUaW1lIHhzaTp0eXBlPSJQSVZMX1RTIiBpbnN0aXR1dGlvblNwZWNpZmllZD0iZmFsc2UiPgogICAgICAgICAgPHBlcmlvZCB2YWx1ZT0iMjQiIHVuaXQ9ImgiPgogICAgICAgICAgIDx0cmFuc2xhdGlvbiBjb2RlPSIyMyIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuMTEuMTM1OCIgY29kZVN5c3RlbU5hbWU9ItCV0LTQuNC90LjRhtGLINC40LfQvNC10YDQtdC90LjRjyIgY29kZVN5c3RlbVZlcnNpb249IjIuOCIgZGlzcGxheU5hbWU9ItCn0LDRgSIgdmFsdWU9IjI0IiAvPgogICAgICAgICAgPC9wZXJpb2Q+CiAgICAgICAgIDwvZWZmZWN0aXZlVGltZT4KICAgICAgICAgPGRvc2VRdWFudGl0eSB2YWx1ZT0iMSIgdW5pdD0i0YjRgi4gKNGC0LDQsdC70LXRgtC60LApIj4KICAgICAgICAgIDx0cmFuc2xhdGlvbiBjb2RlPSIzNCIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi42MTIiIGNvZGVTeXN0ZW1OYW1lPSLQn9C+0YLRgNC10LHQuNGC0LXQu9GM0YHQutC40LUg0LXQtNC40L3QuNGG0Ysg0JXQodCa0JvQnyIgY29kZVN5c3RlbVZlcnNpb249IjEuNjIiIGRpc3BsYXlOYW1lPSLRiNGCLiAo0YLQsNCx0LvQtdGC0LrQsCkiIHZhbHVlPSIxIiAvPgogICAgICAgICA8L2Rvc2VRdWFudGl0eT4KICAgICAgICAgPGNvbnN1bWFibGUgdHlwZUNvZGU9IkNTTSI+CiAgICAgICAgICA8bWFudWZhY3R1cmVkUHJvZHVjdD4KICAgICAgICAgICA8bWFudWZhY3R1cmVkTWF0ZXJpYWwgbnVsbEZsYXZvcj0iTkEiIC8+CiAgICAgICAgICA8L21hbnVmYWN0dXJlZFByb2R1Y3Q+CiAgICAgICAgIDwvY29uc3VtYWJsZT4KICAgICAgICA8L3N1YnN0YW5jZUFkbWluaXN0cmF0aW9uPgogICAgICAgPC9lbnRyeVJlbGF0aW9uc2hpcD4KICAgICAgIDxlbnRyeVJlbGF0aW9uc2hpcCB0eXBlQ29kZT0iQ09NUCI+CiAgICAgICAgPG9ic2VydmF0aW9uIGNsYXNzQ29kZT0iT0JTIiBtb29kQ29kZT0iRVZOIj4KICAgICAgICAgPGNvZGUgY29kZT0iNjAxMSIgY29kZVN5c3RlbT0iMS4yLjY0My41LjEuMTMuMTMuOTkuMi4xNjYiIGNvZGVTeXN0ZW1OYW1lPSLQmtC+0LTQuNGA0YPQtdC80YvQtSDQv9C+0LvRjyBDREEg0LTQvtC60YPQvNC10L3RgtC+0LIiIGNvZGVTeXN0ZW1WZXJzaW9uPSIxLjQ3IiBkaXNwbGF5TmFtZT0i0JrQvtC70LjRh9C10YHRgtCy0L4g0L3QsNC30L3QsNGH0LXQvdC90YvRhSDQtNC+0LciIC8+CiAgICAgICAgIDx2YWx1ZSB4c2k6dHlwZT0iUFEiIHZhbHVlPSIxIiB1bml0PSJVIj4KICAgICAgICAgIDx0cmFuc2xhdGlvbiBjb2RlPSIxMjgiIGNvZGVTeXN0ZW09IjEuMi42NDMuNS4xLjEzLjEzLjExLjEzNTgiIGNvZGVTeXN0ZW1OYW1lPSLQldC00LjQvdC40YbRiyDQuNC30LzQtdGA0LXQvdC40Y8iIGNvZGVTeXN0ZW1WZXJzaW9uPSIyLjgiIGRpc3BsYXlOYW1lPSLQldC00LjQvdC40YbQsCIgdmFsdWU9IjEiIC8+CiAgICAgICAgIDwvdmFsdWU+CiAgICAgICAgPC9vYnNlcnZhdGlvbj4KICAgICAgIDwvZW50cnlSZWxhdGlvbnNoaXA+CiAgICAgICA8cHJlY29uZGl0aW9uIHR5cGVDb2RlPSJQUkNOIj4KICAgICAgICA8Y3JpdGVyaW9uPgogICAgICAgICA8Y29kZSBjb2RlPSJBU1NFUlRJT04iIGNvZGVTeXN0ZW09IjIuMTYuODQwLjEuMTEzODgzLjUuNCIgLz4KICAgICAgICAgPHZhbHVlIHhzaTp0eXBlPSJTVCI+0J/RgNC40L3QuNC80LDRgtGMIDEg0YjRgiDQv9C10YDQvtGA0LDQu9GM0L3QviAxINGA0LDQtyDQsiDQtNC10L3RjCDQsiDRgtC10YfQtdC90LjQtSAxINC00L3RjzwvdmFsdWU+CiAgICAgICAgPC9jcml0ZXJpb24+CiAgICAgICA8L3ByZWNvbmRpdGlvbj4KICAgICAgPC9zdWJzdGFuY2VBZG1pbmlzdHJhdGlvbj4KICAgICA8L2VudHJ5PgogICAgPC9zZWN0aW9uPgogICA8L2NvbXBvbmVudD4KICA8L3N0cnVjdHVyZWRCb2R5PgogPC9jb21wb25lbnQ+CjwvQ2xpbmljYWxEb2N1bWVudD4=\",' +
    '\"orgSignature\": \"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\",' +
    '\"registrationData\": null,' +
    '\"personalSignatures\": [' +
    '{' +
    '\"signerRole\": 0,' +
    '\"signature\": \"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\"' +
    '}' +
    ']' +
    '},' +
    '\"cancel\": null' +
    '}';

export function prescription(baseUrl) {
    group('create prescription', function () {
    const SignToJwsPrescription = http.post('http://109.95.224.42:8082//SignService3/api/crypto/Jws?numCert=01d729ed662a5fc00000001600050001',
        JSON.stringify(bodyPrescriptionToSign), {
        headers: {'Content-Type': 'application/json'}
    });
        check(SignToJwsPrescription, {
            'http response SignToJwsPrescription status code is 200': r => r.status === 200,
        });
    let bodySignToJwsPrescription = JSON.parse(SignToJwsPrescription.body);
    let bodySign =  bodySignToJwsPrescription['data'];
    if (SignToJwsPrescription.status !=200){console.log('!!!ALARM WARNING УВАГА :   '+bodySign['message']+ '' +
        '      !!!RESPONSE STATUS:  ' +SignToJwsPrescription.status);}
    //console.log(JSON.stringify(bodySignToJwsPrescription));
    //console.log(JSON.stringify(bodySign));

     const newPrescription = http.post(baseUrl+'/prescription',
            bodySign, {
            headers: {'Content-Type': 'application/jose'}
        });
     let bodyPrescription = newPrescription.body;
        //console.log(bodyPrescription);
        check(newPrescription, {
            'http response newPrescription status code is 200': r => r.status === 200,
        });
        if (newPrescription.status !=200){console.log('!!!ALARM WARNING УВАГА :   '+newPrescription+ '' +
            '      !!!RESPONSE STATUS:  ' +newPrescription.status);}
    sleep(1);
    });
}