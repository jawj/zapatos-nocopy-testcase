
const actualMoment = jest.requireActual('moment');
let fixedMoment = null, offset = null;

function moment(...args) {
  if (args.length) return actualMoment(...args);

  const
    m1 = fixedMoment ? fixedMoment.clone() : actualMoment(),
    m2 = offset ? m1.add(...offset) : m1;

  return m2;
}

moment.__setOffset__ = function (...args) {  // ...args should be (null), or (time: number, units: string)
  offset = args.length === 2 ? args : null;
}

moment.__setFixed__ = function (m) {  // m should be null or a moment
  fixedMoment = m;
}

moment.prototype = actualMoment.prototype;
for (let k in actualMoment) if (actualMoment.hasOwnProperty(k)) moment[k] = actualMoment[k];

module.exports = moment;
