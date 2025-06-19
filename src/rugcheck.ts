import { getFullTokenReportFromMint } from "./transactions";

 

 getFullTokenReportFromMint('8Y5MwnUM19uqhnsrFnKijrmn33CmHBTUoedXtTGDpump').then((report) => {
   console.log(report.report?.dexOrders);
 })
 


