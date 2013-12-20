module TodoMVC {
    export interface TodoItemData {
        title: string;
        completed: boolean;
    }

    export class TodoItem {
        public title: KnockoutObservable<string>;
        public previousTitle: string;
        public completed: KnockoutObservable<boolean>;
        public editing: KnockoutObservable<boolean>;

        constructor(title: string, completed: boolean = false) {
            this.title = ko.observable<string>(title);
            this.completed = ko.observable<boolean>(completed);
            this.editing = ko.observable<boolean>(false);
        }
    }

    export class AppViewModel {
        public items: KnockoutObservableArray<TodoItem>;
        public filteredItems: KnockoutComputed<TodoItem[]>;
        public newItemTitle: KnockoutObservable<string>;
        public currentFilter: KnockoutObservable<string>;
        public completedItemsCount: KnockoutComputed<number>;
        public remainingItemsCount: KnockoutComputed<number>;
        public allItemsCompleted: KnockoutComputed<boolean>;

        constructor(items: TodoItemData[]) {
            this.newItemTitle = ko.observable<string>();
            this.currentFilter = ko.observable<string>('all');

            this.items = ko.observableArray<TodoItem>(items.map(i => new TodoItem(i.title, i.completed)));
            this.filteredItems = ko.computed<TodoItem[]>(() => {
                switch (this.currentFilter()) {
                    case 'active': return this.items().filter(i => !i.completed());
                    case 'completed': return this.items().filter(i => i.completed());
                    default: return this.items();
                }
            });

            this.completedItemsCount = ko.computed<number>(() => this.items().filter(i => i.completed()).length);
            this.remainingItemsCount = ko.computed<number>(() => this.items().length - this.completedItemsCount());
            this.allItemsCompleted = ko.computed<boolean>({
                read: () => this.remainingItemsCount() === 0,
                write: (newValue: boolean) => {
                    this.items().forEach(i => i.completed(newValue));
                }
            });

            ko.computed(() => {
                localStorage.setItem('items-knockoutjs', ko.toJSON(this.items));
            }).extend({ throttle: 500 });
        }
        
        public addNewItem() {
            var newItemTitle = this.newItemTitle().trim();
            if (newItemTitle) {
                this.items.push(new TodoItem(newItemTitle));
                this.newItemTitle('');
            }
        }

        public removeItem(item: TodoItem) {
            this.items.remove(item);
        }

        public removeCompletedItems() {
            this.items.remove(item => item.completed());
        }

        public editItem(item: TodoItem) {
            item.editing(true);
            item.previousTitle = item.title();
        }

        public saveEditing(item: TodoItem) {
            item.editing(false);

            var title = item.title();
            var trimmedTitle = title.trim();

            if (title !== trimmedTitle)
                item.title(trimmedTitle);
            if (!trimmedTitle)
                this.removeItem(item);
        }

        public cancelEditing(item: TodoItem) {
            item.editing(false);
            item.title(item.previousTitle);
        }
    }
}

var savedItems = ko.utils.parseJson(localStorage.getItem('items-knockoutjs'));
var appViewModel = new TodoMVC.AppViewModel(savedItems || []);
ko.applyBindings(appViewModel);

Router({ '/:mode': appViewModel.currentFilter }).init();
