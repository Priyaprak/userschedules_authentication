const exphbs = require("express-handlebars");

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

module.exports = {
  hbsHelpers: {
    eq :function (a,b,opts) {
        console.log("IF " + a + b)
        if (a === b) {
            console.log("IF true")
            return opts.fn(this);
        } else {
            console.log("IF false")
            return opts.inverse(this);
        }
        },
        
  },
};
