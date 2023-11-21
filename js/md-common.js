// A base gradeName that provides a markdown-parsing helper for handlebars.
//
// NOTE:  This grade should not be used directly, you should add either the server or client appropriate gradeName to the appropriate list of components.
//
//  For your convenience, here are those grade names:
//  _server_: `fluid.handlebars.helper.md.server`
//  _client_: `fluid.handlebars.helper.md.client`
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.handlebars.helper.md");

fluid.handlebars.helper.md.getMdFunction = function (that) {
    return function (context) {
        if (context) {
            if (that && that.renderer) {
                // We need to ensure that this is a string, as Pagedown cannot handle anything else.
                return that.renderer.render(String(context));
            }
            else {
                fluid.fail("Can't convert markdown content because the renderer could not be found.");
            }
        }

        // If we can't evolve the output, we just pass it through.
        return context;
    };
};

fluid.defaults("fluid.handlebars.helper.md", {
    gradeNames: ["fluid.handlebars.helper"],
    helperName: "md",
    markdownItOptions: {},
    members: {
        renderer: null
    },
    invokers: {
        "getHelper": {
            "funcName": "fluid.handlebars.helper.md.getMdFunction",
            "args":     ["{that}"]
        }
    },
    events: {
        "rendererAvailable": null
    }
});
