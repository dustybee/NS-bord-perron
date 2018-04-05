var username = config.username;
var password = config.password;
var stationID = 'asd';

$('.current-time').html(moment().format('HH:mm'));
getTrains();


setInterval(function() {
    $('.current-time').html(moment().format('HH:mm'));
    getTrains();
}, 60000);

setInterval(function() {
    $('.current-time').html(moment().format('HH:mm'));
}, 1000);

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
	if (xml.hasChildNodes()) {
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
};

function getTrains() {
    $.get({
		url:'https://crossorigin.me/https://'+username+':'+password+'@webservices.ns.nl/ns-api-avt?station='+stationID,
        datatype: "xml",
        data:{},
        success:function(data, status, xhr){
            var treinData = xmlToJson(data);
            updateTrains(treinData);
        }
    });
}

function updateTrains(train) {
    var TreinSoortKort;
	$('.EindBestemming').html(train.ActueleVertrekTijden.VertrekkendeTrein[0].EindBestemming['#text']);

	$('.TreinSoort').html(train.ActueleVertrekTijden.VertrekkendeTrein[0].TreinSoort['#text']);

	if(train.ActueleVertrekTijden.VertrekkendeTrein[0].TreinSoort['#text'].length > 12) {
		$('.TreinSoort').addClass('TreinSoortTekstKlein');
	} else {
		$('.TreinSoort').removeClass('TreinSoortTekstKlein');
	}
	
	if(train.ActueleVertrekTijden.VertrekkendeTrein[0].Vervoerder['#text'] == "NS" || train.ActueleVertrekTijden.VertrekkendeTrein[0].Vervoerder['#text'] == "NS international") {
		$('.ns-logo').attr('src', 'https://ns.nl/static/generic/2.21.0/images/nslogo.svg');
	} else if (train.ActueleVertrekTijden.VertrekkendeTrein[0].TreinSoort['#text'] == "Thalys") {
		$('.ns-logo').attr('src', 'images/Thalys.svg');
	} else {
		$('.ns-logo').removeAttr('src');
	}

	$('.VertrekSpoor').html(train.ActueleVertrekTijden.VertrekkendeTrein[0].VertrekSpoor['#text']);
	
	if(train.ActueleVertrekTijden.VertrekkendeTrein[0].RouteTekst !== undefined ) {
		$('.RouteTekst').html('via '+train.ActueleVertrekTijden.VertrekkendeTrein[0].RouteTekst['#text']);
	} else {
		$('.RouteTekst').html("&nbsp;");
	}

	if(train.ActueleVertrekTijden.VertrekkendeTrein[0].VertrekVertragingTekst !== undefined) {
		$('.VertrekVertragingTekst').html(train.ActueleVertrekTijden.VertrekkendeTrein[0].VertrekVertragingTekst['#text']);
	} else {
		$('.VertrekVertragingTekst').html("&nbsp;");
	}

	if(train.ActueleVertrekTijden.VertrekkendeTrein[0].ReisTip !== undefined) {
		$('.ReisTip').html(train.ActueleVertrekTijden.VertrekkendeTrein[0].ReisTip['#text']);
	} else if (train.ActueleVertrekTijden.VertrekkendeTrein[0].Opmerkingen !== undefined) {
		$('.ReisTip').html(train.ActueleVertrekTijden.VertrekkendeTrein[0].Opmerkingen.Opmerking['#text']);
	} else {
		$('.ReisTip').html("&nbsp;");
	}

    var VertrekTijdRaw1 = train.ActueleVertrekTijden.VertrekkendeTrein[0].VertrekTijd['#text'];
    var VertrekTijd1 = VertrekTijdRaw1.substring(11, 16);
	$('.VertrekTijd').html(VertrekTijd1);

    var VertrekTijdRaw2 = train.ActueleVertrekTijden.VertrekkendeTrein[1].VertrekTijd['#text'];
    var VertrekTijd2 = VertrekTijdRaw2.substring(11, 16);
    var TreinSoortVolgende = train.ActueleVertrekTijden.VertrekkendeTrein[1].TreinSoort['#text'];

    if(TreinSoortVolgende == "Intercity"){ TreinSoortKort = "IC"; }
	else if (TreinSoortVolgende == "Sprinter") { TreinSoortKort = "SP"; }
	else if (TreinSoortVolgende == "Intercity direct") { TreinSoortKort = "ID"; }
	else if (TreinSoortVolgende == "Thalys") { TreinSoortKort = "TH"; }
	else if (TreinSoortVolgende == "ICE International") { TreinSoortKort = "ICE"; };


    $('.next-train').html("Hierna/Next: "+VertrekTijd2+' '+TreinSoortKort+' '+train.ActueleVertrekTijden.VertrekkendeTrein[1].EindBestemming['#text']);
}