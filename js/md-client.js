// A client-side module that provides the ability to parse markdown in handlebars.
// This is intended to be added as a child component of a grade that wires in helpers, such as `fluid.handlebars.renderer`
//
/* eslint-env browser */
(function (fluid) {
    "use strict";
    fluid.registerNamespace("fluid.handlebars.helper.md.client");

    fluid.handlebars.helper.md.client.initConverter = function (that) {
        that.renderer = window.markdownit(that.options.markdownItOptions);
        that.events.rendererAvailable.fire();
    };

    fluid.defaults("fluid.handlebars.helper.md.client", {
        gradeNames: ["fluid.handlebars.helper.md"],
        listeners: {
            onCreate: [
                {
                    funcName: "fluid.handlebars.helper.md.client.initConverter",
                    args:     ["{that}"]
                }
            ]
        }
    });
})(fluid);
