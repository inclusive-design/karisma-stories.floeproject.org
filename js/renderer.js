/*

    The common core of both the client and server-side renderers.

    See the docs for details: https://github.com/fluid-project/fluid-handlebars/blob/main/docs/renderer.md

*/
/* global require */
var fluid_3_0_0 = fluid_3_0_0 || {};
var Handlebars = Handlebars || {};
(function (fluid, Handlebars) {
    "use strict";
    if (typeof require !== "undefined") {
        fluid = require("infusion");
        Handlebars = require("handlebars");
    }

    fluid.registerNamespace("fluid.handlebars.renderer.common");

    /**
     *
     * Register all of the helper components that have added themselves to {that}.helpers with our internal copy of
     * Handlebars.
     *
     * @param {Object} that - The renderer component itself.
     *
     */
    fluid.handlebars.renderer.common.registerHelpers = function (that) {
        if (Handlebars) {
            fluid.each(that.helpers, function (value, key) {
                Handlebars.registerHelper(key, value);
            });
        }
        else {
            fluid.fail("Handlebars is not available, so we cannot wire in our helpers.");
        }
    };

    /**
     *
     * Our internal handlebars instance needs to be made aware of each of our helpers.
     *
     * @param {Object} that - The renderer component itself.
     *
     */
    fluid.handlebars.renderer.loadPartials  = function (that) {
        fluid.each(that.model.templates.partials, function (value, key) {
            Handlebars.registerPartial(key, value);
        });
    };

    /**
     *
     * Add a helper to our internal registry.
     *
     * @param {Object} that - The renderer component itself.
     * @param {Object} component - The helper component to register.
     *
     */
    fluid.handlebars.renderer.common.addHelper = function (that, component) {
        var key = component.options.helperName;
        if (component.getHelper) {
            that.helpers[key] = component.getHelper();
        }
        else {
            fluid.fail("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
        }
    };

    /**
     *
     * Render a handlebars template.
     *
     * @param {Object} that - The renderer component itself.
     * @param {String} templateKey - The template key to use, relative to `that.model.templates.pages`.
     * @param {Object} context - The "context" data to expose to Handlebars.
     * @return {String} The renderered content.
     */
    fluid.handlebars.renderer.common.render = function (that, templateKey, context) {
        var template = fluid.get(that.model, ["templates", "pages", templateKey]);
        if (template) {
            var compiledTemplate = Handlebars.compile(template);

            return compiledTemplate(context);
        }
        else {
            fluid.fail("Renderer can't find template '" + templateKey + "'.");
        }
    };

    /**
     *
     * Render content within a "layout".
     *
     * @param {Object} that - The renderer component itself.
     * @param {String} templateKey - The template key to use, relative to `that.model.templates.pages`.
     * @param {Object} context - The "context" data to expose to Handlebars.
     * @return {String} The renderered content.
     *
     */
    fluid.handlebars.renderer.common.renderWithLayout = function (that, templateKey, context) {
        // Render the page body first.
        var pageBody = that.render(templateKey, context);

        // Pass both the body and the derived message bundle as part of the effective context.
        var layoutContext = fluid.extend(true, {}, { body: pageBody}, context);

        // Render the page body in the selected layout (or the default if none is selected).
        var layoutTemplateKey = context.layout ? context.layout : that.options.defaultLayout;
        var layoutTemplate = fluid.get(that.model, ["templates", "layouts", layoutTemplateKey]);
        var compiledLayoutTemplate = Handlebars.compile(layoutTemplate);

        return compiledLayoutTemplate(layoutContext);
    };

    fluid.defaults("fluid.handlebars.renderer.common", {
        gradeNames: ["fluid.modelComponent"],
        defaultLocale: "en_us",
        defaultLayout: "main",
        model: {
            messages:  {},
            templates: {}
        },
        mergePolicy: {
            // Templates contain lots of literal squiggly braces, which we cannot expand
            "templates.layouts":  "noexpand",
            "templates.pages":    "noexpand",
            "templates.partials": "noexpand"
        },
        members: {
            helpers: {}
        },
        distributeOptions: [
            {
                record: {
                    "funcName": "fluid.handlebars.renderer.common.addHelper",
                    "args": ["{fluid.handlebars.renderer.common}", "{fluid.handlebars.helper}"]
                },
                target: "{that > fluid.handlebars.helper}.options.listeners.onCreate"
            }
        ],
        components: {
            equals: {
                type: "fluid.handlebars.helper.equals"
            },
            jsonify: {
                type: "fluid.handlebars.helper.jsonify"
            }
        },
        invokers: {
            render: {
                funcName: "fluid.handlebars.renderer.common.render",
                args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
            },
            renderWithLayout: {
                funcName: "fluid.handlebars.renderer.common.renderWithLayout",
                args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
            }
        },
        modelListeners: {
            "templates": {
                funcName: "fluid.handlebars.renderer.loadPartials",
                args:     ["{that}"]
            }
        },
        listeners: {
            "onCreate.addHelpers": {
                funcName: "fluid.handlebars.renderer.common.registerHelpers",
                args:     ["{that}"]
            }
        }
    });
})(fluid_3_0_0, Handlebars);
