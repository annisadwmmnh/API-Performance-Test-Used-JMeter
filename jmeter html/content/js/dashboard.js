/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 22.22222222222222, "KoPercent": 77.77777777777777};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09259259259259259, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "GET DASHBOARD DIREKTUR"], "isController": false}, {"data": [0.0, 500, 1500, "GET DETAIL EMPLOYEES"], "isController": false}, {"data": [0.0, 500, 1500, "PUT UPDATE EMPLOYEES"], "isController": false}, {"data": [0.0, 500, 1500, "POST LOGIN"], "isController": false}, {"data": [0.0, 500, 1500, "POST CREATE EMPLOYEES"], "isController": false}, {"data": [0.0, 500, 1500, "GET ALL GRADES BY LEVEL"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE EMPLOYEES"], "isController": false}, {"data": [0.25, 500, 1500, "POST REGISTER"], "isController": false}, {"data": [1.0, 500, 1500, "GET ALL GRADES"], "isController": false}, {"data": [0.0, 500, 1500, "POST Login"], "isController": false}, {"data": [0.0, 500, 1500, "GET EMPLOYEES"], "isController": false}, {"data": [0.0, 500, 1500, "POST FORGOT PASSWORD"], "isController": false}, {"data": [0.0, 500, 1500, "POST CHANGE PASSWORD"], "isController": false}, {"data": [0.0, 500, 1500, "GET DASHBOARD"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27, 21, 77.77777777777777, 422.7037037037039, 0, 2754, 264.0, 1591.0, 2325.5999999999976, 2754.0, 0.22424131687789645, 1.8439160397945284, 0.033715681216052354], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET DASHBOARD DIREKTUR", 2, 2, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.017629377594824015, 0.021124263973485415, 0.0], "isController": false}, {"data": ["GET DETAIL EMPLOYEES", 2, 2, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.017648979447763436, 0.020768574447807556, 0.0], "isController": false}, {"data": ["PUT UPDATE EMPLOYEES", 2, 2, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.017649290939736495, 0.020768940998420388, 0.0], "isController": false}, {"data": ["POST LOGIN", 2, 2, 100.0, 506.0, 262, 750, 506.0, 750.0, 750.0, 750.0, 0.017475643322119795, 0.009454596094193718, 0.004249448425007646], "isController": false}, {"data": ["POST CREATE EMPLOYEES", 2, 2, 100.0, 293.5, 291, 296, 293.5, 296.0, 296.0, 296.0, 0.01760377424919903, 0.012704286298982502, 0.009575490485160019], "isController": false}, {"data": ["GET ALL GRADES BY LEVEL", 2, 2, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.01763170886522322, 0.02097209120882996, 0.0], "isController": false}, {"data": ["DELETE EMPLOYEES", 2, 2, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.017649446689846273, 0.020769124278578868, 0.0], "isController": false}, {"data": ["POST REGISTER", 2, 0, 0.0, 1970.5, 1187, 2754, 1970.5, 2754.0, 2754.0, 2754.0, 0.01705960626428742, 0.00779677317547511, 0.004198262479101982], "isController": false}, {"data": ["GET ALL GRADES", 2, 0, 0.0, 271.0, 264, 278, 271.0, 278.0, 278.0, 278.0, 0.01758844790741441, 0.018086558248542356, 0.0029543096094485142], "isController": false}, {"data": ["POST Login", 1, 1, 100.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.846469709897611, 0.8299114761092151], "isController": false}, {"data": ["GET EMPLOYEES", 2, 0, 0.0, 1625.5, 1568, 1683, 1625.5, 1683.0, 1683.0, 1683.0, 0.01739145557787459, 1.6120894257776155, 0.002972172584109427], "isController": false}, {"data": ["POST FORGOT PASSWORD", 2, 2, 100.0, 346.0, 277, 415, 346.0, 415.0, 415.0, 415.0, 0.01754801575811815, 0.011978577163012292, 0.004044269256753792], "isController": false}, {"data": ["POST CHANGE PASSWORD", 2, 2, 100.0, 547.5, 492, 603, 547.5, 603.0, 603.0, 603.0, 0.017536168347216136, 0.13163257617273127, 0.005360176457693994], "isController": false}, {"data": ["GET DASHBOARD", 2, 2, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.017629377594824015, 0.020969318271968407, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 51: https://staging-eta.herokuapp.com/api/v1/employees/{3}", 6, 28.571428571428573, 22.22222222222222], "isController": false}, {"data": ["401", 3, 14.285714285714286, 11.11111111111111], "isController": false}, {"data": ["500", 4, 19.047619047619047, 14.814814814814815], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 62: https://staging-eta.herokuapp.com/api/v1/dashboard?employeeid={12}", 2, 9.523809523809524, 7.407407407407407], "isController": false}, {"data": ["404/Not Found", 2, 9.523809523809524, 7.407407407407407], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 71: https://staging-eta.herokuapp.com/api/v1/dashboard/direktur?employeeid={12}", 2, 9.523809523809524, 7.407407407407407], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 62: https://staging-eta.herokuapp.com/api/v1/grades/level?levelid={12}", 2, 9.523809523809524, 7.407407407407407], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27, 21, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 51: https://staging-eta.herokuapp.com/api/v1/employees/{3}", 6, "500", 4, "401", 3, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 62: https://staging-eta.herokuapp.com/api/v1/dashboard?employeeid={12}", 2, "404/Not Found", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET DASHBOARD DIREKTUR", 2, 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 71: https://staging-eta.herokuapp.com/api/v1/dashboard/direktur?employeeid={12}", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET DETAIL EMPLOYEES", 2, 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 51: https://staging-eta.herokuapp.com/api/v1/employees/{3}", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT UPDATE EMPLOYEES", 2, 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 51: https://staging-eta.herokuapp.com/api/v1/employees/{3}", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST LOGIN", 2, 2, "401", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST CREATE EMPLOYEES", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET ALL GRADES BY LEVEL", 2, 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 62: https://staging-eta.herokuapp.com/api/v1/grades/level?levelid={12}", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["DELETE EMPLOYEES", 2, 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 51: https://staging-eta.herokuapp.com/api/v1/employees/{3}", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Login", 1, 1, "401", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST FORGOT PASSWORD", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST CHANGE PASSWORD", 2, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET DASHBOARD", 2, 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 62: https://staging-eta.herokuapp.com/api/v1/dashboard?employeeid={12}", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
