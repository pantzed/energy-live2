(function(){
  let abort;
  let proxy = 'egaug.es';
  let deviceName = 'egauge8642';
  let xmlDOM;
  let jsonObject;
  let registers;
  let timeStamp;
  let serial;

  function makeRegistersObject(registers) {
    let obj = {};
    registers.forEach(function(innerObj) {
      obj[innerObj['@attributes'].n] = {'type': `${convertRegisterType(innerObj)}`, 'power': Math.abs(parseFloat([innerObj.v])), 'delta': Math.abs(parseFloat([innerObj.i]))};
    });
    return obj;
  }

  function convertRegisterType(obj) {
    let type = obj['@attributes'].t;
    if (type === 'P' || type === 'S') {
      return 'Watts';
    }
    else if (type === 'V') {
      return 'Volts';
    }
    else {
      return type;
    }
  }

  function makeTableWithData(data){
    let regList = document.getElementById('register-table-rows');
    regList.innerHTML = "";
    for (let key in data) {
      let childRow = document.createElement('tr');
      let childDataName = document.createElement('td');
      let childDataValue = document.createElement('td');
      let childDataType = document.createElement('td');
      childDataName.innerText = `${key}`;
      childDataValue.innerText = `${data[key].delta}`;
      childDataType.innerText = `${data[key].type}`;
      childRow.appendChild(childDataName);
      childRow.appendChild(childDataValue);
      childRow.appendChild(childDataType);
      regList.appendChild(childRow);
    }
  }

  // Changes XML to JSON
  function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
      obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

    //Functions to build, populate, and update graph
    let chartObjArray = [];
    let graphLabels = [];
    let wattData = [];
    let bgColors = [];
    let chart;
  
    function makeChartObject() {
      let ctx = document.getElementById('canvas-1').getContext('2d');
      chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: graphLabels,
          datasets: [{
            label: "Watts",
            data: wattData,
            backgroundColor: bgColors,
            borderWidth: 1
          }]
        },
        options: {
          animation: false,
          responsive: true
        }
      });
      document.getElementById('chart-container').classList.remove('hidden');
      return chart;
    }

    function updateChartData() {
      let chartObj = chartObjArray[0];
      chartObj.data.datasets.data = wattData;
      chartObj.data.labels = graphLabels;
      chartObj.data.datasets.backgroundColor = bgColor;
      chartObj.update()
    }

    function gatherChartLabels(registers) {
      for (let key in registers) {
        if (registers[key].type === "Watts") {
          graphLabels.push(key);
        }
      }
    }

    function gatherChartData(registers) {
      for (let key in registers) {
        if (registers[key].type === "Watts") {
          wattData.push(registers[key].delta);
        }
      }
    }

    function gatherBackgroundColor(registers) {
      wattData.forEach((x) => {
        bgColors.push('rgb(255, 99, 150)');
      })
    }

    function clearChartArray() {
      chartObjArray = [];
    }

    function clearChartDataAndLabels(){
      graphLabels = [];
      wattData = [];
    }
    //End graph stuff

  function getInformationForChartsFromRegisters(registers) {
    gatherChartData(registers);
    gatherChartLabels(registers);
    gatherBackgroundColor();
  }

  function convertXMLToJSON(xml) {
    xmlDOM = new DOMParser().parseFromString(xml, 'text/xml');
    jsonObject = xmlToJson(xmlDOM);
    timeStamp = jsonObject.data.ts;
    serial = jsonObject.data['@attributes'].serial;
    registers = makeRegistersObject(jsonObject.data.r);
  }

  function destroyChart(array) {
    array[0].destroy();
  }


  function callEgauge() {
    fetch(`https://cors-anywhere.herokuapp.com/http://${deviceName}.${proxy}/cgi-bin/egauge?inst`, {
      method: "GET"
    })
    .then(data => data.text())
    .then(xml => {
      document.getElementById('device-form').addEventListener('submit', function(){
        abort = true;
      });
      convertXMLToJSON(xml);
      makeTableWithData(registers);
      if (chartObjArray.length > 0) {
        destroyChart(chartObjArray);
      }
      clearChartArray();
      clearChartDataAndLabels();
      getInformationForChartsFromRegisters(registers);
      let newChart = makeChartObject();
      chartObjArray.push(newChart);
      document.getElementById('table-title').innerHTML = `${deviceName} Live Data`;
    })
    .then(() => {
      if (abort === true){
        abort = false;
        destroyChart(chartObjArray);
        clearChartArray();
        clearChartDataAndLabels();
        return;
      }
      else {
        callEgauge();
        addBlinker();
      }
    })
  }

  callEgauge(); //load initial data with default egauge name

  function clearAllOnNewSubmit() {
    event.preventDefault();
    xmlDOM = '';
    jsonObject = '';
    timeStamp = '';
    serial = '';
    registers = '';
    deviceName = document.getElementById('device-name').value;
    document.getElementById('table-title').innerHTML = `Loading...`;
  }

  function clearForm() {
    document.getElementById('device-name').value = '';
  }

  document.getElementById('device-form').addEventListener('submit', function(){
    document.getElementById('table-title').innerHTML = `Loading...`;
    clearAllOnNewSubmit();
    clearForm();
    removeBlinker();
    callEgauge();
  });

  function addBlinker() {
    document.getElementById('blinker').classList.add('blinker');
  }

  function removeBlinker() {
    document.getElementById('blinker').classList.remove('blinker');
  }


})();