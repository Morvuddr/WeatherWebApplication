global.Handlebars = require('handlebars');

const bodyHtml =
    '<div id="body"></div>' +
    '<script id="hdlbrs_tmplt" type="text/x-handlebars-template"> <div id="myErrorContainer"> {{ errorString }}</div> <div id="place"> {{ place }} </div> <div id="weather"> {{ weather }}</div> <div id="temperature"> {{ temp }}</div> <div id="wind"> {{ wind }}</div> <div id="press">{{ press }}</div></script>' +
    '<div class="loader" id="loader"></div>' +
    '<form id="myFormID"></form>' +
    '</div>';

Object.defineProperty(document, 'currentScript', {
    value: document.createElement('script'),
});
document.body.innerHTML = bodyHtml;

exports.bodyHtml = bodyHtml;