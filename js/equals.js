/* eslint-env node */
/*

    Handlebars helper to allow us to compare values and optionally display content. Adapted from the approach outlined
    by "bendog" here:

    http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/

    For more information, see the docs: https://github.com/fluid-project/fluid-handlebars/blob/main/docs/helper.md

*/
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.handlebars.helper.equals");

fluid.handlebars.helper.equals.getEqualsFunction = function () {
    return function (lvalue, rvalue, options) {
        if (arguments.length < 3) {
            fluid.fail("You must call the 'equals' helper with three arguments.");
        }
        else if (lvalue !== rvalue) {
            return options.inverse(this);
        }
        else {
            return options.fn(this);
        }
    };
};

fluid.defaults("fluid.handlebars.helper.equals", {
    gradeNames: ["fluid.handlebars.helper"],
    helperName: "equals",
    invokers: {
        "getHelper": {
            "funcName": "fluid.handlebars.helper.equals.getEqualsFunction",
            "args":     ["{that}"]
        }
    }
});
