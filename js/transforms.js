/*

    Model transformation functions useful in validating form content.

 */
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.registerNamespace("fluid.binder.transforms");

/*

    A transform function to optionally strip empty strings when they are relayed.  Add this to your binder component
    using code like:

    ```
    bindings: {
        sample: {
            selector: "sample",
            path:     "sample",
            rules: {
                domToModel: {
                    "": {
                        transform: {
                            type:  "fluid.binder.transforms.stripEmptyString",
                            inputPath: ""
                        }
                    }
                }
            }
        }
    }
    ```

 */
fluid.binder.transforms.stripEmptyString = function (value) {
    return value === "" ? null : value;
};

fluid.defaults("fluid.binder.transforms.stripEmptyString", {
    gradeNames: ["fluid.standardTransformFunction"]
});

/**
 *
 * Transform the value returned by jQuery.val for a single checkbox into a boolean.
 *
 * @param {Array} value - An array of values, either the value attribute of a ticked checkbox, or "on" if the checkbox has no value specified.
 * @return {Boolean} - `true` if the first value is checked, `false`.
 *
 */
fluid.binder.transforms.checkToBoolean = function (value) {
    return fluid.get(value, 0) ? true : false;
};

fluid.binder.transforms.checkToBoolean.invert = function (transformSpec) {
    transformSpec.type = "fluid.binder.transforms.booleanToCheck";
    return transformSpec;
};

fluid.defaults("fluid.binder.transforms.checkToBoolean", {
    gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
    invertConfiguration: "fluid.binder.transforms.checkToBoolean.invert"
});

/**
 *
 * Transform a boolean model value into the value used for checkboxes by jQuery.val.
 *
 * @param {Boolean} value - The value to be passed to the DOM.
 * @return {Array} - An array with the first value set to "on" if the value is `true`, an empty Array otherwise.
 *
 */
fluid.binder.transforms.booleanToCheck = function (value) {
    return value ? ["on"] : [];
};

fluid.binder.transforms.booleanToCheck.invert = function (transformSpec) {
    transformSpec.type = "fluid.binder.transforms.checkToBoolean";
    return transformSpec;
};

fluid.defaults("fluid.binder.transforms.booleanToCheck", {
    gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
    invertConfiguration: "fluid.binder.transforms.booleanToCheck.invert"
});
