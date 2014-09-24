 var basicObject = {
    map: null, 
    response: null,
    typeOfAction: null,
    currentCategory: null,
    markers: [], 
  }
  fetchDataFromUrl = function (myObject) {
    var query_string = basicObject;
    var validationArray = [];
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      validationArray[i] =  pair[0];
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        if(pair[0]=='url' || pair[0]=='dim' || pair[0]=='img'  || pair[0]=='category' ) { 
         // query_string[pair[0]] = pair[1];
         var arr1=[ pair[1] ];
         query_string[pair[0]] = arr1;
        }else{
          alert('< '+pair[0]+' >  Is a wrong attribute. Acceptable attributes are: url, category, img, dim');
          return;
        }
       }else {
        query_string[pair[0]].push(pair[1]);
      }
    }
    validation = validationArray.length / 4;//check 4 pair of variables needed
    if(validation == parseInt(validation)) {
      query_string.iterates = validation; 
    }else{
      alert('Wrong pair of values. Please check the Url');
      return;
    }
    return query_string;
  } 

  function GoogleMapsMultipleMarkers(input,idOfClickedListItem,classNameOfClickedItem) {
    //create a new namespace
    var  dataInput = input; 
    //  classNameOfClickedItem defines the action add/remove/exe for markers (if list-item has active class then action: remove markers with category  of  idOfClickedListItem ) 
    dataInput.typeOfAction = classNameOfClickedItem;
    dataInput.currentCategory = idOfClickedListItem;
    dataInput.mainHandler = function() {
    //load all markers 
      if(dataInput.typeOfAction =='exe') {
          dataInput.initBarnardosMap();  
      }else{
        //detect action add remove
        dataInput.eventDetection();
      }
    }
    dataInput.eventDetection = function(){
      if(dataInput.typeOfAction =='' || dataInput.typeOfAction == null ) {
        dataInput.addMarkKindOf();
        dataInput.addClassActive();
      }else{
        dataInput.removeMarkKindOf();
        dataInput.removeClassActive();
      }
    }
    dataInput.addMarkKindOf = function(){
      for (var i = 0; i <  dataInput.markers.length; i++) {
        if(dataInput.markers[i].markerCategory == dataInput.currentCategory) {
          dataInput.markers[i].setMap(dataInput.map);     
        }
      }
    }
    dataInput.removeMarkKindOf = function(){
      for (var i = 0; i <  dataInput.markers.length; i++) {
        if(dataInput.markers[i].markerCategory == dataInput.currentCategory) {
          dataInput.markers[i].setMap(null);
        }
      }
    }
    dataInput.addClassActive = function() {
      document.getElementById(dataInput.currentCategory).setAttribute("class","active");
    }
    dataInput.removeClassActive = function() {
      document.getElementById(dataInput.currentCategory).setAttribute("class","");
    }
    dataInput.initBarnardosMap = function() {
      dataInput.initiateGoogleMaps(); 
    }
    dataInput.initialiseDataMap = function(i) {
      dataInput.CsvToJson(dataInput.ajaxCall(dataInput.url[i]));
    }
    dataInput.CsvToJson = function(csv){
      dataInput.response = eval("(" +  dataInput.cleanTrace(csv) + ")");  
    }
    dataInput.ajaxCall =  function(Url){
      var xhReq = new XMLHttpRequest();
      xhReq.open("GET", Url, false);
      xhReq.send(null);
      return xhReq.responseText;
    }
    dataInput.cleanTrace = function(csv){
      return dataInput.csvJSON(dataInput.cleanTraceQuats(csv));
    }
    dataInput.csvJSON = function(csv) {
      var lines=csv.split("\r\n");
      var result = [];
      var headers=lines[0].split(",");
      for(var i=1;i<lines.length;i++) {
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      return JSON.stringify(result); //JSON
    }
    dataInput.cleanTraceQuats = function(csv) {
      csv = csv.replace(/"/g,"");
      return csv;
    }
    dataInput.initiateGoogleMaps = function() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&'+'callback=initialize';
      document.body.appendChild(script);
    }
    dataInput.setInactiveImg = function(status,i) {
       if(status=='no') {
         var imagename = dataInput.img[i].substr(dataInput.img[i].lastIndexOf("/")+1);
         var regex = new RegExp(imagename, "g");
         var path = dataInput.img[i].replace(regex,'');
         var incativeImg = 'in'+imagename;
         newpath = path+incativeImg;
         return newpath;
      }else{
        return  dataInput.img[i];
      }
    }
    dataInput.addButton = function(i) {
      var listItem = document.createElement('li');
      listItem.id = dataInput.category[i];
      listItemTextNode =  document.createTextNode(dataInput.category[i]);        
      listItem.appendChild(listItemTextNode);
      var myId =  listItem.id 
      document.getElementById('buttonsList').appendChild(listItem).setAttribute("onclick","trigerEvent(this);");
      document.getElementById(myId).setAttribute("class","active");
    }
    dataInput.setMarker = function(map, response,i) {
      var image = {
    
        size: new google.maps.Size(dataInput.dim[i], 32),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0, 32)
      };
      var contentPopUpShop = [] ;
      infowindow = new google.maps.InfoWindow( {
      content: "holding..." });
      for (var k  in response) {     
        var myLatLng = new google.maps.LatLng( parseFloat(response[k].LATITUDE),parseFloat(response[k].LONGITUDE));
        // set the content of the pop up
        contentPopUpShop[k] = '<div id="content" style="width:110px;height:100px;">'+ '<p> '+response[k].TITLE+ '</p>' + '<p> '+response[k].DESCRIPTION+ '</p>'+'</div>'; 
         // create the marker  
         var curentCategory = dataInput.category[i];
        
        var marker = new google.maps.Marker( {
            position: myLatLng,
            map: dataInput.map,
            icon: dataInput.setInactiveImg(response[k].UPDATED,i),
            title:response[k].TOWNORCITY,
            zIndex: 1,
            markerCategory:curentCategory,
            popUp: contentPopUpShop[k]
        });
        // add event listener
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.popUp);
            infowindow.open(map, this);
        });
         dataInput.markers.push(marker);     
      }
    }
    dataInput.mainHandler(idOfClickedListItem,classNameOfClickedItem);  
    initialize = function() {           
      var mapOptions = {
          zoom: 6,
          center: new google.maps.LatLng(54.3981628,-4.116037)
      }
      dataInput.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      for(i=0;i<dataInput.url.length;i++) {
            dataInput.addButton(i);
            dataInput.initialiseDataMap(i);
            dataInput.setMarker(dataInput.map, dataInput.response,i);                   
      }              
    }
  }
  function trigerEvent(object) {
      GoogleMapsMultipleMarkers(myFechedData,object.getAttribute('id'),object.getAttribute('class'));
  }
  var myFechedData =  fetchDataFromUrl(basicObject);
  window.onload = GoogleMapsMultipleMarkers(myFechedData,null,'exe');
