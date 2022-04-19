    
var uploadField = document.getElementById("mainImage");

uploadField.onchange = function() {
    if(this.files[0].size > 5242880){
       alert("La imagen seleccionada es muy grande. Seleccione otra.");
       this.value = "";
    };
};

var uploadField = document.getElementById("extraImage");

uploadField.onchange = function() {

    if(this.files[0].size > 5242880){
       alert("La imagen seleccionada es muy grande. Seleccione otra.");
       this.value = "";
    }
};
/*
var uploadField = document.getElementById("extraImage1");

uploadField.onchange = function() {

    if(this.files[0].size > 5242880){
       alert("La imagen seleccionada es muy grande. Seleccione otra.");
       this.value = "";
    }
};*/
var uploadField = document.getElementById("extraImage2");

uploadField.onchange = function() {

    if(this.files[0].size > 5242880){
       alert("La imagen seleccionada es muy grande. Seleccione otra.");
       this.value = "";
    }
};
var uploadField = document.getElementById("extraImage3");

uploadField.onchange = function() {

    if(this.files[0].size > 5242880){
       alert("La imagen seleccionada es muy grande. Seleccione otra.");
       this.value = "";
    }
};