/*

 A component to standardize the process of retrieving data and then updating the model when the results are received.

 The component sends a request when its `makeRequest` invoker is called.  The request parameters are:

   1.  The request data, which is the result of transforming the model according to the rules specified in
       `options.rules.modelToRequestPayload`.

   2.  The ajax options, which are the result of transforming `options.ajaxOptions` according to the rules specified in
       `options.rules.ajaxOptions`.

       The end result is expected to contain options in the format used by `jQuery.ajax()`,
       with the exception of the `json: true` option, which is a nicety to improve handling of JSON data payloads.

       The rules used to prepare the final AJAX options are expanded before each request, so that you can use IoC
       references that refer to the current state of the component.

 Once the request is sent, the following workflow applies:

   1.  If the AJAX request returns an error, the `handleError` invoker is called.  The error is transformed
       using the rules found in `options.rules.errorResponseToModel`, and the results are applied to the component's
       model using the change applier.

   2.  If the AJAX request is successful, the `handleSuccess` invoker is called.  The response data is transformed
       using the rules found in `options.rules.successResponseToModel`, and applied to the model using the change
       applier.

A few more things to note:

   1.  All model changes are batched, i.e. the entire set of changes results in a single transaction.

   2.  `null` values in transformation results will be stripped from the existing model.  `undefined` values are
       stripped out by `fluid.model.transformWithRules`, during the transformation process, and will not result in any
       model change.

   3.  This component does not handle any rendering, you are expected to do that yourself, or use a grade that does so.

 */
// TODO:  Reconcile this with the larger migration to dataSources and / or resource loaders.
(function (fluid, $) {
    "use strict";
    fluid.registerNamespace("fluid.handlebars.ajaxCapable");

    // Apply all changes in a single transaction.  Also ensures that values flagged with `null` are deleted from the model.
    fluid.handlebars.ajaxCapable.batchChanges = function (that, changeSet) {
        var myTransaction = that.applier.initiate();

        fluid.each(changeSet, function (value, key) {
            var change = { path: key };
            if (value === undefined || value === null) {
                change.type = "DELETE";
            }
            else {
                change.value = value;
            }
            myTransaction.fireChangeRequest(change);
        });

        myTransaction.commit();
    };

    fluid.handlebars.ajaxCapable.makeRequest = function (that) {
        var rules = fluid.expandOptions(that.options.rules.ajaxOptions, that);
        var transformedAjaxOptions = fluid.model.transformWithRules(that.options.ajaxOptions, rules);

        var transformedModel = fluid.model.transformWithRules(that.model, that.options.rules.modelToRequestPayload);

        // We have added a `json` option not supported by `jQuery.ajax()` itself, which makes it easier to pass JSON data.
        if (transformedAjaxOptions.json) {
            transformedAjaxOptions.contentType = "application/json";
        }

        transformedAjaxOptions.data = transformedAjaxOptions.json ? JSON.stringify(transformedModel) : transformedModel;
        $.ajax(transformedAjaxOptions);
    };

    fluid.handlebars.ajaxCapable.handleSuccess = function (that, data) {
        var transformedData = fluid.model.transformWithRules(data, that.options.rules.successResponseToModel);

        fluid.handlebars.ajaxCapable.batchChanges(that, transformedData);

        that.events.requestReceived.fire(that, true);
    };

    fluid.handlebars.ajaxCapable.handleError = function (that, data) {
        var errorData = fluid.model.transformWithRules(data, that.options.rules.errorResponseToModel);

        fluid.handlebars.ajaxCapable.batchChanges(that, errorData);

        that.events.requestReceived.fire(that, false);
    };

    fluid.defaults("fluid.handlebars.ajaxCapable", {
        gradeNames:    ["fluid.modelComponent"],
        ajaxOptions: {
            accepts:  "application/json",
            success: "{that}.handleSuccess",
            error:   "{that}.handleError"
        },
        events: {
            requestReceived: null
        },
        // Rules to control what (if any) feedback from successful response is displayed.
        rules: {
            // Rules to control how a successful response is applied to the model.
            successResponseToModel: {
                "": "responseJSON" // By default, use the entire jQuery `jqXHR` object's JSON payload.
            },

            // Rules to control how an error is applied to the model
            errorResponseToModel: {
                "": "responseJSON" // By default, use the entire jQuery `jqXHR` object's JSON payload.
            },

            // Rules to control how our model is parsed before making a request
            modelToRequestPayload: {
                "": "", // Pass the model with no alterations except for excluding our two key variables, messages and templates.
                "messages": { transform: { type: "fluid.transforms.delete" } },
                "templates": { transform: { type: "fluid.transforms.delete" } }
            },

            // Rules to control how the raw ajaxOptions are permuted before sending to the server.  This allows things
            // like adding model data to the url.
            ajaxOptions: {
                "": "" // By default, pass the full list of options from `options.ajaxOptions` on to `jQuery.ajax()`
            }

        },
        invokers: {
            makeRequest: {
                funcName: "fluid.handlebars.ajaxCapable.makeRequest",
                args:     ["{that}"]
            },
            handleSuccess: {
                funcName: "fluid.handlebars.ajaxCapable.handleSuccess",
                args:     ["{that}", "{arguments}.2"]  // We use the jqXHR object because it gives us fine control over text vs. JSON responses.
            },
            handleError: {
                funcName: "fluid.handlebars.ajaxCapable.handleError",
                args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // jqXHR, textStatus, errorThrown
            }
        }
    });
})(fluid, jQuery);
