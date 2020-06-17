const exampleTitre = "ISS (ZARYA)";
const example1 = "1 25544U 98067A   14273.50403866  .00012237  00000-0  21631-3 0  1790";
const example2 = "2 25544  51.6467 297.5710 0002045 126.1182  27.2142 15.50748592907666";

function text2Binary(string, nbBits) {
    result = "";
    for (var i = 0; i < string.length; i++) {
        result += string[i].charCodeAt(0).toString(2);
    }
    while (result.length < nbBits) {
        result = '0' + result;
    }
    return result;
}

function binary2Text(binary, nbLetters) {
    let result = String.fromCharCode(parseInt(binary, 2));
    while (result.length < nbLetters) {
        result += " ";
    }
    return result;
}

// Entier positif
function int2Binary(int, nbBits) {
    int = Number(int);
    result = int.toString(2);
    while (result.length < nbBits) {
        result = '0' + result;
    }
    return result;
}

function binary2Int(byte, nbDigits) {
    byte = Number(byte);
    result = parseInt(byte, 2);
    result = result.toString();
    while (result.length < nbDigits) {
        result = '0' + result;
    }
    return result;
}

function testLigne1() {
    line1 = example1;
    document.getElementById("ligne1").innerHTML = line1;
    let byte1 = convertLine1();
    document.getElementById("resultLigne1").innerHTML = byte1;
    let dec1 = deconvertLine1(byte1);
    document.getElementById("DeresultLigne1").innerHTML = dec1;
}

function convertLine1() {
    let result = '';
    // Satellite catalog number
    // 5 digits, >0, 17 bits
    result += int2Binary(line1.substring(2, 7), 17);
    // Classification
    // (U, C, S), 8 bits
    result += text2Binary(line1.substring(7, 8), 8);
    // International Designator (last two digits of launch year)
    // 2 digits, >0, 7 bits
    result += int2Binary(line1.substring(9, 11), 7);
    // International Designator (launch number of the year)
    // 3 digits, >0, 10 bits
    result += int2Binary(line1.substring(11, 14), 10);

    return result;
}

function deconvertLine1(byte) {
    let result = "1 ";
    // Satellite catalog number, 5 digits, >0, 17 bits
    result += binary2Int(byte.substring(0, 17), 5);
    // Classification (U, C, S), 8 bits
    result += binary2Text(byte.substring(17, 25)) + " ";
    // International Designator (last two digits of launch year)
    // 2 digits, >0, 7 bits
    result += binary2Int(byte.substring(25, 32), 2);
    // International Designator (launch number of the year)
    // 3 digits, >0, 10 bits
    result += binary2Int(byte.substring(32, 42), 3);

    return result;
}
