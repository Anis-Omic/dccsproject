//predefined variables for begining of process
var formular=[
    {id: 0, name:"Some existing formular"},                                
    {id: 1, label: "Label1", inputtype:"Textbox", ifrb: null, requirment: "Mandatory"},    
    {id: 2, label: "Label2", inputtype:"Textbox", ifrb: null, requirment: "None"},
    {id: 3, label: "Label3", inputtype:"Checkbox", ifrb: null, requirment: "None"},
	{id: 4, label: "Label4", inputtype:"Textbox", ifrb: null, requirment: "Numeric"},
    {id: 5, label: "Label5", inputtype:"Radiobuttons", ifrb: null, requirment: "Mandatory"},
    {id: 6, label: "Label6", inputtype:"Textbox", ifrb: null, requirment: "None"}
];
	var rblabels=["radio lb1", "radio lb2", "Radio lb3"];
	formular[5].ifrb=rblabels;



	//global variables for tracking indexedDB version
var adbvers=1;
var fdbvers=1;


//filling indexedDB with predifined variables or geting indexedDB version if exist
var request1 = indexedDB.open("adminbase");
	request1.onupgradeneeded = function(event) {
		var db = event.target.result;
		var objectStore = db.createObjectStore( "Some existing formular", { keyPath: "id"});
        
		for (var i in formular) {
			objectStore.add(formular[i]);
		}
	};
	request1.onsuccess = function(event) {
		var db = event.target.result;
		adbvers=db.version+1;
		db.close();
	};

