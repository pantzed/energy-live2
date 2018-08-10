# energy-live2
A revision of the original "energy-live" using node/express to serve a webpage showing electrical energy data.

## Project Specs:

### What problem does your project solve?
The project allows egauge energy meter users to better visualize their data. 

### How will your project solve this problem?
It will provide a less granular visual representation of data, so that it can be more easily understood.

### What inputs does your project need?
Data from an eGauge meter.

### What outputs does your project produce, and how do they help solve the problem? This includes:
A bar graph (column chart) with one column for each measurement point. The graph will be built using an html canvas. 
Numerical power values for each measurement point.
The data is delivered as a delta, so the program will need to calculate the difference between the previous and current call. This might involve storing data in an object and updating that object with each call. 

### External Data
API: https://www.egauge.net/docs/egauge-xml-api.pdf
Validated that information can be called:
```
$ http -v GET "egauge8642.egaug.es/cgi-bin/egauge?inst"
GET /cgi-bin/egauge?inst HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: egauge8642.egaug.es
User-Agent: HTTPie/0.9.9

HTTP/1.1 200 OK
Cache-Control: no-cache
Content-type: text/xml
Date: Fri, 25 May 2018 15:47:41 GMT
Server: lighttpd/1.4.31
Transfer-Encoding: chunked

<?xml version="1.0" encoding="UTF-8" ?>
<data serial="0x8a7a9c0">
 <ts>1527263261</ts>
 <r t="P" n="Grid"><v>-159600880850</v><i>-606</i></r>
</data>
```

### Technical Stack
* CSS Framework: Skeleton
* Javascript Libraries: [Chart.js](http://www.chartjs.org/)
* XML to JSON parser: [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)
* Deployment Method: Heroku
    
### Feature List
* ~~Input a specific energy meter~~
* ~~Display numerical data in a table~~
* ~~Bar graph showing value for each measurement point~~
* Consolidate and refactor JavaScript files
* Mobile friendly/Responsive design
* Merge scripts for historical and real-time displays
* Use local storage object for saving favorite devices
* Load most recently visited device when returning to the page
* Replace Skeleton with Bootstrap 4
* Deploy with heroku



