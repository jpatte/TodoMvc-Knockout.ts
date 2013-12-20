module Utils {
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    function keyhandlerBindingFactory(keyCode) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
				var wrappedHandler = function (data, event) {
					if (event.keyCode === keyCode)
						valueAccessor().call(this, data, event);
				};

                var newValueAccessor = () => { return { keyup: wrappedHandler } };
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    ko.bindingHandlers['enterKey'] = keyhandlerBindingFactory(ENTER_KEY);
    ko.bindingHandlers['escapeKey'] = keyhandlerBindingFactory(ESCAPE_KEY);

    ko.bindingHandlers['selectAndFocus'] = {
        init: function(element: any, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext) {
            ko.bindingHandlers['hasFocus'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            ko.utils.registerEventHandler(element, 'focus', () => element.focus());
        },
        update: function(element: any, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext) {
            ko.utils.unwrapObservable(valueAccessor()); // for dependency
            setTimeout(() => ko.bindingHandlers['hasFocus'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext), 0);
        }
    }
}
