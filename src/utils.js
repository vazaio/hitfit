export function getBattery(bytes) {//via  https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
    let batt = Buffer.from(bytes.buffer)// https://github.com/vshymanskyy/miband-js/blob/master/src/miband.js
    if (batt.length <= 2) return 'unknown';
    let res = {}
    res.level = batt[1]
    res.charging = !!batt[2]
    return res;
}

export function getPedometer(bytes) {
    let pedo = Buffer.from(bytes.buffer)
    let res = {}
    res.steps = pedo.readUInt16LE(1)
    if (pedo.length >= 8)  res.distance = pedo.readUInt32LE(5)
    if (pedo.length >= 12) res.calories = pedo.readUInt32LE(9)
    return res
}

export function getHeartRate(bytes) {
    bytes = bytes.buffer ? bytes : new DataView(bytes);
    let flags = bytes.getUint8(0);
    let rate16Bits = flags & 0x1;
    let res = {};
    let index = 1;
    if (rate16Bits) {
      res.heartRate = bytes.getUint16(index, true);
      index += 2;
    } else {
      res.heartRate = bytes.getUint8(index);
      index += 1;
    }
    let rrIntervalPresent = flags & 0x10;
    if (rrIntervalPresent) {
      let rrIntervals = [];
      for (; index + 1 < bytes.byteLength; index += 2) {
        rrIntervals.push(bytes.getUint16(index, true));
      }
      res.rrIntervals = rrIntervals;
    }
    return res;
}
