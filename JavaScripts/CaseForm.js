var DNB = DNB || {};
DNB.Case = {
    Fields: {
        ArrivalWindowStartTime: 'dnb_arrivalwindowstarttime',
        ArrivalWindowEndTime: 'dnb_arrivalwindowendtime'
    },

    onLoad: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var ctrlArrivalWindow = formContext.getControl(DNB.Case.Fields.ArrivalWindowStartTime);
        ctrlArrivalWindow.addOnOutputChange(DNB.Case.onChangeEndTime);
    },

    onChangeEndTime: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var ctrlArrivalWindow = formContext.getControl(DNB.Case.Fields.ArrivalWindowStartTime);
        var validationResult = ctrlArrivalWindow.getOutputs();
        var uniqueId = 'dnb_timewindowvalidation';
        if (validationResult &&
            validationResult[`${DNB.Case.Fields.ArrivalWindowStartTime}.fieldControl.isTimeWindowValid`] &&
            validationResult[`${DNB.Case.Fields.ArrivalWindowStartTime}.fieldControl.isTimeWindowValid`].value === false) {
            ctrlArrivalWindow.setNotification('You must specify an end time that happens after the start time.', uniqueId);
        }
        else {
            ctrlArrivalWindow.clearNotification(uniqueId);
        }
    }

    onSave: function Test() {

    };
}