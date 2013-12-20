var TodoMVC;
(function (TodoMVC) {
    var TodoItem = (function () {
        function TodoItem(title, completed) {
            if (typeof completed === "undefined") { completed = false; }
            this.title = ko.observable(title);
            this.completed = ko.observable(completed);
            this.editing = ko.observable(false);
        }
        return TodoItem;
    })();
    TodoMVC.TodoItem = TodoItem;

    var AppViewModel = (function () {
        function AppViewModel(items) {
            var _this = this;
            this.newItemTitle = ko.observable();
            this.currentFilter = ko.observable('all');

            this.items = ko.observableArray(items.map(function (i) {
                return new TodoItem(i.title, i.completed);
            }));
            this.filteredItems = ko.computed(function () {
                switch (_this.currentFilter()) {
                    case 'active':
                        return _this.items().filter(function (i) {
                            return !i.completed();
                        });
                    case 'completed':
                        return _this.items().filter(function (i) {
                            return i.completed();
                        });
                    default:
                        return _this.items();
                }
            });

            this.completedItemsCount = ko.computed(function () {
                return _this.items().filter(function (i) {
                    return i.completed();
                }).length;
            });
            this.remainingItemsCount = ko.computed(function () {
                return _this.items().length - _this.completedItemsCount();
            });
            this.allItemsCompleted = ko.computed({
                read: function () {
                    return _this.remainingItemsCount() === 0;
                },
                write: function (newValue) {
                    _this.items().forEach(function (i) {
                        return i.completed(newValue);
                    });
                }
            });

            ko.computed(function () {
                localStorage.setItem('items-knockoutjs', ko.toJSON(_this.items));
            }).extend({ throttle: 500 });
        }
        AppViewModel.prototype.addNewItem = function () {
            var newItemTitle = this.newItemTitle().trim();
            if (newItemTitle) {
                this.items.push(new TodoItem(newItemTitle));
                this.newItemTitle('');
            }
        };

        AppViewModel.prototype.removeItem = function (item) {
            this.items.remove(item);
        };

        AppViewModel.prototype.removeCompletedItems = function () {
            this.items.remove(function (item) {
                return item.completed();
            });
        };

        AppViewModel.prototype.editItem = function (item) {
            item.editing(true);
            item.previousTitle = item.title();
        };

        AppViewModel.prototype.saveEditing = function (item) {
            item.editing(false);

            var title = item.title();
            var trimmedTitle = title.trim();

            if (title !== trimmedTitle)
                item.title(trimmedTitle);
            if (!trimmedTitle)
                this.removeItem(item);
        };

        AppViewModel.prototype.cancelEditing = function (item) {
            item.editing(false);
            item.title(item.previousTitle);
        };
        return AppViewModel;
    })();
    TodoMVC.AppViewModel = AppViewModel;
})(TodoMVC || (TodoMVC = {}));

var savedItems = ko.utils.parseJson(localStorage.getItem('items-knockoutjs'));
var appViewModel = new TodoMVC.AppViewModel(savedItems || []);
ko.applyBindings(appViewModel);

Router({ '/:mode': appViewModel.currentFilter }).init();
//# sourceMappingURL=app.js.map
