/*

    A helper component that adds additional block helpers to a `fluid.express.hb` instance.  See the docs for details:

    https://github.com/fluid-project/fluid-handlebars/blob/main/docs/helper.md

 */
/* eslint-env node */
"use strict";
// Base gradeName for handlebars "helper" modules, which can be used on both the client and server side handlebars stacks.
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.handlebars.helper");



fluid.defaults("fluid.handlebars.helper", {
    gradeNames: ["fluid.modelComponent", "fluid.hasRequiredOptions"],
    requiredOptions: {
        helperName: true
    },
    invokers: {
        getHelper: {
            funcName: "fluid.fail",
            args:     ["You must implement getHelper in your grade before it will function properly as a helper."]
        }
    }
});