var request2 = indexedDB.open("formularbase");     
	request2.onupgradeneeded = function(event) {
		var db = event.target.result;
		var objectStore = db.createObjectStore( "Some existing formular1", { keyPath: "id"});
			
		for (var i in filedformular) {
			objectStore.add(filedformular[i]);
		}		
	};
	request2.onsuccess = function(event) {
		var db = event.target.result;
		fdbvers=db.version+1;
		db.close();
	};

	//function for changing tabs
	function openTab(evt, tabName) {
		
		document.getElementById("welcome").style.display="none";
		document.getElementById("tab").style.border="none";
		
		// Declare all variables
		var i, tabcontent, tablinks;
	
		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document.getElementById(tabName).style.display = "block";
		evt.currentTarget.className += " active";
	}   
	
	//functions for administrator tab
	
	//search database and depending of result call function for show page that will create further functionality 
	function adminsearch(searchadminbase){
		var request = indexedDB.open("adminbase");
		request.onsuccess = function(event){
			var db = event.target.result;
			if(db.objectStoreNames.contains(searchadminbase)){
				console.log("Template exist");
				var transaction = db.transaction(searchadminbase, 'readonly');
				var objectStore = transaction.objectStore(searchadminbase);
				if ('getAll' in objectStore) {
					objectStore.getAll().onsuccess = function(event) {
						adminupdatetemplate(event.target.result);
					};
				}
			}
			else{
				adminaddtemplate();
			}
			db.close();
		};
	}
	
	//function that change option of select with selected variable
	function selectoption(select_element, selected){
		var opts = select_element.options;
		for (var opt, j = 0; opt = opts[j]; j++) {
			if (opt.value == selected) {
				select_element.selectedIndex = j;
				break;
			}
		}
	}
	
	//for existing formular from database we call this function for print page with appropriate values
	function adminupdatetemplate(template){
		var div = document.getElementById("adminbody");
		div.innerHTML = "";
		div.style.display = "inline";
		document.getElementById("savebutton").style.display="inline";
		var button = document.getElementById("button");
		button.setAttribute("onClick", "saveformular(formname.value, 'update')");
		
		for(var i=1; i<template.length;i++){
			inputid=i;
			newdiv();
		}
		
		var l=0;
		for(var j=1; j<template.length; j++){
			var lbl=document.getElementsByClassName('label');
				lbl[j-1].value=template[j].label;
			var inptyp=document.getElementsByClassName('inputtype');
				selectoption(inptyp[j-1], template[j].inputtype);
			if(inptyp[j-1].value == "Radiobuttons"){
				var rbn=document.getElementsByClassName('radiobuttonsnumber');
					rbn[j-1].style.display="inline";
					selectoption(rbn[j-1], template[j].ifrb.length);
				var rbtnsval=document.getElementsByClassName('buttonsvalues');
					createradiolabels(rbn[j-1], Number(j));
				var rblabel=document.getElementsByClassName('rblabel');
				for(var k=0; k<template[j].ifrb.length; k++){
					rblabel[k+l].value=template[j].ifrb[k];
				}
				l=l+template[j].ifrb.length;
			}	
			var req=document.getElementsByClassName('requirment');
				selectoption(req[j-1], template[j].requirment);
		}
	}
	
	//function for creating new page layout that will allow create new formular
	function adminaddtemplate(){
		var div=document.getElementById("adminbody");
		div.innerHTML="";
		div.style.display="inline";
		document.getElementById("savebutton").style.display="inline";
		var button = document.getElementById("button");
		button.setAttribute("onClick", "saveformular(formname.value, 'add')");
		inputid=1;
		newdiv();
	}
	
	var inputid=1; // global variable for tracking div id of every new element for formular
	//creating div with layout for formular element
	function newdiv(){
		if(inputid != 1){
			var oldbutton=document.getElementById("newdivbutton");
			oldbutton.parentNode.removeChild(oldbutton);
			if(inputid > 2){
				var oldxbutton=document.getElementById("removedivbutton");
				oldxbutton.parentNode.removeChild(oldxbutton);	
			}
		}
		var div=document.getElementById("adminbody");
		var elm=document.createElement("div");
				elm.id= inputid;
				elm.className= "admindivs";
				elm.innerHTML=elm.innerHTML + "Element "+inputid+": ";
			var label=document.createElement("input");
				label.type="text";
				label.className="label";
				elm.appendChild(label);
			var select1 = document.createElement("select")
				select1.className="inputtype";
				select1.setAttribute("onchange", "requirment(this,"+elm.id+"), radiobuttonsnumber(this,"+elm.id+")");
				inputtypeoptions(select1);
				elm.appendChild(select1);
			var select2 = document.createElement("select");
				select2.className="radiobuttonsnumber";
				select2.setAttribute("onchange", "createradiolabels(this,"+elm.id+")");
				radiobuttonsnumberoptions(select2);
				elm.appendChild(select2);
			var select3 = document.createElement("select")
				select3.className="requirment";
				requirmentoptions(select3);
				elm.appendChild(select3);
			var newdivbutton=document.createElement("input");
				newdivbutton.id="newdivbutton";
				newdivbutton.type="submit";
				newdivbutton.value="+";
				newdivbutton.setAttribute("onClick", "newdiv()");
				elm.appendChild(newdivbutton);
			if(inputid !=1){
				var removedivbutton=document.createElement("input");
				removedivbutton.id="removedivbutton";
				removedivbutton.type="submit";
				removedivbutton.value="x";
				removedivbutton.setAttribute("onClick", "removelastdiv("+inputid+")");
				elm.appendChild(removedivbutton);
			}
			div.appendChild(elm);
			var buttonsvalues=document.createElement("div");
				buttonsvalues.className="buttonsvalues";
				buttonsvalues.id="buttons"+inputid;
			
			div.appendChild(buttonsvalues);
			inputid++;

	}
	
	//by clicking button X we call this function to remove last added element of template
	function removelastdiv(divid){
		var div=document.getElementById(divid);
		div.parentNode.removeChild(div);
		var buttonsvalues=document.getElementById("buttons"+divid);
		buttonsvalues.parentNode.removeChild(buttonsvalues)
		var lastdiv=document.getElementById(divid-1);
		var newdivbutton=document.createElement("input");
			newdivbutton.id="newdivbutton";
			newdivbutton.type="submit";
			newdivbutton.value="+";
			newdivbutton.setAttribute("onClick", "newdiv()");
		lastdiv.appendChild(newdivbutton);
		if(inputid > 3 ){
			var removedivbutton=document.createElement("input");
			removedivbutton.id="removedivbutton";
			removedivbutton.type="submit";
			removedivbutton.value="x";
			removedivbutton.setAttribute("onClick", "removelastdiv("+(divid-1)+")");
			lastdiv.appendChild(removedivbutton);
		}
		inputid--;	
	}
	
	//creating options for inputtype select 
	function inputtypeoptions(element){
		var inputtype=["Textbox", "Checkbox", "Radiobuttons"];
		for (var i = 0; i < inputtype.length; i++) {
			var option = document.createElement("option");
				option.value = inputtype[i];
				option.text = inputtype[i];
				element.appendChild(option);
		}
	}
	
	//creating options for	requirment select 
	function requirmentoptions(element){
		var requirment=["None", "Mandatory", "Numeric"];
		for (var i = 0; i < requirment.length; i++) {
			var option = document.createElement("option");
				option.value = requirment[i];
				option.text = requirment[i];
				element.appendChild(option);
		}
	}
	
	//creating options for radiobuttonsnumber select 
	function radiobuttonsnumberoptions(element){
		for (var i = 1; i <= 5; i++) {
			var option = document.createElement("option");
				if(i==1){
					option.value = "";
					option.setAttribute("selected", "selected");
					option.setAttribute("disabled", "disabled");
					element.appendChild(option);
				}
				else{
					option.value = i;
					option.text = ""+i;
					element.appendChild(option);
				}
		}
	}
	
	//after choosing "Radio button" as input in input type this func will show input select for number of radio buttons
	function radiobuttonsnumber(inputtype, divid){  
		var rbn = document.getElementsByClassName("radiobuttonsnumber");
		var bv = document.getElementsByClassName("buttonsvalues");
		if(inputtype.value == "Radiobuttons"){
			rbn[divid-1].style.display= "inline";
		}
		else{
			rbn[divid-1].style.display= "none";
			bv[divid-1].style.display= "none";
		}
	}
	
	//if input type is radio buttons or checkbox input can not be numeric and we have to disable that option
	function requirment(inputtype, divid){
		var requirment=document.getElementsByClassName("requirment");
		if(inputtype.value != "Textbox"){
			requirment[divid-1].options[2].setAttribute("disabled", true);
		}
		else{
			requirment[divid-1].options[2].removeAttribute("disabled");
		}
	}
	
	//after choosing number of radio buttons this function generate inputs for radio button labels 
	function createradiolabels(rbuttonslabels, divid){
		var k=divid - 1;
		var bv = document.getElementsByClassName("buttonsvalues");
		bv[k].innerHTML= "";
		bv[k].style.display= "inline-block";
			for(var i = 1; i <= rbuttonslabels.value; i++){
				var rblabel=document.createElement("input");
					rblabel.type="text";
					rblabel.className="rblabel";
					bv[k].appendChild(rblabel);
					var br=document.createElement("br");
					bv[k].appendChild(br);
			}
	}

	//function that saves formular to database
	function saveformular(searchadminbase, uora){
		var label = document.getElementsByClassName("label");
		var inputtype = document.getElementsByClassName("inputtype");
		var rbn = document.getElementsByClassName("radiobuttonsnumber");
		var requirment = document.getElementsByClassName("requirment");
		var rblabel = document.getElementsByClassName("rblabel");
		
		var form2 =[
			{id: 0, name: searchadminbase}
		];
		var fill = {id: 0, label:"", inputtype:"", ifrb:null, requirment:""};
	
		var mbv = Number(0);
		for(var i=1; i < inputid; i++){			
			form2[i]=Object.create(fill);
			form2[i].id = i;
			form2[i].label = label[i-1].value;
			form2[i].inputtype = inputtype[i-1][inputtype[i-1].selectedIndex].value;
			if(inputtype[i-1].value == "Radiobuttons"){
				var rbv=[];
				var val=rbn[i-1][rbn[i-1].selectedIndex].value;
				for(var j=0; j < val; j++){
					rbv[j]=rblabel[j+mbv].value;
				}
				mbv = Number(mbv) + Number(val);
				form2[i].ifrb=rbv;
			}
			form2[i].requirment=requirment[i-1][requirment[i-1].selectedIndex].value;
		}
		if(uora == "update"){
			var request = indexedDB.open("adminbase", adbvers);
				request.onupgradeneeded = function(event) {
					var db = event.target.result;
					db.deleteObjectStore(searchadminbase);
				};
				request.onsuccess =function(event){
					var db = event.target.result;
					adbvers=db.version+1;
					
					db.close()
					adminwritetoindexdb(form2, searchadminbase);
				};
			window.alert("Template updated");
		}
		else if( uora == "add"){
			adminwritetoindexdb(form2, searchadminbase);
			window.alert("Template saved");
		}	
	}
		
	//function to write filled values to indexdb
	function adminwritetoindexdb(file, name){
		var request = indexedDB.open("adminbase", adbvers);
			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				var objectStore = db.createObjectStore( name, { keyPath: "id"});
        
				for (var i in file) {
					objectStore.add(file[i]);
				}
			};
			request.onsuccess = function(event) {
				var db = event.target.result;
				adbvers=db.version+1;
				db.close();
			};
	}

	//functions for Formular tab
	
	var filedformular=[
        {id:0, name:"Some existing formular", version: 1},                                
       	{id:1, Label: "Label1"},    
       	{id:2, Label: "Label2"},
		{id:3, Label: false},  
		{id:4, Label: 24},
		{id:5, Label: "Radio lb3"},
		{id:6, Label: "Label6"},
		
	];

	//reads admin database and show existing formulars as option to choose in formular tab
	function refreshformularselect(exist){
		var selectformular = document.getElementById("SelectExistingFormular");
		var request = indexedDB.open("adminbase");
			request.onsuccess = function(event) {
				var db = event.target.result
				var templatenames = db.objectStoreNames;
				db.close();
				for(var i=(exist-1); i<templatenames.length; i++){
					var option = document.createElement("option");
					option.text = templatenames[i];;
					option.value = templatenames[i];
					selectformular.appendChild(option);
				}
			};
	
	}
	
	//search formular database by name and version and if formular exist generate page layout with filled fields else just generate page layout based on template
	function generateformular(templatename, version){
		
		document.getElementById("formularbody").style.display="inline";
		document.getElementById("formularform").innerHTML="";
		
		var template;
		var formular;
		var request = indexedDB.open("adminbase");
		request.onsuccess = function(event){
			var db = event.target.result;
			if(db.objectStoreNames.contains(templatename)){
				console.log("Template exist");
				var transaction = db.transaction(templatename, 'readonly');
				var objectStore = transaction.objectStore(templatename);
				if ('getAll' in objectStore) {
					objectStore.getAll().onsuccess = function(event) {
						template = event.target.result.slice();
					};
				}
			}
			var request3 = indexedDB.open("formularbase");
			request3.onsuccess = function(event){
				var db2 = event.target.result;
				if(db2.objectStoreNames.contains(templatename+version)){
					console.log("Formular exist");
					var transaction2 = db2.transaction(templatename+version, 'readonly');
					var objectStore2= transaction2.objectStore(templatename+version);
					if ('getAll' in objectStore2) {
						objectStore2.getAll().onsuccess = function(event) {
							formular = event.target.result.slice();
							db2.close();
							oldformular(template, formular);
						};
					}
					
				}
				else{
					for(var i=1; i<template.length; i++){
						formularlayout(i, template[i]);
					}
					var destination= document.getElementById("formularform");
					var submit= document.createElement("input");
					submit.type="submit";
					submit.id="buttonsave";
					submit.value="Save";
					destination.appendChild(submit);
				}
				
			};
			db.close();
		};
	}

	//generate page layout based on template from adminbase and fill it with values from formular base
	function oldformular(template, existformular){
		for(var i=1; i<template.length; i++){
			formularlayout(i, template[i]);
		}
		var destination= document.getElementById("formularform");
		var submit= document.createElement("input");
		submit.type="submit";
		submit.id="buttonsave";
		submit.value="Save";
		destination.appendChild(submit);
		
		for(var j=1; j<template.length; j++){
			if(template[j].inputtype == "Textbox"){
				var input=document.getElementById(template[j].label);
				input.value=existformular[j].Label;
			}
			else if(template[j].inputtype == "Checkbox"){
				var input=document.getElementById(template[j].label);
				if(existformular[j].Label){
					input.setAttribute("checked", true);
				}
			}
			else{
				var input=document.getElementById(existformular[j].Label);
				input.setAttribute("checked", true);
			}
		}
	}
	
	//generate layout for elements individualy
	function formularlayout(element, template){
		
		var formularf=document.getElementById("formularform");
			var br=document.createElement("br");
			var div=document.createElement("div");
			div.id=element;
			div.className="formulardivs";
			var label=template.label;
			
		if(template.requirment == "Mandatory"){
			label+="*_:";	
		}
		else{
			label+="__:"
		}
		div.innerHTML+=label;
		
		if(template.inputtype == "Textbox"){
			var input=document.createElement("input");
			input.id=template.label;
			input.className="formularinput";
			input.style.marginLeft=" "+16-label.length+"ex";
			if(template.requirment == "Numeric"){
				input.type="number";
				input.setAttribute("placeholder", "Number input");
			}
			else{
				input.type="text";
			}
			if(template.requirment == "Mandatory"){
				input.setAttribute("required", true);
			}
			div.appendChild(input);
		}
		else if(template.inputtype == "Checkbox"){
			var input=document.createElement("input");
			input.id=template.label;
			input.type="checkbox";
			input.style.marginLeft=" "+18-label.length+"ex";
			input.className="formularinput";
			if(template.requirment == "Mandatory"){
				input.setAttribute("required", true);
			}
			div.appendChild(input);
		}
		else{
			var div2=document.createElement("div");
			div2.className="formularradiobuttons";
			var input=[];
			var rblabel=[];
			for(var i=0; i<template.ifrb.length; i++){
				input[i]=document.createElement("input");
				rblabel[i]= document.createElement("LABEL");
				input[i].id=template.ifrb[i];
				input[i].className="formularinput";
				input[i].name="radiobutton"+element;
				input[i].type="radio";
				if(template.requirment == "Mandatory"){
					input[i].setAttribute("required", true);
				}
				rblabel[i].setAttribute("for", input[i].id);
				rblabel[i].innerHTML=template.ifrb[i];
				div2.appendChild(input[i]);
				div2.appendChild(rblabel[i]);
				div2.style.marginLeft=" "+16-label.length+"ex";
				div2.appendChild(document.createElement("br"));
			}
				
			div.appendChild(div2);
		}
		
		formularf.appendChild(div);
		formularf.appendChild(br);
		
	}
	
	//saving filled form to formular database or updating existing one 
	function formularsave(templatename, version){
		var fform =[
			{id: 0, name: templatename, version: Number(version)}
		];
		var fill = {id: 1, Label:""};
		
		var template;
		var request = indexedDB.open("adminbase");
		request.onsuccess = function(event){
			var db = event.target.result;
			if(db.objectStoreNames.contains(templatename)){
				var transaction = db.transaction(templatename, 'readonly');
				var objectStore = transaction.objectStore(templatename);
				if ('getAll' in objectStore) {
					objectStore.getAll().onsuccess = function(event) {
						template = event.target.result.slice();
						for(var i=1; i<template.length; i++){
							fform[i] = Object.create(fill);
							fform[i].id=i;
							if(template[i].inputtype == "Textbox"){
								var input = document.getElementById(template[i].label);
								fform[i].Label=input.value;
							}
							else if(template[i].inputtype == "Checkbox"){
								var input = document.getElementById(template[i].label);
								if(input.checked)
									fform[i].Label=true;
								else
									fform[i].Label=false;
							}
							else{
								var input = document.formularform["radiobutton"+i];
								for (var j = 0; j < input.length; j++){ 
									if (input[j].checked){
										fform[i].Label=input[j].id;
										break;
									}		
								}
							}
						}
						var request2 = indexedDB.open("formularbase");
						request2.onsuccess = function(event){
							var db2 = event.target.result;
							if(db2.objectStoreNames.contains(templatename + version)){
								updateformularinindexdb(fform, templatename + version);
								window.alert("Formular updated");
							}	
							else{
								formularwritetoindexdb(fform, templatename + version);
								window.alert("Formular saved");
							}
							db2.close();
						};
					};
				}
			}
			db.close();
		};
	}
	
	//function we call for writing new formular in formular base
	function formularwritetoindexdb(file, name){
		var request = indexedDB.open("formularbase", fdbvers);
			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				var objectStore = db.createObjectStore( name, { keyPath: "id"});
				for (var i in file) {
					objectStore.add(file[i]);
				}
			};
			request.onsuccess = function(event) {
				var db = event.target.result;
				fdbvers=db.version+1;
				db.close();
			};
	}
	
	//function we call for updating formular in formular base
	function updateformularinindexdb(file, name){
		var request = indexedDB.open("formularbase", fdbvers);
			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				db.deleteObjectStore(name);
			};
			request.onsuccess =function(event){
				var db = event.target.result;
				fdbvers=db.version+1;	
				db.close()
				formularwritetoindexdb(file, name);
			};
	}