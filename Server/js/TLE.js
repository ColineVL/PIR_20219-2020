// Example de wikipédia anglais
const exampleTitre = "ISS (ZARYA)";
const example1 = "1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927";
const example2 = "2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537";

// Text or char
function text2Binary(string, nbBits) {
    result = "";
    for (var i = 0; i < string.length; i++) {
        if (string[i] !== " ") {
            result += string[i].charCodeAt(0).toString(2);
        }
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
    result = parseInt(byte, 2);
    result = result.toString();
    while (result.length < nbDigits) {
        result = '0' + result;
    }
    return result;
}

// Signe
// TODO remplacer ces deux fonctions par une map, un dict ?
function sign2Binary(sign) {
    if (sign === "-") {
        return "1";
    } else {
        return "0";
    }
}

function binaryToSign(bin) {
    if (bin === "0") {
        return " ";
    } else {
        return "-";
    }
}

// Conversion
function convertLine1() {
    let result = '';

    // (1) Line number

    // (2) Satellite catalog number
    // 5 digits, >0, 17 bits
    result += int2Binary(line1.substring(2, 7), 17);

    // (3) Classification
    // (U, C, S), 8 bits
    result += text2Binary(line1.substring(7, 8), 8);
    // Don't forget the space

    // (4) International Designator (last two digits of launch year)
    // 2 digits, >0, 7 bits
    result += int2Binary(line1.substring(9, 11), 7);

    // (5) International Designator (launch number of the year)
    // 3 digits, >0, 10 bits
    result += int2Binary(line1.substring(11, 14), 10);

    // (6) International Designator (piece of the launch)
    // 3 letters, 24 bits
    result += text2Binary(line1.substring(14, 17), 24);
    // Don't forget the space

    // (7) Epoch year (last two digits of year)
    // 2 digits, >0, 7 bits
    result += int2Binary(line1.substring(18, 20), 7);

    // (8) Epoch (day of the year and fractional portion of the day)
    // Day: 3 digits, >0, 10 bits
    result += int2Binary(line1.substring(20, 23), 10);
    // Don't forget the point
    // Fractional portion: 8 digits, >0, 27 bits
    result += int2Binary(line1.substring(24, 32), 27);
    // Don't forget the space

    // (9) First Derivative of Mean Motion aka the Ballistic Coefficient
    // Sign: + or -, 1 digit, 1 bit
    result += sign2Binary(line1.substring(33, 34));
    // Don't forget the point
    // Value: 8 digits, >0, 27 bits
    result += int2Binary(line1.substring(35, 43), 27);
    // Don't forget the space

    // (10) Second Derivative of Mean Motion (decimal point assumed)
    // Sign: + or -, 1 digit, 1 bit
    result += sign2Binary(line1.substring(44, 45));
    // Value: 5 digits, 17 bits
    result += int2Binary(line1.substring(45, 50), 17);
    // Sign: + or -, 1 digit, 1 bit
    result += sign2Binary(line1.substring(50, 51));
    // Value: 1 digit, 4 bits
    result += int2Binary(line1.substring(51, 52), 4);
    // Don't forget the space

    // (11) Drag Term aka Radiation Pressure Coefficient or BSTAR (decimal point assumed)
    // Sign: + or -, 1 digit, 1 bit
    result += sign2Binary(line1.substring(53, 54));
    // Value: 5 digits, 17 bits
    result += int2Binary(line1.substring(54, 59), 17);
    // Sign: + or -, 1 digit, 1 bit
    result += sign2Binary(line1.substring(59, 60));
    // Value: 1 digit, 4 bits
    result += int2Binary(line1.substring(60, 61), 4);
    // Don't forget the space

    // (12) Ephemeris type (internal use only - always zero in distributed TLE data)
    // 1 digit
    // Don't forget space

    // (13) Element set number. Incremented when a new TLE is generated for this object.
    // 4 digits, 14 bits
    result += int2Binary(line1.substring(64, 68), 14);

    // (14) Checksum (modulo 10)
    // 1 digit, 4 bits
    result += int2Binary(line1.substring(68, 69), 4);

    return result;
}

function deconvertLine1(byte) {

    // (1) Line number
    let result = "1 ";

    // (2) Satellite catalog number, 5 digits, >0, 17 bits
    result += binary2Int(byte.substring(0, 17), 5);

    // (3) Classification (U, C, S), 8 bits
    result += binary2Text(byte.substring(17, 25)) + " ";
    // Don't forget the space

    // (4) International Designator (last two digits of launch year)
    // 2 digits, >0, 7 bits
    result += binary2Int(byte.substring(25, 32), 2);

    // (5) International Designator (launch number of the year)
    // 3 digits, >0, 10 bits
    result += binary2Int(byte.substring(32, 42), 3);

    // (6) International Designator (piece of the launch)
    // 3 letters, 24 bits
    result += binary2Text(byte.substring(42, 66), 3) + " ";
    // Don't forget the space

    // (7) Epoch year (last two digits of year)
    // 2 digits, >0, 7 bits
    result += binary2Int(byte.substring(66, 73), 2);

    // (8) Epoch (day of the year and fractional portion of the day)
    // Day: 3 digits, >0, 10 bits
    result += binary2Int(byte.substring(73, 83), 3) + ".";
    // Don't forget the point
    // Fractional portion: 8 digits, >0, 27 bits
    result += binary2Int(byte.substring(83, 110), 8) + " ";
    // Don't forget the space

    // (9) First Derivative of Mean Motion aka the Ballistic Coefficient
    // Sign: + or -, 1 digit, 1 bit
    result += binaryToSign(byte.substring(110, 111)) + ".";
    // Don't forget the point
    // Value: 8 digits, >0, 27 bits
    result += binary2Int(byte.substring(111, 138), 8) + " ";
    // Don't forget the space

    // (10) Second Derivative of Mean Motion (decimal point assumed)
    // Sign: + or -, 1 digit, 1 bit
    result += binaryToSign(byte.substring(138, 139));
    // Value: 5 digits, 17 bits
    result += binary2Int(byte.substring(139, 156), 5);
    // Sign: + or -, 1 digit, 1 bit
    result += binaryToSign(byte.substring(156, 157));
    // Value: 1 digit, 4 bits
    result += binary2Int(byte.substring(157, 161), 1) + " ";
    // Don't forget the space

    // (11) Drag Term aka Radiation Pressure Coefficient or BSTAR (decimal point assumed)
    // Sign: + or -, 1 digit, 1 bit
    result += binaryToSign(byte.substring(161, 162));
    // Value: 5 digits, 17 bits
    result += binary2Int(byte.substring(162, 179), 5);
    // Sign: + or -, 1 digit, 1 bit
    result += binaryToSign(byte.substring(179, 180));
    // Value: 1 digit, 4 bits
    result += binary2Int(byte.substring(180, 184), 1) + " ";
    // Don't forget the space

    // (12) Ephemeris type (internal use only - always zero in distributed TLE data)
    // 1 digit
    result += "0 ";
    // Don't forget space

    // (13) Element set number. Incremented when a new TLE is generated for this object.
    // 4 digits, 14 bits
    result += binary2Int(byte.substring(184, 198), 4);

    // (14) Checksum (modulo 10)
    // 1 digit, 4 bits
    result += binary2Int(byte.substring(198, 202), 1);

    return result;
}

// Test
function testLigne1() {
    line1 = example1;
    document.getElementById("ligne1").innerHTML = line1;
    let byte1 = convertLine1();
    console.log(byte1.length);
    document.getElementById("resultLigne1").innerHTML = byte1;
    let dec1 = deconvertLine1(byte1);
    document.getElementById("DeresultLigne1").innerHTML = dec1;
}
