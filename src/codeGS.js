/**
 * Cuando un usuario visita una aplicación o un programa envía a la aplicación una HTTP GET request
 * @param {*} request 
 * @returns Pagina Web
 */

function doGet(request) {
    return HtmlService.createTemplateFromFile('Index').evaluate();
}

/**
 * Funcion que trae la data del sheet 
 * @returns {object} Contiene la información de la base de datos
 */
function globalVariables() {
    var varArray = {
        spreadsheetId: '1CgEI8rd4oBCBpUdfSUjW4j4i8zIlMhVZ8ggEF8sc5jc',
        dataRage: 'Data!A2:AI',
        idRange: 'Data!A2:AI',
        lastCol: 'AI',
        insertRange: 'Data!A1:AI1',
        sheetID: '0'
    };
    return varArray;
}

/**
 * Permite retornar la información de los contratos almacenados en la base de datos
 * @param {*} formObject Objeto que contiene la información del formulario "INSCRIPCIÓN DE CONTRATO"
 * @returns {array} Array con toda la información contractual
 */
function process(formObject) {
    var result = "";
    if (formObject.searchtext) {
        // @ts-ignore
        result = search(formObject.searchtext);
    }
    return result;
}

/**
 * Consulta y trae la información de los contratos almacenados en la base de datos
 * @param {boolean} searchtext 
 * @returns Array con toda la información contractual
 */
function search(searchtext) {
    var spreadsheetId = '1CgEI8rd4oBCBpUdfSUjW4j4i8zIlMhVZ8ggEF8sc5jc';
    var dataRage = 'Data!A2:AI';
    var data = Sheets.Spreadsheets.Values.get(spreadsheetId, dataRage).values;
    var ar = [];
    data.forEach(function (f) {
        if (~f.indexOf(searchtext)) {
            ar.push(f);
        }
    });
    return ar;


}

/**
 * Permite actualizar o ingresar información nueva de contratos
 * @param {object} formObject formObject Objeto que contiene la información del formulario "INSCRIPCIÓN DE CONTRATO"
 * @returns {array} Ultimos 10 contratos
 */
function processForm(formObject) {
    if (formObject.RecId && checkID(formObject.RecId)) {// SE EJECUTA SI TIENE UN ID EXISTENTE 
        updateData(getFormValues(formObject), globalVariables().spreadsheetId, getRangeByID(formObject.RecId)); // ACTUALIZAR DATA
    } else {
        appendData(getFormValues(formObject), globalVariables().spreadsheetId, globalVariables().insertRange);
    }
    return getLastTenRows();// TRAE LOS ULTIMOS 10 DATOS 
}




/* Tomar del array los datos */
/**
 * Almacena la información de el objeto proveniente del formulario dentro de un array
 * @param {object} formObject formObject Objeto que contiene la información del formulario "INSCRIPCIÓN DE CONTRATO"
 * @returns {array} Contiene la información ingresada en el formulario
 */
function getFormValues(formObject) {
    /* Agregar variables con el form*/
    if (formObject.RecId && checkID(formObject.RecId)) {
        var values = [[formObject.RecId.toString(),
        formObject.ident,
        formObject.tipodepersona,
        formObject.identificacion,
        formObject.cnumber,
        formObject.razonsocial,
        formObject.nombrec,
        formObject.repre,
        formObject.identrepre,
        formObject.identificacionrepre,
        formObject.domi,
        formObject.direc,
        formObject.email,
        formObject.phone,
        formObject.country,
        formObject.fechainicio,
        formObject.fechaterm,
        formObject.objeto,
        formObject.alcan,
        formObject.Proyecto,
        formObject.lugar,
        formObject.tipoc,
        formObject.acuerd,
        formObject.valor,
        formObject.anticipo,
        formObject.reteg,
        formObject.porcrete,
        formObject.encargado,
        formObject.empresa,
        formObject.estado,
        formObject.solicitante,
        formObject.anexos,
        formObject.cfinal]];
    } else {
        var values = [[new Date().getTime().toString(),
        formObject.ident,
        formObject.tipodepersona,
        formObject.identificacion,
        formObject.cnumber,
        formObject.razonsocial,
        formObject.nombrec,
        formObject.repre,
        formObject.identrepre,
        formObject.identificacionrepre,
        formObject.domi,
        formObject.direc,
        formObject.email,
        formObject.phone,
        formObject.country,
        formObject.fechainicio,
        formObject.fechaterm,
        formObject.objeto,
        formObject.alcan,
        formObject.Proyecto,
        formObject.lugar,
        formObject.tipoc,
        formObject.acuerd,
        formObject.valor,
        formObject.anticipo,
        formObject.reteg,
        formObject.porcrete,
        formObject.encargado,
        formObject.empresa,
        formObject.estado,
        formObject.solicitante,
        formObject.anexos,
        formObject.cfinal]];
    }
    return values;
}


/*
 
FUNCIONES DEL CRUD
 
*/


