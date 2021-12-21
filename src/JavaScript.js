/**
 * Evita el envio del formulario
 */

 function preventFormSubmit() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function (event) {
            event.preventDefault();
        });
    }
}
window.addEventListener("load", functionInit, true);

/**
 * Ejecuta algunas funciones cuando la pagina cargue
 */
function functionInit() {
    getLastTenRows();
    preventFormSubmit();

};

/**
 * Almacena la información del contrato y crea una tabla con los últimos 10 contratos
 * @param {object} formObject Formulario
 */
function handleFormSubmit(formObject) {
    google.script.run.withSuccessHandler(createTable).processForm(formObject);
    document.getElementById("myForm").reset();
}

/**
 * Consulta todos los contratis y crea una tabla con los mismos
 * @param {object} formObject Formulario
 */
function handleeFormSubmit(formObject) {
    google.script.run.withSuccessHandler(createTable).process(formObject);
    document.getElementById("search-form").reset();
}

/**
 * Crea una tabla con los últimos 10 contratos
 */
function getLastTenRows() {
    google.script.run.withSuccessHandler(createTable).getLastTenRows();
}

/**
 * Crea una tabla con todos los contratos
 */
function getAllData() {
    document.getElementById('dataTable').innerHTML = "";
    google.script.run.withSuccessHandler(createTable).getAllData();
}


/**
 * Crea una tabla con los contratos ingresados
 * @param {array} dataArray Contratos
 */
function createTable(dataArray) {
    if (dataArray) {
        var result = "<table class='table table-responsive-sm' style='font-size:0.9em'>" +
            "<thead class='thead' style='white-space: nowrap'>" +
            "<tr>" +
            "<th scope='col'></th>" +//Change table headings to match witht he Google Sheet
            "<th scope='col'>Editar</th>" +
            "<th scope='col'>ID</th>" +
            "<th scope='col'>Tipo de identificacion</th>" +
            "<th scope='col'>Tipo de persona</th>" +
            "<th scope='col'>N° de identificacion</th>" +
            "<th scope='col'>N° de contrato</th>" +
            "<th scope='col'>Razon Social</th>" +
            "<th scope='col'>Nombre comercial</th>" +
            "<th scope='col'>Nombre del representante</th>" +
            "<th scope='col'>Tipo de identificacion del representante</th>" +
            "<th scope='col'>N° de identificacion del representante</th>" +
            "<th scope='col'>Lugar de expedicion</th>" +
            "<th scope='col'>Direccion</th>" +
            "<th scope='col'>Email</th>" +
            "<th scope='col'>Numero de telefono</th>" +
            "<th scope='col'>Departamento</th>" +
            "<th scope='col'>Fehca de Inicio</th>" +
            "<th scope='col'>Fecha de Terminanción</th>" +
            "<th scope='col'>Objeto</th>" +
            "<th scope='col'>Alcamce</th>" +
            "<th scope='col'>Proyecto/Area</th>" +
            "<th scope='col'>Lugar de desarrollo</th>" +
            "<th scope='col'>Tipo de contrato</th>" +
            "<th scope='col'>Tipo de acuerdo</th>" +
            "<th scope='col'>Valor (sin IVA)</th>" +
            "<th scope='col'>Anticipo Autorizado(%)</th>" +
            "<th scope='col'>Aplica Retegarantia</th>" +
            "<th scope='col'>Porcentaje Retegarantia</th>" +
            "<th scope='col'>Persona aprobadora</th>" +
            "<th scope='col'>Empresa</th>" +
            "<th scope='col'>Estado</th>" +
            "<th scope='col'>Solicitante</th>" +
            "<th scope='col'>Anexos</th>" +
            "<th scope='col'>Contrato final</th>" +
            "<th scope='col'>Link</th>" +
            "<th scope='col'>Estado del contrato</th>" +
            "</tr>" +
            "</thead>";
        for (var i = 0; i < dataArray.length; i++) {
            result += "<tr>";
            result += "<td></td>";
            result += "<td><button type='button' class='btn btn-warning btn-xs editBtn' onclick='editData(this);'><img src='https://drive.google.com/uc?export=view&id=1c4KbKf9H7spiO4yA0WGp_c8k8WcUyPup'high='70%' width='70%' justify='center'></button></td>";
            for (var j = 0; j < dataArray[i].length; j++) {
                result += "<td>" + dataArray[i][j] + "</td>";
            }
            result += "</tr>";
        }
        result += "</table>";
        var div = document.getElementById('search-results');
        div.innerHTML = result;
        document.getElementById("message").innerHTML = "";
    } else {
        var div = document.getElementById('search-results')
        div.innerHTML = "Data not found!";
    }
}

/**
 * Permite eliminar un contrato
 * @param {string} elemento
 */
function deleteData(el) {
    var result = confirm("¿Seguro que quieres eliminar?");
    if (result) {
        var recordId = el.parentNode.parentNode.cells[2].innerHTML;
        google.script.run.withSuccessHandler(createTable).deleteData(recordId);
    }
}

