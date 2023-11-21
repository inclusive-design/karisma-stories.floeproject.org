// A client-side module that:
//
// 1. Instantiates a `fluid.handlebars.renderer`.
// 2. Distributes its renderer to any child grades that extend the `templateAware` grade.
// 3. Makes any child grades that extend the `templateAware` grade delay their creation until templates are loaded.
//
// For this to work as expected and for components to be created in the right order, you should only add components
// to `components.requireRenderer`.
//
(function (fluid) {
    "use strict";
    fluid.defaults("fluid.handlebars.templateManager", {
        gradeNames: ["fluid.handlebars.serverResourceAware"],
        components: {
            // All components that require a renderer should be added as children of the `requireRenderer` component
            // to ensure that they are created once the renderer is available.
            requireRenderer: {
                createOnEvent: "{fluid.handlebars.templateManager}.events.onResourcesLoaded",
                type: "fluid.component"
            }
        },
        distributeOptions: [
            // Any child components of this one should use our renderer
            {
                record: "{fluid.handlebars.templateManager}.renderer",
                target: "{that templateAware}.options.components.renderer"
            },
            // Make sure any template aware grades are notified when the renderer is ready.
            {
                target: "{that templateAware}.options.events.onRendererAvailable",
                record: "{fluid.handlebars.templateManager}.events.onRendererAvailable"
            }
        ]
    });
})(fluid);
