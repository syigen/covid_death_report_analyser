function selectConfigs(searchUrl) {
    const _searchUrl = searchUrl;
    return {
        filter: '',
        show: false,
        selected: null,
        focusedOptionIndex: null,
        options: [],
        init(filter) {
            console.log(filter);
            this.filter = filter;
            // this.fetchOptions();
        },
        close() {
            this.show = false;
            this.filter = this.selectedName();
            this.focusedOptionIndex = this.selected ? this.focusedOptionIndex : null;
        },
        open() {
            this.show = true;
        },
        toggle() {
            if (this.show) {
                this.close();
            } else {
                this.open()
            }
        },
        isOpen() {
            return this.show === true
        },
        selectedName() {
            return this.selected ? this.selected : this.filter;
        },
        classOption(id, index) {
            const isSelected = this.selected ? (id == this.selected) : false;
            const isFocused = (index == this.focusedOptionIndex);
            return {
                'cursor-pointer w-full border-gray-100 border-b hover:bg-blue-50': true,
                'bg-blue-100': isSelected,
                'bg-blue-50': isFocused
            };
        },
        fetchOptions() {
            const query = this.filter;
            fetch(`${_searchUrl}?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    this.options = data
                });
        },
        filteredOptions() {
            const results = this.options
                ? this.options.filter(option => {
                    return (option.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
                })
                : ""
            return results
        },
        onOptionClick(index) {
            this.focusedOptionIndex = index;
            this.selectOption();
        },
        selectOption() {
            if (!this.isOpen()) {
                return;
            }
            this.focusedOptionIndex = this.focusedOptionIndex ?? 0;
            const selected = this.filteredOptions()[this.focusedOptionIndex]
            if (this.selected && this.selected == selected) {
                this.filter = '';
                this.selected = null;
            } else {
                this.selected = selected;
                this.filter = this.selectedName();
            }
            this.close();
        },
        focusPrevOption() {
            if (!this.isOpen()) {
                return;
            }
            const optionsNum = Object.keys(this.filteredOptions()).length - 1;
            if (this.focusedOptionIndex > 0 && this.focusedOptionIndex <= optionsNum) {
                this.focusedOptionIndex--;
            } else if (this.focusedOptionIndex == 0) {
                this.focusedOptionIndex = optionsNum;
            }
        },
        focusNextOption() {
            const optionsNum = Object.keys(this.filteredOptions()).length - 1;
            if (!this.isOpen()) {
                this.open();
            }
            if (this.focusedOptionIndex == null || this.focusedOptionIndex == optionsNum) {
                this.focusedOptionIndex = 0;
            } else if (this.focusedOptionIndex >= 0 && this.focusedOptionIndex < optionsNum) {
                this.focusedOptionIndex++;
            }
        }
    }

}