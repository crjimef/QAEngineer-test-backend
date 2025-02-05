const reporter = require('k6-html-reporter');

const options = {
        jsonFile: "report/jsonReportLoad.json",
        output: "report/k6-Load-report.html",
};
const options2 = {
        jsonFile: "report/jsonReportSecurity.json",
        output: "report/k6-Security-report.html",
};

reporter.generateSummaryReport(options);
reporter.generateSummaryReport(options2);