/* CREAR Y UNIR INFORMACION */
/**
 * Registra los datos del contrato en la base de datos
 * @param {array} values Información del contrato
 * @param {string} spreadsheetId ID de la hoja de cálculo que hace de BD
 * @param {string} range Rango de valores dentro de la hoja de cálculo
 */
function appendData(values, spreadsheetId, range) {
    var valueRange = Sheets.newRowData();
    valueRange.values = values;
    var appendRequest = Sheets.newAppendCellsRequest();
    appendRequest.sheetID = spreadsheetId;
    appendRequest.rows = valueRange;
    var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range, { valueInputOption: "RAW" });
}


/**
 * Permite obtener los valores de un rango en una hoja de cálculo
 * @param {string} spreadsheetId ID de la hoja de cálculo que hace de BD
 * @param {string} range Rango de valores dentro de la hoja de cálculo
 * @returns {array} Valores almacenados en la hoja de calculo
 */
function readData(spreadsheetId, range) {
    var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
    return result.values;
}


/**
 * Actualiza los datos del contrato en la base de datos
 * @param {array} values Información del contrato
 * @param {string} spreadsheetId ID de la hoja de cálculo que hace de BD
 * @param {string} range Rango de valores dentro de la hoja de cálculo 
 */
function updateData(values, spreadsheetId, range) {
    var valueRange = Sheets.newValueRange();
    valueRange.values = values;
    var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
        valueInputOption: "RAW"
    });
}


/**
 * Permite eliminar una fila de la base de datos
 * @param {string} ID ID de la fila
 * @returns {array} returna el contenido de las últimas 10 filas
 */
function deleteData(ID) {

    var startIndex = getRowIndexByID(ID);

    var deleteRange = {
        "sheetId": globalVariables().sheetID,
        "dimension": "ROWS",
        "startIndex": startIndex,
        "endIndex": startIndex + 1
    }

    var deleteRequest = [{ "deleteDimension": { "range": deleteRange } }];
    Sheets.Spreadsheets.batchUpdate({ "requests": deleteRequest }, globalVariables().spreadsheetId);

    return getLastTenRows();
}


/**
 * Consulta sí el ID existe en la base de datos
 * @param {string} ID ID de la fila
 * @returns {boolean}
 */
function checkID(ID) {
    var idList = readData(globalVariables().spreadsheetId, globalVariables().idRange,).reduce(function (a, b) { return a.concat(b); });
    return idList.includes(ID);
}


/**
 * Retorna el range de la fila mediante su ID
 * @param {string} id ID de la fila
 * @returns {string} Rango
 */
function getRangeByID(id) {
    if (id) {
        var idList = readData(globalVariables().spreadsheetId, globalVariables().idRange);
        for (var i = 0; i < idList.length; i++) {
            if (id == idList[i][0]) {
                return 'Data!A' + (i + 2) + ':' + globalVariables().lastCol + (i + 2);
            }
        }
    }
}



/**
 * Retorna la información del contrato consultando por ID
 * @param {string} id ID de la fila
 * @returns {array} Información del contrato
 */
function getRecordById(id) {
    if (id && checkID(id)) {
        var result = readData(globalVariables().spreadsheetId, getRangeByID(id));
        return result;
    }
}

/**
 * Retorna la información del contrato consultando por CC
 * @param {string} CC Número del contrato 
 * @returns {array} Información del contrato
 */
function getRecordCC(CC) {
    if (CC && checkID(CC)) {
        var result1 = readData(globalVariables().spreadsheetId, getRangeByID(CC));
        return result1;
    }
}




/**
 * Retorna la indice de la fila mediante el ID de la misma
 * @param {string} id ID de la fila
 * @returns {number} Indice de la fila
 */
function getRowIndexByID(id) {
    if (id) {
        var idList = readData(globalVariables().spreadsheetId, globalVariables().idRange);
        for (var i = 0; i < idList.length; i++) {
            if (id == idList[i][0]) {
                var rowIndex = parseInt(i + 1);
                return rowIndex;
            }
        }
    }
}


/**
 * Consulta la información de los últimos 10 contratos
 * @returns {array} Información de los ultimos 10 contratos
 */
function getLastTenRows() {
    var lastRow = readData(globalVariables().spreadsheetId, globalVariables().dataRage).length + 1;
    if (lastRow <= 11) {
        var range = globalVariables().dataRage;
    } else {
        var range = 'Data!A' + (lastRow - 4) + ':' + globalVariables().lastCol;
    }
    var lastTenRows = readData(globalVariables().spreadsheetId, range);
    return lastTenRows;
}


/**
 * Consulta toda la información el la base de datos
 * @returns {arrat} Información de todos los contratos
 */
function getAllData() {
    var data = readData(globalVariables().spreadsheetId, globalVariables().dataRage);
    return data;
}



/**
 * Retorna los valores para la lista desplegable del formulario
 * @param {string} range 
 * @returns {array} Lista
 */
function getDropdownList(range) {
    var list = readData(globalVariables().spreadsheetId, range);
    return list;
}



/**
 * Permite insertar un fragmento de HTML dentro de otro bloque de HTML
 * @param {*} filename 
 * @returns {string} HTML
 */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

