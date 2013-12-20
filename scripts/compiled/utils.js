var Utils;
(function (Utils) {
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    function keyhandlerBindingFactory(keyCode) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                var wrappedHandler = function (data, event) {
                    if (event.keyCode === keyCode)
                        valueAccessor().call(this, data, event);
                };

                var newValueAccessor = function () {
                    return { keyup: wrappedHandler };
                };
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    ko.bindingHandlers['enterKey'] = keyhandlerBindingFactory(ENTER_KEY);
    ko.bindingHandlers['escapeKey'] = keyhandlerBindingFactory(ESCAPE_KEY);

    ko.bindingHandlers['selectAndFocus'] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.bindingHandlers['hasFocus'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            ko.utils.registerEventHandler(element, 'focus', function () {
                return element.focus();
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.utils.unwrapObservable(valueAccessor()); // for dependency
            setTimeout(function () {
                return ko.bindingHandlers['hasFocus'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            }, 0);
        }
    };
})(Utils || (Utils = {}));
//# sourceMappingURL=utils.js.map
