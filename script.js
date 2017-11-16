$(document).ready(function () {
    var vm;

    vm = {
        items: ['a', 'b', 'c', 'd', 'e', 'f'],
        index: -1
    }
    $("#addDropdown").on("click", function () {
        createDropdown();
    });
    $("#removeDropdown").on("click", function () {
        removeDropdown();
    });

    function createDropdown() {

        // If dropdowns are more than the items, don't create dropdown
        if ($("select[id^='dropdown']").length == vm.items.length)
            return;

        var currentVm = {};
        $.extend(true, currentVm, vm);
        
        // get selected values from all dropdowns
        var selectedValues = getSelectedValues();

        if (selectedValues && selectedValues.length > 0) {
            currentVm.items = $.grep(currentVm.items, function (item) {
                return $.inArray(item, selectedValues) == -1;
            });
        }

        if (currentVm.items && currentVm.items.length > 0 ) {
            currentVm.index++;
            vm.index++;
            $("#dropdownTemplate").tmpl(currentVm).appendTo("#dropdownSection");
            
            // Register change event for dropdowns
            $("#dropdown" + currentVm.index).off("change").on("change", function () {
                dropdownChange(this.id);
            });
        }
    }

    function getSelectedValues() {
        var selectedValues = [];

        $("select[id^='dropdown']").each(function () {
            var value = this.selectedOptions[0].value;
            if (value && value.toLowerCase().indexOf("select") <= -1) {
                selectedValues.push(value);
            }
        });
        return selectedValues;
    }

    function dropdownChange(dropdownId) {
        // update option list in all dropdowns
        updateOptionList(dropdownId);
    }

    function updateOptionList(currentDropdown) {

        // get selected values from all dropdowns
        var selectedValues = getSelectedValues();

        $("select[id^='dropdown']").each(function () {
            if (this.id != currentDropdown) {
                // get selected value of current dropdown
                var selectedValue = this.selectedOptions[0].value;

                // remove current options
                $(this).find("option").remove();

                // add updated list of options
                $(this).append("<option value='select'>select</option>");
                for (var i = 0; i < vm.items.length; i++) {
                    if ($.inArray(vm.items[i], selectedValues) > -1 && vm.items[i] != selectedValue)
                        continue;

                    $(this).append("<option value="+vm.items[i]+">"+vm.items[i]+"</option>");
                }

                // set selected value to dropdown
                $(this).val(selectedValue);
            }
        });
    }

    function removeDropdown() {

        if (vm.index == -1)
            return;
        // remove last dropdown
        var dropdown = "#dropdown" + vm.index;
        $(dropdown).remove();
        vm.index--;
        // udpate option list
        updateOptionList();
    }
});