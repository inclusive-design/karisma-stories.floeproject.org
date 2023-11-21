
/*
    A client-side Handlebars renderer.  Requires Handlebars.js and Pagedown (for markdown rendering).

    See the docs for more details:

    https://github.com/fluid-project/fluid-handlebars/blob/main/docs/jsonifyHelper.md

 */
(function (fluid) {
    "use strict";
    fluid.registerNamespace("fluid.handlebars.renderer");

    fluid.handlebars.renderer.passthrough = function (that, element, key, context, manipulator) {
        element[manipulator](that.render(key, context));
    };

    ["after", "append", "before", "prepend", "replaceWith", "html"].forEach(function (manipulator) {
        fluid.handlebars.renderer[manipulator] = function (that, element, key, context) {
            fluid.handlebars.renderer.passthrough(that, element, key, context, manipulator);
        };
    });

    fluid.defaults("fluid.handlebars.renderer", {
        gradeNames: ["fluid.handlebars.renderer.common"],
        model: {
            templates: {},
            messages: {}
        },
        components: {
            "md": {
                "type": "fluid.handlebars.helper.md.client"
            },
            messageHelper: {
                type: "fluid.handlebars.helper.messageHelper.client",
                options: {
                    model: {
                        messages: "{fluid.handlebars.renderer.common}.model.messages"
                    }
                }
            }
        },
        invokers: {
            "after": {
                funcName: "fluid.handlebars.renderer.after",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "append": {
                funcName: "fluid.handlebars.renderer.append",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "before": {
                funcName: "fluid.handlebars.renderer.before",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "html": {
                funcName: "fluid.handlebars.renderer.html",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "prepend": {
                funcName: "fluid.handlebars.renderer.prepend",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "replaceWith": {
                funcName: "fluid.handlebars.renderer.replaceWith",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            }
        }
    });
})(fluid);
