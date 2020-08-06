const moment = require("moment");

module.exports = {
  base64: (data) => data.toString("base64"),
  formatDate: (date, format) => moment(date).format(format),
  replaceBreaks: (str) => str.replace(/(?:\r\n|\r|\n)/g, "<br>"),
  truncate: (str, len, link) => {
    if (str.length > len && str.length > 0) {
      let newStr = str + " ";
      newStr = str.substr(0, len);
      newStr = str.substr(0, newStr.lastIndexOf(" "));
      newStr = newStr.length > 0 ? newStr : str.substr(0, len);
      return (
        newStr +
        "... " +
        (link ? '<a href="/cocktails/' + link + '">[mehr]</a>' : "")
      );
    }
    return str;
  },
  select: (selected, options) =>
    options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      ),
};