/**
 * Trae la información del contrato seleccionado para su edición
 * @param {string} el 
 */
function editData(el) {
    var recordId = el.parentNode.parentNode.cells[2].innerHTML; //https://stackoverflow.com/a/32377357/2391195
    google.script.run.withSuccessHandler(populateForm).getRecordById(recordId);
}

/**
 * Trae la información de un contrato de acuerdo a su número
 */
function DataCC() {
    var recordCC = document.getElementById('cnumber').value;
    google.script.run.withSuccessHandler(populateForm).getRecordCC(recordCC);
}

/**
 * Permite rellenar el formulario con la información del contrato seleccionado
 * @param {array} records Información de los contratos
 */
function populateForm(records) {
    document.getElementById('RecId').value = records[0][0];
    document.getElementById('ident').value = records[0][1];
    document.getElementById(records[0][2]).checked = true;
    document.getElementById('identificacion').value = records[0][3];
    document.getElementById('cnumber').value = records[0][4];
    document.getElementById('razonsocial').value = records[0][5];
    document.getElementById('nombrec').value = records[0][6];
    document.getElementById('repre').value = records[0][7];
    document.getElementById('identrepre').value = records[0][8];
    document.getElementById('identificacionrepre').value = records[0][9];
    document.getElementById('domi').value = records[0][10];
    document.getElementById('direc').value = records[0][11];
    document.getElementById('email').value = records[0][12];
    document.getElementById('phone').value = records[0][13];
    document.getElementById('country').value = records[0][14];
    document.getElementById('fechainicio').value = records[0][15];
    document.getElementById('fechaterm').value = records[0][16];
    document.getElementById('objeto').value = records[0][17];
    document.getElementById('alcan').value = records[0][18];
    document.getElementById('Proyecto').value = records[0][19];
    document.getElementById('lugar').value = records[0][20];
    document.getElementById('tipoc').value = records[0][21];
    document.getElementById('acuerd').value = records[0][22];
    document.getElementById('valor').value = records[0][23];
    document.getElementById('anticipo').value = records[0][24];
    document.getElementById(records[0][25]).checked = true;
    document.getElementById('porcrete').value = records[0][26];
    document.getElementById('encargado').value = records[0][27];
    document.getElementById(records[0][28]).checked = true;
    document.getElementById("estado").value = records[0][29];
    document.getElementById("solicitante").value = records[0][30];
    document.getElementById("anexos").value = records[0][31];
    document.getElementById("cfinal").value = records[0][32];
    document.getElementById("message").innerHTML = "<div class='alert alert-warning' role='alert'>Update Record [ID: " + records[0][0] + "]</div>";
}

/**
 * Genera las diferentes listas desplegables
 */
function createCountryDropdown() {

    google.script.run.withSuccessHandler(countryDropDown).getDropdownList("Helpers!A1:A1120");
    google.script.run.withSuccessHandler(identDropDown).getDropdownList("ident!A1:A5");
    google.script.run.withSuccessHandler(identrepreDropDown).getDropdownList("ident!A1:A5");
    google.script.run.withSuccessHandler(acuerdDropDown).getDropdownList("tipoc!A1:A5");
    google.script.run.withSuccessHandler(estadodDropDown).getDropdownList("Estado del contrato!A1:A5");
    google.script.run.withSuccessHandler(tipocdDropDown).getDropdownList("Tipo de contrato!A1:A5");
    google.script.run.withSuccessHandler(lugarDropDown).getDropdownList("Helpers!A1:A1120");
    google.script.run.withSuccessHandler(scolicitanteDropDown).getDropdownList("SOLICITANTE!A1:A10");
}


/**
 * Genera una lista de departamentos
 * @param {array} values Lista de departamentos
 */
function countryDropDown(values) {
    var list = document.getElementById('country');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de tipos de identificación
 * @param {array} values Lista de tipos de identificación
 */
function identDropDown(values) {
    var list = document.getElementById('ident');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de tipos de identificación
 * @param {array} values Lista de tipos de identificación
 */
function identrepreDropDown(values) {
    var list = document.getElementById('identrepre');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de tipos de acuerdo
 * @param {array} values Lista de tipos de acuerdo
 */
function acuerdDropDown(values) {
    var list = document.getElementById('acuerd');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de estados
 * @param {array} values Lista de estados
 */
function estadodDropDown(values) {
    var list = document.getElementById('estado');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de tipos de contrato
 * @param {array} values Lista de tipos de contrato
 */
function tipocdDropDown(values) {
    var list = document.getElementById('tipoc');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de lugares de expedición
 * @param {array} values Lista de lugares de expedición
 */
function lugarDropDown(values) {
    var list = document.getElementById('lugar');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}

/**
 * Genera una lista de solicitantes
 * @param {array} values Lista de solicitantes
 */
function scolicitanteDropDown(values) {
    var list = document.getElementById('solicitante');
    for (var i = 0; i < values.length; i++) {
        var option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        list.appendChild(option);
    }
}