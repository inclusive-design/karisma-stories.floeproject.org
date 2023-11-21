/*

  A component to standardize handling of "simple" form data submitted via AJAX.  This component:

  1.  Performs an initial render of the component using the template specified in `options.templateKeys.initial`
  2.  Binds a form submission that sends the `model` data formatted using `options.rules.request` using the options
      specified in `options.ajax`

  For more details on the request and response cycle, see the `templateRequestAndUpdate` grade.

 */
/* eslint-env browser */
(function (fluid) {
    "use strict";
    fluid.registerNamespace("fluid.handlebars.templateFormControl");

    fluid.handlebars.templateFormControl.submitForm = function (that, event) {
        // We are handling this event and should prevent any further handling.
        if (event) { event.preventDefault(); }

        // Let the `ajaxCapable` grade handle the request and response.
        that.makeRequest();
    };

    fluid.handlebars.templateFormControl.handleKeyPress = function (that, event) {
        if (event.keyCode === 13) { // Enter
            that.submitForm(event);
        }
    };

    // Add support for hiding content if needed
    fluid.handlebars.templateFormControl.hideContentIfNeeded = function (that, success) {
        if ((success && that.options.hideOnSuccess) || (!success && that.options.hideOnError)) {
            var form = that.locate("form");
            form.hide();
        }
    };

    fluid.defaults("fluid.handlebars.templateFormControl", {
        gradeNames:    ["fluid.handlebars.ajaxCapable", "fluid.hasRequiredFields", "fluid.handlebars.templateAware.serverResourceAware"],
        hideOnSuccess: true,  // Whether to hide our form if the results are successful
        hideOnError:   false, // Whether to hide our form if the results are unsuccessful
        requiredFields: {
            templateKeys:           true,
            "templateKeys.initial": true,
            "templateKeys.error":   true,
            "templateKeys.success": true
        },
        templateKeys: {
            success: "common-success",
            error:   "common-error"
        },
        // You are expected to add any data from the response you care about to the success and error rules.
        rules: {
            successResponseToModel: {
                successMessage: "responseJSON.message"
            },
            errorResponseToModel: {
                errorMessage:   "responseJSON.message"
            }
        },
        selectors: {
            initial: "",         // The container that will be updated with template content on startup and on a full refresh.
            form:    "form",     // The form element whose submission we will control
            error:   ".templateFormControl-error",   // The error message controlled by our sub-component
            success: ".templateFormControl-success", // The positive feedback controlled by our sub-component
            submit:  ".submit"   // Clicking or hitting enter on our submit button will launch our AJAX request
        },
        model: {
            errorMessage: false,
            successMessage: false
        },
        components: {
            success: {
                type:          "fluid.handlebars.templateMessage",
                createOnEvent: "{templateFormControl}.events.onDomChange",
                container:     "{templateFormControl}.dom.success",
                options: {
                    components: {
                        renderer: "{templateFormControl}.renderer"
                    },
                    templateKey: "{templateFormControl}.options.templateKeys.success",
                    model:  {
                        message: "{templateFormControl}.model.successMessage"
                    },
                    listeners: {
                        "onCreate.renderMarkup": {
                            func: "fluid.identity"
                        }
                    }
                }
            },
            error: {
                type:          "fluid.handlebars.templateMessage",
                createOnEvent: "{templateFormControl}.events.onDomChange",
                container:     "{templateFormControl}.dom.error",
                options: {
                    components: {
                        renderer: "{templateFormControl}.renderer"
                    },
                    templateKey: "error",
                    model:  {
                        message: "{templateFormControl}.model.errorMessage"
                    },
                    listeners: {
                        "onCreate.renderMarkup": {
                            func: "fluid.identity"
                        }
                    }
                }
            }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["initial", "{that}.options.templateKeys.initial", "{that}.model", "html"]
            },
            submitForm: {
                funcName: "fluid.handlebars.templateFormControl.submitForm",
                args:     ["{that}", "{arguments}.0"]
            },
            handleKeyPress: {
                funcName: "fluid.handlebars.templateFormControl.handleKeyPress",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            "onMarkupRendered.wireSubmitKeyPress": {
                "this": "{that}.dom.submit",
                method: "on",
                args:   ["keyup.handleKeyPress", "{that}.handleKeyPress"]
            },
            "onMarkupRendered.wireSubmitClick": {
                "this": "{that}.dom.submit",
                method: "on",
                args:   ["click.submitForm", "{that}.submitForm"]
            },
            "onMarkupRendered.wireFormSubmit": {
                "this": "{that}.dom.form",
                method: "on",
                args:   ["submit.submitForm", "{that}.submitForm"]
            },
            "requestReceived.hideContentIfNeeded": {
                funcName: "fluid.handlebars.templateFormControl.hideContentIfNeeded",
                args:     ["{that}", "{arguments}.1"]
            }
        }
    });
})(fluid);
